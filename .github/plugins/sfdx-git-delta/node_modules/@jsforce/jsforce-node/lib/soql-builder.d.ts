export type Condition = string | {
    [field: string]: any;
} | Array<{
    [field: string]: any;
}>;
export type SortDir = 'ASC' | 'DESC' | 'asc' | 'desc' | 1 | -1;
export type Sort = string | Array<[string, SortDir]> | {
    [field: string]: SortDir;
};
export type QueryConfig = {
    fields?: string[];
    includes?: {
        [field: string]: QueryConfig;
    };
    table?: string;
    conditions?: Condition;
    sort?: Sort;
    limit?: number;
    offset?: number;
};
/**
 * Create SOQL
 * @private
 */
export declare function createSOQL(query: QueryConfig): string;
