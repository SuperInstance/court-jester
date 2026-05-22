import { type LLMProvider, type Message } from '../providers/types.js';
import { SessionMemory, type SessionLog } from './memory.js';
import { type Turn } from './turns.js';
export interface DialogueConfig {
    maxRounds: number;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
}
export declare class DialogueSession {
    private provider;
    private memory;
    private tracker;
    private config;
    constructor(provider: LLMProvider, memory: SessionMemory, config?: Partial<DialogueConfig>);
    /**
     * Run a multi-round dialogue session.
     * Returns the session log with all turns and a summary.
     */
    runDialogue(agentName: string, topic: string, mode: string, rounds: number, initialPrompt: string, additionalContext?: string): Promise<{
        session: SessionLog;
        summary: string;
        content: string;
    }>;
    /**
     * One-shot conversation: user prompt -> jester response
     */
    singleTurn(userPrompt: string, contextMessages?: Message[]): Promise<{
        content: string;
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
        cost: number;
    }>;
    /**
     * Generate a summary of the dialogue session.
     */
    private generateSummary;
    /**
     * Calculate a score based on turn quality.
     */
    private calculateSpringboardScore;
    getTurnHistory(): Turn[];
}
//# sourceMappingURL=session.d.ts.map