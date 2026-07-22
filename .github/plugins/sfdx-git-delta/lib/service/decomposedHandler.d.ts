import StandardHandler from './standardHandler.js';
export default class DecomposedHandler extends StandardHandler {
    handleAddition(): Promise<void>;
    protected _copyParent(): Promise<void>;
    protected _getElementName(): string;
    protected getParentName(): string;
}
