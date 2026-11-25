
import {
    registerPlugin,
    type PluginListenerHandle,
} from "@capacitor/core";

interface NativeAudioPlayerPlugin {
    play(options: { uri: string }): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;

    addListener(
        eventName: "playbackCompleted",
        listener: () => void
    ): Promise<PluginListenerHandle>;
}

const NativeAudioPlayer =
    registerPlugin<NativeAudioPlayerPlugin>("NativeAudioPlayer");

export async function playNativeAudio(uri: string): Promise<void> {
    await NativeAudioPlayer.play({ uri });
}

export async function pauseNativeAudio(): Promise<void> {
    await NativeAudioPlayer.pause();
}

export async function resumeNativeAudio(): Promise<void> {
    await NativeAudioPlayer.resume();
}

export function addNativePlaybackCompletedListener(
    callback: () => void
): Promise<PluginListenerHandle> {
    return NativeAudioPlayer.addListener("playbackCompleted", callback);
}
