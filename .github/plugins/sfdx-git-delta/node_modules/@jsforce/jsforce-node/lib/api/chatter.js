"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chatter = exports.Resource = void 0;
/**
 * @file Manages Salesforce Chatter REST API calls
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
const jsforce_1 = require("../jsforce");
const function_1 = require("../util/function");
/*--------------------------------------------*/
/**
 * A class representing chatter API request
 */
class Request {
    _chatter;
    _request;
    _promise;
    constructor(chatter, request) {
        this._chatter = chatter;
        this._request = request;
    }
    /**
     * Retrieve parameters in batch request form
     */
    batchParams() {
        const { method, url, body } = this._request;
        return {
            method,
            url: this._chatter._normalizeUrl(url),
            ...(typeof body !== 'undefined' ? { richInput: body } : {}),
        };
    }
    /**
     * Retrieve parameters in batch request form
     *
     * @method Chatter~Request#promise
     * @returns {Promise.<Chatter~RequestResult>}
     */
    promise() {
        return (this._promise || (this._promise = this._chatter._request(this._request)));
    }
    /**
     * Returns Node.js Stream object for request
     *
     * @method Chatter~Request#stream
     * @returns {stream.Stream}
     */
    stream() {
        return this._chatter._request(this._request).stream();
    }
    /**
     * Promise/A+ interface
     * http://promises-aplus.github.io/promises-spec/
     *
     * Delegate to deferred promise, return promise instance for batch result
     */
    then(onResolve, onReject) {
        return this.promise().then(onResolve, onReject);
    }
}
function apppendQueryParamsToUrl(url, queryParams) {
    if (queryParams) {
        const qstring = Object.keys(queryParams)
            .map((name) => `${name}=${encodeURIComponent(String(queryParams[name] ?? ''))}`)
            .join('&');
        url += (url.indexOf('?') > 0 ? '&' : '?') + qstring;
    }
    return url;
}
/*------------------------------*/
class Resource extends Request {
    _url;
    /**
     *
     */
    constructor(chatter, url, queryParams) {
        super(chatter, {
            method: 'GET',
            url: apppendQueryParamsToUrl(url, queryParams),
        });
        this._url = this._request.url;
    }
    /**
     * Create a new resource
     */
    create(data) {
        return this._chatter.request({
            method: 'POST',
            url: this._url,
            body: data,
        });
    }
    /**
     * Retrieve resource content
     */
    retrieve() {
        return this._chatter.request({
            method: 'GET',
            url: this._url,
        });
    }
    /**
     * Update specified resource
     */
    update(data) {
        return this._chatter.request({
            method: 'POST',
            url: this._url,
            body: data,
        });
    }
    /**
     * Delete specified resource
     */
    destroy() {
        return this._chatter.request({
            method: 'DELETE',
            url: this._url,
        });
    }
    /**
     * Synonym of Resource#destroy()
     */
    delete = this.destroy;
    /**
     * Synonym of Resource#destroy()
     */
    del = this.destroy;
}
exports.Resource = Resource;
/*------------------------------*/
/**
 * API class for Chatter REST API call
 */
class Chatter {
    _conn;
    /**
     *
     */
    constructor(conn) {
        this._conn = conn;
    }
    /**
     * Sending request to API endpoint
     * @private
     */
    _request(req_) {
        const { method, url: url_, headers: headers_, body: body_ } = req_;
        let headers = headers_ ?? {};
        let body;
        if (/^(put|post|patch)$/i.test(method)) {
            if ((0, function_1.isObject)(body_)) {
                headers = {
                    ...headers_,
                    'Content-Type': 'application/json',
                };
                body = JSON.stringify(body_);
            }
            else {
                body = body_;
            }
        }
        const url = this._normalizeUrl(url_);
        return this._conn.request({
            method,
            url,
            headers,
            body,
        });
    }
    /**
     * Convert path to site root relative url
     * @private
     */
    _normalizeUrl(url) {
        if (url.startsWith('/chatter/') || url.startsWith('/connect/')) {
            return '/services/data/v' + this._conn.version + url;
        }
        else if (/^\/v[\d]+\.[\d]+\//.test(url)) {
            return '/services/data' + url;
        }
        else if (!url.startsWith('/services/') && url.startsWith('/')) {
            return '/services/data/v' + this._conn.version + '/chatter' + url;
        }
        else {
            return url;
        }
    }
    /**
     * Make a request for chatter API resource
     */
    request(req) {
        return new Request(this, req);
    }
    /**
     * Make a resource request to chatter API
     */
    resource(url, queryParams) {
        return new Resource(this, url, queryParams);
    }
    /**
     * Make a batch request to chatter API
     */
    async batch(requests) {
        const deferreds = requests.map((request) => {
            const deferred = defer();
            request._promise = deferred.promise;
            return deferred;
        });
        const res = await this.request({
            method: 'POST',
            url: this._normalizeUrl('/connect/batch'),
            body: {
                batchRequests: requests.map((request) => request.batchParams()),
            },
        });
        res.results.forEach((result, i) => {
            const deferred = deferreds[i];
            if (result.statusCode >= 400) {
                deferred.reject(result.result);
            }
            else {
                deferred.resolve(result.result);
            }
        });
        return res;
    }
}
exports.Chatter = Chatter;
function defer() {
    let resolve_ = () => { };
    let reject_ = () => { };
    const promise = new Promise((resolve, reject) => {
        resolve_ = resolve;
        reject_ = reject;
    });
    return {
        promise,
        resolve: resolve_,
        reject: reject_,
    };
}
/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
(0, jsforce_1.registerModule)('chatter', (conn) => new Chatter(conn));
exports.default = Chatter;
