import { useState } from "react";
import type { LibrarySortOption } from "./LibrarySort";
import LibrarySort from "./LibrarySort";
import SongCard, { type Song } from "./SongCard";

const songs: Song[] = [
    {
        id: "1",
        title: "Midnight City",
        artist: "M83",
        coverUrl: "public/assets/music/album-cover.jpg",
    },
    {
        id: "2",
        title: "Golden Hour",
        artist: "JVKE",
        coverUrl: "public/assets/music/album-cover.jpg",
    },
];
const SongList = () => {

    const [ sortBy, setSortBy ] = useState<LibrarySortOption>("A-Z");

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-2 mb-2">
                <span>67 songs</span>
                <LibrarySort
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />
            </div>
            <div className="flex flex-col gap-2">
            {songs.map((song) => (
                <SongCard
                    key={song.id}
                    song={song}
                    onClick={() => console.log("Play:", song.title)}
                    onMoreClick={() => console.log("More:", song.title)}
                />
            ))}
        </div>
        </div>
    )
}

export default SongList;