'use strict';
export default class BaseProcessor {
    work;
    metadata;
    config;
    constructor(work, metadata) {
        this.work = work;
        this.metadata = metadata;
        this.config = work.config;
    }
    async process() {
        throw new Error('this class should be derived');
    }
}
//# sourceMappingURL=baseProcessor.js.map