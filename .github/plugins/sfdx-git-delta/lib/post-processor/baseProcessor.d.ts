import { MetadataRepository } from '../metadata/MetadataRepository.js';
import type { Config } from '../types/config.js';
import type { Work } from '../types/work.js';
export default class BaseProcessor {
    protected readonly work: Work;
    protected readonly metadata: MetadataRepository;
    protected readonly config: Config;
    constructor(work: Work, metadata: MetadataRepository);
    process(): Promise<void>;
}
