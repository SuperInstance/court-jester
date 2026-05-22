export interface GitSyncConfig {
    sessionsDir: string;
    remoteUrl?: string;
    remoteName?: string;
    branch?: string;
    autoPush: boolean;
}
export declare class PlatoGitSync {
    private config;
    constructor(config?: Partial<GitSyncConfig>);
    /**
     * Initialize the sessions directory as a git repo.
     */
    initRepo(): {
        success: boolean;
        error?: string;
    };
    /**
     * Commit all session files and optionally push.
     */
    sync(message?: string): {
        success: boolean;
        error?: string;
    };
    /**
     * Push to the PLATO remote.
     */
    push(): {
        success: boolean;
        error?: string;
    };
    /**
     * Pull from the PLATO remote.
     */
    pull(): {
        success: boolean;
        error?: string;
    };
    /**
     * Get the git log for the sessions repo.
     */
    log(limit?: number): {
        success: boolean;
        entries?: string[];
        error?: string;
    };
    /**
     * Sync using the config file.
     */
    setRemote(url: string, name?: string): {
        success: boolean;
        error?: string;
    };
}
//# sourceMappingURL=git-sync.d.ts.map