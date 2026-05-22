"use strict";
// src/dialogue/turns.ts — Turn tracking for dialogue sessions
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnTracker = void 0;
class TurnTracker {
    turns = [];
    recordTurn(turn) {
        this.turns.push({
            ...turn,
            timestamp: new Date().toISOString(),
        });
    }
    getAllTurns() {
        return [...this.turns];
    }
    get totalTurns() {
        return this.turns.length;
    }
    get totalTokens() {
        return this.turns.reduce((sum, t) => sum + t.tokens, 0);
    }
    get totalCost() {
        return this.turns.reduce((sum, t) => sum + t.cost, 0);
    }
    get totalLatency() {
        return this.turns.reduce((sum, t) => sum + t.latencyMs, 0);
    }
    formatTranscript() {
        return this.turns
            .map((t) => `[Round ${t.round}]\nAgent: ${t.prompt}\nJester: ${t.response}\n`)
            .join('\n');
    }
    reset() {
        this.turns = [];
    }
}
exports.TurnTracker = TurnTracker;
//# sourceMappingURL=turns.js.map