export interface SessionEntry {
    round: number;
    role: 'agent' | 'jester';
    content: string;
    timestamp: string;
}
export interface SessionLog {
    id: string;
    timestamp: string;
    agentName: string;
    topic: string;
    mode: string;
    rounds: number;
    entries: SessionEntry[];
    summary?: string;
    springboardScore?: number;
    tokenUsage: number;
    cost: number;
    metadata: Record<string, string>;
}
export declare class SessionMemory {
    private sessionsDir;
    private gitCommit;
    constructor(sessionsDir: string, gitCommit?: boolean);
    private ensureDir;
    /**
     * Create a new session ID from the current timestamp.
     */
    createSessionId(): string;
    /**
     * Format the current timestamp for logging.
     */
    private nowISO;
    /**
     * Begin a new session and return its ID.
     */
    beginSession(agentName: string, topic: string, mode: string, rounds: number): SessionLog;
    /**
     * Append an entry to the session.
     */
    appendEntry(session: SessionLog, role: 'agent' | 'jester', content: string): void;
    /**
     * Finalize and write the session file. Optionally git-commit.
     */
    finalizeSession(session: SessionLog): string;
    /**
     * Render a session log to Markdown.
     */
    private renderSession;
    /**
     * List all session files, newest first.
     */
    listSessions(): string[];
    /**
     * Read a session file and parse it (simple line-based summary).
     */
    readSessionSummary(filePath: string): string;
    /**
     * Git-commit the session file.
     */
    private gitCommitFile;
}
//# sourceMappingURL=memory.d.ts.map