import ResourceHandler from './inResourceHandler.js';
export default class ObjectTranslationHandler extends ResourceHandler {
    handleAddition(): Promise<void>;
    protected _copyObjectTranslation(path: string): Promise<void>;
    protected _getObjectTranslationPath(): string;
    protected _delegateFileCopy(): boolean;
}
