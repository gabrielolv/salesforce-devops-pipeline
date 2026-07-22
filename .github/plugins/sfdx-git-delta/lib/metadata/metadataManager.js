'use strict';
import { MetadataRepositoryImpl } from './MetadataRepositoryImpl.js';
const inFileMetadata = new Map();
const sharedFolderMetadata = new Map();
const earliestVersion = 46;
const latestVersion = 66;
export const getLatestSupportedVersion = () => {
    return latestVersion - 1;
};
export const isVersionSupported = (version) => {
    return (Number.isInteger(version) &&
        version >= earliestVersion &&
        version <= latestVersion);
};
export const getDefinition = async (apiVersion) => {
    const version = isVersionSupported(apiVersion)
        ? apiVersion
        : getLatestSupportedVersion();
    const { default: metadataVersion } = await import(`./v${version}.js`);
    const metadataRepository = new MetadataRepositoryImpl(metadataVersion);
    return metadataRepository;
};
export const isPackable = (type) => Array.from(inFileMetadata.values()).find((inFileDef) => inFileDef.xmlName === type)?.excluded !== true;
export const getInFileAttributes = (metadata) => inFileMetadata.size
    ? inFileMetadata
    : metadata
        .values()
        .filter((meta) => meta.xmlTag)
        .reduce((acc, meta) => acc.set(meta.xmlTag, {
        xmlName: meta.xmlName,
        key: meta.key,
        excluded: !!meta.excluded,
    }), inFileMetadata);
export const getSharedFolderMetadata = (metadata) => sharedFolderMetadata.size
    ? sharedFolderMetadata
    : metadata
        .values()
        .filter((meta) => meta.content)
        .flatMap((elem) => elem.content)
        .reduce((acc, val) => acc.set(val.suffix, val.xmlName), sharedFolderMetadata);
//# sourceMappingURL=metadataManager.js.map