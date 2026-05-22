/**
 * Get the DeepInfra API key from the environment or from the credential file.
 */
export declare function getDeepInfraKey(): string | undefined;
/**
 * Load config from a JSON file, resolving env var references.
 */
export declare function loadConfig(configPath: string): Record<string, unknown>;
/**
 * Get the default config path.
 */
export declare function getDefaultConfigPath(): string;
//# sourceMappingURL=config.d.ts.map