
import { MoreVertical } from "lucide-react";
import type { MusicTrack } from "../../../types/MusicTrack";

type SongCardProps = {
    song: Pick<MusicTrack, "id" | "title" | "artist" | "coverUrl">;
    isActive?: boolean;
    onClick?: () => void;
    onMoreClick?: () => void;
};

export default function SongCard({
    song,
    isActive = false,
    onClick,
    onMoreClick,
}: SongCardProps) {
    return (
        <div
            onClick={onClick}
            className="flex items-center gap-3 rounded-xl py-2 pl-2 pr-0 transition-colors hover:bg-white/5"
        >
            <img
                src={song.coverUrl || "/assets/images/default-cover.png"}
                alt={song.title}
                className="h-14 w-14 shrink-0 rounded-lg object-cover"
            />

            <div className="min-w-0 flex-1">
                <h3
                    className={`truncate text-sm font-medium ${
                        isActive ? "text-purple-300" : "text-white"
                    }`}
                >
                    {song.title}
                </h3>

                <p
                    className={`mt-1 truncate text-xs ${
                        isActive ? "text-purple-300" : "text-white/50"
                    }`}
                >
                    {song.artist}
                </p>
            </div>

            {isActive && (
                <div
                    className="flex h-5 shrink-0 items-center gap-0.5"
                    aria-label="Currently playing"
                >
                    <span className="h-2 w-0.5 animate-music-bar rounded-full bg-purple-400 [animation-delay:0ms]" />
                    <span className="h-4 w-0.5 animate-music-bar rounded-full bg-purple-400 [animation-delay:150ms]" />
                    <span className="h-3 w-0.5 animate-music-bar rounded-full bg-purple-400 [animation-delay:300ms]" />
                </div>
            )}

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onMoreClick?.();
                }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={`More options for ${song.title}`}
            >
                <MoreVertical size={21} />
            </button>
        </div>
    );
}
