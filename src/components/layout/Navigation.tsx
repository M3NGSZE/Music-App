import { Home, Library, Search, ListMusic, Settings } from "lucide-react"

const navigationItems = [
    { label: "Home", icon: Home },
    { label: "Library", icon: Library },
    { label: "Search", icon: Search },
    { label: "ListMusic", icon: ListMusic },
    { label: "Settings", icon: Settings }
];

export default function Nagivation() {
    return (
        <nav>
            { navigationItems.map((item) => {
                const Icon = item.icon

                return (
                    <button 
                        key={ item.label }
                    >
                        <Icon size={22} strokeWidth={1.8}/>
                        <span> { item.label }</span>
                    </button>
                )
            })}
        </nav>
    )
}