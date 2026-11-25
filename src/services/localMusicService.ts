
import { registerPlugin } from "@capacitor/core";

export interface LocalMusic {
    id: string;
    title: string;
    artist: string;
    album: string;
    albumId: number;
    duration: number;
    mimeType: string;
    name: string;
    size: number;
    uri: string;
    coverUri?: string | null;
}

interface LocalMusicPlugin {
    getSongs(options: {
        offset: number;
        limit: number;
    }): Promise<{
        songs: LocalMusic[];
        offset: number;
        limit: number;
        hasMore: boolean;
    }>;
}

const NativeLocalMusic =
    registerPlugin<LocalMusicPlugin>("LocalMusic");

const BATCH_SIZE = 100;

export async function getLocalSongs(): Promise<LocalMusic[]> {
    console.log("LOCAL MUSIC SCAN STARTED");

    const allSongs: LocalMusic[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
        const result = await NativeLocalMusic.getSongs({
            offset,
            limit: BATCH_SIZE,
        });

        allSongs.push(...result.songs);

        offset += result.songs.length;
        hasMore = result.hasMore;

        if (result.songs.length === 0) {
            break;
        }
    }

    console.log("Total songs loaded:", allSongs.length);

    return allSongs;
}

let discoveryPromise: Promise<LocalMusic[]> | null = null;

export function getLocalSongsOnce(): Promise<LocalMusic[]> {
    if (!discoveryPromise) {
        discoveryPromise = getLocalSongs().catch((error) => {
            discoveryPromise = null;
            throw error;
        });
    }

    return discoveryPromise;
}

export function refreshLocalSongs(): Promise<LocalMusic[]> {
    discoveryPromise = getLocalSongs().catch((error) => {
        discoveryPromise = null;
        throw error;
    });

    return discoveryPromise;
}
