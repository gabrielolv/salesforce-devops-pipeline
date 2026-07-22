import type { Config } from '../types/config.js';
import type { SharedFileMetadata } from '../types/metadata.js';
import type { Manifest } from '../types/work.js';
interface DiffResult {
    added: Manifest;
    deleted: Manifest;
}
interface PrunedContent {
    xmlContent: string;
    isEmpty: boolean;
}
export default class MetadataDiff {
    private config;
    private toContent;
    private fromContent;
    private extractor;
    constructor(config: Config, attributes: Map<string, SharedFileMetadata>);
    compare(path: string): Promise<DiffResult>;
    prune(): PrunedContent;
}
export {};
