"use strict";
// src/plato/git-sync.ts — Git-based PLATO bridge (offline-first)
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
exports.PlatoGitSync = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
class PlatoGitSync {
    config;
    constructor(config = {}) {
        this.config = {
            sessionsDir: config.sessionsDir ?? 'sessions',
            remoteUrl: config.remoteUrl,
            remoteName: config.remoteName ?? 'plato',
            branch: config.branch ?? 'main',
            autoPush: config.autoPush ?? false,
        };
    }
    /**
     * Initialize the sessions directory as a git repo.
     */
    initRepo() {
        const gitDir = path.join(this.config.sessionsDir, '.git');
        if (fs.existsSync(gitDir)) {
            return { success: true }; // Already a repo
        }
        try {
            (0, child_process_1.execSync)('git init', { cwd: this.config.sessionsDir, stdio: 'ignore' });
            (0, child_process_1.execSync)('git checkout -b ' + this.config.branch, {
                cwd: this.config.sessionsDir,
                stdio: 'ignore',
            });
            // Set remote if provided
            if (this.config.remoteUrl) {
                (0, child_process_1.execSync)(`git remote add ${this.config.remoteName} ${this.config.remoteUrl}`, { cwd: this.config.sessionsDir, stdio: 'ignore' });
            }
            return { success: true };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { success: false, error: `Git init failed: ${message}` };
        }
    }
    /**
     * Commit all session files and optionally push.
     */
    sync(message = 'Jester session sync') {
        try {
            // Ensure we're in a git repo
            this.initRepo();
            (0, child_process_1.execSync)(`git add -A`, { cwd: this.config.sessionsDir, stdio: 'ignore' });
            // Check if there's anything to commit
            const status = (0, child_process_1.execSync)('git status --porcelain', {
                cwd: this.config.sessionsDir,
                encoding: 'utf-8',
            });
            if (!status.trim()) {
                return { success: true }; // Nothing to commit
            }
            (0, child_process_1.execSync)(`git commit -m "${message}"`, {
                cwd: this.config.sessionsDir,
                stdio: 'ignore',
            });
            if (this.config.autoPush && this.config.remoteUrl) {
                return this.push();
            }
            return { success: true };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { success: false, error: `Git sync failed: ${message}` };
        }
    }
    /**
     * Push to the PLATO remote.
     */
    push() {
        if (!this.config.remoteUrl) {
            return { success: false, error: 'No remote URL configured for PLATO sync' };
        }
        try {
            (0, child_process_1.execSync)(`git push ${this.config.remoteName} ${this.config.branch}`, { cwd: this.config.sessionsDir, stdio: 'ignore' });
            return { success: true };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { success: false, error: `Git push failed: ${message}` };
        }
    }
    /**
     * Pull from the PLATO remote.
     */
    pull() {
        if (!this.config.remoteUrl) {
            return { success: false, error: 'No remote URL configured for PLATO sync' };
        }
        try {
            (0, child_process_1.execSync)(`git pull ${this.config.remoteName} ${this.config.branch}`, { cwd: this.config.sessionsDir, stdio: 'ignore' });
            return { success: true };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { success: false, error: `Git pull failed: ${message}` };
        }
    }
    /**
     * Get the git log for the sessions repo.
     */
    log(limit = 10) {
        try {
            const output = (0, child_process_1.execSync)(`git log --oneline -${limit}`, { cwd: this.config.sessionsDir, encoding: 'utf-8' });
            const entries = output.trim().split('\n').filter(Boolean);
            return { success: true, entries };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { success: false, error: `Git log failed: ${message}` };
        }
    }
    /**
     * Sync using the config file.
     */
    setRemote(url, name = 'plato') {
        this.config.remoteUrl = url;
        this.config.remoteName = name;
        try {
            // Remove existing remote if present, then add
            try {
                (0, child_process_1.execSync)(`git remote rm ${name}`, {
                    cwd: this.config.sessionsDir,
                    stdio: 'ignore',
                });
            }
            catch {
                // No existing remote
            }
            (0, child_process_1.execSync)(`git remote add ${name} ${url}`, {
                cwd: this.config.sessionsDir,
                stdio: 'ignore',
            });
            return { success: true };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { success: false, error: `Set remote failed: ${message}` };
        }
    }
}
exports.PlatoGitSync = PlatoGitSync;
//# sourceMappingURL=git-sync.js.map