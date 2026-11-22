
import { useState } from "react";
import {
    ArrowDownWideNarrow,
    ChevronDown,
    Check
} from "lucide-react";

export type LibrarySortOption =
    | "A-Z"
    | "Date Added"
    | "Artist";

interface LibrarySortProps {
    sortBy: LibrarySortOption;
    onSortChange: (sort: LibrarySortOption) => void;
}

const LibrarySort = ({
    sortBy,
    onSortChange
}: LibrarySortProps) => {

    const [isOpen, setIsOpen] = useState(false);

    const sortOptions: LibrarySortOption[] = [
        "A-Z",
        "Date Added",
        "Artist"
    ];

    return (
        <div className="relative inline-block">

            {/* Dropdown trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-35 shrink-0 items-center justify-between gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 
                text-white backdrop-blur-xl shadow-lg transition-all hover:bg-white/15"
            >
                <ArrowDownWideNarrow size={18} />

                <span className="text-sm whitespace-nowrap">
                    {sortBy}
                </span>

                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown options */}
            {isOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 min-w-35 overflow-hidden rounded-2xl border border-white/15 bg-neutral-900/90 p-2 shadow-xl backdrop-blur-xl">

                    {sortOptions.map((option) => (
                        <button
                            key={option}
                            onClick={() => {
                                onSortChange(option);
                                setIsOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors ${
                                sortBy === option
                                    ? "bg-white/15 text-white"
                                    : "text-white/60 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {option}

                            {sortBy === option && (
                                <Check size={16} />
                            )}
                        </button>
                    ))}

                </div>
            )}

        </div>
    );
};

export default LibrarySort;
