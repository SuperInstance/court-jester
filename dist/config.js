"use strict";
// src/config.ts — Configuration helpers
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
exports.getDeepInfraKey = getDeepInfraKey;
exports.loadConfig = loadConfig;
exports.getDefaultConfigPath = getDefaultConfigPath;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
/**
 * Get the DeepInfra API key from the environment or from the credential file.
 */
function getDeepInfraKey() {
    if (process.env.DEEPINFRA_KEY) {
        return process.env.DEEPINFRA_KEY;
    }
    if (process.env.DEEPINFRA_API_KEY) {
        return process.env.DEEPINFRA_API_KEY;
    }
    // Check credential file
    const credPaths = [
        path.join(os.homedir(), '.openclaw', 'workspace', '.credentials', 'deepinfra-api-key.txt'),
        path.join(os.homedir(), '.deepinfra', 'api-key.txt'),
        '.deepinfra-key',
    ];
    for (const credPath of credPaths) {
        try {
            if (fs.existsSync(credPath)) {
                return fs.readFileSync(credPath, 'utf-8').trim();
            }
        }
        catch {
            continue;
        }
    }
    return undefined;
}
/**
 * Load config from a JSON file, resolving env var references.
 */
function loadConfig(configPath) {
    const raw = fs.readFileSync(configPath, 'utf-8');
    // Replace ${VAR_NAME} with env vars
    const resolved = raw.replace(/\$\{(\w+)\}/g, (_, key) => {
        return process.env[key] ?? `\${${key}}`;
    });
    return JSON.parse(resolved);
}
/**
 * Get the default config path.
 */
function getDefaultConfigPath() {
    const candidates = ['config.json', 'config.local.json', 'config.example.json'];
    for (const c of candidates) {
        if (fs.existsSync(c))
            return c;
    }
    return 'config.json';
}
//# sourceMappingURL=config.js.map