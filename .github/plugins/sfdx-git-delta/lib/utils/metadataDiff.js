'use strict';
import { __decorate } from "tslib";
import { deepEqual } from 'fast-equals';
import { isUndefined } from 'lodash-es';
import { ATTRIBUTE_PREFIX, convertJsonToXml, parseXmlFileToJson, XML_HEADER_ATTRIBUTE_KEY, } from './fxpHelper.js';
import { log } from './LoggingDecorator.js';
import { fillPackageWithParameter } from './packageHelper.js';
const ARRAY_SPECIAL_KEY = '<array>';
const OBJECT_SPECIAL_KEY = '<object>';
const isEmpty = (arr) => arr.length === 0;
export default class MetadataDiff {
    config;
    toContent;
    fromContent;
    extractor;
    constructor(config, attributes) {
        this.config = config;
        this.extractor = new MetadataExtractor(attributes);
    }
    async compare(path) {
        this.toContent = await parseXmlFileToJson({ path, oid: this.config.to }, this.config);
        this.fromContent = await parseXmlFileToJson({ path, oid: this.config.from }, this.config);
        const comparator = new MetadataComparator(this.extractor, this.fromContent, this.toContent);
        const added = comparator.getChanges();
        const deleted = comparator.getDeletion();
        return { added, deleted };
    }
    prune() {
        const transformer = new JsonTransformer(this.extractor);
        const { prunedContent, isEmpty } = transformer.generatePartialJson(this.fromContent, this.toContent);
        return {
            xmlContent: convertJsonToXml(prunedContent),
            isEmpty,
        };
    }
}
__decorate([
    log
], MetadataDiff.prototype, "compare", null);
__decorate([
    log
], MetadataDiff.prototype, "prune", null);
class MetadataExtractor {
    attributes;
    keySelectorCache = new Map();
    constructor(attributes) {
        this.attributes = attributes;
    }
    getSubTypes(root) {
        return Object.keys(root).filter(tag => this.attributes.has(tag));
    }
    getSubKeys(root) {
        return Object.keys(root);
    }
    isTypePackageable(subType) {
        return !this.attributes.get(subType)?.excluded;
    }
    getXmlName(subType) {
        return this.attributes.get(subType)?.xmlName;
    }
    getKeyValueSelector(subType) {
        if (!this.keySelectorCache.has(subType)) {
            const metadataKey = this.getKeyFieldDefinition(subType);
            this.keySelectorCache.set(subType, elem => elem[metadataKey]);
        }
        return this.keySelectorCache.get(subType);
    }
    getKeyFieldDefinition(subType) {
        return this.attributes.get(subType)?.key;
    }
    extractForSubType(root, subType) {
        const content = root[subType];
        // Only cast to array if it's not already an array
        return Array.isArray(content) ? content : content ? [content] : [];
    }
    extractRootElement(fileContent) {
        const rootKey = this.extractRootKey(fileContent);
        return fileContent[rootKey] ?? {};
    }
    extractRootKey(fileContent) {
        return (Object.keys(fileContent).find(key => key !== XML_HEADER_ATTRIBUTE_KEY) ??
            '');
    }
}
class MetadataComparator {
    extractor;
    fromContent;
    toContent;
    constructor(extractor, fromContent, toContent) {
        this.extractor = extractor;
        this.fromContent = fromContent;
        this.toContent = toContent;
    }
    getChanges() {
        return this.compare(this.toContent, this.fromContent, this.compareAdded);
    }
    getDeletion() {
        return this.compare(this.fromContent, this.toContent, this.compareDeleted);
    }
    compare(baseContent, targetContent, elementMatcher) {
        const base = this.extractor.extractRootElement(baseContent);
        const target = this.extractor.extractRootElement(targetContent);
        const manifest = new Map();
        // Get all subtypes once
        const subTypes = this.extractor.getSubTypes(base);
        for (const subType of subTypes) {
            if (!this.extractor.isTypePackageable(subType))
                continue;
            const baseMeta = this.extractor.extractForSubType(base, subType);
            if (isEmpty(baseMeta))
                continue;
            const targetMeta = this.extractor.extractForSubType(target, subType);
            const keySelector = this.extractor.getKeyValueSelector(subType);
            const xmlName = this.extractor.getXmlName(subType);
            for (const elem of baseMeta) {
                if (elementMatcher(targetMeta, keySelector, elem)) {
                    fillPackageWithParameter({
                        store: manifest,
                        type: xmlName,
                        member: keySelector(elem),
                    });
                }
            }
        }
        return manifest;
    }
    compareAdded = (meta, keySelector, elem) => {
        const elemKey = keySelector(elem);
        const match = meta.find(el => keySelector(el) === elemKey);
        return !match || !deepEqual(match, elem);
    };
    compareDeleted = (meta, keySelector, elem) => {
        const elemKey = keySelector(elem);
        return !meta.some(el => keySelector(el) === elemKey);
    };
}
class JsonTransformer {
    extractor;
    isEmpty = true;
    constructor(extractor) {
        this.extractor = extractor;
    }
    generatePartialJson(fromContent, toContent) {
        const from = this.extractor.extractRootElement(fromContent);
        const to = this.extractor.extractRootElement(toContent);
        const base = {};
        if (XML_HEADER_ATTRIBUTE_KEY in toContent) {
            base[XML_HEADER_ATTRIBUTE_KEY] = toContent[XML_HEADER_ATTRIBUTE_KEY];
        }
        const rootKey = this.extractor.extractRootKey(toContent);
        base[rootKey] = {};
        const root = base[rootKey];
        const subKeys = this.extractor.getSubKeys(to);
        for (const key of subKeys) {
            if (key.startsWith(ATTRIBUTE_PREFIX)) {
                root[key] = to[key];
                continue;
            }
            const fromMeta = this.extractor.extractForSubType(from, key);
            const toMeta = this.extractor.extractForSubType(to, key);
            const keyField = this.extractor.getKeyFieldDefinition(key);
            const partialContent = this.getPartialContent(fromMeta, toMeta, keyField);
            if (!isEmpty(partialContent)) {
                root[key] = partialContent;
            }
        }
        return { prunedContent: base, isEmpty: this.isEmpty };
    }
    getPartialContent(fromMeta, toMeta, keyField) {
        // Early return for empty arrays
        if (isEmpty(toMeta)) {
            return [];
        }
        if (isEmpty(fromMeta)) {
            this.isEmpty = false;
            return toMeta;
        }
        let result;
        if (isUndefined(keyField)) {
            result = this.getPartialContentWithoutKey(fromMeta, toMeta);
        }
        else if (keyField === ARRAY_SPECIAL_KEY) {
            result = this.getPartialContentForArray(fromMeta, toMeta);
        }
        else if (keyField === OBJECT_SPECIAL_KEY) {
            result = this.getPartialContentForObject(fromMeta, toMeta);
        }
        else {
            result = this.getPartialContentWithKey(fromMeta, toMeta, keyField);
        }
        return result;
    }
    getPartialContentWithoutKey(fromMeta, toMeta) {
        if (!deepEqual(fromMeta, toMeta)) {
            this.isEmpty = false;
        }
        return toMeta;
    }
    getPartialContentForArray(fromMeta, toMeta) {
        const diff = deepEqual(fromMeta, toMeta) ? [] : toMeta;
        this.checkEmpty(diff);
        return diff;
    }
    getPartialContentForObject(fromMeta, toMeta) {
        const keySelector = (item) => JSON.stringify(item);
        const fromSet = new Set(fromMeta.map(keySelector));
        const diff = toMeta.filter(item => !fromSet.has(keySelector(item)));
        this.checkEmpty(diff);
        return diff;
    }
    getPartialContentWithKey(fromMeta, toMeta, keyField) {
        const keySelector = (item) => item[keyField];
        const fromMap = new Map(fromMeta.map(item => [keySelector(item), item]));
        const diff = toMeta.filter(item => {
            const key = keySelector(item);
            const fromItem = fromMap.get(key);
            return isUndefined(fromItem) || !deepEqual(item, fromItem);
        });
        this.checkEmpty(diff);
        return diff;
    }
    checkEmpty(diff) {
        if (this.isEmpty) {
            this.isEmpty = isEmpty(diff);
        }
    }
}
//# sourceMappingURL=metadataDiff.js.map