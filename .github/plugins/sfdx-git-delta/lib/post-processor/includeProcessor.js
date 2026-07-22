'use strict';
import { __decorate } from "tslib";
import GitAdapter from '../adapter/GitAdapter.js';
import { TAB } from '../constant/cliConstants.js';
import { ADDITION, DELETION } from '../constant/gitConstants.js';
import DiffLineInterpreter from '../service/diffLineInterpreter.js';
import { buildIncludeHelper } from '../utils/ignoreHelper.js';
import { log } from '../utils/LoggingDecorator.js';
import BaseProcessor from './baseProcessor.js';
export default class IncludeProcessor extends BaseProcessor {
    gitAdapter;
    constructor(work, metadata) {
        super(work, metadata);
        this.gitAdapter = GitAdapter.getInstance(this.config);
    }
    _shouldProcess() {
        return !!this.config.include || !!this.config.includeDestructive;
    }
    async process() {
        if (!this._shouldProcess()) {
            return;
        }
        const includeHelper = await buildIncludeHelper(this.config);
        const includeLines = new Map();
        const gitChanges = [ADDITION, DELETION];
        const lines = await this.gitAdapter.getFilesPath(this.config.source);
        for (const line of lines) {
            gitChanges.forEach((changeType) => {
                const changedLine = `${changeType}${TAB}${line}`;
                if (!includeHelper.keep(changedLine)) {
                    if (!includeLines.has(changeType)) {
                        includeLines.set(changeType, []);
                    }
                    includeLines.get(changeType)?.push(changedLine);
                }
            });
        }
        await this._processIncludes(includeLines);
    }
    async _processIncludes(includeLines) {
        if (includeLines.size === 0) {
            return;
        }
        const fromBackup = this.work.config.from;
        const firsSHA = await this.gitAdapter.getFirstCommitRef();
        // Compare with the whole history of the repository
        // so it can get full file content for inFile metadata
        // while reusing current way to do it on a minimal scope
        if (includeLines.has(ADDITION)) {
            this.work.config.from = firsSHA;
            await this._processLines(includeLines.get(ADDITION));
        }
        if (includeLines.has(DELETION)) {
            // Need to invert the SHA pointer for DELETION
            // so all the addition are interpreted has deletion by MetadataDiff
            // for the lines of InFile metadata type
            this.work.config.from = this.work.config.to;
            this.work.config.to = firsSHA;
            await this._processLines(includeLines.get(DELETION));
            this.work.config.to = this.work.config.from;
        }
        this.work.config.from = fromBackup;
    }
    async _processLines(lines) {
        const lineProcessor = new DiffLineInterpreter(this.work, this.metadata);
        await lineProcessor.process(lines);
    }
}
__decorate([
    log
], IncludeProcessor.prototype, "process", null);
//# sourceMappingURL=includeProcessor.js.map