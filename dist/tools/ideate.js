"use strict";
// src/tools/ideate.ts — "Give me 5 wild ideas about X"
Object.defineProperty(exports, "__esModule", { value: true });
exports.ideate = ideate;
const session_js_1 = require("../dialogue/session.js");
async function ideate(provider, memory, params) {
    const count = params.count ?? 5;
    const style = params.style ?? 'wild';
    const styleInstructions = {
        wild: 'Give me 5 WILD ideas about this. Prioritize novelty. These should be ideas that conventional thinking would reject.',
        practical: 'Give me 5 PRACTICAL ideas about this. These should be implementable with current or near-future technology.',
        absurd: 'Give me 5 ABSURD ideas about this. Go full saturnalia. The more ridiculous, the better — sometimes absurdity contains truth.',
    };
    const prompt = `${styleInstructions[style]}

Topic: ${params.topic}
${params.context ? `Context: ${params.context}` : ''}

For each idea, provide:
1. The idea (one sentence)
2. Why it might work (one sentence)
3. Why it might fail (one sentence)

Number them 1-${count}.`;
    const session = new session_js_1.DialogueSession(provider, memory, {
        maxRounds: 1,
        temperature: 0.9,
    });
    const startTime = Date.now();
    const result = await session.singleTurn(prompt);
    const latencyMs = Date.now() - startTime;
    // Write a session file for tracking
    const sessionLog = memory.beginSession(params.agentName ?? 'unknown', params.topic, `ideate-${style}`, 1);
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
//# sourceMappingURL=ideate.js.map