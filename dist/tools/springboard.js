"use strict";
// src/tools/springboard.ts — Multi-round dialogue springboard
Object.defineProperty(exports, "__esModule", { value: true });
exports.springboard = springboard;
const session_js_1 = require("../dialogue/session.js");
async function springboard(provider, memory, params) {
    const rounds = Math.min(params.rounds ?? 5, 7);
    const style = params.style ?? 'explore';
    const stylePrompts = {
        explore: 'I want to explore this topic from multiple angles. Each round, take a DIFFERENT perspective. Don\'t repeat yourself. If the topic has N dimensions, try to touch all of them.',
        debate: 'I want to DEBATE this topic. You take the contrarian position to whatever I say. If I say left, you say right. Challenge everything. Find the weak points in my reasoning and push on them.',
        whatif: 'I want to play "WHAT IF?" with this topic. Each round, change one fundamental assumption. "What if gravity worked backwards?" "What if time was a resource?" Keep twisting.',
    };
    const initialPrompt = params.initialPrompt ??
        `${stylePrompts[style]}

Topic to explore: ${params.topic}

${params.context ? `Context for grounding: ${params.context}` : ''}

Round 1: Start with your most interesting angle.`;
    const session = new session_js_1.DialogueSession(provider, memory, {
        maxRounds: rounds,
        temperature: 0.85,
    });
    const startTime = Date.now();
    const result = await session.runDialogue(params.agentName ?? 'unknown', params.topic, `springboard-${style}`, rounds, initialPrompt);
    const latencyMs = Date.now() - startTime;
    return {
        summary: result.summary,
        fullTranscript: result.content,
        sessionPath: undefined, // Saved by runDialogue
        springboardScore: result.session.springboardScore ?? 5,
        tokensUsed: result.session.tokenUsage,
        cost: result.session.cost,
        latencyMs,
        roundCount: result.session.entries.length,
    };
}
//# sourceMappingURL=springboard.js.map