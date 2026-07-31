package org.curiouslearning.container.presentation.webapp;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import android.webkit.JavascriptInterface;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import org.curiouslearning.container.core.subapp.handler.AppEventPayloadHandler;
import org.curiouslearning.container.core.subapp.handler.DefaultAppEventPayloadHandler;
import org.curiouslearning.container.core.subapp.payload.AppEventPayload;
import org.curiouslearning.container.core.subapp.validation.AppEventPayloadValidator;
import org.curiouslearning.container.core.subapp.validation.ValidationResult;

public class WebAppJsBridge {

    public interface WebAppBridgeListener {
        void onCachedStatusReceived(boolean dataCachedStatus);
        void onOrientationRequested(String orientationType);
        void onCloseRequested();
        void onMonsterEvolutionStateReceived(String jsonState);
    }

    private final Context mContext;
    private final WebAppBridgeListener listener;
    
    private final Gson gson = new Gson();
    private final AppEventPayloadValidator validator = new AppEventPayloadValidator();
    private final AppEventPayloadHandler handler = new DefaultAppEventPayloadHandler();

    public WebAppJsBridge(Context context, WebAppBridgeListener listener) {
        this.mContext = context;
        this.listener = listener;
    }

    @JavascriptInterface
    public void cachedStatus(boolean dataCachedStatus) {
        if (listener != null) listener.onCachedStatusReceived(dataCachedStatus);
    }

    @JavascriptInterface
    public void setContainerAppOrientation(String orientationType) {
        if (listener != null) listener.onOrientationRequested(orientationType);
    }

    @JavascriptInterface
    public void closeWebView() {
        if (listener != null) listener.onCloseRequested();
    }

    @JavascriptInterface
    public void logMessage(String payloadJson) {
        try {
            if (payloadJson == null || payloadJson.trim().isEmpty()) {
                Log.e("WebAppJsBridge", "Rejected payload: empty JSON");
                return;
            }

            AppEventPayload payload = gson.fromJson(payloadJson, AppEventPayload.class);
            ValidationResult result = validator.validate(payload);

            if (!result.isValid) {
                Log.e("WebAppJsBridge", "Payload rejected: " + result.errorMessage);
                return;
            }

            handler.handle(payload);

        } catch (JsonSyntaxException e) {
            Log.e("WebAppJsBridge", "Invalid JSON payload", e);
        } catch (Exception e) {
            Log.e("WebAppJsBridge", "Unexpected error handling payload", e);
        }
    }

    @JavascriptInterface
    public void onMonsterEvolutionStateReceived(String jsonState) {
        if (listener != null) listener.onMonsterEvolutionStateReceived(jsonState);
    }
}
