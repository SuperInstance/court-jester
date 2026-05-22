"use strict";
// src/dialogue/memory.ts — Git-native file-based memory for sessions
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
exports.SessionMemory = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
class SessionMemory {
    sessionsDir;
    gitCommit;
    constructor(sessionsDir, gitCommit = true) {
        this.sessionsDir = sessionsDir;
        this.gitCommit = gitCommit;
        this.ensureDir();
    }
    ensureDir() {
        if (!fs.existsSync(this.sessionsDir)) {
            fs.mkdirSync(this.sessionsDir, { recursive: true });
        }
    }
    /**
     * Create a new session ID from the current timestamp.
     */
    createSessionId() {
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    }
    /**
     * Format the current timestamp for logging.
     */
    nowISO() {
        return new Date().toISOString();
    }
    /**
     * Begin a new session and return its ID.
     */
    beginSession(agentName, topic, mode, rounds) {
        const id = this.createSessionId();
        const session = {
            id,
            timestamp: this.nowISO(),
            agentName,
            topic,
            mode,
            rounds,
            entries: [],
            tokenUsage: 0,
            cost: 0,
            metadata: {},
        };
        return session;
    }
    /**
     * Append an entry to the session.
     */
    appendEntry(session, role, content) {
        session.entries.push({
            round: session.entries.length + 1,
            role,
            content,
            timestamp: this.nowISO(),
        });
    }
    /**
     * Finalize and write the session file. Optionally git-commit.
     */
    finalizeSession(session) {
        const filePath = path.join(this.sessionsDir, `${session.id}.md`);
        const markdown = this.renderSession(session);
        fs.writeFileSync(filePath, markdown, 'utf-8');
        if (this.gitCommit) {
            this.gitCommitFile(filePath, `Jester session: ${session.id} — ${session.topic}`);
        }
        return filePath;
    }
    /**
     * Render a session log to Markdown.
     */
    renderSession(session) {
        const lines = [];
        lines.push(`# Jester Session: ${session.id}\n`);
        lines.push('## Context');
        lines.push(`- **Agent:** ${session.agentName}`);
        lines.push(`- **Topic:** ${session.topic}`);
        lines.push(`- **Mode:** ${session.mode} (${session.rounds} rounds)`);
        lines.push(`- **Started:** ${session.timestamp}`);
        if (session.metadata && Object.keys(session.metadata).length > 0) {
            for (const [key, val] of Object.entries(session.metadata)) {
                lines.push(`- **${key}:** ${val}`);
            }
        }
        lines.push('');
        for (const entry of session.entries) {
            lines.push(`## Round ${entry.round}`);
            const emoji = entry.role === 'agent' ? '🤖' : '🃏';
            lines.push(`**${emoji} ${entry.role === 'agent' ? 'Agent' : 'Jester'}:**`);
            lines.push('');
            lines.push(entry.content);
            lines.push('');
        }
        if (session.summary) {
            lines.push('## Summary');
            lines.push(session.summary);
            lines.push('');
        }
        lines.push('---');
        lines.push('_Session metadata:_');
        lines.push(`- **Total rounds:** ${session.entries.length}`);
        lines.push(`- **Tokens used:** ${session.tokenUsage}`);
        lines.push(`- **Cost:** \$${session.cost.toFixed(4)}`);
        if (session.springboardScore !== undefined) {
            lines.push(`- **Springboard score:** ${session.springboardScore}/10`);
        }
        return lines.join('\n');
    }
    /**
     * List all session files, newest first.
     */
    listSessions() {
        if (!fs.existsSync(this.sessionsDir))
            return [];
        return fs
            .readdirSync(this.sessionsDir)
            .filter((f) => f.endsWith('.md'))
            .sort()
            .reverse()
            .map((f) => path.join(this.sessionsDir, f));
    }
    /**
     * Read a session file and parse it (simple line-based summary).
     */
    readSessionSummary(filePath) {
        if (!fs.existsSync(filePath)) {
            return `Session file not found: ${filePath}`;
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        // Return first ~20 lines as summary
        return content.split('\n').slice(0, 20).join('\n');
    }
    /**
     * Git-commit the session file.
     */
    gitCommitFile(filePath, message) {
        try {
            // Check if we're in a git repo
            (0, child_process_1.execSync)('git rev-parse --git-dir', {
                cwd: this.sessionsDir,
                stdio: 'ignore',
            });
            (0, child_process_1.execSync)(`git add "${filePath}"`, { cwd: this.sessionsDir, stdio: 'ignore' });
            (0, child_process_1.execSync)(`git commit -m "${message}"`, { cwd: this.sessionsDir, stdio: 'ignore' });
        }
        catch {
            // Not a git repo or git not available — that's fine
        }
    }
}
exports.SessionMemory = SessionMemory;
//# sourceMappingURL=memory.js.map