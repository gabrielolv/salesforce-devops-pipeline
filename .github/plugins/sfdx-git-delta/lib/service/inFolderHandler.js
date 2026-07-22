'use strict';
import { __decorate } from "tslib";
import { join, parse } from 'node:path/posix';
import { EXTENSION_SUFFIX_REGEX, PATH_SEP } from '../constant/fsConstants.js';
import { INFOLDER_SUFFIX, META_REGEX, METAFILE_SUFFIX, } from '../constant/metadataConstants.js';
import { readDirs } from '../utils/fsHelper.js';
import { log } from '../utils/LoggingDecorator.js';
import StandardHandler from './standardHandler.js';
const INFOLDER_SUFFIX_REGEX = new RegExp(`${INFOLDER_SUFFIX}$`);
export default class InFolderHandler extends StandardHandler {
    async handleAddition() {
        await super.handleAddition();
        if (!this.config.generateDelta)
            return;
        await this._copyFolderMetaFile();
        await this._copySpecialExtension();
    }
    async _copyFolderMetaFile() {
        const [, folderPath, folderName] = this._parseLine();
        const suffix = folderName.endsWith(INFOLDER_SUFFIX)
            ? ''
            : `.${this.metadataDef.suffix.toLowerCase()}`;
        const folderFileName = `${folderName}${suffix}${METAFILE_SUFFIX}`;
        await this._copyWithMetaFile(join(folderPath, folderFileName));
    }
    async _copySpecialExtension() {
        const parsedLine = parse(this.line);
        const dirContent = await readDirs(parsedLine.dir, this.config);
        await Promise.all(dirContent
            .filter((file) => file.includes(parsedLine.name))
            .map((file) => this._copyWithMetaFile(file)));
    }
    _getElementName() {
        return this.splittedLine
            .slice(this.splittedLine.indexOf(this.metadataDef.directoryName) + 1)
            .join(PATH_SEP)
            .replace(META_REGEX, '')
            .replace(INFOLDER_SUFFIX_REGEX, '')
            .replace(EXTENSION_SUFFIX_REGEX, '');
    }
    _isProcessable() {
        return (super._isProcessable() ||
            this._parentFolderIsNotTheType() ||
            this.ext.endsWith(INFOLDER_SUFFIX));
    }
}
__decorate([
    log
], InFolderHandler.prototype, "handleAddition", null);
//# sourceMappingURL=inFolderHandler.js.map