import type { Config } from '../types/config.js';
import type { FileGitRef } from '../types/git.js';
export declare const xml2Json: (xmlContent: string) => any;
export declare const parseXmlFileToJson: (forRef: FileGitRef, config: Config) => Promise<any>;
export declare const convertJsonToXml: (jsonContent: any) => string;
export declare const ATTRIBUTE_PREFIX = "@_";
export declare const XML_HEADER_ATTRIBUTE_KEY = "?xml";
