import { FastForward, Pause, Rewind, Play } from "lucide-react";
import { useAudioPlayer } from "../../context/useAudioPlayer";

export default function MiniPlayer() {
  const { isPlaying, currentTrack, pause, resume, playNext, playPrevious } =
    useAudioPlayer();

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        pause();
      } else {
        await resume();
      }
    } catch (error) {
      console.error("Audio playback error:", error);
    }
  };

  const handleNext = async () => {
    try {
      await playNext();
    } catch (error) {
      console.error("Next track playback error:", error);
    }
  };

  const handlePrevious = async () => {
    try {
      await playPrevious();
    } catch (error) {
      console.error("Previous track playback error:", error);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="w-[90%] max-w-md">
      <div className="flex items-center rounded-2xl border border-white/15 bg-white/8 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <div className="flex w-[70%] min-w-0 items-center gap-3">
          <img
            src={currentTrack.coverUrl || "/assets/images/default-cover.png"}
            alt={currentTrack.title}
            className="h-12 w-12 shrink-0 rounded-xl object-cover"
          />

          <div className="flex min-w-0 flex-col justify-center">
            <p className="truncate text-sm font-semibold text-white">
              {currentTrack.title}
            </p>

            <p className="truncate text-xs text-white/50">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        <div className="flex w-[30%] items-center justify-center gap-2">
          <button
            onClick={handlePrevious}
            className="text-white/70 transition hover:text-white"
            aria-label="Previous track"
          >
            <Rewind size={20} />
          </button>

          <button
            className="text-white transition hover:scale-110"
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>

          <button
            onClick={handleNext}
            className="text-white/70 transition hover:text-white"
            aria-label="Next track"
          >
            <FastForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
