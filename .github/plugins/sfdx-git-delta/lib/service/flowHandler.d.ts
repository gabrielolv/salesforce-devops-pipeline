import StandardHandler from './standardHandler.js';
export default class FlowHandler extends StandardHandler {
    handleDeletion(): Promise<void>;
    private warnFlowDeleted;
}
