package org.curiouslearning.container.core.usage;

/**
 * A monotonic elapsed-time source, injected so usage measurement can be driven by tests.
 *
 * <p>Not a wall clock: device clocks get NTP-corrected mid-session, so a
 * {@code System.currentTimeMillis()} delta can come back negative.
 */
public interface MonotonicClock {

    /**
     * Milliseconds since an arbitrary fixed origin, non-decreasing for the life of the process.
     *
     * <p>Meaningful only when subtracted from another reading, never as an absolute time.
     */
    long elapsedRealtimeMillis();
}
