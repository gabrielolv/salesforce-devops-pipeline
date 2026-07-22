import { Ignore } from 'ignore';
export declare class IgnoreHelper {
    readonly globalIgnore: Ignore;
    protected readonly destructiveIgnore: Ignore;
    constructor(globalIgnore: Ignore, destructiveIgnore: Ignore);
    keep(line: string): boolean;
}
export declare const buildIgnoreHelper: ({ ignore, ignoreDestructive, }: {
    ignore?: string | undefined;
    ignoreDestructive?: string | undefined;
}) => Promise<IgnoreHelper>;
export declare const buildIncludeHelper: ({ include, includeDestructive, }: {
    include?: string | undefined;
    includeDestructive?: string | undefined;
}) => Promise<IgnoreHelper>;
export declare const resetIgnoreInstance: () => void;
export declare const resetIncludeInstance: () => void;
