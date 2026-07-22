export declare function stringify(value: unknown): string;
export declare function hasCustomToString(obj: unknown): obj is {
    toString: () => string;
};
export declare function log(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
