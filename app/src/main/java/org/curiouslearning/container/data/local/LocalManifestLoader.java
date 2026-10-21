package org.curiouslearning.container.data.local;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.VisibleForTesting;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

import org.curiouslearning.container.data.database.WebAppDatabase;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.model.WebAppResponse;
import org.curiouslearning.container.utilities.CacheUtils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Executors;

import io.sentry.Sentry;

/**
 * Loads the catalog from the manifest packaged in the APK ({@code assets/web_apps_manifest.json})
 * into the Room catalog table, for the offline standalone flavors.
 *
 * <p>The file uses the same schema as the remote manifest ({@code version} + {@code web_apps[]}),
 * so the rest of the app — Room entity, language popup, adapter, WebApp launch — is unchanged.
 * Entries are validated before anything is written: a packaged manifest that is missing, malformed
 * or incomplete is a build defect, so it is logged, reported to Sentry and surfaced to the caller
 * instead of leaving the catalog in an indefinite loading state.
 */
public final class LocalManifestLoader {

    private static final String TAG = "LocalManifest";

    public static final String MANIFEST_ASSET = "web_apps_manifest.json";

    /** Outcome of a load attempt, delivered on a background thread. */
    public interface Listener {
        void onLoaded(@NonNull String version, int appCount);

        void onFailed(@NonNull String reason);
    }

    private LocalManifestLoader() {
    }

    /**
     * Reads, validates and stores the packaged manifest off the main thread. The Room write goes
     * through {@link WebAppDatabase#deleteWebApps(List)} (replace-all), exactly like a remote
     * manifest refresh, so observers of the catalog LiveData pick it up the same way.
     */
    public static void loadInto(@NonNull Context context,
                                @NonNull WebAppDatabase webAppDatabase,
                                @Nullable Listener listener) {
        Context appContext = context.getApplicationContext();
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                String json = readAsset(appContext);
                WebAppResponse response = parse(json);
                List<WebApp> webApps = response.getWebApps();
                CacheUtils.setManifestVersionNumber(response.getVersion());
                webAppDatabase.deleteWebApps(webApps);
                Log.i(TAG, "Local manifest loaded: version=" + response.getVersion()
                        + " apps=" + webApps.size()
                        + " languages=" + languagesOf(webApps));
                if (listener != null) {
                    listener.onLoaded(response.getVersion(), webApps.size());
                }
            } catch (Exception e) {
                String reason = "Packaged manifest unusable (" + MANIFEST_ASSET + "): " + e.getMessage();
                Log.e(TAG, reason, e);
                // A missing/invalid bundled manifest is a packaging bug, not an offline condition,
                // so it stays observable in Sentry.
                Sentry.captureMessage(reason);
                if (listener != null) {
                    listener.onFailed(reason);
                }
            }
        });
    }

    private static String readAsset(Context context) throws IOException {
        try (InputStream in = context.getAssets().open(MANIFEST_ASSET)) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buffer = new byte[8192];
            int read;
            while ((read = in.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }
            return new String(out.toByteArray(), StandardCharsets.UTF_8);
        }
    }

    /**
     * Parses and validates manifest JSON. Pure function, exercised directly by unit tests.
     *
     * @throws IllegalArgumentException when the document is not a manifest or an entry lacks a
     *                                  field the catalog UI or the sub-app launch needs.
     */
    @VisibleForTesting
    @NonNull
    public static WebAppResponse parse(@Nullable String json) {
        if (json == null || json.trim().isEmpty()) {
            throw new IllegalArgumentException("manifest is empty");
        }
        JsonElement root;
        try {
            root = JsonParser.parseString(json);
        } catch (JsonSyntaxException e) {
            throw new IllegalArgumentException("manifest is not valid JSON: " + e.getMessage(), e);
        }
        if (!root.isJsonObject()) {
            throw new IllegalArgumentException("manifest root must be a JSON object");
        }
        JsonObject object = root.getAsJsonObject();

        JsonElement versionElement = object.get("version");
        if (versionElement == null || versionElement.isJsonNull()
                || versionElement.getAsString().trim().isEmpty()) {
            throw new IllegalArgumentException("manifest has no \"version\"");
        }

        JsonElement appsElement = object.get("web_apps");
        if (appsElement == null || !appsElement.isJsonArray()) {
            throw new IllegalArgumentException("manifest has no \"web_apps\" array");
        }
        JsonArray appsArray = appsElement.getAsJsonArray();
        if (appsArray.size() == 0) {
            throw new IllegalArgumentException("manifest \"web_apps\" is empty");
        }

        List<WebApp> webApps = new Gson().fromJson(appsArray, new TypeToken<List<WebApp>>() {
        }.getType());

        for (int i = 0; i < webApps.size(); i++) {
            WebApp app = webApps.get(i);
            requireField(i, "title", app.getTitle());
            requireField(i, "appUrl", app.getAppUrl());
            requireField(i, "appIconUrl", app.getAppIconUrl());
            requireField(i, "language", app.getLanguage());
            requireField(i, "languageInEnglishName", app.getLanguageInEnglishName());
        }

        WebAppResponse response = new WebAppResponse();
        response.setVersion(versionElement.getAsString().trim());
        response.setWebApp(webApps);
        return response;
    }

    private static void requireField(int index, String name, String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "web_apps[" + index + "] is missing \"" + name + "\"");
        }
    }

    private static Set<String> languagesOf(List<WebApp> webApps) {
        Set<String> languages = new LinkedHashSet<>();
        for (WebApp app : webApps) {
            languages.add(app.getLanguageInEnglishName());
        }
        return languages;
    }
}
