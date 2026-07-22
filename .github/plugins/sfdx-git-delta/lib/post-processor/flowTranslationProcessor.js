'use strict';
import { __decorate } from "tslib";
import { join, parse } from 'node:path/posix';
import { castArray } from 'lodash-es';
import { FLOW_XML_NAME, META_REGEX, TRANSLATION_EXTENSION, TRANSLATION_TYPE, } from '../constant/metadataConstants.js';
import { readDirs, writeFile } from '../utils/fsHelper.js';
import { isSamePath, isSubDir, pathExists, readFile } from '../utils/fsUtils.js';
import { convertJsonToXml, parseXmlFileToJson, xml2Json, } from '../utils/fxpHelper.js';
import { buildIgnoreHelper } from '../utils/ignoreHelper.js';
import { log } from '../utils/LoggingDecorator.js';
import { fillPackageWithParameter } from '../utils/packageHelper.js';
import BaseProcessor from './baseProcessor.js';
const EXTENSION = `.${TRANSLATION_EXTENSION}`;
const getTranslationName = (translationPath) => parse(translationPath.replace(META_REGEX, '')).name;
const getDefaultTranslation = () => ({
    '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
    Translations: {
        '@_xmlns': 'http://soap.sforce.com/2006/04/metadata',
        flowDefinitions: [],
    },
});
export default class FlowTranslationProcessor extends BaseProcessor {
    // biome-ignore lint/suspicious/noExplicitAny: Any is expected here
    translations;
    ignoreHelper;
    isOutputEqualsToRepo;
    constructor(work, metadata) {
        super(work, metadata);
        this.translations = new Map();
    }
    async process() {
        if (this._shouldProcess()) {
            await this._buildFlowDefinitionsMap();
            await this._handleFlowTranslation();
        }
    }
    async _buildFlowDefinitionsMap() {
        this.translations.clear();
        const allFiles = await readDirs(this.config.source, this.work.config);
        const translationPaths = allFiles.filter((file) => file.replace(META_REGEX, '').endsWith(EXTENSION));
        for (const translationPath of translationPaths) {
            if (await this._canParse(translationPath)) {
                await this._parseTranslationFile(translationPath);
            }
        }
    }
    async _canParse(translationPath) {
        if (!this.ignoreHelper) {
            this.ignoreHelper = await buildIgnoreHelper(this.config);
            this.isOutputEqualsToRepo = isSamePath(this.config.output, this.config.repo);
        }
        return (!this.ignoreHelper.globalIgnore.ignores(translationPath) &&
            (this.isOutputEqualsToRepo ||
                !isSubDir(this.config.output, translationPath)));
    }
    async _handleFlowTranslation() {
        for (const translationPath of this.translations.keys()) {
            fillPackageWithParameter({
                store: this.work.diffs.package,
                type: TRANSLATION_TYPE,
                member: getTranslationName(translationPath),
            });
            if (this.config.generateDelta) {
                const jsonTranslation = await this._getTranslationAsJSON(translationPath);
                this._scrapTranslationFile(jsonTranslation, this.translations.get(translationPath));
                const scrappedTranslation = convertJsonToXml(jsonTranslation);
                await writeFile(translationPath, scrappedTranslation, this.config);
            }
        }
    }
    _scrapTranslationFile(
    // biome-ignore lint/suspicious/noExplicitAny: Any is expected here
    jsonTranslation, 
    // biome-ignore lint/suspicious/noExplicitAny: Any is expected here
    actualFlowDefinition) {
        const flowDefinitions = castArray(jsonTranslation.Translations?.flowDefinitions);
        const fullNames = new Set(
        // biome-ignore lint/suspicious/noExplicitAny: Any is expected here
        flowDefinitions.map((flowDef) => flowDef?.fullName));
        const strippedActualFlowDefinition = actualFlowDefinition.filter(
        // biome-ignore lint/suspicious/noExplicitAny: Any is expected here
        (flowDef) => !fullNames.has(flowDef?.fullName));
        jsonTranslation.Translations.flowDefinitions = flowDefinitions.concat(strippedActualFlowDefinition);
    }
    async _parseTranslationFile(translationPath) {
        const translationJSON = await parseXmlFileToJson({ path: translationPath, oid: this.config.to }, this.config);
        const flowDefinitions = castArray(translationJSON?.Translations?.flowDefinitions);
        flowDefinitions.forEach(flowDefinition => this._addFlowPerTranslation({
            translationPath,
            flowDefinition,
        }));
    }
    _addFlowPerTranslation({ translationPath, flowDefinition, }) {
        const packagedElements = this.work.diffs.package.get(FLOW_XML_NAME);
        if (packagedElements?.has(flowDefinition?.fullName)) {
            if (!this.translations.has(translationPath)) {
                this.translations.set(translationPath, []);
            }
            this.translations.get(translationPath).push(flowDefinition);
        }
    }
    async _getTranslationAsJSON(translationPath) {
        const translationPathInOutputFolder = join(this.config.output, translationPath);
        const translationExist = await pathExists(translationPathInOutputFolder);
        let jsonTranslation = getDefaultTranslation();
        if (translationExist) {
            const xmlTranslation = await readFile(translationPathInOutputFolder);
            jsonTranslation = xml2Json(xmlTranslation);
        }
        return jsonTranslation;
    }
    _shouldProcess() {
        return this.work.diffs.package.has(FLOW_XML_NAME);
    }
}
__decorate([
    log
], FlowTranslationProcessor.prototype, "process", null);
//# sourceMappingURL=flowTranslationProcessor.js.map