import StandardHandler from './standardHandler.js';
export default class InFolderHandler extends StandardHandler {
    handleAddition(): Promise<void>;
    protected _copyFolderMetaFile(): Promise<void>;
    protected _copySpecialExtension(): Promise<void>;
    protected _getElementName(): string;
    protected _isProcessable(): boolean;
}
