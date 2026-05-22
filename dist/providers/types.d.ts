export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface Completion {
    content: string;
    model: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    cost: number;
    latencyMs: number;
}
export interface ProviderConfig {
    name: string;
    model: string;
    apiKey: string;
    baseUrl: string;
    maxTokens: number;
    temperature: number;
}
export interface LLMProvider {
    readonly name: string;
    readonly model: string;
    complete(messages: Message[], options?: Partial<CompletionOptions>): Promise<Completion>;
}
export interface CompletionOptions {
    maxTokens: number;
    temperature: number;
    topP: number;
}
export declare const DEFAULT_COMPLETION_OPTIONS: CompletionOptions;
export declare const MODEL_COST_MAP: Record<string, {
    input: number;
    output: number;
}>;
//# sourceMappingURL=types.d.ts.map