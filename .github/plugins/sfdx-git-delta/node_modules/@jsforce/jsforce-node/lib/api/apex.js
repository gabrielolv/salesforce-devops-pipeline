"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Apex = void 0;
/**
 * @file Manages Salesforce Apex REST endpoint calls
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
const jsforce_1 = require("../jsforce");
/**
 * API class for Apex REST endpoint call
 */
class Apex {
    _conn;
    /**
     *
     */
    constructor(conn) {
        this._conn = conn;
    }
    /* @private */
    _baseUrl() {
        return `${this._conn.instanceUrl}/services/apexrest`;
    }
    /**
     * @private
     */
    _createRequestParams(method, path, body, options = {}) {
        const headers = typeof options.headers === 'object' ? options.headers : {};
        if (!/^(GET|DELETE)$/i.test(method)) {
            headers['content-type'] = 'application/json';
        }
        const params = {
            method,
            url: this._baseUrl() + path,
            headers,
        };
        if (body) {
            params.body = JSON.stringify(body);
        }
        return params;
    }
    /**
     * Call Apex REST service in GET request
     */
    get(path, options) {
        return this._conn.request(this._createRequestParams('GET', path, undefined, options));
    }
    /**
     * Call Apex REST service in POST request
     */
    post(path, body, options) {
        const params = this._createRequestParams('POST', path, body, options);
        return this._conn.request(params);
    }
    /**
     * Call Apex REST service in PUT request
     */
    put(path, body, options) {
        const params = this._createRequestParams('PUT', path, body, options);
        return this._conn.request(params);
    }
    /**
     * Call Apex REST service in PATCH request
     */
    patch(path, body, options) {
        const params = this._createRequestParams('PATCH', path, body, options);
        return this._conn.request(params);
    }
    /**
     * Call Apex REST service in DELETE request
     */
    delete(path, options) {
        return this._conn.request(this._createRequestParams('DELETE', path, undefined, options));
    }
    /**
     * Synonym of Apex#delete()
     */
    del = this.delete;
}
exports.Apex = Apex;
/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
(0, jsforce_1.registerModule)('apex', (conn) => new Apex(conn));
exports.default = Apex;
