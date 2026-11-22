import { createContext } from "react";

export  interface AudioPlayerContextType {
    isPlaying: boolean;
    play: (source: Blob | string) => Promise<void>;
    pause: () => void;
    resume: () => Promise<void>;
}

export const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);