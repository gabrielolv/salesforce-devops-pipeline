import { MetadataRepository } from '../metadata/MetadataRepository.js';
import type { Work } from '../types/work.js';
import { IgnoreHelper } from '../utils/ignoreHelper.js';
import BaseProcessor from './baseProcessor.js';
export default class FlowTranslationProcessor extends BaseProcessor {
    protected readonly translations: Map<string, any>;
    protected ignoreHelper: IgnoreHelper | undefined;
    protected isOutputEqualsToRepo: boolean | undefined;
    constructor(work: Work, metadata: MetadataRepository);
    process(): Promise<void>;
    _buildFlowDefinitionsMap(): Promise<void>;
    protected _canParse(translationPath: string): Promise<boolean>;
    protected _handleFlowTranslation(): Promise<void>;
    protected _scrapTranslationFile(jsonTranslation: any, actualFlowDefinition: any): void;
    protected _parseTranslationFile(translationPath: string): Promise<void>;
    protected _addFlowPerTranslation({ translationPath, flowDefinition, }: {
        translationPath: string;
        flowDefinition: any;
    }): void;
    protected _getTranslationAsJSON(translationPath: string): Promise<{
        '?xml': {
            '@_version': string;
            '@_encoding': string;
        };
        Translations: {
            '@_xmlns': string;
            flowDefinitions: never[];
        };
    }>;
    _shouldProcess(): boolean;
}
