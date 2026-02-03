package org.curiouslearning.container.core.subapp.handler;

import android.util.Log;

import org.curiouslearning.container.core.subapp.payload.AppEventPayload;

public class DefaultAppEventPayloadHandler
        implements AppEventPayloadHandler {

    private static final String TAG = "AppEventHandler";

    @Override
    public void handle(AppEventPayload payload) {

        Log.d(TAG,
                "Accepted payload | app_id=" + payload.app_id +
                        " collection=" + payload.collection +
                        " timestamp=" + payload.timestamp
        );
    }
}
