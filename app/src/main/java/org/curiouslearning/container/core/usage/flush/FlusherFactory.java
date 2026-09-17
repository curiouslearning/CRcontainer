package org.curiouslearning.container.core.usage.flush;

import androidx.annotation.NonNull;

/**
 * Builds the flusher for one recovered record's own {@code cr_user_id} — never from current state, which
 * the debug override can have changed since. Hoisted out of {@code OpenStretchRecovery}'s own nested
 * interface (MR-184 research.md D6) so both launch-time recovery passes —
 * {@code OpenStretchRecovery} and {@link PendingUsageWriteRecovery} — share one abstraction instead of two
 * identical ones.
 */
public interface FlusherFactory {
    SubAppUsageFlusher forUser(@NonNull String crUserId);
}
