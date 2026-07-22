import type { SharedFileMetadata } from '../types/metadata.js';
import { MetadataRepository } from './MetadataRepository.js';
export declare const getLatestSupportedVersion: () => number;
export declare const isVersionSupported: (version: number | undefined) => boolean;
export declare const getDefinition: (apiVersion: number | undefined) => Promise<MetadataRepository>;
export declare const isPackable: (type: string) => boolean;
export declare const getInFileAttributes: (metadata: MetadataRepository) => Map<string, SharedFileMetadata>;
export declare const getSharedFolderMetadata: (metadata: MetadataRepository) => Map<string, string>;
