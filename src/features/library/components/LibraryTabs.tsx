
export type LibraryTab =
    | "Songs"
    | "Playlists"
    | "Favorites"
    | "Artists"
    | "Albums"
    | "Folders";

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
        "Albums",
        "Folders"
    ];

    return (
        <div className="flex gap-2 overflow-x-auto flex-nowrap whitespace-nowrap scrollbar-hide hide-scrollbar -mx-6 px-6">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`
                        flex shrink-0 items-center justify-center
                        rounded-full border px-5 py-1.5
                        backdrop-blur-xl shadow-lg
                        transition-all duration-200 text-sm
                        ${
                            activeTab === tab
                                ? "border-white/30 bg-white/25 text-white"
                                : "border-white/15 bg-white/10 text-white/60 hover:bg-white/15"
                        }
                    `}
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}

export default LibraryTabs;