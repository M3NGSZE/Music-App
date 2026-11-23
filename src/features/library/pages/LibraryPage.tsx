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

            <div className={activeTab === "Songs" ? "block" : "hidden"}>
                <SongList />
            </div>

            <div className={activeTab === "Playlists" ? "block" : "hidden"}>
                <PlayList />
            </div>

            <div className={activeTab === "Favorites" ? "block" : "hidden"}>
                <FavoriteList />
            </div>

            <div className={activeTab === "Artists" ? "block" : "hidden"}>
                <ArtistList />
            </div>

            <div className={activeTab === "Albums" ? "block" : "hidden"}>
                <AlbumList />
            </div>

            <div className={activeTab === "Folders" ? "block" : "hidden"}>
                <FolderList />
            </div>

        </div>
    );
}