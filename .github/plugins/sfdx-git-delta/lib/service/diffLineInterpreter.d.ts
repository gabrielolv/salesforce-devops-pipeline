import { MetadataRepository } from '../metadata/MetadataRepository.js';
import type { Work } from '../types/work.js';
export default class DiffLineInterpreter {
    protected readonly work: Work;
    protected readonly metadata: MetadataRepository;
    constructor(work: Work, metadata: MetadataRepository);
    process(lines: string[]): Promise<void>;
    protected getConcurrencyThreshold(): number;
}
