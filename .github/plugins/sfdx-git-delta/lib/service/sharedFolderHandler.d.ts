import { MetadataRepository } from '../metadata/MetadataRepository.js';
import { Metadata } from '../types/metadata.js';
import type { Manifest, Work } from '../types/work.js';
import StandardHandler from './standardHandler.js';
export default class SharedFolderHandler extends StandardHandler {
    protected readonly sharedFolderMetadata: Map<string, string>;
    constructor(line: string, metadataDef: Metadata, work: Work, metadata: MetadataRepository);
    protected _fillPackage(store: Manifest): void;
    protected _isProcessable(): boolean;
    protected _getMetaTypeFilePath(path: string): string;
}
