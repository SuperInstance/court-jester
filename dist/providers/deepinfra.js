"use strict";
// src/providers/deepinfra.ts — DeepInfra API client (Seed-2.0-mini and friends)
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepInfraProvider = void 0;
const types_js_1 = require("./types.js");
class DeepInfraProvider {
    name;
    model;
    config;
    constructor(config) {
        this.config = config;
        this.name = config.name;
        this.model = config.model;
    }
    async complete(messages, options) {
        const opts = { ...types_js_1.DEFAULT_COMPLETION_OPTIONS, ...options };
        const startTime = Date.now();
        const body = {
            model: this.model,
            messages,
            max_tokens: opts.maxTokens,
            temperature: opts.temperature,
            top_p: opts.topP,
        };
        const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.config.apiKey}`,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errorBody = await response.text().catch(() => 'unknown');
            throw new Error(`DeepInfra API error: ${response.status} ${response.statusText} — ${errorBody}`);
        }
        const data = (await response.json());
        const latencyMs = Date.now() - startTime;
        const promptTokens = data.usage.prompt_tokens;
        const completionTokens = data.usage.completion_tokens;
        const totalTokens = data.usage.total_tokens;
        // Calculate cost based on model pricing, fall back to default
        const pricing = types_js_1.MODEL_COST_MAP[this.model] || { input: 0.0001, output: 0.0001 };
        const cost = (promptTokens / 1000) * pricing.input +
            (completionTokens / 1000) * pricing.output;
        return {
            content: data.choices[0]?.message?.content ?? '',
            model: data.model ?? this.model,
            usage: {
                promptTokens,
                completionTokens,
                totalTokens,
            },
            cost,
            latencyMs,
        };
    }
}
exports.DeepInfraProvider = DeepInfraProvider;
//# sourceMappingURL=deepinfra.js.map