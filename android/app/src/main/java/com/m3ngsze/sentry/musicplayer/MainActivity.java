package com.m3ngsze.sentry.musicplayer;

import com.getcapacitor.BridgeActivity;
import com.m3ngsze.sentry.musicplayer.plugins.LocalMusicPlugin;
import com.m3ngsze.sentry.musicplayer.plugins.NativeAudioPlayerPlugin;

import android.os.Bundle;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(LocalMusicPlugin.class);
        registerPlugin(NativeAudioPlayerPlugin.class);

        super.onCreate(savedInstanceState);
    }
}
