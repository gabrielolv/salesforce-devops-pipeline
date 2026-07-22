declare type CompareFn = (valueA: unknown, valueB: unknown) => number;
declare type OrderEnum = 'asc' | 'desc';
declare type Order = OrderEnum | CompareFn;
declare type CompareOptions = {
    order?: OrderEnum;
} | OrderEnum | undefined;
declare type IdentifierFn<T> = (value: T) => unknown;
declare type Identifier<T> = IdentifierFn<T> | string | number;

/**
 * Creates a compare function that defines the natural sort order considering
 * the given `options` which may be passed to [`Array.prototype.sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).
 */
declare function compare(options?: CompareOptions): CompareFn;

/**
 * Creates an array of elements, natural sorted by specified identifiers and
 * the corresponding sort orders. This method implements a stable sort
 * algorithm, which means the original sort order of equal elements is
 * preserved.
 */
declare function orderBy<T>(collection: ReadonlyArray<T>, identifiers?: ReadonlyArray<Identifier<T>> | Identifier<T> | null, orders?: ReadonlyArray<Order> | Order | null): Array<T>;

export { CompareFn, CompareOptions, Identifier, Order, compare, orderBy };
