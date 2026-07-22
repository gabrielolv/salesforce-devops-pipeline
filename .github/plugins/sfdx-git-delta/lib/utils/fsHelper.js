'use strict';
import { join } from 'node:path/posix';
import { outputFile } from 'fs-extra';
import GitAdapter from '../adapter/GitAdapter.js';
import { buildIgnoreHelper } from './ignoreHelper.js';
const copiedFiles = new Set();
const writtenFiles = new Set();
export const copyFiles = async (config, src) => {
    if (copiedFiles.has(src) || writtenFiles.has(src)) {
        return;
    }
    copiedFiles.add(src);
    const ignoreHelper = await buildIgnoreHelper(config);
    if (ignoreHelper.globalIgnore.ignores(src)) {
        return;
    }
    try {
        const gitAdapter = GitAdapter.getInstance(config);
        for await (const file of gitAdapter.getFilesFrom(src)) {
            // Use Buffer to output the file content
            // Let fs implementation detect the encoding ("utf8" or "binary")
            const dst = join(config.output, file.path);
            await outputFile(dst, file.content);
            copiedFiles.add(dst);
        }
    }
    catch {
        /* empty */
    }
};
export const readPathFromGit = async (forRef, config) => {
    let utf8Data = '';
    try {
        const gitAdapter = GitAdapter.getInstance(config);
        utf8Data = await gitAdapter.getStringContent(forRef);
    }
    catch {
        /* empty */
    }
    return utf8Data;
};
export const pathExists = async (path, config) => {
    const gitAdapter = GitAdapter.getInstance(config);
    return await gitAdapter.pathExists(path);
};
export const readDirs = async (paths, config) => {
    const gitAdapter = GitAdapter.getInstance(config);
    return await gitAdapter.getFilesPath(paths);
};
export const writeFile = async (path, content, config) => {
    if (writtenFiles.has(path)) {
        return;
    }
    writtenFiles.add(path);
    const ignoreHelper = await buildIgnoreHelper(config);
    if (ignoreHelper.globalIgnore.ignores(path)) {
        return;
    }
    await outputFile(join(config.output, path), content);
};
//# sourceMappingURL=fsHelper.js.map