package com.m3ngsze.sentry.musicplayer.plugins;

import android.Manifest;
import android.os.Build;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PermissionState;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import com.m3ngsze.sentry.musicplayer.music.MusicRepository;

@CapacitorPlugin(
        name = "LocalMusic",
        permissions = {
                @Permission(
                        alias = "audio13",
                        strings = { Manifest.permission.READ_MEDIA_AUDIO }
                ),
                @Permission(
                        alias = "audioLegacy",
                        strings = { Manifest.permission.READ_EXTERNAL_STORAGE }
                )
        }
)
public class LocalMusicPlugin extends Plugin {
    private MusicRepository musicRepository;

    @Override
    public void load() {
        musicRepository = new MusicRepository(getContext());
    }

    @PluginMethod
    public void getSongs(PluginCall call) {

        String permissionAlias =
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
                        ? "audio13"
                        : "audioLegacy";

        if (getPermissionState(permissionAlias) != PermissionState.GRANTED) {
            requestPermissionForAlias(
                    permissionAlias,
                    call,
                    "permissionCallback"
            );
            return;
        }

        loadSongs(call);
    }

    @PermissionCallback
    private void permissionCallback(PluginCall call) {

        String permissionAlias =
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
                        ? "audio13"
                        : "audioLegacy";

        if (getPermissionState(permissionAlias) == PermissionState.GRANTED) {
            loadSongs(call);
        } else {
            call.reject("Audio permission was denied.");
        }
    }

    private void loadSongs(PluginCall call) {

        int offset = call.getInt("offset", 0);
        int limit = call.getInt("limit", 100);

        if (offset < 0 || limit <= 0 || limit > 500) {
            call.reject("Invalid pagination parameters.");
            return;
        }

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                call.resolve(musicRepository.getSongs(offset, limit));
            }
        } catch (Exception error) {
            call.reject("Unable to retrieve local music.", error);
        }
    }
}
