import { MetadataRepository } from '../metadata/MetadataRepository.js';
import { Metadata } from '../types/metadata.js';
import type { Manifest, Work } from '../types/work.js';
import InFolderHandler from './inFolderHandler.js';
export default class ReportingFolderHandler extends InFolderHandler {
    protected readonly sharedFolderMetadata: Map<string, string>;
    constructor(line: string, metadataDef: Metadata, work: Work, metadata: MetadataRepository);
    protected _copyFolderMetaFile(): Promise<void>;
    protected _fillPackage(store: Manifest): void;
}
