'use strict';
import { __decorate } from "tslib";
import { parse } from 'node:path/posix';
import { DOT, PATH_SEP } from '../constant/fsConstants.js';
import { CUSTOM_APPLICATION_SUFFIX, CUSTOM_METADATA_SUFFIX, EMAIL_SERVICES_FUNCTION_SUFFIX, METAFILE_SUFFIX, OBJECT_TRANSLATION_TYPE, OBJECT_TYPE, PERMISSIONSET_TYPE, SHARING_RULE_TYPE, SUB_OBJECT_TYPES, TERRITORY_MODEL_TYPE, WORKFLOW_TYPE, } from '../constant/metadataConstants.js';
import { log } from '../utils/LoggingDecorator.js';
export class MetadataRepositoryImpl {
    metadatas;
    metadataPerExt;
    metadataPerDir;
    metadataPerXmlName;
    constructor(metadatas) {
        this.metadatas = metadatas;
        this.metadataPerExt = new Map();
        this.metadataPerDir = new Map();
        this.metadataPerXmlName = new Map();
        this.metadatas.forEach(metadata => {
            this.addSuffix(metadata);
            this.addFolder(metadata);
            this.addXmlName(metadata);
        });
    }
    addSuffix(metadata) {
        if (metadata.suffix) {
            if (this.metadataPerExt.has(metadata.suffix)) {
                MetadataRepositoryImpl.UNSAFE_EXTENSION.add(metadata.suffix);
            }
            else {
                this.metadataPerExt.set(metadata.suffix, metadata);
            }
        }
        this.addSharedFolderSuffix(metadata);
    }
    addSharedFolderSuffix(metadata) {
        if (metadata.content) {
            const metadataWithoutContent = {
                ...metadata,
                content: undefined,
            };
            for (const sharedFolderMetadataDef of metadata.content) {
                this.addSuffix({
                    ...metadataWithoutContent,
                    suffix: sharedFolderMetadataDef.suffix,
                });
            }
        }
    }
    addFolder(metadata) {
        if (metadata.directoryName) {
            this.metadataPerDir.set(metadata.directoryName, metadata);
        }
    }
    addXmlName(metadata) {
        if (metadata.xmlName) {
            this.metadataPerXmlName.set(metadata.xmlName, metadata);
        }
    }
    has(path) {
        return !!this.get(path);
    }
    get(path) {
        const parts = path.split(PATH_SEP);
        return (this.searchByExtension(parts) ??
            this.searchByDirectory(parts) ??
            this.searchByXmlName(path));
    }
    searchByExtension(parts) {
        const extension = parse(parts[parts.length - 1].replace(METAFILE_SUFFIX, '')).ext.replace(DOT, '');
        if (MetadataRepositoryImpl.UNSAFE_EXTENSION.has(extension)) {
            return;
        }
        return this.metadataPerExt.get(extension);
    }
    searchByDirectory(parts) {
        let metadata;
        for (const part of parts) {
            metadata = this.metadataPerDir.get(part) ?? metadata;
            if (metadata &&
                !MetadataRepositoryImpl.TYPES_WITH_SUB_TYPES.has(metadata.xmlName)) {
                break;
            }
        }
        return metadata;
    }
    searchByXmlName(xmlName) {
        return this.metadataPerXmlName.get(xmlName);
    }
    getFullyQualifiedName(path) {
        let fullyQualifiedName = parse(path).base;
        const type = this.get(path);
        if (type && MetadataRepositoryImpl.COMPOSED_TYPES.has(type.xmlName)) {
            const parentType = path
                .split(PATH_SEP)
                .find(part => this.metadataPerDir.has(part));
            fullyQualifiedName = path
                .slice(path.indexOf(parentType))
                .replace(new RegExp(PATH_SEP, 'g'), '');
        }
        return fullyQualifiedName;
    }
    values() {
        return this.metadatas;
    }
    static TYPES_WITH_SUB_TYPES = new Set([
        OBJECT_TYPE,
        TERRITORY_MODEL_TYPE,
        WORKFLOW_TYPE,
        SHARING_RULE_TYPE,
        '',
    ]);
    static UNSAFE_EXTENSION = new Set([
        CUSTOM_APPLICATION_SUFFIX,
        EMAIL_SERVICES_FUNCTION_SUFFIX,
        CUSTOM_METADATA_SUFFIX,
    ]);
    static COMPOSED_TYPES = new Set([
        OBJECT_TYPE,
        OBJECT_TRANSLATION_TYPE,
        PERMISSIONSET_TYPE,
        WORKFLOW_TYPE,
        SHARING_RULE_TYPE,
        ...SUB_OBJECT_TYPES,
    ]);
}
__decorate([
    log
], MetadataRepositoryImpl.prototype, "getFullyQualifiedName", null);
//# sourceMappingURL=MetadataRepositoryImpl.js.map