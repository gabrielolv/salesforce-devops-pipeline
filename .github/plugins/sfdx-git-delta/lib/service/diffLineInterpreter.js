'use strict';
import { __decorate } from "tslib";
import { availableParallelism } from 'node:os';
import { queue } from 'async';
import { log } from '../utils/LoggingDecorator.js';
import TypeHandlerFactory from './typeHandlerFactory.js';
export default class DiffLineInterpreter {
    work;
    metadata;
    constructor(work, metadata) {
        this.work = work;
        this.metadata = metadata;
    }
    async process(lines) {
        const typeHandlerFactory = new TypeHandlerFactory(this.work, this.metadata);
        const MAX_PARALLELISM = this.getConcurrencyThreshold();
        const processor = queue(async (handler) => await handler.handle(), MAX_PARALLELISM);
        for (const line of lines) {
            const handler = typeHandlerFactory.getTypeHandler(line);
            processor.push(handler);
        }
        if (processor.length() > 0) {
            await processor.drain();
        }
    }
    getConcurrencyThreshold() {
        // This is because of this issue: https://github.com/scolladon/sfdx-git-delta/issues/762#issuecomment-1907609957
        const AVAILABLE_PARALLELISM = availableParallelism
            ? availableParallelism()
            : Infinity;
        return Math.min(AVAILABLE_PARALLELISM, 6);
    }
}
__decorate([
    log
], DiffLineInterpreter.prototype, "process", null);
//# sourceMappingURL=diffLineInterpreter.js.map