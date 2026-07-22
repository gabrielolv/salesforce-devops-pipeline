import { MetadataRepository } from '../metadata/MetadataRepository.js';
import type { Work } from '../types/work.js';
import BaseProcessor from './baseProcessor.js';
export default class PostProcessorManager {
    protected readonly work: Work;
    protected readonly postProcessors: BaseProcessor[];
    constructor(work: Work);
    use(postProcessor: BaseProcessor): this;
    execute(): Promise<void>;
}
export declare const getPostProcessors: (work: Work, metadata: MetadataRepository) => PostProcessorManager;
