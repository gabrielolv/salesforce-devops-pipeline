'use strict';
import { __decorate } from "tslib";
import { join, parse } from 'node:path/posix';
import { DOT, PATH_SEP } from '../constant/fsConstants.js';
import { META_REGEX, METAFILE_SUFFIX } from '../constant/metadataConstants.js';
import { pathExists, readDirs } from '../utils/fsHelper.js';
import { log } from '../utils/LoggingDecorator.js';
import StandardHandler from './standardHandler.js';
export default class ResourceHandler extends StandardHandler {
    metadataName;
    async handleAddition() {
        this.metadataName = this._getMetadataName();
        await super.handleAddition();
        if (!this.config.generateDelta)
            return;
        await this._copyResourceFiles();
    }
    async handleDeletion() {
        const [, elementPath, elementName] = this._parseLine();
        const exists = await pathExists(join(elementPath, elementName), this.config);
        if (exists) {
            await this.handleModification();
        }
        else {
            await super.handleDeletion();
        }
    }
    async _copyResourceFiles() {
        const staticResourcePath = this.metadataName.substring(0, this.metadataName.lastIndexOf(PATH_SEP));
        const allStaticResources = await readDirs(staticResourcePath, this.work.config);
        const startsWithMetadataName = new RegExp(`${this.metadataName}[${PATH_SEP}${DOT}]`);
        const resourceFiles = allStaticResources.filter((file) => startsWithMetadataName.test(file));
        for (const resourceFile of resourceFiles) {
            await this._copy(resourceFile);
        }
    }
    _getElementName() {
        const parsedPath = this._getParsedPath();
        return parsedPath.name;
    }
    _getParsedPath() {
        const base = !this.metadataDef.excluded && this.ext === this.metadataDef.suffix
            ? this.splittedLine.at(-1)
            : this.splittedLine[this.splittedLine.lastIndexOf(this.metadataDef.directoryName) + 1];
        return parse(base.replace(META_REGEX, ''));
    }
    _isProcessable() {
        return true;
    }
    _getMetadataName() {
        const metadataDirIndex = this.splittedLine.lastIndexOf(this.metadataDef.directoryName);
        const metadataFullPath = this.splittedLine.slice(0, metadataDirIndex + 2);
        const componentNameIndex = metadataFullPath.length - 1;
        const componentNameParts = metadataFullPath[componentNameIndex]
            .replace(METAFILE_SUFFIX, '')
            .split(DOT);
        if (componentNameParts.length > 1) {
            componentNameParts.pop();
        }
        metadataFullPath[componentNameIndex] = componentNameParts.join(DOT);
        return metadataFullPath.join(PATH_SEP);
    }
    _getMetaTypeFilePath() {
        return `${this.metadataName}.${this.metadataDef.suffix}${METAFILE_SUFFIX}`;
    }
    _shouldCopyMetaFile() {
        return true;
    }
}
__decorate([
    log
], ResourceHandler.prototype, "handleAddition", null);
__decorate([
    log
], ResourceHandler.prototype, "handleDeletion", null);
//# sourceMappingURL=inResourceHandler.js.map