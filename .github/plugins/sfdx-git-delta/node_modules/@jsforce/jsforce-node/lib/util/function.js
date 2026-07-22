"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyFunc = exports.identityFunc = exports.isPromiseLike = exports.isNumber = exports.isFunction = exports.isMapObject = exports.isObject = void 0;
/**
 *
 */
function isObject(v) {
    const t = typeof v;
    return v != null && (t == 'object' || t == 'function');
}
exports.isObject = isObject;
/**
 *
 */
function isMapObject(v) {
    const t = typeof v;
    return v != null && t == 'object';
}
exports.isMapObject = isMapObject;
/**
 *
 */
function isFunction(v) {
    return typeof v == 'function';
}
exports.isFunction = isFunction;
/**
 *
 */
function isNumber(v) {
    return typeof v == 'number';
}
exports.isNumber = isNumber;
/**
 * Detect whether the value has CommonJS Promise/A+ interface or not
 */
function isPromiseLike(v) {
    return isObject(v) && isFunction(v.then);
}
exports.isPromiseLike = isPromiseLike;
/**
 *
 */
function identityFunc(a) {
    return a;
}
exports.identityFunc = identityFunc;
/**
 *
 */
function emptyFunc() { }
exports.emptyFunc = emptyFunc;
