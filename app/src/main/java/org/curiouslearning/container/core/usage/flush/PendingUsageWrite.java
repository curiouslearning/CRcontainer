package org.curiouslearning.container.core.usage.flush;

import androidx.annotation.NonNull;

import java.util.Locale;

/**
 * One {@code appKey::language} key's coalesced-but-unflushed total: everything a
 * {@link CoalescingUsageFlusher} has folded since its last real Firestore flush. Mirrors {@code
 * OpenStretchRecord}'s style — {@code public final} fields, no setters — but carries far less: only
 * already-drained whole seconds, with no elapsed-time anchor to protect (see data-model.md §1).
 */
public final class PendingUsageWrite {

    private static final String KEY_SEPARATOR = "::";

    /** The sub-app the time was spent in — the manifest {@code app_id}. */
    public final String appKey;

    /** The language the sub-app was launched in; part of the destination document's identity. */
    public final String language;

    /** The {@code cr_user_id} in force when the buffer's first fold happened. */
    public final String crUserId;

    /** Running sum of every folded segment's {@code cappedSeconds} since the last flush. */
    public final long cappedSeconds;

    /** Running sum of every folded segment's {@code rawSeconds} since the last flush; always {@code >=
     * cappedSeconds}. */
    public final long rawSeconds;

    public PendingUsageWrite(@NonNull String appKey,
                             @NonNull String language,
                             @NonNull String crUserId,
                             long cappedSeconds,
                             long rawSeconds) {
        this.appKey = appKey;
        this.language = language;
        this.crUserId = crUserId;
        this.cappedSeconds = cappedSeconds;
        // A corrupt raw value must not also destroy the recoverable capped time (data-model.md's own rule).
        this.rawSeconds = Math.max(rawSeconds, cappedSeconds);
    }

    /** This record's store key. Same shape {@code SubAppUsageTimers}/{@code OpenStretchRecord} already use. */
    @NonNull
    public String key() {
        return key(appKey, language);
    }

    /** @see #key() */
    @NonNull
    public static String key(@NonNull String appKey, @NonNull String language) {
        return appKey + KEY_SEPARATOR + language.toLowerCase(Locale.ROOT);
    }

    /** True when there is nothing worth persisting; a record failing this should never exist on disk. */
    public boolean isEmpty() {
        return cappedSeconds == 0L && rawSeconds == 0L;
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
        return "PendingUsageWrite{appKey=" + appKey
                + ", language=" + language
                + ", cappedSeconds=" + cappedSeconds
                + ", rawSeconds=" + rawSeconds + "}";
    }
}
