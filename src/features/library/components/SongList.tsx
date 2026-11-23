
import { useEffect, useRef, useState } from "react";
import type { MusicTrack } from "../../../types/MusicTrack";
import {
    getCachedSongs,
    saveCachedSongs,
} from "../../../services/musicLibraryCache";
import { useAudioPlayer } from "../../../context/useAudioPlayer";
import type { LibrarySortOption } from "./LibrarySort";
import LibrarySort from "./LibrarySort";
import SongCard from "./SongCard";
import { getLocalSongsOnce } from "../../../services/localMusicService";
import { useVirtualizer } from "@tanstack/react-virtual";

const SongList = () => {
    const [sortBy, setSortBy] = useState<LibrarySortOption>("A-Z");
    const [songs, setSongs] = useState<MusicTrack[]>(() =>
        getCachedSongs()
    );
    const [loading, setLoading] = useState(() => getCachedSongs().length === 0);
    const [error, setError] = useState<string | null>(null);

    const { play } = useAudioPlayer();

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadMusic() {
            try {
                const result = await getLocalSongsOnce();

                if (cancelled) return;

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
                saveCachedSongs(tracks);

                console.log("Discovered local music:", tracks);
            } catch (error) {
                if (cancelled) return;

                console.error("Music discovery failed:", error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to discover device music."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadMusic();

        return () => {
            cancelled = true;
        };
    }, []);

    // eslint-disable-next-line react-hooks/incompatible-library
    const rowVirtualizer = useVirtualizer({
        count: songs.length,
        getScrollElement: () => scrollContainerRef.current,
        estimateSize: () => 72,
        overscan: 20,
    });

    return (
        <div className="flex h-full min-h-0 flex-col">

            {/* Fixed song list controls */}
            <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
                <span className="text-sm">
                    {songs.length} songs
                </span>

                <LibrarySort
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />
            </div>

            {loading && songs.length > 0 && (
                <p className="mb-3 shrink-0 text-xs text-white/50">
                    Updating your music library...
                </p>
            )}

            {error && (
                <p className="mb-3 shrink-0 text-sm text-red-500">
                    {error}
                </p>
            )}

            {/* Scrollable song cards */}
            <div
                ref={scrollContainerRef}
                className="min-h-0 flex-1 overflow-y-auto custom-scrollbar"
            >
                {songs.length === 0 && !loading && (
                    <p className="py-6 text-center text-sm text-white/50">
                        No songs discovered yet.
                    </p>
                )}

                <div
                    className="relative w-full"
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const song = songs[virtualRow.index];

                        return (
                            <div
                                key={song.id}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <SongCard
                                    song={song}
                                    onClick={() => play(song.source, song)}
                                    onMoreClick={() =>
                                        console.log("More:", song.title)
                                    }
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SongList;
