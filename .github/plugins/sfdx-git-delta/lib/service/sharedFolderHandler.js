'use strict';
import { join, parse } from 'node:path/posix';
import { METAFILE_SUFFIX } from '../constant/metadataConstants.js';
import { getSharedFolderMetadata } from '../metadata/metadataManager.js';
import { fillPackageWithParameter } from '../utils/packageHelper.js';
import StandardHandler from './standardHandler.js';
export default class SharedFolderHandler extends StandardHandler {
    /* jscpd:ignore-start */
    sharedFolderMetadata;
    constructor(line, metadataDef, work, metadata) {
        super(line, metadataDef, work, metadata);
        this.sharedFolderMetadata = getSharedFolderMetadata(this.metadata);
    }
    /* jscpd:ignore-end */
    _fillPackage(store) {
        const type = this.sharedFolderMetadata.get(this.ext);
        fillPackageWithParameter({
            store,
            type: type,
            member: this._getElementName(),
        });
    }
    _isProcessable() {
        return super._isProcessable() || this.sharedFolderMetadata.has(this.ext);
    }
    _getMetaTypeFilePath(path) {
        const parsedPath = parse(path);
        return join(parsedPath.dir, `${parsedPath.name}${parsedPath.ext}${METAFILE_SUFFIX}`);
    }
}
//# sourceMappingURL=sharedFolderHandler.js.map