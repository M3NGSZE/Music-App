package com.m3ngsze.sentry.musicplayer;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(LocalMusicPlugin.class);
        registerPlugin(NativeAudioPlayerPlugin.class);

        super.onCreate(savedInstanceState);
    }
}
