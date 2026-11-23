import { useState } from "react";
import MainHeader from "../../../components/layout/MainHeader";
import LibraryTabs, { type LibraryTab } from "../components/LibraryTabs";
import SongList from "../components/SongList";
import FavoriteList from "../components/FavoriteList";
import ArtistList from "../components/ArtistList";
import AlbumList from "../components/AlbumList";
import PlayList from "../components/PlayList";
import FolderList from "../components/FolderList";

export function LibraryPage() {

    const [activeTab, setActiveTab] = useState<LibraryTab>("Songs");

    return (
        <div className="flex flex-col gap-6">
            
            <MainHeader title="Library" />

            <LibraryTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "Songs" && <SongList />}

            {activeTab === "Playlists" && <PlayList />}

            {activeTab === "Favorites" && <FavoriteList />}

            {activeTab === "Artists" && <ArtistList />}

            {activeTab === "Albums" && <AlbumList />}

            {activeTab === "Folders" && <FolderList />}

        </div>
    );
}