'use strict';
import FlowTranslationProcessor from './flowTranslationProcessor.js';
import IncludeProcessor from './includeProcessor.js';
import PackageGenerator from './packageGenerator.js';
const processors = [
    FlowTranslationProcessor,
    IncludeProcessor,
];
// It must be done last
processors.push(PackageGenerator);
export default class PostProcessorManager {
    work;
    postProcessors;
    constructor(work) {
        this.work = work;
        this.postProcessors = [];
    }
    use(postProcessor) {
        this.postProcessors.push(postProcessor);
        return this;
    }
    async execute() {
        for (const postProcessor of this.postProcessors) {
            try {
                await postProcessor.process();
            }
            catch (error) {
                if (error instanceof Error) {
                    this.work.warnings.push(error);
                }
            }
        }
    }
}
export const getPostProcessors = (work, metadata) => {
    const postProcessor = new PostProcessorManager(work);
    for (const processor of processors) {
        const instance = new processor(work, metadata);
        postProcessor.use(instance);
    }
    return postProcessor;
};
//# sourceMappingURL=postProcessorManager.js.map