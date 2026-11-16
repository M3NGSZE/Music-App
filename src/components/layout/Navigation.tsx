import { Home, Library, Search } from "lucide-react";
import { NavLink } from "react-router";

const navigationItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Library", icon: Library, path: "/library" },
    { label: "Search", icon: Search, path: "/search" }
];

export default function Nagivation() {
    return (
        <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center gap-2 w-[90%] max-w-md p-2 rounded-full
                        bg-white/0.08 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
            {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => `flex flex-1 flex-col items-center justify-center gap-1 rounded-full transition-all duration-300 py-2
                                    ${isActive ? "bg-purple-400/20 text-purple-300 shadow-inner shadow-white/10" : "text-white/50 hover:text-white/90" }`} 
                    >
                        <Icon size={22} strokeWidth={1.6} />
                        <span className="text-xs font-medium">{item.label}</span>
                    </NavLink>
                );
            })}
        </nav>
    );
}
