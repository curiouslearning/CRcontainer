package org.curiouslearning.container.core.usage;

import androidx.annotation.NonNull;

import java.util.Locale;

/**
 * One sub-app's undrained usage state, as of the last moment the container could write it down.
 * Carries its own identity fields, since language and cr_user_id can change before recovery runs.
 */
public final class OpenStretchRecord {

    /** No segment is open; only undrained totals remain. */
    public static final long NOT_RUNNING = -1L;

    private static final String KEY_SEPARATOR = "::";

    /** The sub-app the time was spent in — the manifest {@code app_id}. */
    public final String appKey;

    /** The language the sub-app was launched in; part of the destination document's identity. */
    public final String language;

    /** The {@code cr_user_id} in force when the stretch began, not whatever is current at recovery. */
    public final String crUserId;

    /**
     * Wall-clock instant of boot. {@code elapsedRealtime()} restarts on reboot, so the fields below are
     * meaningless from another boot — and still numerically plausible, which is what makes them dangerous.
     */
    public final long bootToken;

    /** {@code elapsedRealtime} at which the open segment began, or {@link #NOT_RUNNING}. */
    public final long segmentStartMs;

    /** Latest {@code elapsedRealtime} at which this stretch was known to still be in progress. */
    public final long lastAliveMs;

    /** The timer's accumulated post-cap total not yet written, in ms. */
    public final long undrainedCappedMs;

    /** What the cap trimmed from those segments, in ms; keeps {@code raw = capped + trimmed}. */
    public final long undrainedTrimmedMs;

    public OpenStretchRecord(@NonNull String appKey,
                             @NonNull String language,
                             @NonNull String crUserId,
                             long bootToken,
                             long segmentStartMs,
                             long lastAliveMs,
                             long undrainedCappedMs,
                             long undrainedTrimmedMs) {
        this.appKey = appKey;
        this.language = language;
        this.crUserId = crUserId;
        this.bootToken = bootToken;
        this.segmentStartMs = segmentStartMs;
        this.lastAliveMs = lastAliveMs;
        this.undrainedCappedMs = undrainedCappedMs;
        this.undrainedTrimmedMs = undrainedTrimmedMs;
    }

    /** This record's store key. Same shape {@code SubAppUsageTimers} uses, so one record per timer holds. */
    @NonNull
    public String key() {
        return key(appKey, language);
    }

    /** @see #key() */
    @NonNull
    public static String key(@NonNull String appKey, @NonNull String language) {
        return appKey + KEY_SEPARATOR + language.toLowerCase(Locale.ROOT);
    }

    /** True while a segment was open when this record was last written. */
    public boolean hasOpenSegment() {
        return segmentStartMs != NOT_RUNNING;
    }

    /** True when the identity fields are all usable; a record failing this is discarded on read. */
    public boolean hasUsableIdentity() {
        return isPresent(appKey) && isPresent(language) && isPresent(crUserId);
    }

    private static boolean isPresent(String value) {
        return value != null && !value.trim().isEmpty();
    }

    @Override
    public String toString() {
        return "OpenStretchRecord{appKey=" + appKey
                + ", language=" + language
                + ", bootToken=" + bootToken
                + ", segmentStartMs=" + segmentStartMs
                + ", lastAliveMs=" + lastAliveMs
                + ", undrainedCappedMs=" + undrainedCappedMs
                + ", undrainedTrimmedMs=" + undrainedTrimmedMs + "}";
    }
}
