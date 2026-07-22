'use strict';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { readPathFromGit } from './fsHelper.js';
const XML_PARSER_OPTION = {
    commentPropName: '#comment',
    ignoreAttributes: false,
    ignoreNameSpace: false,
    parseTagValue: false,
    parseNodeValue: false,
    parseAttributeValue: false,
    trimValues: true,
    processEntities: false,
};
const JSON_PARSER_OPTION = {
    ...XML_PARSER_OPTION,
    format: true,
    indentBy: '    ',
    suppressBooleanAttributes: false,
    suppressEmptyNode: false,
};
export const xml2Json = (xmlContent) => {
    // biome-ignore lint/suspicious/noExplicitAny: Any is expected here
    let jsonContent = {};
    if (xmlContent) {
        const xmlParser = new XMLParser(XML_PARSER_OPTION);
        jsonContent = xmlParser.parse(xmlContent);
    }
    return jsonContent;
};
export const parseXmlFileToJson = async (forRef, config) => {
    const xmlContent = await readPathFromGit(forRef, config);
    return xml2Json(xmlContent);
};
// biome-ignore lint/suspicious/noExplicitAny: Any is expected here
export const convertJsonToXml = (jsonContent) => {
    const xmlBuilder = new XMLBuilder(JSON_PARSER_OPTION);
    return xmlBuilder.build(jsonContent);
};
export const ATTRIBUTE_PREFIX = '@_';
export const XML_HEADER_ATTRIBUTE_KEY = '?xml';
//# sourceMappingURL=fxpHelper.js.map