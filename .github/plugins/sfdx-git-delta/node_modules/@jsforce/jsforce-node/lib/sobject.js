"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SObject = void 0;
/**
 *
 */
const logger_1 = require("./util/logger");
const record_reference_1 = __importDefault(require("./record-reference"));
const query_1 = __importStar(require("./query"));
const quick_action_1 = __importDefault(require("./quick-action"));
/**
 * A class for organizing all SObject access
 */
class SObject {
    static _logger = (0, logger_1.getLogger)('sobject');
    type;
    _conn;
    _logger;
    // layouts: (ln?: string) => Promise<DescribeLayoutResult>;
    layouts$;
    layouts$$;
    // compactLayouts: () => Promise<DescribeCompactLayoutsResult>;
    compactLayouts$;
    compactLayouts$$;
    // approvalLayouts: () => Promise<DescribeApprovalLayoutsResult>;
    approvalLayouts$;
    approvalLayouts$$;
    /**
     *
     */
    constructor(conn, type) {
        this.type = type;
        this._conn = conn;
        this._logger = conn._logLevel
            ? SObject._logger.createInstance(conn._logLevel)
            : SObject._logger;
        const cache = this._conn.cache;
        const layoutCacheKey = (layoutName) => layoutName
            ? `layouts.namedLayouts.${layoutName}`
            : `layouts.${this.type}`;
        const layouts = SObject.prototype.layouts;
        this.layouts = cache.createCachedFunction(layouts, this, {
            key: layoutCacheKey,
            strategy: 'NOCACHE',
        });
        this.layouts$ = cache.createCachedFunction(layouts, this, {
            key: layoutCacheKey,
            strategy: 'HIT',
        });
        this.layouts$$ = cache.createCachedFunction(layouts, this, {
            key: layoutCacheKey,
            strategy: 'IMMEDIATE',
        });
        const compactLayoutCacheKey = `compactLayouts.${this.type}`;
        const compactLayouts = SObject.prototype.compactLayouts;
        this.compactLayouts = cache.createCachedFunction(compactLayouts, this, {
            key: compactLayoutCacheKey,
            strategy: 'NOCACHE',
        });
        this.compactLayouts$ = cache.createCachedFunction(compactLayouts, this, {
            key: compactLayoutCacheKey,
            strategy: 'HIT',
        });
        this.compactLayouts$$ = cache.createCachedFunction(compactLayouts, this, {
            key: compactLayoutCacheKey,
            strategy: 'IMMEDIATE',
        });
        const approvalLayoutCacheKey = `approvalLayouts.${this.type}`;
        const approvalLayouts = SObject.prototype.approvalLayouts;
        this.approvalLayouts = cache.createCachedFunction(approvalLayouts, this, {
            key: approvalLayoutCacheKey,
            strategy: 'NOCACHE',
        });
        this.approvalLayouts$ = cache.createCachedFunction(approvalLayouts, this, {
            key: approvalLayoutCacheKey,
            strategy: 'HIT',
        });
        this.approvalLayouts$$ = cache.createCachedFunction(approvalLayouts, this, {
            key: approvalLayoutCacheKey,
            strategy: 'IMMEDIATE',
        });
    }
    create(records, options) {
        return this._conn.create(this.type, records, options);
    }
    /**
     * Synonym of SObject#create()
     */
    insert = this.create;
    retrieve(ids, options) {
        return this._conn.retrieve(this.type, ids, options);
    }
    update(records, options) {
        return this._conn.update(this.type, records, options);
    }
    upsert(records, extIdField, options) {
        return this._conn.upsert(this.type, records, extIdField, options);
    }
    destroy(ids, options) {
        return this._conn.destroy(this.type, ids, options);
    }
    /**
     * Synonym of SObject#destroy()
     */
    delete = this.destroy;
    /**
     * Synonym of SObject#destroy()
     */
    del = this.destroy;
    /**
     * Call Bulk#load() to execute bulkload, returning batch object
     */
    bulkload(operation, optionsOrInput, input) {
        return this._conn.bulk.load(this.type, operation, optionsOrInput, input);
    }
    /**
     * Bulkly insert input data using bulk API
     */
    createBulk(input) {
        return this.bulkload('insert', input);
    }
    /**
     * Synonym of SObject#createBulk()
     */
    insertBulk = this.createBulk;
    /**
     * Bulkly update records by input data using bulk API
     */
    updateBulk(input) {
        return this.bulkload('update', input);
    }
    /**
     * Bulkly upsert records by input data using bulk API
     */
    upsertBulk(input, extIdField) {
        return this.bulkload('upsert', { extIdField }, input);
    }
    /**
     * Bulkly delete records specified by input data using bulk API
     */
    destroyBulk(input) {
        return this.bulkload('delete', input);
    }
    /**
     * Synonym of SObject#destroyBulk()
     */
    deleteBulk = this.destroyBulk;
    /**
     * Bulkly hard delete records specified in input data using bulk API
     */
    destroyHardBulk(input) {
        return this.bulkload('hardDelete', input);
    }
    /**
     * Synonym of SObject#destroyHardBulk()
     */
    deleteHardBulk = this.destroyHardBulk;
    /**
     * Describe SObject metadata
     */
    describe() {
        return this._conn.describe(this.type);
    }
    /**
     *
     */
    describe$() {
        return this._conn.describe$(this.type);
    }
    /**
     *
     */
    describe$$() {
        return this._conn.describe$$(this.type);
    }
    /**
     * Get record representation instance by given id
     */
    record(id) {
        return new record_reference_1.default(this._conn, this.type, id);
    }
    /**
     * Retrieve recently accessed records
     */
    recent() {
        return this._conn.recent(this.type);
    }
    /**
     * Retrieve the updated records
     */
    updated(start, end) {
        return this._conn.updated(this.type, start, end);
    }
    /**
     * Retrieve the deleted records
     */
    deleted(start, end) {
        return this._conn.deleted(this.type, start, end);
    }
    /**
     * Describe layout information for SObject
     */
    async layouts(layoutName) {
        const url = `/sobjects/${this.type}/describe/${layoutName ? `namedLayouts/${layoutName}` : 'layouts'}`;
        const body = await this._conn.request(url);
        return body;
    }
    /**
     * @typedef {Object} CompactLayoutInfo
     * @prop {Array.<Object>} compactLayouts - Array of compact layouts
     * @prop {String} defaultCompactLayoutId - ID of default compact layout
     * @prop {Array.<Object>} recordTypeCompactLayoutMappings - Array of record type mappings
     */
    /**
     * Describe compact layout information defined for SObject
     *
     * @param {Callback.<CompactLayoutInfo>} [callback] - Callback function
     * @returns {Promise.<CompactLayoutInfo>}
     */
    async compactLayouts() {
        const url = `/sobjects/${this.type}/describe/compactLayouts`;
        const body = await this._conn.request(url);
        return body;
    }
    /**
     * Describe compact layout information defined for SObject
     *
     * @param {Callback.<ApprovalLayoutInfo>} [callback] - Callback function
     * @returns {Promise.<ApprovalLayoutInfo>}
     */
    async approvalLayouts() {
        const url = `/sobjects/${this.type}/describe/approvalLayouts`;
        const body = await this._conn.request(url);
        return body;
    }
    find(conditions, fields, options = {}) {
        const { sort, limit, offset, ...qoptions } = options;
        const config = {
            fields: fields == null ? undefined : fields,
            includes: options.includes,
            table: this.type,
            conditions: conditions == null ? undefined : conditions,
            sort,
            limit,
            offset,
        };
        const query = new query_1.default(this._conn, config, qoptions);
        return query.setResponseTarget(query_1.ResponseTargets.Records);
    }
    findOne(conditions, fields, options = {}) {
        const query = this.find(conditions, fields, { ...options, limit: 1 });
        return query.setResponseTarget(query_1.ResponseTargets.SingleRecord);
    }
    /**
     * Find and fetch records only by specifying fields to fetch.
     */
    select(fields) {
        return this.find(null, fields);
    }
    /**
     * Count num of records which matches given conditions
     */
    count(conditions) {
        const query = this.find(conditions, 'count()');
        return query.setResponseTarget(query_1.ResponseTargets.Count);
    }
    /**
     * Returns the list of list views for the SObject
     *
     * @param {Callback.<ListViewsInfo>} [callback] - Callback function
     * @returns {Promise.<ListViewsInfo>}
     */
    listviews() {
        const url = `${this._conn._baseUrl()}/sobjects/${this.type}/listviews`;
        return this._conn.request(url);
    }
    /**
     * Returns the list view info in specifed view id
     *
     * @param {String} id - List view ID
     * @returns {ListView}
     */
    listview(id) {
        return new ListView(this._conn, this.type, id); // eslint-disable-line no-use-before-define
    }
    /**
     * Returns all registered quick actions for the SObject
     *
     * @param {Callback.<Array.<QuickAction~QuickActionInfo>>} [callback] - Callback function
     * @returns {Promise.<Array.<QuickAction~QuickActionInfo>>}
     */
    quickActions() {
        return this._conn.request(`/sobjects/${this.type}/quickActions`);
    }
    /**
     * Get reference for specified quick aciton in the SObject
     *
     * @param {String} actionName - Name of the quick action
     * @returns {QuickAction}
     */
    quickAction(actionName) {
        return new quick_action_1.default(this._conn, `/sobjects/${this.type}/quickActions/${actionName}`);
    }
}
exports.SObject = SObject;
/**
 * A class for organizing list view information
 *
 * @protected
 * @class ListView
 * @param {Connection} conn - Connection instance
 * @param {SObject} type - SObject type
 * @param {String} id - List view ID
 */
class ListView {
    _conn;
    type;
    id;
    /**
     *
     */
    constructor(conn, type, id) {
        this._conn = conn;
        this.type = type;
        this.id = id;
    }
    /**
     * Executes query for the list view and returns the resulting data and presentation information.
     */
    results() {
        const url = `${this._conn._baseUrl()}/sobjects/${this.type}/listviews/${this.id}/results`;
        return this._conn.request(url);
    }
    /**
     * Returns detailed information about a list view
     */
    describe(options = {}) {
        const url = `${this._conn._baseUrl()}/sobjects/${this.type}/listviews/${this.id}/describe`;
        return this._conn.request({ method: 'GET', url, headers: options.headers });
    }
    /**
     * Explain plan for executing list view
     */
    explain() {
        const url = `/query/?explain=${this.id}`;
        return this._conn.request(url);
    }
}
exports.default = SObject;
// TODO Bulk
