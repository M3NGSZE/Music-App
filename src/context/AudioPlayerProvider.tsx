import { useEffect, useRef, useState, type ReactNode } from "react";
import { AudioPlayerContext } from "./AudioPlayerContext";

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  async function play(source: Blob | string) {
    const audio = audioRef.current;

    console.log("PLAY called");
    console.log("Audio element:", audio);
    console.log("Source:", source);

    if (!audio) return;

    // Release the previous temporary URL.
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    let audioSource: string;

    if (source instanceof Blob) {
      audioSource = URL.createObjectURL(source);
      objectUrlRef.current = audioSource;
    } else {
      audioSource = source;
    }

    audio.src = audioSource;
    audio.load();

    try {
      await audio.play();
      console.log("Playback started");
    } catch (error) {
      console.error("PLAY failed:", error);
    }
  }

  function pause() {
    audioRef.current?.pause();
  }

  async function resume() {
    const audio = audioRef.current;

    console.log("RESUME called");
    console.log("Audio source:", audio?.src);
    console.log("Audio paused:", audio?.paused);
    console.log("Audio readyState:", audio?.readyState);

    if (!audio || !audio.src || !audio.paused) return;

    try {
      await audio.play();
      console.log("RESUME successful");
    } catch (error) {
      console.error("RESUME failed:", error);
    }
  }

  useEffect(() => {
    return () => {
      const audio = audioRef.current;

      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        play,
        pause,
        resume,
      }}
    >
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />

      {children}
    </AudioPlayerContext.Provider>
  );
}
