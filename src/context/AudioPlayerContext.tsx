
import { createContext } from "react";
import type { MusicTrack } from "../types/MusicTrack";

export interface AudioPlayerContextType {
    isPlaying: boolean;
    currentTrack: MusicTrack | null;
    play: (source: Blob | string, track?: MusicTrack) => Promise<void>;
    pause: () => void;
    resume: () => Promise<void>;
}

export const AudioPlayerContext =
    createContext<AudioPlayerContextType | null>(null);
