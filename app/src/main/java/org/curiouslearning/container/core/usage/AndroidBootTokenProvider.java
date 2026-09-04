package org.curiouslearning.container.core.usage;

/**
 * The production {@link BootTokenProvider}: the wall-clock instant of boot, derived as
 * {@code currentTimeMillis() - elapsedRealtime()}. Stable within a boot, different across one.
 */
public final class AndroidBootTokenProvider implements BootTokenProvider {

    /**
     * How far two same-boot tokens may drift apart, in ms. A tolerance rather than bucketing, because a
     * value near a bucket edge flips buckets under a drift far smaller than the bucket width.
     */
    static final long TOLERANCE_MS = 5_000L;

    private final WallClock wallClock;
    private final MonotonicClock monotonicClock;
    private final long toleranceMs;

    /** A wall clock, separate from {@link MonotonicClock} because only this class needs one. */
    interface WallClock {
        long currentTimeMillis();
    }

    public AndroidBootTokenProvider() {
        this(System::currentTimeMillis, new AndroidMonotonicClock(), TOLERANCE_MS);
    }

    /** Visible for tests, which cannot reboot a device or move an NTP server. */
    AndroidBootTokenProvider(WallClock wallClock, MonotonicClock monotonicClock, long toleranceMs) {
        this.wallClock = wallClock;
        this.monotonicClock = monotonicClock;
        this.toleranceMs = toleranceMs;
    }

    @Override
    public long currentToken() {
        return wallClock.currentTimeMillis() - monotonicClock.elapsedRealtimeMillis();
    }

    @Override
    public boolean matches(long storedToken) {
        return Math.abs(storedToken - currentToken()) <= toleranceMs;
    }
}
