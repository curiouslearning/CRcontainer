package org.curiouslearning.container.core.usage;

import androidx.annotation.NonNull;

/**
 * Repeats a small piece of work while a usage stretch is open, so the container keeps its own record of
 * how recently that stretch was known to be alive. Injected so a test can fire ticks by hand.
 */
public interface HeartbeatTicker {

    /**
     * Runs {@code tick} every {@code intervalMs}, replacing any tick already running.
     * Implementations must keep it off the main thread and swallow anything it throws.
     */
    void start(@NonNull Runnable tick, long intervalMs);

    /** Stops the running tick. A no-op when none is running; safe to call more than once. */
    void stop();
}
