
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
    const result = await LocalMusicPlugin.getSongs();

    return result.songs;
}
