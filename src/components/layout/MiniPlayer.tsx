import { FastForward, Pause, Rewind, Play } from "lucide-react";
import { useState } from "react";

export default function MiniPlayer() {

  const [ isPlaying, setIsPlaying ] = useState( true );

  const handlePlayPause = () => {
    setIsPlaying( ( previous ) => !previous );
  };

    return (
      <div className="w-[90%] max-w-md">
        <div
          className="flex items-center rounded-2xl border border-white/15 bg-white/8
                    backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-2"
        >
          {/* Track information */}
          <div className="flex w-[70%] min-w-0 items-center gap-3">
            <img
              src="/assets/music/album-cover.jpg"
              alt="Album cover"
              className="h-12 w-12 shrink-0 rounded-xl object-cover"
            />
            <div className="flex min-w-0 flex-col justify-center">
              <p className="truncate text-sm font-semibold text-white">
                Music Title
              </p>
              <p className="truncate text-xs text-white/50">Artist Name</p>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center justify-center w-[30%] gap-2 ">
            <button className="text-white/70 transition hover:text-white">
              <Rewind size={20} />
            </button>

            <button
              className="text-white transition hover:scale-110"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause size={22} /> : <Play size={22} />}
            </button>

            <button className="text-white/70 transition hover:text-white">
              <FastForward size={20} />
            </button>
          </div>
        </div>
      </div>
    );
}