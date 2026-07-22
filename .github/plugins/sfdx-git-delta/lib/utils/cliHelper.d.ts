import GitAdapter from '../adapter/GitAdapter.js';
import type { Config } from '../types/config.js';
import type { Work } from '../types/work.js';
import { MessageService } from './MessageService.js';
export default class CLIHelper {
    protected readonly work: Work;
    protected readonly config: Config;
    protected readonly gitAdapter: GitAdapter;
    protected readonly message: MessageService;
    constructor(work: Work);
    protected _validateGitSha(): Promise<string[]>;
    validateConfig(): Promise<void>;
    protected _handleDefault(): Promise<void>;
    protected _getApiVersion(): Promise<void>;
    protected _apiVersionDefault(): void;
    protected _sanitizeConfig(): void;
}
