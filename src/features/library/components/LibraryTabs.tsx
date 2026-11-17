
export type LibraryTab =
    | "Songs"
    | "Playlists"
    | "Favorites"
    | "Artists"
    | "Albums";

interface LibraryTabsProps {
    activeTab: LibraryTab;
    onTabChange: (tab: LibraryTab) => void;
}

const LibraryTabs = ({
    activeTab,
    onTabChange
}: LibraryTabsProps) => {

    const tabs: LibraryTab[] = [
        "Songs",
        "Playlists",
        "Favorites",
        "Artists",
        "Albums"
    ];

    return (
        <div className="flex gap-2">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={activeTab === tab ? "active" : ""}
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}

export default LibraryTabs;