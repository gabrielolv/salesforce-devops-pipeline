import GitAdapter from '../adapter/GitAdapter.js';
import { ADDITION, DELETION } from '../constant/gitConstants.js';
import { MetadataRepository } from '../metadata/MetadataRepository.js';
import type { Work } from '../types/work.js';
import BaseProcessor from './baseProcessor.js';
type GitChange = typeof ADDITION | typeof DELETION;
export default class IncludeProcessor extends BaseProcessor {
    protected readonly gitAdapter: GitAdapter;
    constructor(work: Work, metadata: MetadataRepository);
    protected _shouldProcess(): boolean;
    process(): Promise<void>;
    protected _processIncludes(includeLines: Map<GitChange, string[]>): Promise<void>;
    protected _processLines(lines: string[]): Promise<void>;
}
export {};
