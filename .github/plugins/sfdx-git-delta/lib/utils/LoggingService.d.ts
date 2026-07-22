type LoggerMessage<T = string> = T | (() => T);
export declare function lazy(strings: TemplateStringsArray, ...exprs: any[]): () => string;
export declare class Logger {
    private static coreLogger;
    static debug<T = string>(message: LoggerMessage<T>, meta?: unknown): void;
    static error<T = string>(message: LoggerMessage<T>, meta?: unknown): void;
    static info<T = string>(message: LoggerMessage<T>, meta?: unknown): void;
    static trace<T = string>(message: LoggerMessage<T>, meta?: unknown): void;
    static warn<T = string>(message: LoggerMessage<T>, meta?: unknown): void;
}
export {};
