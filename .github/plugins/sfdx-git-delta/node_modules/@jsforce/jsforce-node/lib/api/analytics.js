"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analytics = exports.Dashboard = exports.Report = exports.ReportInstance = void 0;
/**
 * @file Manages Salesforce Analytics API
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
const jsforce_1 = require("../jsforce");
/*----------------------------------------------------------------------------------*/
/**
 * Report object class in Analytics API
 */
class ReportInstance {
    _report;
    _conn;
    id;
    /**
     *
     */
    constructor(report, id) {
        this._report = report;
        this._conn = report._conn;
        this.id = id;
    }
    /**
     * Retrieve report result asynchronously executed
     */
    retrieve() {
        const url = [
            this._conn._baseUrl(),
            'analytics',
            'reports',
            this._report.id,
            'instances',
            this.id,
        ].join('/');
        return this._conn.request(url);
    }
}
exports.ReportInstance = ReportInstance;
/*----------------------------------------------------------------------------------*/
/**
 * Report object class in Analytics API
 */
class Report {
    _conn;
    id;
    /**
     *
     */
    constructor(conn, id) {
        this._conn = conn;
        this.id = id;
    }
    /**
     * Describe report metadata
     */
    describe() {
        const url = [
            this._conn._baseUrl(),
            'analytics',
            'reports',
            this.id,
            'describe',
        ].join('/');
        return this._conn.request(url);
    }
    /**
     * Destroy a report
     */
    destroy() {
        const url = [this._conn._baseUrl(), 'analytics', 'reports', this.id].join('/');
        return this._conn.request({ method: 'DELETE', url });
    }
    /**
     * Synonym of Analytics~Report#destroy()
     */
    delete = this.destroy;
    /**
     * Synonym of Analytics~Report#destroy()
     */
    del = this.destroy;
    /**
     * Clones a given report
     */
    clone(name) {
        const url = [this._conn._baseUrl(), 'analytics', 'reports'].join('/') +
            '?cloneId=' +
            this.id;
        const config = { reportMetadata: { name } };
        return this._conn.request({
            method: 'POST',
            url,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config),
        });
    }
    /**
     * Explain plan for executing report
     */
    explain() {
        const url = '/query/?explain=' + this.id;
        return this._conn.request(url);
    }
    /**
     * Run report synchronously
     */
    execute(options = {}) {
        const url = [this._conn._baseUrl(), 'analytics', 'reports', this.id].join('/') +
            '?includeDetails=' +
            (options.details ? 'true' : 'false');
        return this._conn.request({
            url,
            ...(options.metadata
                ? {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(options.metadata),
                }
                : { method: 'GET' }),
        });
    }
    /**
     * Synonym of Analytics~Report#execute()
     */
    run = this.execute;
    /**
     * Synonym of Analytics~Report#execute()
     */
    exec = this.execute;
    /**
     * Run report asynchronously
     */
    executeAsync(options = {}) {
        const url = [
            this._conn._baseUrl(),
            'analytics',
            'reports',
            this.id,
            'instances',
        ].join('/') + (options.details ? '?includeDetails=true' : '');
        return this._conn.request({
            method: 'POST',
            url,
            ...(options.metadata
                ? {
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(options.metadata),
                }
                : { body: '' }),
        });
    }
    /**
     * Get report instance for specified instance ID
     */
    instance(id) {
        return new ReportInstance(this, id);
    }
    /**
     * List report instances which had been executed asynchronously
     */
    instances() {
        const url = [
            this._conn._baseUrl(),
            'analytics',
            'reports',
            this.id,
            'instances',
        ].join('/');
        return this._conn.request(url);
    }
}
exports.Report = Report;
/*----------------------------------------------------------------------------------*/
/**
 * Dashboard object class in the Analytics API
 */
class Dashboard {
    _conn;
    id;
    /**
     *
     */
    constructor(conn, id) {
        this._conn = conn;
        this.id = id;
    }
    /**
     * Describe dashboard metadata
     *
     * @method Analytics~Dashboard#describe
     * @param {Callback.<Analytics-DashboardMetadata>} [callback] - Callback function
     * @returns {Promise.<Analytics-DashboardMetadata>}
     */
    describe() {
        const url = [
            this._conn._baseUrl(),
            'analytics',
            'dashboards',
            this.id,
            'describe',
        ].join('/');
        return this._conn.request(url);
    }
    /**
     * Get details about dashboard components
     */
    components(componentIds) {
        const url = [
            this._conn._baseUrl(),
            'analytics',
            'dashboards',
            this.id,
        ].join('/');
        const config = {
            componentIds: Array.isArray(componentIds)
                ? componentIds
                : typeof componentIds === 'string'
                    ? [componentIds]
                    : undefined,
        };
        return this._conn.request({
            method: 'POST',
            url,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config),
        });
    }
    /**
     * Get dashboard status
     */
    status() {
        const url = [
            this._conn._baseUrl(),
            'analytics',
            'dashboards',
            this.id,
            'status',
        ].join('/');
        return this._conn.request(url);
    }
    /**
     * Refresh a dashboard
     */
    refresh() {
        const url = [
            this._conn._baseUrl(),
            'analytics',
            'dashboards',
            this.id,
        ].join('/');
        return this._conn.request({
            method: 'PUT',
            url,
            body: '',
        });
    }
    /**
     * Clone a dashboard
     */
    clone(config, folderId) {
        const url = [this._conn._baseUrl(), 'analytics', 'dashboards'].join('/') +
            '?cloneId=' +
            this.id;
        if (typeof config === 'string') {
            config = { name: config, folderId };
        }
        return this._conn.request({
            method: 'POST',
            url,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config),
        });
    }
    /**
     * Destroy a dashboard
     */
    destroy() {
        const url = [
            this._conn._baseUrl(),
            'analytics',
            'dashboards',
            this.id,
        ].join('/');
        return this._conn.request({ method: 'DELETE', url });
    }
    /**
     * Synonym of Analytics~Dashboard#destroy()
     */
    delete = this.destroy;
    /**
     * Synonym of Analytics~Dashboard#destroy()
     */
    del = this.destroy;
}
exports.Dashboard = Dashboard;
/*----------------------------------------------------------------------------------*/
/**
 * API class for Analytics API
 */
class Analytics {
    _conn;
    /**
     *
     */
    constructor(conn) {
        this._conn = conn;
    }
    /**
     * Get report object of Analytics API
     */
    report(id) {
        return new Report(this._conn, id);
    }
    /**
     * Get recent report list
     */
    reports() {
        const url = [this._conn._baseUrl(), 'analytics', 'reports'].join('/');
        return this._conn.request(url);
    }
    /**
     * Get dashboard object of Analytics API
     */
    dashboard(id) {
        return new Dashboard(this._conn, id);
    }
    /**
     * Get recent dashboard list
     */
    dashboards() {
        const url = [this._conn._baseUrl(), 'analytics', 'dashboards'].join('/');
        return this._conn.request(url);
    }
}
exports.Analytics = Analytics;
/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
(0, jsforce_1.registerModule)('analytics', (conn) => new Analytics(conn));
exports.default = Analytics;
