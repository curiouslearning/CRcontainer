package org.curiouslearning.container.core.usage;

import androidx.annotation.NonNull;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Process-wide {@link SubAppUsageTimer} instances, one per sub-app and language.
 *
 * <p>Held here rather than in {@code WebApp} because that Activity is recreated when a landscape sub-app
 * calls {@code setRequestedOrientation()}, which would discard an Activity-scoped timer's pending time.
 */
public final class SubAppUsageTimers {

    private static final String KEY_SEPARATOR = "::";

    private static final Map<String, SubAppUsageTimer> TIMERS = new HashMap<>();
    private static final MonotonicClock CLOCK = new AndroidMonotonicClock();

    private SubAppUsageTimers() {
    }

    /** Returns the shared timer for {@code appKey} in {@code language}, creating it on first use. */
    public static synchronized SubAppUsageTimer getInstance(@NonNull String appKey, @NonNull String language) {

        String key = key(appKey, language);
        SubAppUsageTimer timer = TIMERS.get(key);

        if (timer == null) {
            timer = new SubAppUsageTimer(CLOCK);
            TIMERS.put(key, timer);
        }

        return timer;
    }

    /** Folds language case, which is not normalised upstream, so one child's time cannot fork across two timers. */
    private static String key(String appKey, String language) {
        return appKey + KEY_SEPARATOR + language.toLowerCase(Locale.ROOT);
    }
}
