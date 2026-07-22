import BaseProcessor from './baseProcessor.js';
export default class PackageGenerator extends BaseProcessor {
    process(): Promise<void>;
    protected _cleanPackages(): void;
    protected _buildPackages(): Promise<void>;
}
