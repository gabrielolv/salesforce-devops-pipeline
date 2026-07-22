import ShareFolderHandler from './sharedFolderHandler.js';
export default class BotHandler extends ShareFolderHandler {
    protected _getElementName(): string;
    handleAddition(): Promise<void>;
    protected _addParentBot(): Promise<void>;
}
