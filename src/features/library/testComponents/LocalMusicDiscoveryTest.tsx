
import { useState } from "react";
import {
    getLocalSongs,
    type LocalMusic,
} from "../../../services/localMusicService";
//import { useAudioPlayer } from "../../../context/useAudioPlayer";
import { playNativeAudio } from "../../../services/nativeAudioPlayerService";

export default function LocalMusicDiscoveryTest() {
    const [songs, setSongs] = useState<LocalMusic[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //const { play } = useAudioPlayer();

    async function handleDiscoverMusic() {
        try {
            setLoading(true);
            setError(null);

            const result = await getLocalSongs();

            setSongs(result);

            console.log("Discovered local music:", result);
        } catch (error) {
            console.error("Local music discovery failed:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to discover local music."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleNativePlay(uri: string) {
        try {
            await playNativeAudio(uri);
            console.log("Native playback started");
        } catch (error) {
            console.error("Native playback failed:", error);
        }
    }

    return (
        <div className="flex flex-col gap-3 rounded-xl border p-4">

            <h2 className="text-lg font-semibold">
                Local Music Discovery Test
            </h2>

            <button
                onClick={handleDiscoverMusic}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
                {loading ? "Discovering..." : "Discover Device Music"}
            </button>

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}

            <p className="text-sm">
                Found {songs.length} songs
            </p>

            {songs.slice(0, 5).map((song) => (
                <div
                        key={song.id}
                        className="border-b py-2"
                    >
                        <p className="font-medium">
                            {song.title || song.name}
                        </p>

                        <p className="text-sm text-gray-500">
                            {song.artist} · {song.album}
                        </p>

                        <p className="text-xs text-gray-400">
                            {Math.floor(song.duration / 1000)} seconds
                        </p>

                        <button
                            onClick={() => handleNativePlay(song.uri)}
                            className="rounded-lg bg-green-600 px-3 py-1 text-white"
                        >
                            Test                
                        </button>
                    </div>  
            ))}

        </div>
    );
}
