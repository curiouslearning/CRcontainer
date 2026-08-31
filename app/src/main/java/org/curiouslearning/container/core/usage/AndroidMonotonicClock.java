package org.curiouslearning.container.core.usage;

import android.os.SystemClock;

/**
 * The production {@link MonotonicClock}, backed by {@link SystemClock#elapsedRealtime()}, which keeps
 * counting while the device sleeps.
 *
 */
public final class AndroidMonotonicClock implements MonotonicClock {

    @Override
    public long elapsedRealtimeMillis() {
        return SystemClock.elapsedRealtime();
    }
}
