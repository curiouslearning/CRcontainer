package org.curiouslearning.container;

import android.app.Application;
import android.util.Log;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;

import app.rive.runtime.kotlin.core.Rive;
import app.rive.runtime.kotlin.core.RendererType;
import io.sentry.Sentry;
import io.sentry.android.core.SentryAndroid;

public class MyApplication extends Application {
    private static final String TAG = "MyApplication";

    @Override
    public void onCreate() {
        super.onCreate();

        // FacebookSdk.sdkInitialize(getApplicationContext());
        FacebookSdk.setAutoInitEnabled(true);
        FacebookSdk.fullyInitialize();
        FacebookSdk.setAdvertiserIDCollectionEnabled(true);
        AppEventsLogger.activateApp(this);
        SentryAndroid.init(this, options -> {
            options.setDsn(
                    "https://3e3bfa9bd4473edd4e0b0d502195f4de@o4504951275651072.ingest.us.sentry.io/4510001311383552");
            options.setEnvironment(BuildConfig.BUILD_TYPE);
        });

        // Initialize Rive manually (auto-init is disabled in AndroidManifest.xml)
        // Wrapped in try/catch to handle MissingLibraryException on Android 7 (armeabi-v7a)
        // devices where the native libandroid.so may not be available.
        try {
            Rive.INSTANCE.init(this, RendererType.Rive);
        } catch (Throwable e) {
            // Catch Throwable (not just Exception) to also handle native-level errors:
            // UnsatisfiedLinkError, NoClassDefFoundError, etc. on older/broken devices
            Log.e(TAG, "Rive initialization failed — animations will be unavailable on this device", e);
            Sentry.captureException(e);
        }
    }
}

