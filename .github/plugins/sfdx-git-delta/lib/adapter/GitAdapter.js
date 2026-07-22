import { __decorate } from "tslib";
import { readFile } from 'node:fs/promises';
import { join } from 'node:path/posix';
import { simpleGit } from 'simple-git';
import { TAB } from '../constant/cliConstants.js';
import { PATH_SEP, UTF8_ENCODING } from '../constant/fsConstants.js';
import { ADDITION, BLOB_TYPE, DELETION, HEAD, IGNORE_WHITESPACE_PARAMS, MODIFICATION, NUM_STAT_CHANGE_INFORMATION, TREE_TYPE, } from '../constant/gitConstants.js';
import { treatPathSep } from '../utils/fsUtils.js';
import { getLFSObjectContentPath, isLFS } from '../utils/gitLfsHelper.js';
import { log } from '../utils/LoggingDecorator.js';
const EOL = new RegExp(/\r?\n/);
const revPath = (pathDef) => `${pathDef.oid}:${pathDef.path}`;
export default class GitAdapter {
    config;
    static instances = new Map();
    static getInstance(config) {
        if (!GitAdapter.instances.has(config)) {
            const instance = new GitAdapter(config);
            GitAdapter.instances.set(config, instance);
        }
        return GitAdapter.instances.get(config);
    }
    simpleGit;
    getFilesPathCache;
    pathExistsCache;
    constructor(config) {
        this.config = config;
        this.simpleGit = simpleGit({ baseDir: config.repo, trimmed: true });
        this.getFilesPathCache = new Map();
        this.pathExistsCache = new Map();
    }
    async configureRepository() {
        await this.simpleGit.addConfig('core.longpaths', 'true');
        await this.simpleGit.addConfig('core.quotepath', 'off');
    }
    async parseRev(ref) {
        return await this.simpleGit.revparse(['--verify', ref]);
    }
    async pathExistsImpl(path) {
        let doesPathExists = false;
        try {
            const type = await this.simpleGit.catFile([
                '-t',
                revPath({ path, oid: this.config.to }),
            ]);
            doesPathExists = [TREE_TYPE, BLOB_TYPE].includes(type.trimEnd());
        }
        catch {
            doesPathExists = false;
        }
        return doesPathExists;
    }
    async pathExists(path) {
        if (this.pathExistsCache.has(path)) {
            return this.pathExistsCache.get(path);
        }
        const doesPathExists = await this.pathExistsImpl(path);
        this.pathExistsCache.set(path, doesPathExists);
        return doesPathExists;
    }
    async getFirstCommitRef() {
        return await this.simpleGit.raw(['rev-list', '--max-parents=0', HEAD]);
    }
    async getBufferContent(forRef) {
        let content = await this.simpleGit.showBuffer(revPath(forRef));
        if (isLFS(content)) {
            const lsfPath = getLFSObjectContentPath(content);
            content = await readFile(join(this.config.repo, lsfPath));
        }
        return content;
    }
    async getStringContent(forRef) {
        const content = await this.getBufferContent(forRef);
        return content.toString(UTF8_ENCODING);
    }
    async getFilesPathImpl(path) {
        return (await this.simpleGit.raw([
            'ls-tree',
            '--name-only',
            '-r',
            this.config.to,
            path || '.',
        ]))
            .split(EOL)
            .filter(line => line)
            .map(line => treatPathSep(line));
    }
    async getFilesPathCached(path) {
        if (this.getFilesPathCache.has(path)) {
            return Array.from(this.getFilesPathCache.get(path));
        }
        const filesPath = await this.getFilesPathImpl(path);
        const pathSegmentsLength = path.split(PATH_SEP).length;
        // Start iterating over each filePath
        for (const filePath of filesPath) {
            const relevantSegments = filePath
                .split(PATH_SEP)
                .slice(pathSegmentsLength);
            // Only cache the sub-paths for relevant files starting from the given path
            const subPathSegments = [path];
            for (const segment of relevantSegments) {
                subPathSegments.push(segment);
                const currentPath = subPathSegments.join(PATH_SEP);
                if (!this.getFilesPathCache.has(currentPath)) {
                    this.getFilesPathCache.set(currentPath, new Set());
                }
                this.getFilesPathCache.get(currentPath).add(filePath);
            }
        }
        // Store the full set of file paths for the given path in cache
        this.getFilesPathCache.set(path, new Set(filesPath));
        return filesPath;
    }
    async getFilesPath(paths) {
        if (typeof paths === 'string') {
            return this.getFilesPathCached(paths);
        }
        const result = [];
        for (const path of paths) {
            const filesPath = await this.getFilesPathCached(path);
            result.push(...filesPath);
        }
        return result;
    }
    async *getFilesFrom(path) {
        const filesPath = await this.getFilesPath(path);
        for (const filePath of filesPath) {
            const fileContent = await this.getBufferContent({
                path: filePath,
                oid: this.config.to,
            });
            yield {
                path: filePath,
                content: fileContent,
            };
        }
    }
    async getDiffLines() {
        let lines = [];
        for (const changeType of [ADDITION, MODIFICATION, DELETION]) {
            const linesOfType = await this.getDiffForType(changeType);
            lines = lines.concat(linesOfType.map(line => line.replace(NUM_STAT_CHANGE_INFORMATION, `${changeType}${TAB}`)));
        }
        return lines.map(treatPathSep);
    }
    async getDiffForType(changeType) {
        return (await this.simpleGit.raw([
            'diff',
            '--numstat',
            '--no-renames',
            ...(this.config.ignoreWhitespace ? IGNORE_WHITESPACE_PARAMS : []),
            `--diff-filter=${changeType}`,
            this.config.from,
            this.config.to,
            '--',
            ...this.config.source,
        ])).split(EOL);
    }
}
__decorate([
    log
], GitAdapter.prototype, "configureRepository", null);
__decorate([
    log
], GitAdapter.prototype, "parseRev", null);
__decorate([
    log
], GitAdapter.prototype, "pathExists", null);
__decorate([
    log
], GitAdapter.prototype, "getFirstCommitRef", null);
__decorate([
    log
], GitAdapter.prototype, "getStringContent", null);
__decorate([
    log
], GitAdapter.prototype, "getFilesPath", null);
__decorate([
    log
], GitAdapter.prototype, "getDiffLines", null);
//# sourceMappingURL=GitAdapter.js.map