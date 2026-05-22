import { type LLMProvider } from '../providers/types.js';
import { SessionMemory } from '../dialogue/memory.js';
export interface ProvokeParams {
    idea: string;
    context?: string;
    intensity?: 'mild' | 'medium' | 'savage';
    agentName?: string;
}
export interface ProvokeResult {
    content: string;
    sessionPath?: string;
    tokensUsed: number;
    cost: number;
    latencyMs: number;
}
export declare function provoke(provider: LLMProvider, memory: SessionMemory, params: ProvokeParams): Promise<ProvokeResult>;
//# sourceMappingURL=provoke.d.ts.map