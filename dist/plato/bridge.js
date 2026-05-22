"use strict";
// src/plato/bridge.ts — PLATO HTTP REST bridge
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatoHttpBridge = void 0;
class PlatoHttpBridge {
    baseUrl;
    roomPrefix;
    constructor(baseUrl, roomPrefix = 'jester') {
        this.baseUrl = baseUrl.replace(/\/+$/, '');
        this.roomPrefix = roomPrefix;
    }
    /**
     * Push a session summary as a tile to a PLATO room.
     */
    async pushTile(room, title, content, tags) {
        const fullRoom = `${this.roomPrefix}/${room}`;
        const url = `${this.baseUrl}/api/rooms/${encodeURIComponent(fullRoom)}/tiles`;
        const body = {
            title,
            content,
            tags: tags ?? ['jester', 'ideation'],
            timestamp: new Date().toISOString(),
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const errorText = await response.text().catch(() => 'unknown error');
                return { success: false, error: `PLATO API error: ${response.status} — ${errorText}` };
            }
            return { success: true };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { success: false, error: `PLATO connection error: ${message}` };
        }
    }
    /**
     * Pull context from a PLATO room to prime ideation.
     */
    async pullRoomContext(room, limit = 5) {
        const fullRoom = `${this.roomPrefix}/${room}`;
        const url = `${this.baseUrl}/api/rooms/${encodeURIComponent(fullRoom)}/tiles?limit=${limit}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const errorText = await response.text().catch(() => 'unknown error');
                return { success: false, error: `PLATO API error: ${response.status} — ${errorText}` };
            }
            const data = (await response.json());
            return { success: true, tiles: data.tiles ?? [] };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { success: false, error: `PLATO connection error: ${message}` };
        }
    }
    /**
     * List rooms the jester has access to.
     */
    async listRooms() {
        const url = `${this.baseUrl}/api/rooms?prefix=${encodeURIComponent(this.roomPrefix)}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                return { success: false, error: `PLATO API error: ${response.status}` };
            }
            const data = (await response.json());
            return { success: true, rooms: data.rooms ?? [] };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { success: false, error: `PLATO connection error: ${message}` };
        }
    }
    /**
     * Check if the PLATO server is reachable.
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseUrl}/api/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000),
            });
            return { alive: response.ok };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { alive: false, error: message };
        }
    }
}
exports.PlatoHttpBridge = PlatoHttpBridge;
//# sourceMappingURL=bridge.js.map