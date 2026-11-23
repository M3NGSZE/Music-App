
import { MoreHorizontal } from "lucide-react";
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
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5"
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

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onMoreClick?.();
                }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={`More options for ${song.title}`}
            >
                <MoreHorizontal size={21} />
            </button>
        </div>
    );
}
