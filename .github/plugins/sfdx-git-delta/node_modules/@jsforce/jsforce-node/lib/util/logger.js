"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = exports.Logger = exports.LogLevels = void 0;
/**
 *
 */
exports.LogLevels = {
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5,
    NONE: 6,
};
const LogLevelLabels = ['', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'NONE'];
const globalLogLevelConfig = (() => {
    const globalLogLevelStr = process.env.JSFORCE_LOG_LEVEL ||
        global.__JSFORCE_LOG_LEVEL__ ||
        'NONE';
    if (/^(DEBUG|INFO|WARN|ERROR|FATAL|NONE)$/i.test(globalLogLevelStr)) {
        return { '*': globalLogLevelStr };
    }
    try {
        return JSON.parse(globalLogLevelStr);
    }
    catch (e) {
        return { '*': 'NONE' };
    }
})();
function getModuleLogLevel(logLevelConfig, moduleName) {
    const logLevel = logLevelConfig[moduleName] || logLevelConfig['*'];
    return typeof logLevel === 'number'
        ? logLevel
        : exports.LogLevels[logLevel] || exports.LogLevels.NONE;
}
/**
 *
 */
class Logger {
    _moduleName;
    _logLevel;
    constructor(moduleName, logLevelConfig = globalLogLevelConfig) {
        this._moduleName = moduleName;
        this._logLevel =
            typeof logLevelConfig === 'number'
                ? logLevelConfig
                : typeof logLevelConfig === 'string'
                    ? exports.LogLevels[logLevelConfig] || exports.LogLevels.NONE
                    : getModuleLogLevel(logLevelConfig, moduleName);
    }
    createInstance(logLevelConfig = this._logLevel) {
        return new Logger(this._moduleName, logLevelConfig);
    }
    setLogLevel(logLevel) {
        if (typeof logLevel === 'string') {
            this._logLevel = exports.LogLevels[logLevel] || exports.LogLevels.NONE;
        }
        else {
            this._logLevel = logLevel;
        }
    }
    log(logLevel, ...messages) {
        if (this._logLevel <= logLevel) {
            const msgs = [
                `${LogLevelLabels[logLevel]}\t[${this._moduleName}] `,
                ...messages,
            ];
            if (logLevel < exports.LogLevels.ERROR) {
                console.log(...msgs); // eslint-disable-line no-console
            }
            else {
                console.error(...msgs); // eslint-disable-line no-console
            }
        }
    }
    debug(...messages) {
        this.log(exports.LogLevels.DEBUG, ...messages);
    }
    info(...messages) {
        this.log(exports.LogLevels.INFO, ...messages);
    }
    warn(...messages) {
        this.log(exports.LogLevels.WARN, ...messages);
    }
    error(...messages) {
        this.log(exports.LogLevels.ERROR, ...messages);
    }
    fatal(...messages) {
        this.log(exports.LogLevels.FATAL, ...messages);
    }
}
exports.Logger = Logger;
const loggers = {};
/**
 *
 */
function getLogger(moduleName) {
    const logger = loggers[moduleName] || new Logger(moduleName);
    loggers[moduleName] = logger;
    return logger;
}
exports.getLogger = getLogger;
