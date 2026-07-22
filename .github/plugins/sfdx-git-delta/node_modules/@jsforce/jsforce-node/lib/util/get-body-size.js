"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBodySize = void 0;
const is_1 = __importDefault(require("@sindresorhus/is"));
function getBodySize(body, headers = {}) {
    function isFormData(body) {
        return is_1.default.nodeStream(body) && is_1.default.function_(body.getBoundary);
    }
    if (headers && 'content-length' in headers) {
        return Number(headers['content-length']);
    }
    if (!body) {
        return 0;
    }
    if (is_1.default.string(body)) {
        return Buffer.byteLength(body);
    }
    if (is_1.default.urlSearchParams(body)) {
        return Buffer.byteLength(body.toString());
    }
    if (is_1.default.buffer(body)) {
        return body.length;
    }
    try {
        // `getLengthSync` will throw if body has a stream:
        // https://github.com/form-data/form-data#integer-getlengthsync
        if (isFormData(body)) {
            return body.getLengthSync();
        }
    }
    catch {
        return undefined;
    }
    return undefined;
}
exports.getBodySize = getBodySize;
