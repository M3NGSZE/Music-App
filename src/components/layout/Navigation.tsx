import { Home, Library, Search, ListMusic, Settings } from "lucide-react";
import { NavLink } from "react-router";

const navigationItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Library", icon: Library, path: "/library" },
    { label: "Search", icon: Search, path: "/search" },
    { label: "Playlists", icon: ListMusic, path: "/playlists" },
    { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Nagivation() {
    return (
        <nav className=" bg-amber-200 flex items-center justify-center">
            {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className=""
                    >
                        <div className="py-2 px-4 flex flex-col items-center justify-center gap-0">
                            <Icon size={22} strokeWidth={1.6} />
                            <span>{item.label}</span>
                        </div>
                    </NavLink>
                );
            })}
        </nav>
    );
}
