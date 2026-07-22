import { ParsedPath } from 'node:path/posix';
import { MetadataRepository } from '../metadata/MetadataRepository.js';
import { Metadata } from '../types/metadata.js';
import { Work } from '../types/work.js';
import StandardHandler from './standardHandler.js';
export default class ContainedDecomposedHandler extends StandardHandler {
    protected holderFolder: ParsedPath | undefined;
    constructor(line: string, metadataDef: Metadata, work: Work, metadata: MetadataRepository);
    handleAddition(): Promise<void>;
    handleDeletion(): Promise<void>;
    protected _setholderFolder(): void;
    protected _isDecomposedFormat(): boolean;
    protected _hasRelatedContent(): Promise<boolean>;
    protected _copyDecomposedFiles(): Promise<void>;
    protected _getElementName(): string;
    protected _isProcessable(): boolean;
}
