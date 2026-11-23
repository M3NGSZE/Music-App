
import { useState } from "react";
import type { MusicTrack } from "../../../types/MusicTrack";
import { getLocalSongs } from "../../../services/localMusicService";
import { useAudioPlayer } from "../../../context/useAudioPlayer";
import type { LibrarySortOption } from "./LibrarySort";
import LibrarySort from "./LibrarySort";
import SongCard from "./SongCard";

const SongList = () => {
    const [sortBy, setSortBy] = useState<LibrarySortOption>("A-Z");
    const [songs, setSongs] = useState<MusicTrack[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { play } = useAudioPlayer();

    async function handleDiscoverMusic() {
        try {
            setLoading(true);
            setError(null);

            const result = await getLocalSongs();

            const tracks: MusicTrack[] = result.map((song) => ({
                id: song.id,
                title: song.title || song.name,
                artist: song.artist,
                album: song.album,
                duration: song.duration,
                source: song.uri,
                fileName: song.name,
                dateAdded: Date.now(),
                isFavorite: false,
            }));

            setSongs(tracks);

            console.log("Discovered local music:", tracks);
        } catch (error) {
            console.error("Music discovery failed:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to discover device music."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col">
            <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm">{songs.length} songs</span>

                <LibrarySort
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />
            </div>

            <button
                onClick={handleDiscoverMusic}
                disabled={loading}
                className="mb-4 rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
                {loading ? "Discovering..." : "Discover Device Music"}
            </button>

            {error && (
                <p className="mb-3 text-sm text-red-500">{error}</p>
            )}

            {songs.length === 0 && !loading && (
                <p className="py-6 text-center text-sm text-white/50">
                    No songs discovered yet.
                </p>
            )}

            <div className="flex flex-col gap-2">
                {songs.map((song) => (
                    <SongCard
                        key={song.id}
                        song={song}
                        onClick={() => play(song.source, song)}
                        onMoreClick={() =>
                            console.log("More:", song.title)
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default SongList;
