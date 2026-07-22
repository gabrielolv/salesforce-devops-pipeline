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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerModule = void 0;
const events_1 = require("events");
const VERSION_1 = __importDefault(require("./VERSION"));
const connection_1 = __importDefault(require("./connection"));
const oauth2_1 = __importDefault(require("./oauth2"));
const date_1 = __importDefault(require("./date"));
const registry_1 = __importDefault(require("./registry"));
const client_1 = __importStar(require("./browser/client"));
/**
 *
 */
class JSforce extends events_1.EventEmitter {
    VERSION = VERSION_1.default;
    Connection = connection_1.default;
    OAuth2 = oauth2_1.default;
    SfDate = date_1.default;
    Date = date_1.default;
    BrowserClient = client_1.BrowserClient;
    registry = registry_1.default;
    browser = client_1.default;
}
function registerModule(name, factory) {
    jsforce.on('connection:new', (conn) => {
        let obj = undefined;
        Object.defineProperty(conn, name, {
            get() {
                obj = obj ?? factory(conn);
                return obj;
            },
            enumerable: true,
            configurable: true,
        });
    });
}
exports.registerModule = registerModule;
const jsforce = new JSforce();
exports.default = jsforce;
