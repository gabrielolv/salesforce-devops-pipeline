/**
 *
 */
export declare const LogLevels: {
    [level: string]: number;
};
export type LogLevelConfig = string | number | {
    [name: string]: string | number;
};
/**
 *
 */
export declare class Logger {
    _moduleName: string;
    _logLevel: number;
    constructor(moduleName: string, logLevelConfig?: LogLevelConfig);
    createInstance(logLevelConfig?: LogLevelConfig): Logger;
    setLogLevel(logLevel: string | number): void;
    log(logLevel: number, ...messages: any[]): void;
    debug(...messages: any[]): void;
    info(...messages: any[]): void;
    warn(...messages: any[]): void;
    error(...messages: any[]): void;
    fatal(...messages: any[]): void;
}
/**
 *
 */
export declare function getLogger(moduleName: string): Logger;
