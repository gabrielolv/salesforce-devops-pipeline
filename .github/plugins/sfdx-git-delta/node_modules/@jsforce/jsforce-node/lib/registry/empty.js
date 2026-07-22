"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyRegistry = void 0;
const base_1 = require("./base");
/**
 *
 */
class EmptyRegistry extends base_1.BaseRegistry {
    _saveConfig() {
        // ignore all call requests
    }
}
exports.EmptyRegistry = EmptyRegistry;
