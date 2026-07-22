'use strict';
import { __decorate } from "tslib";
import { join, parse } from 'node:path/posix';
import { DOT, PATH_SEP } from '../constant/fsConstants.js';
import { ADDITION, DELETION, GIT_DIFF_TYPE_REGEX, MODIFICATION, } from '../constant/gitConstants.js';
import { META_REGEX, METAFILE_SUFFIX } from '../constant/metadataConstants.js';
import { copyFiles } from '../utils/fsHelper.js';
import { log } from '../utils/LoggingDecorator.js';
import { Logger, lazy } from '../utils/LoggingService.js';
import { fillPackageWithParameter } from '../utils/packageHelper.js';
const RegExpEscape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export default class StandardHandler {
    line;
    metadataDef;
    work;
    metadata;
    changeType;
    diffs;
    config;
    warnings;
    splittedLine;
    suffixRegex;
    ext;
    parsedLine;
    parentFolder;
    constructor(line, metadataDef, work, metadata) {
        this.line = line;
        this.metadataDef = metadataDef;
        this.work = work;
        this.metadata = metadata;
        this.changeType = line.charAt(0);
        this.line = line.replace(GIT_DIFF_TYPE_REGEX, '');
        this.diffs = work.diffs;
        this.config = work.config;
        this.warnings = work.warnings;
        this.splittedLine = this.line.split(PATH_SEP);
        if (this.metadataDef.metaFile === true) {
            this.line = this.line.replace(METAFILE_SUFFIX, '');
        }
        this.suffixRegex = new RegExp(`\\.${this.metadataDef.suffix}$`);
        this.parsedLine = parse(this.line);
        this.ext = this.parsedLine.base
            .replace(METAFILE_SUFFIX, '')
            .split(DOT)
            .pop();
        this.parentFolder = this.parsedLine.dir.split(PATH_SEP).slice(-1)[0];
    }
    async handle() {
        if (this._isProcessable()) {
            try {
                switch (this.changeType) {
                    case ADDITION:
                        await this.handleAddition();
                        break;
                    case DELETION:
                        await this.handleDeletion();
                        break;
                    case MODIFICATION:
                        await this.handleModification();
                        break;
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    error.message = `${this.line}: ${error.message}`;
                    this.warnings.push(error);
                }
            }
        }
    }
    async handleAddition() {
        Logger.info(lazy `${this.metadataDef.xmlName}.${() => this._getElementName()} created`);
        this._fillPackage(this.diffs.package);
        if (!this.config.generateDelta)
            return;
        await this._copyWithMetaFile(this.line);
    }
    async handleDeletion() {
        Logger.info(lazy `${this.metadataDef.xmlName}.${() => this._getElementName()} deleted`);
        this._fillPackage(this.diffs.destructiveChanges);
    }
    async handleModification() {
        Logger.info(lazy `${this.metadataDef.xmlName}.${() => this._getElementName()} modified`);
        await this.handleAddition();
    }
    _getParsedPath() {
        return parse(this.splittedLine
            .slice(this.splittedLine.findIndex(x => x.includes(METAFILE_SUFFIX)) - 1)
            .join(PATH_SEP)
            .replace(META_REGEX, ''));
    }
    _getElementName() {
        const parsedPath = this._getParsedPath();
        return parsedPath.name;
    }
    _fillPackage(store) {
        fillPackageWithParameter({
            store,
            type: this.metadataDef.xmlName,
            member: this._getElementName(),
        });
    }
    async _copyWithMetaFile(src) {
        if (this._delegateFileCopy()) {
            await this._copy(src);
            if (this._shouldCopyMetaFile(src)) {
                await this._copy(this._getMetaTypeFilePath(src));
            }
        }
    }
    async _copy(elementPath) {
        if (this._delegateFileCopy()) {
            await copyFiles(this.config, elementPath);
        }
    }
    _getMetaTypeFilePath(path) {
        const parsedPath = parse(path);
        return join(parsedPath.dir, `${parsedPath.name}.${this.metadataDef.suffix}${METAFILE_SUFFIX}`);
    }
    _shouldCopyMetaFile(path) {
        return (this.metadataDef.metaFile === true && !`${path}`.endsWith(METAFILE_SUFFIX));
    }
    _parseLine() {
        return this.line.match(new RegExp(`(?<path>.*[/\\\\]?${RegExpEscape(this.metadataDef.directoryName)})[/\\\\](?<name>[^/\\\\]*)+`, 'u'));
    }
    _isProcessable() {
        return this.metadataDef.suffix === this.ext;
    }
    _delegateFileCopy() {
        return true;
    }
    _parentFolderIsNotTheType() {
        return this.parentFolder !== this.metadataDef.directoryName;
    }
    toString() {
        return `${this.constructor.name}: ${this.changeType} -> ${this.line}`;
    }
}
__decorate([
    log
], StandardHandler.prototype, "handle", null);
__decorate([
    log
], StandardHandler.prototype, "handleAddition", null);
__decorate([
    log
], StandardHandler.prototype, "handleDeletion", null);
__decorate([
    log
], StandardHandler.prototype, "handleModification", null);
//# sourceMappingURL=standardHandler.js.map