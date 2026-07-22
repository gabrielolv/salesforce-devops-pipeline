"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRegistry = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const base_1 = require("./base");
/**
 *
 */
function getDefaultConfigFilePath() {
    const homeDir = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
    if (!homeDir) {
        throw new Error('cannot find user home directory to store configuration files');
    }
    return path_1.default.join(homeDir, '.jsforce', 'config.json');
}
/**
 *
 */
class FileRegistry extends base_1.BaseRegistry {
    _configFilePath;
    constructor({ configFilePath }) {
        super();
        this._configFilePath = configFilePath || getDefaultConfigFilePath();
        try {
            const data = fs_1.default.readFileSync(this._configFilePath, 'utf-8');
            this._registryConfig = JSON.parse(data);
        }
        catch (e) {
            //
        }
    }
    _saveConfig() {
        const data = JSON.stringify(this._registryConfig, null, 4);
        try {
            fs_1.default.writeFileSync(this._configFilePath, data);
            fs_1.default.chmodSync(this._configFilePath, '600');
        }
        catch (e) {
            const configDir = path_1.default.dirname(this._configFilePath);
            fs_1.default.mkdirSync(configDir);
            fs_1.default.chmodSync(configDir, '700');
            fs_1.default.writeFileSync(this._configFilePath, data);
            fs_1.default.chmodSync(this._configFilePath, '600');
        }
    }
}
exports.FileRegistry = FileRegistry;
