import type { Config } from '../types/config.js';
import type { FileGitRef } from '../types/git.js';
export declare const copyFiles: (config: Config, src: string) => Promise<void>;
export declare const readPathFromGit: (forRef: FileGitRef, config: Config) => Promise<string>;
export declare const pathExists: (path: string, config: Config) => Promise<boolean>;
export declare const readDirs: (paths: string | string[], config: Config) => Promise<string[]>;
export declare const writeFile: (path: string, content: string, config: Config) => Promise<void>;
