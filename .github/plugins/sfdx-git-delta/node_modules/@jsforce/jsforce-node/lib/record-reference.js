"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordReference = void 0;
/**
 * Remote reference to record information
 */
class RecordReference {
    type;
    id;
    _conn;
    /**
     *
     */
    constructor(conn, type, id) {
        this._conn = conn;
        this.type = type;
        this.id = id;
    }
    /**
     * Retrieve record field information
     */
    async retrieve(options) {
        const rec = await this._conn.retrieve(this.type, this.id, options);
        return rec;
    }
    /**
     * Update record field information
     */
    async update(record, options) {
        const record_ = { ...record, Id: this.id };
        return this._conn.update(this.type, record_, options);
    }
    /**
     * Delete record field
     */
    destroy(options) {
        return this._conn.destroy(this.type, this.id, options);
    }
    /**
     * Synonym of Record#destroy()
     */
    delete = this.destroy;
    /**
     * Synonym of Record#destroy()
     */
    del = this.destroy;
    /**
     * Get blob field as stream
     *
     * @param {String} fieldName - Blob field name
     * @returns {stream.Stream}
     */
    blob(fieldName) {
        const url = [
            this._conn._baseUrl(),
            'sobjects',
            this.type,
            this.id,
            fieldName,
        ].join('/');
        return this._conn.request(url).stream();
    }
}
exports.RecordReference = RecordReference;
exports.default = RecordReference;
