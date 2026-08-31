package org.curiouslearning.container.core.usage;

/**
 * The result of one {@link SubAppUsageTimer#stopAndDrain()}: how much container-measured foreground time is
 * ready to be written, and which document it belongs to.
 *
 * <p>Immutable, and safe to hand to a Firestore callback that may run later.
 */
public final class UsageSegment {

    /** The sub-app the time was spent in — the manifest {@code app_id}. */
    public final String appKey;

    /** The language the sub-app was launched in; part of the destination document's identity. */
    public final String language;

    /** Sum of the drained segments after each one was individually capped, in whole seconds. */
    public final long cappedSeconds;

    /** Sum of the same segments before the cap, in whole seconds. Always {@code >= cappedSeconds}. */
    public final long rawSeconds;

    public UsageSegment(String appKey, String language, long cappedSeconds, long rawSeconds) {
        this.appKey = appKey;
        this.language = language;
        this.cappedSeconds = cappedSeconds;
        this.rawSeconds = rawSeconds;
    }

    /** True when there is nothing to write; callers should skip the write rather than send a zero increment. */
    public boolean isEmpty() {
        return cappedSeconds == 0L && rawSeconds == 0L;
    }

    @Override
    public String toString() {
        return "UsageSegment{appKey=" + appKey +
                ", language=" + language +
                ", cappedSeconds=" + cappedSeconds +
                ", rawSeconds=" + rawSeconds + "}";
    }
}
