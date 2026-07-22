import { SimpleGit } from 'simple-git';
import type { Config } from '../types/config.js';
import type { FileGitRef } from '../types/git.js';
export default class GitAdapter {
    protected readonly config: Config;
    private static instances;
    static getInstance(config: Config): GitAdapter;
    protected readonly simpleGit: SimpleGit;
    protected readonly getFilesPathCache: Map<string, Set<string>>;
    protected readonly pathExistsCache: Map<string, boolean>;
    private constructor();
    configureRepository(): Promise<void>;
    parseRev(ref: string): Promise<string>;
    protected pathExistsImpl(path: string): Promise<boolean>;
    pathExists(path: string): Promise<boolean>;
    getFirstCommitRef(): Promise<string>;
    protected getBufferContent(forRef: FileGitRef): Promise<Buffer>;
    getStringContent(forRef: FileGitRef): Promise<string>;
    protected getFilesPathImpl(path: string): Promise<string[]>;
    protected getFilesPathCached(path: string): Promise<string[]>;
    getFilesPath(paths: string | string[]): Promise<string[]>;
    getFilesFrom(path: string): AsyncGenerator<{
        path: string;
        content: Buffer<ArrayBufferLike>;
    }, void, unknown>;
    getDiffLines(): Promise<string[]>;
    protected getDiffForType(changeType: string): Promise<string[]>;
}
