import { MoreHorizontal } from "lucide-react";
import type { MusicTrack } from "../../../types/MusicTrack";

export interface Song {
    id: string;
    title: string;
    artist: string;
    coverUrl?: string;
}

type SongCardProps = {
    song: Pick<MusicTrack, "id" | "title" | "artist" | "coverUrl">;
    onClick?: () => void;
    onMoreClick?: () => void;
};

export default function SongCard({
    song,
    onClick,
    onMoreClick,
}: SongCardProps) {
    return (
        <div
            onClick={onClick}
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5"
        >
            {/* Album Cover */}
            <img
                src={song.coverUrl || "/assets/images/default-cover.png"}
                alt={song.title}
                className="h-14 w-14 shrink-0 rounded-lg object-cover"
            />

            {/* Song Information */}
            <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium text-white">
                    {song.title}
                </h3>

                <p className="mt-1 truncate text-xs text-white/50">
                    {song.artist}
                </p>
            </div>

            {/* More Options */}
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