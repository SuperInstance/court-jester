import { type LLMProvider } from './providers/types.js';
export interface JesterConfig {
    provider: string;
    model: string;
    apiKey: string;
    baseUrl: string;
    maxTokens: number;
    temperature: number;
    plato: {
        mode: 'git' | 'http';
        httpUrl: string;
        roomPrefix: string;
    };
    sessions: {
        dir: string;
        gitCommit: boolean;
    };
}
export interface TokenUsageStats {
    totalTokens: number;
    totalCost: number;
    totalSessions: number;
}
export declare class CourtJester {
    private provider;
    private memory;
    private dialogueSession;
    private platoHttp;
    private platoGit;
    private config;
    private configPath;
    constructor(configPath?: string);
    /**
     * Initialize the jester from a config file or env vars.
     */
    initialize(config?: Partial<JesterConfig>): Promise<void>;
    /**
     * Resolve config from partial or env vars.
     */
    private resolveConfig;
    /**
     * Resolve API key from config or env vars.
     */
    private resolveApiKey;
    /**
     * jester_ideate — Generate wild ideas about a topic.
     */
    ideate(params: {
        topic: string;
        count?: number;
        style?: 'wild' | 'practical' | 'absurd';
        context?: string;
        agentName?: string;
    }): Promise<import("./tools/ideate.js").IdeateResult>;
    /**
     * jester_provoke — Attack an idea to find its weaknesses.
     */
    provoke(params: {
        idea: string;
        context?: string;
        intensity?: 'mild' | 'medium' | 'savage';
        agentName?: string;
    }): Promise<import("./tools/provoke.js").ProvokeResult>;
    /**
     * jester_riff — Free-associate on a topic.
     */
    riff(params: {
        topic: string;
        turns?: number;
        seedThought?: string;
        agentName?: string;
    }): Promise<import("./tools/riff.js").RiffResult>;
    /**
     * jester_sharpen — Iron sharpens iron, find weaknesses in an argument.
     */
    sharpen(params: {
        argument: string;
        perspective?: 'logic' | 'evidence' | 'assumptions' | 'all';
        agentName?: string;
    }): Promise<import("./tools/sharpen.js").SharpenResult>;
    /**
     * jester_springboard — Multi-round dialogue springboard.
     */
    springboard(params: {
        topic: string;
        rounds?: number;
        style?: 'explore' | 'debate' | 'whatif';
        initialPrompt?: string;
        context?: string;
        agentName?: string;
    }): Promise<import("./tools/springboard.js").SpringboardResult>;
    /**
     * jester_plato_push — Push a dialogue session to PLATO.
     */
    platoPush(params: {
        room: string;
        title: string;
        content: string;
        tags?: string[];
        mode?: 'http' | 'git';
    }): Promise<{
        success: boolean;
        error?: string;
    }>;
    /**
     * jester_plato_pull — Pull context from PLATO for ideation.
     */
    platoPull(params: {
        room: string;
        limit?: number;
        mode?: 'http' | 'git';
    }): Promise<{
        success: boolean;
        tiles?: import("./plato/bridge.js").PlatoTile[];
        error?: string;
    } | {
        success: boolean;
        entries?: string[];
        error?: string;
    }>;
    /**
     * Get token usage statistics.
     */
    getUsageStats(): TokenUsageStats;
    /**
     * List recent sessions.
     */
    listSessions(limit?: number): string[];
    /**
     * Get the underlying provider.
     */
    getProvider(): LLMProvider;
    /**
     * Check if we can reach the configured API.
     */
    healthCheck(): Promise<{
        alive: boolean;
        details: Record<string, unknown>;
    }>;
}
//# sourceMappingURL=jester.d.ts.map