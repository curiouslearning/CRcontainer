package org.curiouslearning.container.core.usage;

/** Where a drained {@link UsageSegment} goes. A seam for tests, and for MR-184's coalescing. */
public interface SubAppUsageFlusher {

    /** Writes {@code segment}. Implementations skip an {@link UsageSegment#isEmpty()}. */
    void flush(UsageSegment segment);
}
