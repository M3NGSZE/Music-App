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

type PlaybackEngine = "web" | "native" | null;

export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const engineRef = useRef<PlaybackEngine>(null);

  const [isPlaying, setIsPlaying] = useState(false);

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

  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

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

    // Native playback for Android and iOS
    const platform = Capacitor.getPlatform();

    const isAndroidNative =
      platform === "android" &&
      typeof source === "string" &&
      source.startsWith("content://");

    const isIOSNative =
      platform === "ios" &&
      typeof source === "string" &&
      source.startsWith("file://");

    if (isAndroidNative || isIOSNative) {
      const audio = audioRef.current;

      audio?.pause();
      audio?.removeAttribute("src");
      audio?.load();

      releaseObjectUrl();

      engineRef.current = "native";

      try {
        await playNativeAudio(source);
        setIsPlaying(true);
        console.log(`${platform} native playback started`);
      } catch (error) {
        setIsPlaying(false);
        engineRef.current = null;
        console.error("Native playback failed:", error);
      }

      return;
    }

    // Web playback (also used for imported Blob files)
    if (engineRef.current === "native") {
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

    setIsPlaying(false);

    audio.src = audioSource;
    audio.load();

    try {
      await audio.play();
      setIsPlaying(true);
      console.log("Web playback started");
    } catch (error) {
      setIsPlaying(false);
      console.error("Web playback failed:", error);
    }
  }

  function pause() {
    if (engineRef.current === "native") {
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

    if (engineRef.current === "native") {
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

  async function playQueue(tracks: MusicTrack[], index: number) {
    const selectedTrack = tracks[index];

    if (!selectedTrack) return;

    setQueue(tracks);
    setCurrentIndex(index);

    await play(selectedTrack.source, selectedTrack);
  }

  async function playNext() {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) return;

    const nextTrack = queue[nextIndex];

    setCurrentIndex(nextIndex);
    await play(nextTrack.source, nextTrack);
  }

  async function playPrevious() {
    const previousIndex = currentIndex - 1;

    if (previousIndex < 0) return;

    const previousTrack = queue[previousIndex];

    setCurrentIndex(previousIndex);
    await play(previousTrack.source, previousTrack);
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

      if (engineRef.current === "native") {
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
        queue,
        play,
        playQueue,
        playNext,
        playPrevious,
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
