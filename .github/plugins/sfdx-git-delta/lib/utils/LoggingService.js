import { Logger as CoreLogger, LoggerLevel } from '@salesforce/core';
import { PLUGIN_NAME } from '../constant/libConstant.js';
function resolveLoggerMessage(message) {
    return typeof message === 'function' ? message() : message;
}
// biome-ignore lint/suspicious/noExplicitAny: Any is expected here
export function lazy(strings, ...exprs) {
    const getters = exprs.map(expr => {
        if (typeof expr === 'function')
            return expr;
        return () => expr;
    });
    return () => strings.reduce((acc, str, i) => acc + str + (i < getters.length ? getters[i]() : ''), '');
}
export class Logger {
    static coreLogger = (() => {
        const coreLogger = CoreLogger.childFromRoot(PLUGIN_NAME);
        coreLogger.setLevel();
        return coreLogger;
    })();
    static debug(message, meta) {
        if (Logger.coreLogger.shouldLog(LoggerLevel.DEBUG)) {
            const content = resolveLoggerMessage(message);
            Logger.coreLogger.debug(content, meta);
        }
    }
    static error(message, meta) {
        if (Logger.coreLogger.shouldLog(LoggerLevel.ERROR)) {
            const content = resolveLoggerMessage(message);
            Logger.coreLogger.error(content, meta);
        }
    }
    static info(message, meta) {
        if (Logger.coreLogger.shouldLog(LoggerLevel.INFO)) {
            const content = resolveLoggerMessage(message);
            Logger.coreLogger.info(content, meta);
        }
    }
    static trace(message, meta) {
        if (Logger.coreLogger.shouldLog(LoggerLevel.TRACE)) {
            const content = resolveLoggerMessage(message);
            Logger.coreLogger.trace(content, meta);
        }
    }
    static warn(message, meta) {
        if (Logger.coreLogger.shouldLog(LoggerLevel.WARN)) {
            const content = resolveLoggerMessage(message);
            Logger.coreLogger.warn(content, meta);
        }
    }
}
//# sourceMappingURL=LoggingService.js.map