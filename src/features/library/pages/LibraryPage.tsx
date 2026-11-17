import { useState } from "react";
import MainHeader from "../../../components/layout/MainHeader";
import LibraryTabs, { type LibraryTab } from "../components/LibraryTabs";
import SongList from "../components/SongList";
import PlayList from "../components/Playlist";
import FavoriteList from "../components/FavoriteList";
import ArtistList from "../components/ArtistList";
import AlbumList from "../components/AlbumList";

export function LibraryPage() {

    const [activeTab, setActiveTab] = useState<LibraryTab>("Songs");

    return (
        <div>
            <MainHeader title="Library" />

            <LibraryTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "Songs" && <SongList />}

            {activeTab === "Songs" && <PlayList />}

            {activeTab === "Songs" && <FavoriteList />}

            {activeTab === "Albums" && <ArtistList />}

            {activeTab === "Artists" && <AlbumList />}
        </div>
    );
}