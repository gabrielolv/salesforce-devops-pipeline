'use strict';
import { __decorate } from "tslib";
import { basename } from 'node:path/posix';
import { DOT } from '../constant/fsConstants.js';
import { getInFileAttributes, isPackable } from '../metadata/metadataManager.js';
import { writeFile } from '../utils/fsHelper.js';
import { log } from '../utils/LoggingDecorator.js';
import MetadataDiff from '../utils/metadataDiff.js';
import { fillPackageWithParameter } from '../utils/packageHelper.js';
import StandardHandler from './standardHandler.js';
const getRootType = (line) => basename(line).split(DOT)[0];
export default class InFileHandler extends StandardHandler {
    metadataDiff;
    constructor(line, metadataDef, work, metadata) {
        super(line, metadataDef, work, metadata);
        const inFileMetadata = getInFileAttributes(metadata);
        this.metadataDiff = new MetadataDiff(this.config, inFileMetadata);
    }
    async handleAddition() {
        await this._compareRevisionAndStoreComparison();
    }
    async handleDeletion() {
        if (this._shouldTreatDeletionAsDeletion()) {
            await super.handleDeletion();
        }
        else {
            await this.handleAddition();
        }
    }
    async handleModification() {
        await this.handleAddition();
    }
    async _compareRevisionAndStoreComparison() {
        const { added, deleted } = await this.metadataDiff.compare(this.line);
        this._storeComparison(this.diffs.destructiveChanges, deleted);
        this._storeComparison(this.diffs.package, added);
        const { xmlContent, isEmpty } = this.metadataDiff.prune();
        if (this._shouldTreatContainerType(isEmpty)) {
            // Call from super.handleAddition to add the Root Type
            // QUESTION: Why InFile element are not deployable when root component is not listed in package.xml ?
            await super.handleAddition();
        }
        if (this.config.generateDelta && !isEmpty) {
            await writeFile(this.line, xmlContent, this.config);
        }
    }
    _storeComparison(store, content) {
        for (const [type, members] of content) {
            for (const member of members) {
                this._fillPackageForInfileMetadata(store, type, member);
            }
        }
    }
    _fillPackageForInfileMetadata(store, subType, member) {
        if (isPackable(subType)) {
            const cleanedMember = `${this._getQualifiedName()}${member}`;
            fillPackageWithParameter({
                store,
                type: subType,
                member: cleanedMember,
            });
        }
    }
    _getQualifiedName() {
        return `${getRootType(this.line)}${DOT}`;
    }
    _delegateFileCopy() {
        return false;
    }
    _shouldTreatDeletionAsDeletion() {
        return this.metadataDef.pruneOnly;
    }
    _shouldTreatContainerType(fileIsEmpty) {
        return !fileIsEmpty;
    }
}
__decorate([
    log
], InFileHandler.prototype, "handleAddition", null);
__decorate([
    log
], InFileHandler.prototype, "handleDeletion", null);
//# sourceMappingURL=inFileHandler.js.map