import StandardHandler from './standardHandler.js';
export default class ResourceHandler extends StandardHandler {
    protected metadataName: string | undefined;
    handleAddition(): Promise<void>;
    handleDeletion(): Promise<void>;
    protected _copyResourceFiles(): Promise<void>;
    protected _getElementName(): string;
    protected _getParsedPath(): import("node:path").ParsedPath;
    protected _isProcessable(): boolean;
    protected _getMetadataName(): string;
    protected _getMetaTypeFilePath(): string;
    protected _shouldCopyMetaFile(): boolean;
}
