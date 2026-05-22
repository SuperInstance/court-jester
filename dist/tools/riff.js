"use strict";
// src/tools/riff.ts — Free-association mode (multi-turn rolling)
Object.defineProperty(exports, "__esModule", { value: true });
exports.riff = riff;
const session_js_1 = require("../dialogue/session.js");
async function riff(provider, memory, params) {
    const maxRounds = Math.min(params.turns ?? 3, 5);
    const session = new session_js_1.DialogueSession(provider, memory, {
        maxRounds,
        temperature: 0.95, // Hottest temperature for free association
    });
    const initialPrompt = `Free-associate on this topic. Let your mind wander. Follow threads. Make weird connections.

Topic: ${params.topic}
${params.seedThought ? `Seed thought: ${params.seedThought}` : ''}

Rules:
- No filter. Say whatever comes to mind.
- Each response: 2-4 sentences.
- Build on your previous responses.
- If you hit something interesting, go deeper.`;
    const startTime = Date.now();
    // Use runDialogue for multi-turn
    const dialogueResult = await session.runDialogue(params.agentName ?? 'unknown', params.topic, 'riff', maxRounds, initialPrompt);
    const latencyMs = Date.now() - startTime;
    const resultTurns = session.getTurnHistory().map((t) => ({
        round: t.round,
        content: t.response,
    }));
    return {
        turns: resultTurns,
        fullTranscript: dialogueResult.content,
        sessionPath: undefined, // Already saved by runDialogue
        tokensUsed: dialogueResult.session.tokenUsage,
        cost: dialogueResult.session.cost,
        latencyMs,
    };
}
//# sourceMappingURL=riff.js.map