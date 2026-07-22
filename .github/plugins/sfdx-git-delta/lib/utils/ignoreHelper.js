import { __decorate } from "tslib";
import ignore from 'ignore';
import { ADDITION, DELETION, GIT_DIFF_TYPE_REGEX, MODIFICATION, } from '../constant/gitConstants.js';
import { readFile } from './fsUtils.js';
import { log } from './LoggingDecorator.js';
// QUESTION: Why we should ignore recordTypes for destructive changes manifest ?
// Because the operation is note enabled on the metadata API https://ideas.salesforce.com/s/idea/a0B8W00000GdeGKUAZ/allow-deletion-of-record-type-using-metadata-api
const BASE_DESTRUCTIVE_IGNORE = ['recordTypes/'];
export class IgnoreHelper {
    globalIgnore;
    destructiveIgnore;
    constructor(globalIgnore, destructiveIgnore) {
        this.globalIgnore = globalIgnore;
        this.destructiveIgnore = destructiveIgnore;
    }
    keep(line) {
        const changeType = line.charAt(0);
        let ignInstance;
        if (DELETION === changeType) {
            ignInstance = this.destructiveIgnore;
        }
        else if ([ADDITION, MODIFICATION].includes(changeType)) {
            ignInstance = this.globalIgnore;
        }
        const filePath = line.replace(GIT_DIFF_TYPE_REGEX, '');
        return !ignInstance?.ignores(filePath);
    }
}
__decorate([
    log
], IgnoreHelper.prototype, "keep", null);
let ignoreInstance;
export const buildIgnoreHelper = async ({ ignore, ignoreDestructive, }) => {
    if (!ignoreInstance) {
        const globalIgnore = await _buildIgnore(ignore);
        const destructiveIgnore = await _buildIgnore(ignoreDestructive || ignore);
        destructiveIgnore.add(BASE_DESTRUCTIVE_IGNORE);
        ignoreInstance = new IgnoreHelper(globalIgnore, destructiveIgnore);
    }
    return ignoreInstance;
};
let includeInstance;
export const buildIncludeHelper = async ({ include, includeDestructive, }) => {
    if (!includeInstance) {
        const globalIgnore = await _buildIgnore(include);
        const destructiveIgnore = await _buildIgnore(includeDestructive);
        includeInstance = new IgnoreHelper(globalIgnore, destructiveIgnore);
    }
    return includeInstance;
};
const _buildIgnore = async (ignorePath) => {
    const ign = ignore();
    if (ignorePath) {
        const content = await readFile(ignorePath);
        ign.add(content.toString());
    }
    return ign;
};
export const resetIgnoreInstance = () => {
    ignoreInstance = null;
};
export const resetIncludeInstance = () => {
    includeInstance = null;
};
//# sourceMappingURL=ignoreHelper.js.map