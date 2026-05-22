"use strict";
// src/tools/provoke.ts — "What's wrong with this idea? Attack it."
Object.defineProperty(exports, "__esModule", { value: true });
exports.provoke = provoke;
const session_js_1 = require("../dialogue/session.js");
async function provoke(provider, memory, params) {
    const intensity = params.intensity ?? 'medium';
    const intensityInstructions = {
        mild: 'Gently probe for weaknesses. Be constructive. Point out potential issues but offer alternatives.',
        medium: 'Attack this idea directly. Find the 3 biggest flaws. Be honest but not cruel.',
        savage: 'DESTROY this idea. Find every weakness, every assumption, every edge case. Be brutal. The idea will survive if it has merit.',
    };
    const prompt = `${intensityInstructions[intensity]}

Here's the idea:
"""
${params.idea}
"""
${params.context ? `Additional context: ${params.context}` : ''}

Structure your attack:
1. Biggest flaw
2. Hidden assumption
3. Edge case that breaks it
4. What would need to be true for this to work`;
    const session = new session_js_1.DialogueSession(provider, memory, {
        maxRounds: 1,
        temperature: 0.7,
    });
    const startTime = Date.now();
    const result = await session.singleTurn(prompt);
    const latencyMs = Date.now() - startTime;
    const sessionLog = memory.beginSession(params.agentName ?? 'unknown', `Provoke: ${params.idea.substring(0, 60)}`, `provoke-${intensity}`, 1);
    memory.appendEntry(sessionLog, 'agent', prompt);
    memory.appendEntry(sessionLog, 'jester', result.content);
    sessionLog.tokenUsage = result.usage.totalTokens;
    sessionLog.cost = result.cost;
    const sessionPath = memory.finalizeSession(sessionLog);
    return {
        content: result.content,
        sessionPath,
        tokensUsed: result.usage.totalTokens,
        cost: result.cost,
        latencyMs,
    };
}
//# sourceMappingURL=provoke.js.map