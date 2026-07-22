"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.zeroPad = void 0;
/**
 *
 */
function zeroPad(num, digits = 2) {
    let nstr = '';
    for (let d = digits - 1; d > 0; d--) {
        if (num >= 10 ** d) {
            break;
        }
        nstr += '0';
    }
    return nstr + String(num);
}
exports.zeroPad = zeroPad;
/**
 *
 */
function formatDate(date) {
    return `${date.getUTCFullYear()}-${zeroPad(date.getUTCMonth() + 1)}-${zeroPad(date.getUTCDate())}T${zeroPad(date.getUTCHours())}:${zeroPad(date.getUTCMinutes())}:${zeroPad(date.getUTCSeconds())}+00:00`;
}
exports.formatDate = formatDate;
