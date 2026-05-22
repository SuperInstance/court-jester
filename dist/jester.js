"use strict";
// src/jester.ts — Core jester logic and orchestration
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourtJester = void 0;
const fs = __importStar(require("fs"));
const deepinfra_js_1 = require("./providers/deepinfra.js");
const memory_js_1 = require("./dialogue/memory.js");
const session_js_1 = require("./dialogue/session.js");
const bridge_js_1 = require("./plato/bridge.js");
const git_sync_js_1 = require("./plato/git-sync.js");
const ideate_js_1 = require("./tools/ideate.js");
const provoke_js_1 = require("./tools/provoke.js");
const riff_js_1 = require("./tools/riff.js");
const sharpen_js_1 = require("./tools/sharpen.js");
const springboard_js_1 = require("./tools/springboard.js");
const config_js_1 = require("./config.js");
class CourtJester {
    provider;
    memory;
    dialogueSession;
    platoHttp;
    platoGit;
    config;
    configPath;
    constructor(configPath) {
        this.configPath = configPath ?? '';
    }
    /**
     * Initialize the jester from a config file or env vars.
     */
    async initialize(config) {
        // Load config
        if (config) {
            this.config = this.resolveConfig(config);
        }
        else if (this.configPath && fs.existsSync(this.configPath)) {
            const raw = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
            this.config = this.resolveConfig(raw);
        }
        else {
            this.config = this.resolveConfig({});
        }
        // Resolve API key
        const apiKey = this.resolveApiKey();
        // Create provider
        const providerConfig = {
            name: this.config.provider,
            model: this.config.model,
            apiKey,
            baseUrl: this.config.baseUrl,
            maxTokens: this.config.maxTokens,
            temperature: this.config.temperature,
        };
        this.provider = new deepinfra_js_1.DeepInfraProvider(providerConfig);
        // Create memory
        this.memory = new memory_js_1.SessionMemory(this.config.sessions.dir, this.config.sessions.gitCommit);
        // Create dialogue session
        this.dialogueSession = new session_js_1.DialogueSession(this.provider, this.memory, {
            maxRounds: 7,
            temperature: this.config.temperature,
            maxTokens: this.config.maxTokens,
        });
        // Create PLATO bridges
        this.platoHttp = new bridge_js_1.PlatoHttpBridge(this.config.plato.httpUrl, this.config.plato.roomPrefix);
        this.platoGit = new git_sync_js_1.PlatoGitSync({
            sessionsDir: this.config.sessions.dir,
            autoPush: this.config.plato.mode === 'git',
        });
    }
    /**
     * Resolve config from partial or env vars.
     */
    resolveConfig(partial) {
        return {
            provider: partial.provider ?? process.env.JESTER_PROVIDER ?? 'deepinfra',
            model: partial.model ?? process.env.JESTER_MODEL ?? 'ByteDance/Seed-2.0-mini',
            apiKey: partial.apiKey ?? '',
            baseUrl: partial.baseUrl ?? process.env.JESTER_BASE_URL ?? 'https://api.deepinfra.com/v1/openai',
            maxTokens: partial.maxTokens ?? parseInt(process.env.JESTER_MAX_TOKENS ?? '2000', 10),
            temperature: partial.temperature ?? parseFloat(process.env.JESTER_TEMPERATURE ?? '0.8'),
            plato: {
                mode: partial.plato?.mode ?? 'git',
                httpUrl: partial.plato?.httpUrl ?? 'http://147.224.38.131:8847',
                roomPrefix: partial.plato?.roomPrefix ?? 'jester',
            },
            sessions: {
                dir: partial.sessions?.dir ?? 'sessions',
                gitCommit: partial.sessions?.gitCommit ?? true,
            },
        };
    }
    /**
     * Resolve API key from config or env vars.
     */
    resolveApiKey() {
        if (this.config.apiKey && this.config.apiKey !== '${DEEPINFRA_KEY}') {
            return this.config.apiKey;
        }
        const envKey = (0, config_js_1.getDeepInfraKey)();
        if (envKey)
            return envKey;
        throw new Error('No DeepInfra API key found. Set DEEPINFRA_KEY env var or provide apiKey in config.');
    }
    // ===== Tool Methods =====
    /**
     * jester_ideate — Generate wild ideas about a topic.
     */
    async ideate(params) {
        return (0, ideate_js_1.ideate)(this.provider, this.memory, params);
    }
    /**
     * jester_provoke — Attack an idea to find its weaknesses.
     */
    async provoke(params) {
        return (0, provoke_js_1.provoke)(this.provider, this.memory, params);
    }
    /**
     * jester_riff — Free-associate on a topic.
     */
    async riff(params) {
        return (0, riff_js_1.riff)(this.provider, this.memory, params);
    }
    /**
     * jester_sharpen — Iron sharpens iron, find weaknesses in an argument.
     */
    async sharpen(params) {
        return (0, sharpen_js_1.sharpen)(this.provider, this.memory, params);
    }
    /**
     * jester_springboard — Multi-round dialogue springboard.
     */
    async springboard(params) {
        return (0, springboard_js_1.springboard)(this.provider, this.memory, params);
    }
    /**
     * jester_plato_push — Push a dialogue session to PLATO.
     */
    async platoPush(params) {
        const mode = params.mode ?? this.config.plato.mode;
        if (mode === 'http') {
            return this.platoHttp.pushTile(params.room, params.title, params.content, params.tags);
        }
        else {
            return this.platoGit.sync(`PLATO push: ${params.title}`);
        }
    }
    /**
     * jester_plato_pull — Pull context from PLATO for ideation.
     */
    async platoPull(params) {
        const mode = params.mode ?? 'http';
        if (mode === 'http') {
            return this.platoHttp.pullRoomContext(params.room, params.limit ?? 5);
        }
        else {
            return this.platoGit.log(params.limit ?? 10);
        }
    }
    /**
     * Get token usage statistics.
     */
    getUsageStats() {
        const sessions = this.memory.listSessions();
        // Read each session to aggregate tokens (simplified — parse from metadata)
        let totalTokens = 0;
        let totalCost = 0;
        for (const sessionFile of sessions) {
            try {
                const content = fs.readFileSync(sessionFile, 'utf-8');
                const tokenMatch = content.match(/\*\*Tokens used:\*\* (\d+)/);
                const costMatch = content.match(/\*\*Cost:\*\* \$?([\d.]+)/);
                if (tokenMatch)
                    totalTokens += parseInt(tokenMatch[1], 10);
                if (costMatch)
                    totalCost += parseFloat(costMatch[1]);
            }
            catch {
                // Skip unreadable files
            }
        }
        return {
            totalTokens,
            totalCost,
            totalSessions: sessions.length,
        };
    }
    /**
     * List recent sessions.
     */
    listSessions(limit = 10) {
        return this.memory.listSessions().slice(0, limit);
    }
    /**
     * Get the underlying provider.
     */
    getProvider() {
        return this.provider;
    }
    /**
     * Check if we can reach the configured API.
     */
    async healthCheck() {
        const platoAlive = await this.platoHttp.healthCheck();
        const stats = this.getUsageStats();
        return {
            alive: true, // We don't test the LLM API health here (that costs money)
            details: {
                model: this.config.model,
                provider: this.config.provider,
                totalSessions: stats.totalSessions,
                totalTokens: stats.totalTokens,
                totalCost: stats.totalCost,
                platoReachable: platoAlive.alive,
                platoMode: this.config.plato.mode,
                sessionsDir: this.config.sessions.dir,
            },
        };
    }
}
exports.CourtJester = CourtJester;
//# sourceMappingURL=jester.js.map