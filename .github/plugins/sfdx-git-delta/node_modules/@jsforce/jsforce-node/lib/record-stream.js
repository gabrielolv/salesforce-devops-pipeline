"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parsable = exports.Serializable = exports.RecordStream = void 0;
/**
 * @file Represents stream that handles Salesforce record as stream data
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
const stream_1 = require("stream");
const csv_1 = require("./csv");
const stream_2 = require("./util/stream");
/**
 * @private
 */
function evalMapping(value, mapping) {
    if (typeof value === 'string') {
        const m = /^\$\{(\w+)\}$/.exec(value);
        if (m) {
            return mapping[m[1]];
        }
        return value.replace(/\$\{(\w+)\}/g, ($0, prop) => {
            const v = mapping[prop];
            return typeof v === 'undefined' || v === null ? '' : String(v);
        });
    }
    return value;
}
/**
 * @private
 */
function convertRecordForSerialization(record, options = {}) {
    return Object.keys(record).reduce((rec, key) => {
        const value = rec[key];
        let urec;
        if (key === 'attributes') {
            // 'attributes' prop will be ignored
            urec = { ...rec };
            delete urec[key];
            return urec;
        }
        else if (options.nullValue && value === null) {
            return { ...rec, [key]: options.nullValue };
        }
        else if (value !== null && typeof value === 'object') {
            const precord = convertRecordForSerialization(value, options);
            return Object.keys(precord).reduce((prec, pkey) => {
                prec[`${key}.${pkey}`] = precord[pkey]; // eslint-disable-line no-param-reassign
                return prec;
            }, { ...rec });
        }
        return rec;
    }, record);
}
/**
 * @private
 */
function createPipelineStream(s1, s2) {
    s1.pipe(s2);
    return (0, stream_2.concatStreamsAsDuplex)(s1, s2, { writableObjectMode: true });
}
/**
 * @private
 */
const CSVStreamConverter = {
    serialize(options = {}) {
        const { nullValue, ...csvOpts } = options;
        return createPipelineStream(
        // eslint-disable-next-line no-use-before-define
        RecordStream.map((record) => convertRecordForSerialization(record, options)), (0, csv_1.serializeCSVStream)(csvOpts));
    },
    parse(options = {}) {
        return (0, csv_1.parseCSVStream)(options);
    },
};
/**
 * @private
 */
const DataStreamConverters = {
    csv: CSVStreamConverter,
};
/**
 * Class for Record Stream
 *
 * @class
 * @constructor
 * @extends stream.Transform
 */
class RecordStream extends stream_1.PassThrough {
    /**
     *
     */
    constructor() {
        super({ objectMode: true });
    }
    /**
     * Get record stream of queried records applying the given mapping function
     */
    map(fn) {
        return this.pipe(RecordStream.map(fn));
    }
    /**
     * Get record stream of queried records, applying the given filter function
     */
    filter(fn) {
        return this.pipe(RecordStream.filter(fn));
    }
    /* @override */
    on(ev, fn) {
        return super.on(ev === 'record' ? 'data' : ev, fn);
    }
    /* @override */
    addListener = this.on;
    /* --------------------------------------------------- */
    /**
     * Create a record stream which maps records and pass them to downstream
     */
    static map(fn) {
        const mapStream = new stream_1.Transform({
            objectMode: true,
            transform(record, enc, callback) {
                const rec = fn(record) || record; // if not returned record, use same record
                mapStream.push(rec);
                callback();
            },
        });
        return mapStream;
    }
    /**
     * Create mapping stream using given record template
     */
    static recordMapStream(record, noeval) {
        return RecordStream.map((rec) => {
            const mapped = { Id: rec.Id };
            for (const prop of Object.keys(record)) {
                mapped[prop] = noeval ? record[prop] : evalMapping(record[prop], rec);
            }
            return mapped;
        });
    }
    /**
     * Create a record stream which filters records and pass them to downstream
     *
     * @param {RecordFilterFunction} fn - Record filtering function
     * @returns {RecordStream.Serializable}
     */
    static filter(fn) {
        const filterStream = new stream_1.Transform({
            objectMode: true,
            transform(record, enc, callback) {
                if (fn(record)) {
                    filterStream.push(record);
                }
                callback();
            },
        });
        return filterStream;
    }
}
exports.RecordStream = RecordStream;
/**
 * @class RecordStream.Serializable
 * @extends {RecordStream}
 */
class Serializable extends RecordStream {
    _dataStreams = {};
    /**
     * Get readable data stream which emits serialized record data
     */
    stream(type = 'csv', options = {}) {
        if (this._dataStreams[type]) {
            return this._dataStreams[type];
        }
        const converter = DataStreamConverters[type];
        if (!converter) {
            throw new Error(`Converting [${type}] data stream is not supported.`);
        }
        const dataStream = new stream_1.PassThrough();
        this.pipe(converter.serialize(options)).pipe(dataStream);
        this._dataStreams[type] = dataStream;
        return dataStream;
    }
}
exports.Serializable = Serializable;
/**
 * @class RecordStream.Parsable
 * @extends {RecordStream}
 */
class Parsable extends RecordStream {
    _dataStreams = {};
    _execParse = false;
    _incomings = [];
    /**
     * Get writable data stream which accepts serialized record data
     */
    stream(type = 'csv', options = {}) {
        if (this._dataStreams[type]) {
            return this._dataStreams[type];
        }
        const converter = DataStreamConverters[type];
        if (!converter) {
            throw new Error(`Converting [${type}] data stream is not supported.`);
        }
        const dataStream = new stream_1.PassThrough();
        const parserStream = converter.parse(options);
        parserStream.on('error', (err) => this.emit('error', err));
        parserStream
            .pipe(this)
            .pipe(new stream_1.PassThrough({ objectMode: true, highWaterMark: 500 * 1000 }));
        if (this._execParse) {
            dataStream.pipe(parserStream);
        }
        else {
            this._incomings.push([dataStream, parserStream]);
        }
        this._dataStreams[type] = dataStream;
        return dataStream;
    }
    /* @override */
    on(ev, fn) {
        if (ev === 'readable' || ev === 'record') {
            if (!this._execParse) {
                this._execParse = true;
                for (const [dataStream, parserStream] of this._incomings) {
                    dataStream.pipe(parserStream);
                }
            }
        }
        return super.on(ev, fn);
    }
    /* @override */
    addListener = this.on;
}
exports.Parsable = Parsable;
exports.default = RecordStream;
