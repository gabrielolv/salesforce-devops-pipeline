declare const asyncFilter: (list: string[], predicate: (t: string) => Promise<boolean>) => Promise<string[]>;
export default asyncFilter;
