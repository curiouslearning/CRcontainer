package org.curiouslearning.container.core.usage.flush;

import android.content.Context;

import androidx.annotation.NonNull;

import org.curiouslearning.container.core.usage.heartbeat.ExecutorHeartbeatTicker;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Process-wide {@link CoalescingUsageFlusher} instances, one per sub-app and language.
 *
 * <p>Held here rather than on {@code WebApp}, for the identical reason {@code SubAppUsageTimers} is: that
 * Activity is recreated when a landscape sub-app calls {@code setRequestedOrientation()}, which would
 * otherwise orphan a buffer and its running ticker every time a sub-app is reopened (research.md D2).
 */
public final class CoalescingUsageFlushers {

    private static final String KEY_SEPARATOR = "::";

    private static final Map<String, CoalescingUsageFlusher> FLUSHERS = new HashMap<>();

    private CoalescingUsageFlushers() {
    }

    /**
     * Returns the shared flusher for {@code appKey} in {@code language}, creating it on first use. Only the
     * first caller's {@code crUserId} seeds the new instance's delegate — later callers for the same key
     * join the buffer already in progress.
     */
    public static synchronized CoalescingUsageFlusher getInstance(@NonNull Context context,
                                                                   @NonNull String appKey,
                                                                   @NonNull String language,
                                                                   @NonNull String crUserId) {

        String key = key(appKey, language);
        CoalescingUsageFlusher flusher = FLUSHERS.get(key);

        if (flusher == null) {
            flusher = new CoalescingUsageFlusher(
                    new FirestoreUsageFlusher(crUserId),
                    new SharedPreferencesPendingUsageWriteStore(context),
                    new ExecutorHeartbeatTicker(),
                    appKey,
                    language,
                    crUserId);
            FLUSHERS.put(key, flusher);
        }

        return flusher;
    }

    /** Folds language case, mirroring {@code SubAppUsageTimers}, so one child's time cannot fork across two. */
    private static String key(String appKey, String language) {
        return appKey + KEY_SEPARATOR + language.toLowerCase(Locale.ROOT);
    }
}
