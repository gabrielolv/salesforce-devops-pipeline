"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tooling = void 0;
/**
 * @file Manages Tooling APIs
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
const jsforce_1 = require("../jsforce");
const connection_1 = __importDefault(require("../connection"));
const cache_1 = __importDefault(require("../cache"));
/**
 *
 */
const { query, queryMore, _ensureVersion, create, _createSingle, _createMany, _createParallel, retrieve, _retrieveSingle, _retrieveParallel, _retrieveMany, update, _updateSingle, _updateParallel, _updateMany, upsert, destroy, _destroySingle, _destroyParallel, _destroyMany, describe, describeGlobal, sobject, } = connection_1.default.prototype;
const describeCacheKey = (type) => type ? `describe.${type}` : 'describe';
/**
 * API class for Tooling API call
 */
class Tooling {
    _conn;
    get version() {
        return this._conn.version;
    }
    /**
     * Execute query by using SOQL
     */
    query = query;
    /**
     * Query next record set by using query locator
     */
    queryMore = queryMore;
    _ensureVersion = _ensureVersion;
    /**
     * Create records
     */
    create = create;
    _createSingle = _createSingle;
    _createParallel = _createParallel;
    _createMany = _createMany;
    /**
     * Synonym of Tooling#create()
     */
    insert = create;
    /**
     * Retrieve specified records
     */
    retrieve = retrieve;
    _retrieveSingle = _retrieveSingle;
    _retrieveParallel = _retrieveParallel;
    _retrieveMany = _retrieveMany;
    /**
     * Update records
     */
    update = update;
    _updateSingle = _updateSingle;
    _updateParallel = _updateParallel;
    _updateMany = _updateMany;
    /**
     * Upsert records
     */
    upsert = upsert;
    /**
     * Delete records
     */
    destroy = destroy;
    _destroySingle = _destroySingle;
    _destroyParallel = _destroyParallel;
    _destroyMany = _destroyMany;
    /**
     * Synonym of Tooling#destroy()
     */
    delete = destroy;
    /**
     * Synonym of Tooling#destroy()
     */
    del = destroy;
    cache = new cache_1.default();
    /**
     * Describe SObject metadata
     */
    describe = this.cache.createCachedFunction(describe, this, {
        key: describeCacheKey,
        strategy: 'NOCACHE',
    });
    describe$ = this.cache.createCachedFunction(describe, this, {
        key: describeCacheKey,
        strategy: 'HIT',
    });
    describe$$ = this.cache.createCachedFunction(describe, this, {
        key: describeCacheKey,
        strategy: 'IMMEDIATE',
    });
    /**
     * Synonym of Tooling#describe()
     */
    describeSObject = this.describe;
    describeSObject$ = this.describe$;
    describeSObject$$ = this.describe$$;
    /**
     * Describe global SObjects
     */
    describeGlobal = this.cache.createCachedFunction(describeGlobal, this, {
        key: 'describeGlobal',
        strategy: 'NOCACHE',
    });
    describeGlobal$ = this.cache.createCachedFunction(describeGlobal, this, {
        key: 'describeGlobal',
        strategy: 'HIT',
    });
    describeGlobal$$ = this.cache.createCachedFunction(describeGlobal, this, {
        key: 'describeGlobal',
        strategy: 'IMMEDIATE',
    });
    /**
     * Get SObject instance
     */
    sobject = sobject;
    sobjects = {};
    /**
     *
     */
    constructor(conn) {
        this._conn = conn;
    }
    /**
     * @private
     */
    _establish() {
        this.sobjects = {};
        this.cache.clear();
        this.cache.get('describeGlobal').removeAllListeners('value');
        this.cache.get('describeGlobal').on('value', (res) => {
            if (res.result) {
                for (const { name: type } of res.result.sobjects) {
                    this.sobject(type);
                }
            }
        });
    }
    /**
     * @private
     */
    _baseUrl() {
        return this._conn._baseUrl() + '/tooling';
    }
    /**
     * @private
     */
    _supports(feature) {
        return this._conn._supports(feature);
    }
    /**
     *
     */
    request(request, options) {
        return this._conn.request(request, options);
    }
    /**
     * Executes Apex code anonymously
     */
    executeAnonymous(body) {
        const url = this._baseUrl() +
            '/executeAnonymous?anonymousBody=' +
            encodeURIComponent(body);
        return this.request(url);
    }
    /**
     * Executes Apex tests asynchronously
     */
    runTestsAsynchronous(req) {
        const url = this._baseUrl() + '/runTestsAsynchronous/';
        return this._conn.requestPost(url, req);
    }
    /**
     * Executes Apex tests synchronously
     */
    runTestsSynchronous(req) {
        const url = this._baseUrl() + '/runTestsSynchronous/';
        return this._conn.requestPost(url, req);
    }
    /**
     * Retrieves available code completions of the referenced type
     */
    completions(type = 'apex') {
        const url = this._baseUrl() + '/completions?type=' + encodeURIComponent(type);
        return this.request({
            method: 'GET',
            url,
            headers: { Accept: 'application/json' },
        });
    }
}
exports.Tooling = Tooling;
/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
(0, jsforce_1.registerModule)('tooling', (conn) => new Tooling(conn));
exports.default = Tooling;
