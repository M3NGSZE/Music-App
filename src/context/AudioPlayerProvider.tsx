import { useEffect, useRef, useState, type ReactNode } from "react";
import { Capacitor } from "@capacitor/core";

import { AudioPlayerContext } from "./AudioPlayerContext";
import {
  playNativeAudio,
  pauseNativeAudio,
  resumeNativeAudio,
} from "../services/nativeAudioPlayerService";
import type { MusicTrack } from "../types/MusicTrack";

interface AudioPlayerProviderProps {
  children: ReactNode;
}

type PlaybackEngine = "web" | "android" | null;

export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const engineRef = useRef<PlaybackEngine>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  // const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);

  const PLAYBACK_STORAGE_KEY = "music-player-last-track";
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(() => {
    try {
      const savedTrack = localStorage.getItem(PLAYBACK_STORAGE_KEY);

      return savedTrack ? (JSON.parse(savedTrack) as MusicTrack) : null;
    } catch (error) {
      console.error("Failed to restore last played track:", error);
      return null;
    }
  });

  function releaseObjectUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  async function play(source: Blob | string, track?: MusicTrack) {
    console.log("PLAY called:", source);

    if (track) {
      setCurrentTrack(track);
    }

    // Android MediaStore playback
    if (
      Capacitor.getPlatform() === "android" &&
      typeof source === "string" &&
      source.startsWith("content://")
    ) {
      const audio = audioRef.current;

      audio?.pause();
      audio?.removeAttribute("src");
      audio?.load();

      releaseObjectUrl();

      engineRef.current = "android";

      try {
        await playNativeAudio(source);
        setIsPlaying(true);

        console.log("Android native playback started");
      } catch (error) {
        setIsPlaying(false);
        console.error("Native playback failed:", error);
      }

      return;
    }

    // Web playback (also used for imported Blob files)
    if (engineRef.current === "android") {
      await pauseNativeAudio();
    }

    const audio = audioRef.current;

    if (!audio) return;

    releaseObjectUrl();

    let audioSource: string;

    if (source instanceof Blob) {
      audioSource = URL.createObjectURL(source);
      objectUrlRef.current = audioSource;
    } else {
      audioSource = source;
    }

    engineRef.current = "web";

    audio.src = audioSource;
    audio.load();

    try {
      await audio.play();
      console.log("Web playback started");
    } catch (error) {
      console.error("Web playback failed:", error);
    }
  }

  function pause() {
    if (engineRef.current === "android") {
      pauseNativeAudio()
        .then(() => setIsPlaying(false))
        .catch((error) => console.error("Native pause failed:", error));

      return;
    }

    audioRef.current?.pause();
  }

  async function resume() {
    // Player hasn't been initialized, restore the saved track.
    if (!engineRef.current && currentTrack) {
      await play(currentTrack.source, currentTrack);
      return;
    }

    if (engineRef.current === "android") {
      try {
        await resumeNativeAudio();
        setIsPlaying(true);
        console.log("Native playback resumed");
      } catch (error) {
        console.error("Native resume failed:", error);
      }

      return;
    }

    const audio = audioRef.current;

    if (!audio || !audio.src || !audio.paused) return;

    try {
      await audio.play();
    } catch (error) {
      console.error("Web resume failed:", error);
    }
  }

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const audio = audioRef.current;

      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }

      if (engineRef.current === "android") {
        pauseNativeAudio().catch(console.error);
      }

      releaseObjectUrl();
    };
  }, []);

  useEffect(() => {
    try {
      if (currentTrack) {
        localStorage.setItem(
          PLAYBACK_STORAGE_KEY,
          JSON.stringify(currentTrack),
        );
      } else {
        localStorage.removeItem(PLAYBACK_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to save last played track:", error);
    }
  }, [currentTrack]);

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        currentTrack,
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
