export interface Turn {
    round: number;
    prompt: string;
    response: string;
    tokens: number;
    cost: number;
    latencyMs: number;
    timestamp: string;
}
export declare class TurnTracker {
    private turns;
    recordTurn(turn: Omit<Turn, 'timestamp'>): void;
    getAllTurns(): Turn[];
    get totalTurns(): number;
    get totalTokens(): number;
    get totalCost(): number;
    get totalLatency(): number;
    formatTranscript(): string;
    reset(): void;
}
//# sourceMappingURL=turns.d.ts.map