'use strict';
import { getDefinition } from './metadata/metadataManager.js';
import { getPostProcessors } from './post-processor/postProcessorManager.js';
import DiffLineInterpreter from './service/diffLineInterpreter.js';
import CLIHelper from './utils/cliHelper.js';
import { Logger, lazy } from './utils/LoggingService.js';
import RepoGitDiff from './utils/repoGitDiff.js';
export default async (config) => {
    Logger.trace('main: entry');
    Logger.debug(lazy `main: arguments ${config}`);
    const work = {
        config,
        diffs: { package: new Map(), destructiveChanges: new Map() },
        warnings: [],
    };
    const cliHelper = new CLIHelper(work);
    await cliHelper.validateConfig();
    const metadata = await getDefinition(config.apiVersion);
    const repoGitDiffHelper = new RepoGitDiff(config, metadata);
    const lines = await repoGitDiffHelper.getLines();
    const lineProcessor = new DiffLineInterpreter(work, metadata);
    await lineProcessor.process(lines);
    await getPostProcessors(work, metadata).execute();
    Logger.debug(lazy `main: return ${work}`);
    Logger.trace('main: exit');
    return work;
};
//# sourceMappingURL=main.js.map