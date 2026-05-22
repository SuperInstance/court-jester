import { type LLMProvider } from '../providers/types.js';
import { SessionMemory } from '../dialogue/memory.js';
export interface SharpenParams {
    argument: string;
    perspective?: 'logic' | 'evidence' | 'assumptions' | 'all';
    agentName?: string;
}
export interface SharpenResult {
    content: string;
    sessionPath?: string;
    tokensUsed: number;
    cost: number;
    latencyMs: number;
}
export declare function sharpen(provider: LLMProvider, memory: SessionMemory, params: SharpenParams): Promise<SharpenResult>;
//# sourceMappingURL=sharpen.d.ts.map