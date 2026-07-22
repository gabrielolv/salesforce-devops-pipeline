export declare const treatPathSep: (data: string) => string;
export declare const sanitizePath: (data: string | undefined) => string | undefined;
export declare const isSubDir: (parent: string, dir: string) => boolean;
export declare const isSamePath: (pathA: string, pathB: string) => boolean;
export declare const dirExists: (dir: string) => Promise<boolean>;
export declare const fileExists: (file: string) => Promise<boolean>;
export declare const pathExists: (path: string) => Promise<boolean>;
export declare const readFile: (path: string) => Promise<string>;
