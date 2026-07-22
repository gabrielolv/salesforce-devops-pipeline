import { __decorate } from "tslib";
import { Messages } from '@salesforce/core';
import { PLUGIN_NAME } from '../constant/libConstant.js';
import { log } from './LoggingDecorator.js';
export class MessageService {
    static instance;
    constructor() {
        if (!MessageService.instance) {
            Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
            MessageService.instance = Messages.loadMessages(PLUGIN_NAME, 'delta');
        }
    }
    getMessage(key, tokens) {
        return MessageService.instance.getMessage(key, tokens);
    }
    getMessages(key, tokens) {
        return MessageService.instance.getMessages(key, tokens);
    }
}
__decorate([
    log
], MessageService.prototype, "getMessage", null);
__decorate([
    log
], MessageService.prototype, "getMessages", null);
//# sourceMappingURL=MessageService.js.map