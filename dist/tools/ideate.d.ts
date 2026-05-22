import { type LLMProvider } from '../providers/types.js';
import { SessionMemory } from '../dialogue/memory.js';
export interface IdeateParams {
    topic: string;
    count?: number;
    style?: 'wild' | 'practical' | 'absurd';
    context?: string;
    agentName?: string;
}
export interface IdeateResult {
    content: string;
    sessionPath?: string;
    tokensUsed: number;
    cost: number;
    latencyMs: number;
}
export declare function ideate(provider: LLMProvider, memory: SessionMemory, params: IdeateParams): Promise<IdeateResult>;
//# sourceMappingURL=ideate.d.ts.map