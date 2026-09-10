package org.curiouslearning.container.core.usage.flush;

import androidx.annotation.Nullable;

import org.curiouslearning.container.core.subapp.handler.AppEventWriteCallback;
import org.curiouslearning.container.core.usage.UsageSegment;

/** Where a drained {@link UsageSegment} goes. A seam for tests, and for {@link CoalescingUsageFlusher}. */
public interface SubAppUsageFlusher {

    /**
     * Writes {@code segment}, reporting the outcome to {@code callback} — {@code onQueued()} is when a
     * caller holding the only other copy may discard it. Skips an {@link UsageSegment#isEmpty()} segment.
     */
    void flush(UsageSegment segment, @Nullable AppEventWriteCallback callback);

    /** Fire-and-forget: for callers with nothing to release. */
    default void flush(UsageSegment segment) {
        flush(segment, null);
    }

    /**
     * Flushes whatever is currently buffered for this flusher's key, if anything. A no-op for a flusher
     * that does not buffer (every implementer but {@link CoalescingUsageFlusher}). Fire-and-forget: a caller
     * whose session is genuinely ending calls this after handing off its last segment, and does not wait on
     * it.
     */
    default void flushPending() {
    }
}
