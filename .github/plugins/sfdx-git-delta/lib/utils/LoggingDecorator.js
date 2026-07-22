/** biome-ignore-all lint/suspicious/noExplicitAny: it is dynamic by definition */
import { Logger, lazy } from './LoggingService.js';
export function stringify(value) {
    if (hasCustomToString(value)) {
        return value.toString();
    }
    return JSON.stringify(value, replacer);
}
function replacer(_key, value) {
    if (value instanceof Map) {
        return Array.from(value.entries());
    }
    if (value instanceof Set) {
        return Array.from(value);
    }
    return value;
}
export function hasCustomToString(obj) {
    if (obj === null || typeof obj !== 'object')
        return false;
    const toStringFn = obj.toString;
    if (typeof toStringFn !== 'function')
        return false;
    if (Object.hasOwn(obj, 'toString')) {
        return toStringFn !== Object.prototype.toString;
    }
    const proto = Object.getPrototypeOf(obj);
    const protoToString = proto.toString;
    return (typeof protoToString === 'function' &&
        protoToString !== Object.prototype.toString);
}
export function log(target, propertyKey, descriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args) {
        Logger.trace(lazy `${target.constructor.name}.${propertyKey}: entry`);
        Logger.debug(lazy `${target.constructor.name}.${propertyKey}: arguments : ${stringify(args)}`);
        const call = () => original.call(this, ...args);
        const logResult = (result) => {
            Logger.debug(lazy `${target.constructor.name}.${propertyKey}: result : ${stringify(result)}`);
            Logger.trace(lazy `${target.constructor.name}.${propertyKey}: exit`);
            return result;
        };
        if (original.constructor.name === 'AsyncFunction') {
            return call().then(logResult);
        }
        else {
            return logResult(call());
        }
    };
}
//# sourceMappingURL=LoggingDecorator.js.map