"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickAction = void 0;
/**
 * A class for quick action
 */
class QuickAction {
    _conn;
    _path;
    /**
     *
     */
    constructor(conn, path) {
        this._conn = conn;
        this._path = path;
    }
    /**
     * Describe the action's information (including layout, etc.)
     */
    async describe() {
        const url = `${this._path}/describe`;
        const body = await this._conn.request(url);
        return body;
    }
    /**
     * Retrieve default field values in the action (for given record, if specified)
     */
    async defaultValues(contextId) {
        let url = `${this._path}/defaultValues`;
        if (contextId) {
            url += `/${contextId}`;
        }
        const body = await this._conn.request(url);
        return body;
    }
    /**
     * Execute the action for given context Id and record information
     */
    async execute(contextId, record) {
        const requestBody = { contextId, record };
        const resBody = await this._conn.requestPost(this._path, requestBody);
        return resBody;
    }
}
exports.QuickAction = QuickAction;
exports.default = QuickAction;
