package com.m3ngsze.sentry.musicplayer.plugins;

import android.media.MediaPlayer;
import android.net.Uri;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NativeAudioPlayer")
public class NativeAudioPlayerPlugin extends Plugin {
    private MediaPlayer mediaPlayer;

    @PluginMethod
    public void play(PluginCall call) {
        String uriString = call.getString("uri");

        if (uriString == null || uriString.isEmpty()) {
            call.reject("Audio URI is required.");
            return;
        }

        try {
            releasePlayer();

            mediaPlayer = new MediaPlayer();

            mediaPlayer.setOnPreparedListener(player -> {
                player.start();
                call.resolve();
            });

            mediaPlayer.setOnErrorListener((player, what, extra) -> {
                call.reject("Unable to play audio. Error: " + what);
                releasePlayer();
                return true;
            });

            Uri uri = Uri.parse(uriString);

            mediaPlayer.setDataSource(getContext(), uri);
            mediaPlayer.prepareAsync();

        } catch (Exception error) {
            releasePlayer();
            call.reject("Unable to prepare audio.", error);
        }
    }

    @PluginMethod
    public void pause(PluginCall call) {
        if (mediaPlayer != null && mediaPlayer.isPlaying()) {
            mediaPlayer.pause();
        }

        call.resolve();
    }

    @PluginMethod
    public void resume(PluginCall call) {
        if (mediaPlayer != null && !mediaPlayer.isPlaying()) {
            mediaPlayer.start();
        }

        call.resolve();
    }

    private void releasePlayer() {
        if (mediaPlayer != null) {
            mediaPlayer.release();
            mediaPlayer = null;
        }
    }

    @Override
    protected void handleOnDestroy() {
        releasePlayer();
    }
}
