package org.curiouslearning.container.utilities;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.VisibleForTesting;

import org.curiouslearning.container.data.remote.RetrofitInstance;

import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Resolves and caches the user's coarse "country" value (full English name,
 * e.g. "Philippines") via the ipinfo.io Lite endpoint (MR-156).
 *
 * The value is cached per installation in SharedPreferences and mirrored in a
 * volatile in-memory field so {@link #getCountry()} can be called with no
 * Context and no I/O at event time. Only the country name is ever persisted —
 * the device IP is never stored or logged.
 */
public class CountryProvider {

    private static final String TAG = "CountryProvider";

    // Same prefs file MainActivity uses for pseudoId.
    private static final String PREFS_NAME = "appCached";
    private static final String KEY_CACHED_COUNTRY = "cachedCountry";
    private static final String KEY_CACHED_COUNTRY_UPDATED_AT = "cachedCountryUpdatedAt";

    public static final String MISSING_COUNTRY_VALUE = "unknown";
    private static final long REFRESH_TTL_MS = 7L * 24 * 60 * 60 * 1000;

    private static volatile String cachedCountry;
    private static final AtomicBoolean inFlight = new AtomicBoolean(false);

    private CountryProvider() {
    }

    public static void init(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        cachedCountry = prefs.getString(KEY_CACHED_COUNTRY, null);
    }

    /**
     * Attempts a background refresh when no value is cached or the cached value
     * is older than the 7-day TTL. Offline or failed refreshes leave the
     * previously cached value untouched.
     */
    public static void refreshCountryIfStale(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        long updatedAt = prefs.getLong(KEY_CACHED_COUNTRY_UPDATED_AT, 0L);
        boolean fresh = cachedCountry != null
                && (System.currentTimeMillis() - updatedAt) < REFRESH_TTL_MS;
        if (fresh) {
            return;
        }

        if (!ConnectionUtils.getInstance().isInternetConnected(context)) {
            return;
        }

        if (!inFlight.compareAndSet(false, true)) {
            return;
        }

        RetrofitInstance.getInstance().fetchCountry(new RetrofitInstance.CountryCallback() {
            @Override
            public void onSuccess(String rawCountry) {
                inFlight.set(false);
                String normalized = normalizeCountry(rawCountry);
                if (normalized == null) {
                    Log.w(TAG, "country lookup returned no usable country value");
                    return;
                }
                cachedCountry = normalized;
                prefs.edit()
                        .putString(KEY_CACHED_COUNTRY, normalized)
                        .putLong(KEY_CACHED_COUNTRY_UPDATED_AT, System.currentTimeMillis())
                        .apply();
                Log.d(TAG, "country cached: " + normalized);
            }

            @Override
            public void onFailure() {
                inFlight.set(false);
                Log.w(TAG, "country refresh failed; keeping previously cached value");
            }
        });
    }

    /**
     * Returns the cached full English country name, or null if never resolved.
     * Reads only the in-memory field — safe to call at event time offline.
     */
    public static String getCountry() {
        return cachedCountry;
    }

    @VisibleForTesting
    static String normalizeCountry(String raw) {
        if (raw == null) {
            return null;
        }
        String trimmed = raw.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    @VisibleForTesting
    static void resetForTest() {
        cachedCountry = null;
        inFlight.set(false);
    }
}
