"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = exports.ApprovalProcess = exports.ProcessRule = void 0;
/**
 * A class which manages process (workflow) rules
 */
class ProcessRule {
    _conn;
    /**
     *
     */
    constructor(conn) {
        this._conn = conn;
    }
    /**
     * Get all process rule definitions registered to sobjects
     */
    async list() {
        const res = await this._conn.request('/process/rules');
        return res.rules;
    }
    /**
     * Trigger process rule for given entities
     */
    trigger(contextIds) {
        const contextIds_ = Array.isArray(contextIds) ? contextIds : [contextIds];
        // https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_process_rules_trigger.htm
        return this._conn.request({
            method: 'POST',
            url: '/process/rules/',
            body: JSON.stringify({
                contextIds: contextIds_,
            }),
            headers: {
                'content-type': 'application/json',
            },
        });
    }
}
exports.ProcessRule = ProcessRule;
/**
 * A class which manages approval processes
 */
class ApprovalProcess {
    _conn;
    /**
     *
     */
    constructor(conn) {
        this._conn = conn;
    }
    /**
     * Get all approval process definitions registered to sobjects
     */
    async list() {
        const res = await this._conn.request('/process/approvals');
        return res.approvals;
    }
    /**
     * Send bulk requests for approval process
     */
    request(requests) {
        const requests_ = requests.map((req) => '_request' in req ? req._request : req);
        return this._conn.request({
            method: 'POST',
            url: '/process/approvals',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ requests: requests_ }),
        });
    }
    /**
     * Create approval process request
     *
     * @private
     */
    _createRequest(actionType, contextId, comments, options = {}) {
        return new ApprovalProcessRequest(this, {
            actionType,
            contextId,
            comments,
            ...options,
        });
    }
    /**
     * Submit approval request for an item
     */
    submit(contextId, comments, options) {
        return this._createRequest('Submit', contextId, comments, options);
    }
    /**
     * Approve approval request for an item
     */
    approve(workitemId, comments, options = {}) {
        return this._createRequest('Approve', workitemId, comments, options);
    }
    /**
     * Reject approval request for an item
     */
    reject(workitemId, comments, options = {}) {
        return this._createRequest('Reject', workitemId, comments, options);
    }
}
exports.ApprovalProcess = ApprovalProcess;
/**
 * A class representing approval process request
 */
class ApprovalProcessRequest {
    _process;
    _request;
    _promise;
    constructor(process, request) {
        this._process = process;
        this._request = request;
    }
    /**
     * Promise/A+ interface
     * http://promises-aplus.github.io/promises-spec/
     */
    then(onResolve, onReject) {
        if (!this._promise) {
            this._promise = this._process
                .request([this])
                .then((rets) => rets[0]);
        }
        this._promise.then(onResolve, onReject);
    }
}
/**
 * A class which manages process rules and approval processes
 */
class Process {
    rule;
    approval;
    /**
     *
     */
    constructor(conn) {
        this.rule = new ProcessRule(conn);
        this.approval = new ApprovalProcess(conn);
    }
}
exports.Process = Process;
exports.default = Process;
