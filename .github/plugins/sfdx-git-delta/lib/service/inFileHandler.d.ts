import { MetadataRepository } from '../metadata/MetadataRepository.js';
import { Metadata } from '../types/metadata.js';
import type { Manifest, Work } from '../types/work.js';
import MetadataDiff from '../utils/metadataDiff.js';
import StandardHandler from './standardHandler.js';
export default class InFileHandler extends StandardHandler {
    protected readonly metadataDiff: MetadataDiff;
    constructor(line: string, metadataDef: Metadata, work: Work, metadata: MetadataRepository);
    handleAddition(): Promise<void>;
    handleDeletion(): Promise<void>;
    handleModification(): Promise<void>;
    protected _compareRevisionAndStoreComparison(): Promise<void>;
    protected _storeComparison(store: Manifest, content: Manifest): void;
    protected _fillPackageForInfileMetadata(store: Manifest, subType: string, member: string): void;
    protected _getQualifiedName(): string;
    protected _delegateFileCopy(): boolean;
    protected _shouldTreatDeletionAsDeletion(): boolean | undefined;
    protected _shouldTreatContainerType(fileIsEmpty: boolean): boolean;
}
