import { SfCommand } from '@salesforce/sf-plugins-core';
import type { SgdResult } from '../../../types/sgdResult.js';
export default class SourceDeltaGenerate extends SfCommand<SgdResult> {
    static readonly summary: string;
    static readonly description: string;
    static readonly examples: string[];
    static readonly flags: {
        from: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        to: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        'generate-delta': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'output-dir': import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        'repo-dir': import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        'source-dir': import("@oclif/core/interfaces").OptionFlag<string[], import("@oclif/core/interfaces").CustomOptions>;
        'ignore-file': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'ignore-destructive-file': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'include-file': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'include-destructive-file': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'ignore-whitespace': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'api-version': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    run(): Promise<SgdResult>;
}
