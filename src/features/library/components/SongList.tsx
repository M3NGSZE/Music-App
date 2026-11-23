
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

    const listRef = useRef<HTMLDivElement | null>(null);

    const [scrollMargin, setScrollMargin] = useState(0);

    // async function handleDiscoverMusic() {
    //     try {
    //         setLoading(true);
    //         setError(null);

    //         const result = await refreshLocalSongs();

    //         const tracks: MusicTrack[] = result.map((song) => ({
    //             id: song.id,
    //             title: song.title || song.name,
    //             artist: song.artist,
    //             album: song.album,
    //             duration: song.duration,
    //             source: song.uri,
    //             fileName: song.name,
    //             dateAdded: Date.now(),
    //             isFavorite: false,
    //         }));

    //         setSongs(tracks);
    //         saveCachedSongs(tracks);

    //         console.log("Discovered local music:", tracks);
    //     } catch (error) {
    //         console.error("Music discovery failed:", error);

    //         setError(
    //             error instanceof Error
    //                 ? error.message
    //                 : "Unable to discover device music."
    //         );
    //     } finally {
    //         setLoading(false);
    //     }
    // }

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
        getScrollElement: () =>
            document.getElementById("main-scroll-container"),
        estimateSize: () => 72,
        overscan: 20,
        scrollMargin,
    });

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            const scrollContainer = document.getElementById(
                "main-scroll-container"
            );
            const listElement = listRef.current;

            if (!scrollContainer || !listElement) return;

            const offset =
                listElement.getBoundingClientRect().top -
                scrollContainer.getBoundingClientRect().top +
                scrollContainer.scrollTop;

            setScrollMargin(offset);
        });

        return () => cancelAnimationFrame(frame);
    }, [songs.length, loading, error]);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            console.log(
                "VIRTUALIZATION CHECK:",
                JSON.stringify({
                    totalSongs: songs.length,
                    renderedRows: rowVirtualizer.getVirtualItems().length,
                    totalVirtualHeight: rowVirtualizer.getTotalSize(),
                    scrollContainer: Boolean(
                        document.getElementById("main-scroll-container")
                    ),
                })
            );
        });

        return () => cancelAnimationFrame(frame);
    }, [songs.length, rowVirtualizer]);
    
    return (
        <div className="flex flex-col">
            <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm">
                    {songs.length} songs
                </span>

                <LibrarySort
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />
            </div>

            {/* <button
                onClick={handleDiscoverMusic}
                disabled={loading}
                className="mb-4 rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
                {loading
                    ? "Refreshing..."
                    : "Refresh Device Music"}
            </button>

            {loading && songs.length > 0 && (
                <p className="mb-3 text-xs text-white/50">
                    Updating your music library...
                </p>
            )}

            {error && (
                <p className="mb-3 text-sm text-red-500">
                    {error}
                </p>
            )} */}

            {songs.length === 0 && !loading && (
                <p className="py-6 text-center text-sm text-white/50">
                    No songs discovered yet.
                </p>
            )}

            <div className="flex flex-col gap-2">
                <div
                    ref={listRef}
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
                                    transform: `translateY(${
                                        virtualRow.start - scrollMargin
                                    }px)`,
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
