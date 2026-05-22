export interface PlatoRoom {
    room: string;
    tiles: PlatoTile[];
}
export interface PlatoTile {
    title: string;
    content: string;
    tags?: string[];
    timestamp?: string;
}
export declare class PlatoHttpBridge {
    private baseUrl;
    private roomPrefix;
    constructor(baseUrl: string, roomPrefix?: string);
    /**
     * Push a session summary as a tile to a PLATO room.
     */
    pushTile(room: string, title: string, content: string, tags?: string[]): Promise<{
        success: boolean;
        error?: string;
    }>;
    /**
     * Pull context from a PLATO room to prime ideation.
     */
    pullRoomContext(room: string, limit?: number): Promise<{
        success: boolean;
        tiles?: PlatoTile[];
        error?: string;
    }>;
    /**
     * List rooms the jester has access to.
     */
    listRooms(): Promise<{
        success: boolean;
        rooms?: string[];
        error?: string;
    }>;
    /**
     * Check if the PLATO server is reachable.
     */
    healthCheck(): Promise<{
        alive: boolean;
        error?: string;
    }>;
}
//# sourceMappingURL=bridge.d.ts.map