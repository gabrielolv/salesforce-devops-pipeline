import type { Metadata } from '../types/metadata.js';
import { MetadataRepository } from './MetadataRepository.js';
export declare class MetadataRepositoryImpl implements MetadataRepository {
    protected readonly metadatas: Metadata[];
    protected readonly metadataPerExt: Map<string, Metadata>;
    protected readonly metadataPerDir: Map<string, Metadata>;
    protected readonly metadataPerXmlName: Map<string, Metadata>;
    constructor(metadatas: Metadata[]);
    protected addSuffix(metadata: Metadata): void;
    protected addSharedFolderSuffix(metadata: Metadata): void;
    protected addFolder(metadata: Metadata): void;
    protected addXmlName(metadata: Metadata): void;
    has(path: string): boolean;
    get(path: string): Metadata | undefined;
    protected searchByExtension(parts: string[]): Metadata | undefined;
    protected searchByDirectory(parts: string[]): Metadata | undefined;
    protected searchByXmlName(xmlName: string): Metadata | undefined;
    getFullyQualifiedName(path: string): string;
    values(): Metadata[];
    private static TYPES_WITH_SUB_TYPES;
    private static UNSAFE_EXTENSION;
    private static COMPOSED_TYPES;
}
