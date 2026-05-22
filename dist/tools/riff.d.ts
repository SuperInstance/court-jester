import { type LLMProvider } from '../providers/types.js';
import { SessionMemory } from '../dialogue/memory.js';
export interface RiffParams {
    topic: string;
    turns?: number;
    seedThought?: string;
    agentName?: string;
}
export interface RiffResult {
    turns: {
        round: number;
        content: string;
    }[];
    fullTranscript: string;
    sessionPath?: string;
    tokensUsed: number;
    cost: number;
    latencyMs: number;
}
export declare function riff(provider: LLMProvider, memory: SessionMemory, params: RiffParams): Promise<RiffResult>;
//# sourceMappingURL=riff.d.ts.map