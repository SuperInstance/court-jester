"use strict";
// src/providers/types.ts — LLM Provider Interface
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODEL_COST_MAP = exports.DEFAULT_COMPLETION_OPTIONS = void 0;
exports.DEFAULT_COMPLETION_OPTIONS = {
    maxTokens: 2000,
    temperature: 0.8,
    topP: 0.9,
};
// Cost per 1K tokens for various models (approximate USD)
exports.MODEL_COST_MAP = {
    'ByteDance/Seed-2.0-mini': { input: 0.0001, output: 0.0001 },
    'ByteDance/Seed-2.0-code': { input: 0.00015, output: 0.00015 },
    'ByteDance/Seed-2.0-pro': { input: 0.0005, output: 0.0005 },
    'Qwen/Qwen3-235B-A22B-Instruct-2507': { input: 0.001, output: 0.002 },
    'NousResearch/Hermes-3-Llama-3.1-405B': { input: 0.002, output: 0.004 },
    'NousResearch/Hermes-3-Llama-3.1-70B': { input: 0.0005, output: 0.001 },
};
//# sourceMappingURL=types.js.map