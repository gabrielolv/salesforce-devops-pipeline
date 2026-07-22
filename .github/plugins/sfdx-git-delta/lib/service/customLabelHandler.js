'use strict';
import { __decorate } from "tslib";
import { LABEL_DECOMPOSED_SUFFIX } from '../constant/metadataConstants.js';
import { log } from '../utils/LoggingDecorator.js';
import InFileHandler from './inFileHandler.js';
import StandardHandler from './standardHandler.js';
export default class CustomLabelHandler extends InFileHandler {
    async handleAddition() {
        if (this._isDecomposed()) {
            await StandardHandler.prototype.handleAddition.apply(this);
        }
        else {
            await super.handleAddition();
        }
    }
    _shouldTreatDeletionAsDeletion() {
        return this._isDecomposed();
    }
    _getQualifiedName() {
        return '';
    }
    _delegateFileCopy() {
        return this._isDecomposed();
    }
    _isProcessable() {
        return true;
    }
    _shouldTreatContainerType() {
        // There is no container / parent type for Contained CustomLabels
        return false;
    }
    _isDecomposed() {
        return this.ext === LABEL_DECOMPOSED_SUFFIX;
    }
}
__decorate([
    log
], CustomLabelHandler.prototype, "handleAddition", null);
//# sourceMappingURL=customLabelHandler.js.map