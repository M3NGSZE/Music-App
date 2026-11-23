package com.m3ngsze.sentry.musicplayer.music;

import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;

import androidx.annotation.RequiresApi;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
public class MusicRepository {
    private final ContentResolver resolver;

    public MusicRepository(Context context) {
        resolver = context.getContentResolver();
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public JSObject getSongs(int offset, int limit) {

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

        Bundle queryArgs = new Bundle();

        queryArgs.putString(
                ContentResolver.QUERY_ARG_SQL_SELECTION,
                MediaStore.Audio.Media.IS_MUSIC + " != 0"
        );

        queryArgs.putString(
                ContentResolver.QUERY_ARG_SQL_SORT_ORDER,
                MediaStore.Audio.Media.TITLE + " ASC"
        );

        queryArgs.putInt(ContentResolver.QUERY_ARG_LIMIT, limit);
        queryArgs.putInt(ContentResolver.QUERY_ARG_OFFSET, offset);

        Uri collection = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;

        try (Cursor cursor = resolver.query(
                collection,
                projection,
                queryArgs,
                null
        )) {

            if (cursor != null) {
                while (cursor.moveToNext()) {

                    long id = cursor.getLong(
                            cursor.getColumnIndexOrThrow(
                                    MediaStore.Audio.Media._ID
                            )
                    );

                    Uri contentUri = ContentUris.withAppendedId(
                            collection,
                            id
                    );

                    JSObject song = new JSObject();

                    song.put("id", String.valueOf(id));
                    song.put("title", cursor.getString(
                            cursor.getColumnIndexOrThrow(
                                    MediaStore.Audio.Media.TITLE
                            )
                    ));
                    song.put("artist", cursor.getString(
                            cursor.getColumnIndexOrThrow(
                                    MediaStore.Audio.Media.ARTIST
                            )
                    ));
                    song.put("album", cursor.getString(
                            cursor.getColumnIndexOrThrow(
                                    MediaStore.Audio.Media.ALBUM
                            )
                    ));
                    song.put("duration", cursor.getLong(
                            cursor.getColumnIndexOrThrow(
                                    MediaStore.Audio.Media.DURATION
                            )
                    ));
                    song.put("mimeType", cursor.getString(
                            cursor.getColumnIndexOrThrow(
                                    MediaStore.Audio.Media.MIME_TYPE
                            )
                    ));
                    song.put("name", cursor.getString(
                            cursor.getColumnIndexOrThrow(
                                    MediaStore.Audio.Media.DISPLAY_NAME
                            )
                    ));
                    song.put("size", cursor.getLong(
                            cursor.getColumnIndexOrThrow(
                                    MediaStore.Audio.Media.SIZE
                            )
                    ));
                    song.put("uri", contentUri.toString());

                    songs.put(song);
                }
            }

        } catch (Exception error) {
            throw new RuntimeException(
                    "Unable to retrieve local music.",
                    error
            );
        }

        JSObject result = new JSObject();
        result.put("songs", songs);
        result.put("offset", offset);
        result.put("limit", limit);
        result.put("hasMore", songs.length() == limit);

        return result;
    }
}
