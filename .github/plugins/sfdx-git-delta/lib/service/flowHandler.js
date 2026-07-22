'use strict';
import { __decorate } from "tslib";
import { log } from '../utils/LoggingDecorator.js';
import { MessageService } from '../utils/MessageService.js';
import StandardHandler from './standardHandler.js';
export default class FlowHandler extends StandardHandler {
    async handleDeletion() {
        await super.handleDeletion();
        this.warnFlowDeleted();
    }
    warnFlowDeleted() {
        const message = new MessageService();
        this.work.warnings.push(new Error(message.getMessage('warning.FlowDeleted', [this._getElementName()])));
    }
}
__decorate([
    log
], FlowHandler.prototype, "handleDeletion", null);
//# sourceMappingURL=flowHandler.js.map