import { Home, Library, Search, ListMusic, Settings } from "lucide-react";

const navigationItems = [
    { label: "Home", icon: Home },
    { label: "Library", icon: Library },
    { label: "Search", icon: Search },
    { label: "Playlists", icon: ListMusic },
    { label: "Settings", icon: Settings },
];

export default function Nagivation() {
    return (
        <nav className=" bg-amber-200 flex items-center justify-center" >
            {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                    <button key={item.label} className="">
                        <div className="py-2 px-4 flex flex-col items-center justify-center gap-0">
                            <Icon size={22} strokeWidth={1.6} />
                            <span>{item.label}</span>
                        </div>
                    </button>
                );
            })}
        </nav>
    );
}
