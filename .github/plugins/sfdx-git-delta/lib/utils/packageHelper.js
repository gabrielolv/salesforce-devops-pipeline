'use strict';
import { __decorate } from "tslib";
import { create } from 'xmlbuilder2';
import { OBJECT_TYPE } from '../constant/metadataConstants.js';
import { log } from './LoggingDecorator.js';
const xmlConf = { indent: '    ', newline: '\n', prettyPrint: true };
const frLocale = 'fr';
export default class PackageBuilder {
    config;
    constructor(config) {
        this.config = config;
    }
    buildPackage(strucDiffPerType) {
        const xml = create({ version: '1.0', encoding: 'UTF-8' }).ele('Package', {
            xmlns: 'http://soap.sforce.com/2006/04/metadata',
        });
        Array.from(strucDiffPerType.keys())
            .sort(this._sortTypesWithMetadata)
            .forEach(metadataType => [...strucDiffPerType.get(metadataType)]
            .sort(Intl.Collator(frLocale).compare)
            .reduce((type, member) => {
            type.ele('members').txt(member);
            return type;
        }, xml.ele('types'))
            .ele('name')
            .txt(metadataType));
        xml.ele('version').txt(`${this.config.apiVersion}.0`);
        return xml.end(xmlConf);
    }
    _sortTypesWithMetadata = (x, y) => {
        // QUESTION: Why Object needs to be ordered first in package.xml so it can be deployed ?
        if (x === OBJECT_TYPE)
            return -1; // @deprecated To remove when the order will not impact the result of the deployment
        return new Intl.Collator(frLocale).compare(x, y);
    };
}
__decorate([
    log
], PackageBuilder.prototype, "buildPackage", null);
export const fillPackageWithParameter = ({ store, type, member, }) => {
    if (!store.has(type)) {
        store.set(type, new Set());
    }
    store.get(type)?.add(member);
};
//# sourceMappingURL=packageHelper.js.map