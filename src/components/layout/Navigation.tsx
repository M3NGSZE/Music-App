import { Home, Library, Search } from "lucide-react";
import { NavLink } from "react-router";

const navigationItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Library", icon: Library, path: "/library" },
    { label: "Search", icon: Search, path: "/search" }
];

export default function Nagivation() {
    return (
        <nav className=" bg-amber-950 flex items-center justify-center">
            {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                        `${isActive ? "text-purple-400" : "text-gray-400"}`}
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
