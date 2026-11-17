import { useState } from "react";
import type { LibrarySortOption } from "./LibrarySort";
import LibrarySort from "./LibrarySort";

const SongList = () => {

    const [ sortBy, setSortBy ] = useState<LibrarySortOption>("A-Z");

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-2">
                <span>67 songs</span>
                <LibrarySort
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />
            </div>
        </div>
    )
}

export default SongList;