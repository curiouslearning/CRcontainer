package org.curiouslearning.container.core.usage;

import androidx.annotation.Nullable;

import org.curiouslearning.container.core.subapp.handler.AppEventWriteCallback;

/** Where a drained {@link UsageSegment} goes. A seam for tests, and for MR-184's coalescing. */
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
}
