'use strict';
import { access, readFile as fsReadFile, stat } from 'node:fs/promises';
import { isAbsolute, normalize, relative } from 'node:path/posix';
import { PATH_SEP, PATH_SEPARATOR_REGEX, UTF8_ENCODING, } from '../constant/fsConstants.js';
export const treatPathSep = (data) => data.replace(PATH_SEPARATOR_REGEX, PATH_SEP);
export const sanitizePath = (data) => data ? normalize(treatPathSep(data)) : data;
export const isSubDir = (parent, dir) => {
    const rel = relative(parent, dir);
    return !!rel && !rel.startsWith('..') && !isAbsolute(rel);
};
export const isSamePath = (pathA, pathB) => !relative(pathA, pathB);
export const dirExists = async (dir) => {
    try {
        const st = await stat(dir);
        return st.isDirectory();
    }
    catch {
        return false;
    }
};
export const fileExists = async (file) => {
    try {
        const st = await stat(file);
        return st.isFile();
    }
    catch {
        return false;
    }
};
export const pathExists = async (path) => {
    let pathIsAccessible = true;
    try {
        await access(path);
    }
    catch {
        pathIsAccessible = false;
    }
    return pathIsAccessible;
};
export const readFile = async (path) => {
    const file = await fsReadFile(path, {
        encoding: UTF8_ENCODING,
    });
    return file;
};
//# sourceMappingURL=fsUtils.js.map