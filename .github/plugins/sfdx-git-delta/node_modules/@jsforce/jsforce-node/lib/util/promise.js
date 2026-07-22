"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamPromise = void 0;
/**
 *
 */
const stream_1 = require("stream");
/**
 *
 */
class StreamPromise extends Promise {
    stream() {
        // dummy
        return new stream_1.Duplex();
    }
    static create(builder) {
        const { stream, promise } = builder();
        const streamPromise = new StreamPromise((resolve, reject) => {
            promise.then(resolve, reject);
        });
        streamPromise.stream = () => stream;
        return streamPromise;
    }
}
exports.StreamPromise = StreamPromise;
