import { MetadataRepository } from '../metadata/MetadataRepository.js';
import type { Work } from '../types/work.js';
import Standard from './standardHandler.js';
export default class TypeHandlerFactory {
    protected readonly work: Work;
    protected readonly metadata: MetadataRepository;
    constructor(work: Work, metadata: MetadataRepository);
    getTypeHandler(line: string): Standard;
}
