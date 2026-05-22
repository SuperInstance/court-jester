import { type LLMProvider } from '../providers/types.js';
import { SessionMemory } from '../dialogue/memory.js';
export interface SpringboardParams {
    topic: string;
    rounds?: number;
    style?: 'explore' | 'debate' | 'whatif';
    initialPrompt?: string;
    context?: string;
    agentName?: string;
}
export interface SpringboardResult {
    summary: string;
    fullTranscript: string;
    sessionPath?: string;
    springboardScore: number;
    tokensUsed: number;
    cost: number;
    latencyMs: number;
    roundCount: number;
}
export declare function springboard(provider: LLMProvider, memory: SessionMemory, params: SpringboardParams): Promise<SpringboardResult>;
//# sourceMappingURL=springboard.d.ts.map