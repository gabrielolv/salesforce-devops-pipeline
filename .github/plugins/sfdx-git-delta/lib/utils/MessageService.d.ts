export declare class MessageService {
    private static instance;
    constructor();
    getMessage(key: string, tokens?: string[]): string;
    getMessages(key: string, tokens?: string[]): string[];
}
