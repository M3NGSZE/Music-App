
import { registerPlugin } from "@capacitor/core";

export interface LocalMusic {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: number;
    mimeType: string;
    name: string;
    size: number;
    uri: string;
}

interface LocalMusicPlugin {
    getSongs(): Promise<{
        songs: LocalMusic[];
    }>;
}

const LocalMusicPlugin =
    registerPlugin<LocalMusicPlugin>("LocalMusic");

export async function getLocalSongs(): Promise<LocalMusic[]> {
    console.log("ANDROID MUSIC SCAN STARTED");
    const result = await LocalMusicPlugin.getSongs();

    return result.songs;
}


let discoveryPromise: Promise<LocalMusic[]> | null = null;

// Reuse the same discovery request during this app session.
export function getLocalSongsOnce(): Promise<LocalMusic[]> {
    if (!discoveryPromise) {
        discoveryPromise = getLocalSongs().catch((error) => {
            discoveryPromise = null;
            throw error;
        });
    }

    return discoveryPromise;
}

// Force a new scan when the user manually refreshes.
export function refreshLocalSongs(): Promise<LocalMusic[]> {
    discoveryPromise = getLocalSongs().catch((error) => {
        discoveryPromise = null;
        throw error;
    });

    return discoveryPromise;
}
