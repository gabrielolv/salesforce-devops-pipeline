import StandardHandler from './standardHandler.js';
export default class CustomObjectHandler extends StandardHandler {
    handleAddition(): Promise<void>;
    protected _handleMasterDetailException(): Promise<void>;
}
