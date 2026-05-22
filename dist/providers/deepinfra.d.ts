import { type LLMProvider, type ProviderConfig, type Message, type Completion, type CompletionOptions } from './types.js';
export declare class DeepInfraProvider implements LLMProvider {
    readonly name: string;
    readonly model: string;
    private config;
    constructor(config: ProviderConfig);
    complete(messages: Message[], options?: Partial<CompletionOptions>): Promise<Completion>;
}
//# sourceMappingURL=deepinfra.d.ts.map