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
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);

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
      console.log("Web playback resumed");
    } catch (error) {
      console.error("Web resume failed:", error);
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

      if (engineRef.current === "android") {
        pauseNativeAudio().catch(console.error);
      }

      releaseObjectUrl();
    };
  }, []);

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
