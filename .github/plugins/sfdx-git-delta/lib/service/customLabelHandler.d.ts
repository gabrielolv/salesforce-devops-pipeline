import InFileHandler from './inFileHandler.js';
export default class CustomLabelHandler extends InFileHandler {
    handleAddition(): Promise<void>;
    protected _shouldTreatDeletionAsDeletion(): boolean;
    protected _getQualifiedName(): string;
    protected _delegateFileCopy(): boolean;
    protected _isProcessable(): boolean;
    protected _shouldTreatContainerType(): boolean;
    protected _isDecomposed(): boolean;
}
