package com.m3ngsze.sentry.musicplayer;

import android.Manifest;
import android.content.ContentUris;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PermissionState;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

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

        JSArray songs = new JSArray();

        String[] projection = {
                MediaStore.Audio.Media._ID,
                MediaStore.Audio.Media.TITLE,
                MediaStore.Audio.Media.ARTIST,
                MediaStore.Audio.Media.ALBUM,
                MediaStore.Audio.Media.DURATION,
                MediaStore.Audio.Media.MIME_TYPE,
                MediaStore.Audio.Media.DISPLAY_NAME,
                MediaStore.Audio.Media.SIZE
        };

        String selection = MediaStore.Audio.Media.IS_MUSIC + " != 0";

        String sortOrder = MediaStore.Audio.Media.TITLE + " ASC";

        try (Cursor cursor = getContext().getContentResolver().query(
                MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                projection,
                selection,
                null,
                sortOrder
        )) {

            if (cursor != null) {

                while (cursor.moveToNext()) {

                    long id = cursor.getLong(
                            cursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID)
                    );

                    Uri contentUri = ContentUris.withAppendedId(
                            MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                            id
                    );

                    JSObject song = new JSObject();

                    song.put("id", String.valueOf(id));
                    song.put("title", cursor.getString(
                            cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)
                    ));
                    song.put("artist", cursor.getString(
                            cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)
                    ));
                    song.put("album", cursor.getString(
                            cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)
                    ));
                    song.put("duration", cursor.getLong(
                            cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)
                    ));
                    song.put("mimeType", cursor.getString(
                            cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.MIME_TYPE)
                    ));
                    song.put("name", cursor.getString(
                            cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DISPLAY_NAME)
                    ));
                    song.put("size", cursor.getLong(
                            cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.SIZE)
                    ));
                    song.put("uri", contentUri.toString());

                    songs.put(song);
                }
            }

            JSObject result = new JSObject();
            result.put("songs", songs);

            call.resolve(result);

        } catch (Exception error) {
            call.reject("Unable to retrieve local music.", error);
        }
    }
}
