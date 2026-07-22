'use strict';
import { join } from 'node:path/posix';
import { METAFILE_SUFFIX } from '../constant/metadataConstants.js';
import { getSharedFolderMetadata } from '../metadata/metadataManager.js';
import { fillPackageWithParameter } from '../utils/packageHelper.js';
import InFolderHandler from './inFolderHandler.js';
export default class ReportingFolderHandler extends InFolderHandler {
    /* jscpd:ignore-start */
    sharedFolderMetadata;
    constructor(line, metadataDef, work, metadata) {
        super(line, metadataDef, work, metadata);
        this.sharedFolderMetadata = getSharedFolderMetadata(this.metadata);
    }
    /* jscpd:ignore-end */
    async _copyFolderMetaFile() {
        const [, folderPath, folderName] = this._parseLine();
        const folderFileName = `${folderName}${METAFILE_SUFFIX}`;
        await this._copyWithMetaFile(join(folderPath, folderFileName));
    }
    _fillPackage(store) {
        const type = this.sharedFolderMetadata.get(this.ext);
        fillPackageWithParameter({
            store,
            type: type,
            member: this._getElementName(),
        });
    }
}
//# sourceMappingURL=reportingFolderHandler.js.map