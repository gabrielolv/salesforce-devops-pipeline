'use strict';
import GitAdapter from '../adapter/GitAdapter.js';
import { ADDITION, DELETION } from '../constant/gitConstants.js';
import { buildIgnoreHelper } from './ignoreHelper.js';
export default class RepoGitDiff {
    config;
    metadata;
    gitAdapter;
    constructor(config, metadata) {
        this.config = config;
        this.metadata = metadata;
        this.gitAdapter = GitAdapter.getInstance(this.config);
    }
    async getLines() {
        const lines = await this.gitAdapter.getDiffLines();
        const treatedLines = await this._treatResult(lines);
        return treatedLines;
    }
    async _treatResult(lines) {
        const renamedElements = this._getRenamedElements(lines);
        const ignoreHelper = await buildIgnoreHelper(this.config);
        return lines
            .filter(Boolean)
            .filter((line) => this._filterInternal(line, renamedElements))
            .filter((line) => ignoreHelper.keep(line));
    }
    _getRenamedElements(lines) {
        const linesPerDiffType = this._spreadLinePerDiffType(lines);
        const AfileNames = new Set(linesPerDiffType
            .get(ADDITION)
            ?.map(line => this._extractComparisonName(line)) ?? []);
        const deletedRenamed = [
            ...(linesPerDiffType.get(DELETION) ?? []),
        ].filter((line) => {
            const dEl = this._extractComparisonName(line);
            return AfileNames.has(dEl);
        });
        return deletedRenamed;
    }
    _spreadLinePerDiffType(lines) {
        return lines.reduce((acc, line) => {
            const idx = line.charAt(0);
            if (!acc.has(idx)) {
                acc.set(idx, []);
            }
            acc.get(idx).push(line);
            return acc;
        }, new Map());
    }
    _filterInternal(line, deletedRenamed) {
        return !deletedRenamed.includes(line) && this.metadata.has(line);
    }
    _extractComparisonName(line) {
        return this.metadata.getFullyQualifiedName(line).toLocaleLowerCase();
    }
}
//# sourceMappingURL=repoGitDiff.js.map