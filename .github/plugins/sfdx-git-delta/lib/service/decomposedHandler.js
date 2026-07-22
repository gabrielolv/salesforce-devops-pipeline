'use strict';
import { __decorate } from "tslib";
import { join } from 'node:path/posix';
import { PATH_SEP } from '../constant/fsConstants.js';
import { METAFILE_SUFFIX } from '../constant/metadataConstants.js';
import { log } from '../utils/LoggingDecorator.js';
import StandardHandler from './standardHandler.js';
export default class DecomposedHandler extends StandardHandler {
    async handleAddition() {
        await super.handleAddition();
        if (!this.config.generateDelta)
            return;
        await this._copyParent();
    }
    async _copyParent() {
        const parentDirPath = this.splittedLine
            .slice(0, this.splittedLine.indexOf(this.metadataDef.directoryName))
            .join(PATH_SEP);
        const parentTypeName = this.getParentName();
        const parentTypeSuffix = this.metadata.get(this.metadataDef.parentXmlName).suffix;
        const parentPath = join(parentDirPath, `${parentTypeName}.${parentTypeSuffix}${METAFILE_SUFFIX}`);
        await this._copyWithMetaFile(parentPath);
    }
    _getElementName() {
        const parentTypeSuffix = this.getParentName();
        const elementName = super._getElementName();
        return `${parentTypeSuffix}.${elementName}`;
    }
    getParentName() {
        return this.splittedLine[this.splittedLine.indexOf(this.metadataDef.directoryName) - 1];
    }
}
__decorate([
    log
], DecomposedHandler.prototype, "handleAddition", null);
//# sourceMappingURL=decomposedHandler.js.map