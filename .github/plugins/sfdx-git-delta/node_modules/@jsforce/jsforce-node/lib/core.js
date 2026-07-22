"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.browser = exports.registry = exports.RecordStream = exports.RecordReference = exports.BrowserClient = exports.SfDate = exports.Date = exports.VERSION = void 0;
const jsforce_1 = __importDefault(require("./jsforce"));
const date_1 = __importDefault(require("./date"));
exports.Date = date_1.default;
exports.SfDate = date_1.default;
const registry_1 = __importDefault(require("./registry"));
exports.registry = registry_1.default;
const client_1 = __importStar(require("./browser/client"));
exports.browser = client_1.default;
Object.defineProperty(exports, "BrowserClient", { enumerable: true, get: function () { return client_1.BrowserClient; } });
const VERSION_1 = __importDefault(require("./VERSION"));
exports.VERSION = VERSION_1.default;
const record_reference_1 = __importDefault(require("./record-reference"));
exports.RecordReference = record_reference_1.default;
const record_stream_1 = __importDefault(require("./record-stream"));
exports.RecordStream = record_stream_1.default;
__exportStar(require("./oauth2"), exports);
__exportStar(require("./connection"), exports);
__exportStar(require("./query"), exports);
__exportStar(require("./quick-action"), exports);
__exportStar(require("./sobject"), exports);
__exportStar(require("./types"), exports);
exports.default = jsforce_1.default;
