
import type { MusicTrack } from "../types/MusicTrack";

const CACHE_KEY = "music-library-cache";

export function getCachedSongs(): MusicTrack[] {
    try {
        const cached = localStorage.getItem(CACHE_KEY);

        if (!cached) {
            return [];
        }

        return JSON.parse(cached) as MusicTrack[];
    } catch (error) {
        console.error("Failed to load music cache:", error);
        return [];
    }
}

export function saveCachedSongs(songs: MusicTrack[]): void {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(songs));
    } catch (error) {
        console.error("Failed to save music cache:", error);
    }
}
