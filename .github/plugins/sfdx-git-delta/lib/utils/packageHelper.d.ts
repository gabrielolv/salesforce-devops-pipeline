import type { Config } from '../types/config.js';
import type { Manifest } from '../types/work.js';
export default class PackageBuilder {
    protected readonly config: Config;
    constructor(config: Config);
    buildPackage(strucDiffPerType: Manifest): string;
    _sortTypesWithMetadata: (x: string, y: string) => number;
}
export declare const fillPackageWithParameter: ({ store, type, member, }: {
    store: Manifest;
    type: string;
    member: string;
}) => void;
