'use strict';
import { __decorate } from "tslib";
import { join, parse } from 'node:path/posix';
import { PATH_SEP } from '../constant/fsConstants.js';
import { METAFILE_SUFFIX, PERMISSIONSET_OBJECTSETTINGS_FOLDER, } from '../constant/metadataConstants.js';
import { readDirs } from '../utils/fsHelper.js';
import { log } from '../utils/LoggingDecorator.js';
import StandardHandler from './standardHandler.js';
export default class ContainedDecomposedHandler extends StandardHandler {
    holderFolder;
    constructor(line, metadataDef, work, metadata) {
        super(line, metadataDef, work, metadata);
        this._setholderFolder();
    }
    async handleAddition() {
        await super.handleAddition();
        if (!this.config.generateDelta)
            return;
        // For decomposed format, copy all related files
        if (this._isDecomposedFormat()) {
            await this._copyDecomposedFiles();
        }
    }
    async handleDeletion() {
        if (!this._isDecomposedFormat()) {
            await super.handleDeletion();
            return;
        }
        if (await this._hasRelatedContent()) {
            await this.handleModification();
        }
        else {
            await super.handleDeletion();
        }
    }
    _setholderFolder() {
        if (!this._isDecomposedFormat()) {
            this.holderFolder = parse(this.line
                .replace(METAFILE_SUFFIX, '')
                .replace(`.${this.metadataDef.suffix}`, ''));
            return;
        }
        // Get the parent folder name from the path
        const parentFolderName = this.splittedLine.at(-2);
        // If parent folder is objectSettings, use the grandparent folder name
        // Otherwise use the parent folder name
        const index = parentFolderName === PERMISSIONSET_OBJECTSETTINGS_FOLDER ? -2 : -1;
        this.holderFolder = parse(this.splittedLine.slice(0, index).join(PATH_SEP));
    }
    _isDecomposedFormat() {
        return (!this.parsedLine.base.includes(`.${this.metadataDef.suffix}`) ||
            this.parsedLine.dir.split(PATH_SEP).pop() === this.parsedLine.name);
    }
    async _hasRelatedContent() {
        const files = await readDirs(join(this.holderFolder.dir, this.holderFolder.base), this.config);
        return files.length > 0;
    }
    async _copyDecomposedFiles() {
        await this._copy(join(this.holderFolder.dir, this.holderFolder.base));
    }
    _getElementName() {
        return this.holderFolder.base;
    }
    _isProcessable() {
        return true;
    }
}
__decorate([
    log
], ContainedDecomposedHandler.prototype, "handleAddition", null);
__decorate([
    log
], ContainedDecomposedHandler.prototype, "handleDeletion", null);
//# sourceMappingURL=containedDecomposedHandler.js.map