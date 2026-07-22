"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyRegistry = exports.SfdxRegistry = exports.FileRegistry = void 0;
const file_1 = require("./file");
Object.defineProperty(exports, "FileRegistry", { enumerable: true, get: function () { return file_1.FileRegistry; } });
const sfdx_1 = require("./sfdx");
Object.defineProperty(exports, "SfdxRegistry", { enumerable: true, get: function () { return sfdx_1.SfdxRegistry; } });
const empty_1 = require("./empty");
Object.defineProperty(exports, "EmptyRegistry", { enumerable: true, get: function () { return empty_1.EmptyRegistry; } });
const logger_1 = require("../util/logger");
let registry;
try {
    registry =
        process.env.JSFORCE_CONNECTION_REGISTRY === 'sfdx'
            ? new sfdx_1.SfdxRegistry({})
            : new file_1.FileRegistry({});
}
catch (e) {
    (0, logger_1.getLogger)('registry').error(e);
    registry = new empty_1.EmptyRegistry();
}
exports.default = registry;
