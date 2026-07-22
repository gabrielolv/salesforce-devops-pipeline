"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRefreshDelegate = void 0;
/**
 *
 */
const logger_1 = require("./util/logger");
/**
 *
 */
class SessionRefreshDelegate {
    static _logger = (0, logger_1.getLogger)('session-refresh-delegate');
    _refreshFn;
    _conn;
    _logger;
    _lastRefreshedAt = undefined;
    _refreshPromise = undefined;
    constructor(conn, refreshFn) {
        this._conn = conn;
        this._logger = conn._logLevel
            ? SessionRefreshDelegate._logger.createInstance(conn._logLevel)
            : SessionRefreshDelegate._logger;
        this._refreshFn = refreshFn;
    }
    /**
     * Refresh access token
     * @private
     */
    async refresh(since) {
        // Callback immediately When refreshed after designated time
        if (this._lastRefreshedAt && this._lastRefreshedAt > since) {
            return;
        }
        if (this._refreshPromise) {
            await this._refreshPromise;
            return;
        }
        try {
            this._logger.info('<refresh token>');
            this._refreshPromise = new Promise((resolve, reject) => {
                this._refreshFn(this._conn, (err, accessToken, res) => {
                    if (!err) {
                        this._logger.debug('Connection refresh completed.');
                        this._conn.accessToken = accessToken;
                        this._conn.emit('refresh', accessToken, res);
                        resolve();
                    }
                    else {
                        reject(err);
                    }
                });
            });
            await this._refreshPromise;
            this._logger.info('<refresh complete>');
        }
        catch (err) {
            throw new Error(`Unable to refresh session due to: ${err.message}`);
        }
        finally {
            this._refreshPromise = undefined;
            this._lastRefreshedAt = Date.now();
        }
    }
    isRefreshing() {
        return !!this._refreshPromise;
    }
    async waitRefresh() {
        return this._refreshPromise;
    }
}
exports.SessionRefreshDelegate = SessionRefreshDelegate;
exports.default = SessionRefreshDelegate;
