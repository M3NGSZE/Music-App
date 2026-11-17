import { useState } from "react";
import MainHeader from "../../../components/layout/MainHeader";
import LibraryTabs, { type LibraryTab } from "../components/LibraryTabs";
import SongList from "../components/SongList";
import FavoriteList from "../components/FavoriteList";
import ArtistList from "../components/ArtistList";
import AlbumList from "../components/AlbumList";
import PlayList from "../components/PlayList";

export function LibraryPage() {

    const [activeTab, setActiveTab] = useState<LibraryTab>("Songs");

    return (
        <div>
            <MainHeader title="Library" />

            <br />
            <LibraryTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "Songs" && <SongList />}

            {activeTab === "Playlists" && <PlayList />}

            {activeTab === "Favorites" && <FavoriteList />}

            {activeTab === "Artists" && <ArtistList />}

            {activeTab === "Albums" && <AlbumList />}
        </div>
    );
}