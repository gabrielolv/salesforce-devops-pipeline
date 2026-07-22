import GitAdapter from '../adapter/GitAdapter.js';
import { MetadataRepository } from '../metadata/MetadataRepository.js';
import type { Config } from '../types/config.js';
export default class RepoGitDiff {
    protected readonly config: Config;
    protected readonly metadata: MetadataRepository;
    protected readonly gitAdapter: GitAdapter;
    constructor(config: Config, metadata: MetadataRepository);
    getLines(): Promise<string[]>;
    protected _treatResult(lines: string[]): Promise<string[]>;
    protected _getRenamedElements(lines: string[]): string[];
    protected _spreadLinePerDiffType(lines: string[]): Map<any, any>;
    protected _filterInternal(line: string, deletedRenamed: string[]): boolean;
    protected _extractComparisonName(line: string): string;
}
