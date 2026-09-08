package org.curiouslearning.container.core.usage;

/**
 * The result of one {@link SubAppUsageTimer#stopAndDrain()}, or of one recovered stretch: how much time is
 * ready to be written, and which document it belongs to. Immutable, safe to hand to a later callback.
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

    /** How much of {@link #cappedSeconds} is an estimate rather than a measurement; 0 for a drain. */
    public final long recoveredSeconds;

    /** How many recovery events this segment represents; 0 for a drain, 1 for a recovered stretch. */
    public final long recoveredCount;

    /** An ordinary drain: nothing here is a recovery estimate. */
    public UsageSegment(String appKey, String language, long cappedSeconds, long rawSeconds) {
        this(appKey, language, cappedSeconds, rawSeconds, 0L, 0L);
    }

    public UsageSegment(String appKey,
                        String language,
                        long cappedSeconds,
                        long rawSeconds,
                        long recoveredSeconds,
                        long recoveredCount) {
        this.appKey = appKey;
        this.language = language;
        this.cappedSeconds = cappedSeconds;
        this.rawSeconds = rawSeconds;
        this.recoveredSeconds = recoveredSeconds;
        this.recoveredCount = recoveredCount;
    }

    /**
     * A recovered stretch. {@code rawSeconds} is deliberately the same capped value: {@code raw - capped}
     * measures what the cap trimmed from *measured* play, so an estimate must contribute zero to it.
     */
    public static UsageSegment recovered(String appKey, String language, long seconds) {
        return new UsageSegment(appKey, language, seconds, seconds, seconds, 1L);
    }

    /** True when there is nothing to write; callers skip rather than send a zero increment. */
    public boolean isEmpty() {
        return cappedSeconds == 0L && rawSeconds == 0L && recoveredSeconds == 0L && recoveredCount == 0L;
    }

    /** True when this segment carries recovery counters that must be written alongside the duration. */
    public boolean isRecovered() {
        return recoveredCount > 0L;
    }

    @Override
    public String toString() {
        return "UsageSegment{appKey=" + appKey +
                ", language=" + language +
                ", cappedSeconds=" + cappedSeconds +
                ", rawSeconds=" + rawSeconds +
                (isRecovered()
                        ? ", recoveredSeconds=" + recoveredSeconds + ", recoveredCount=" + recoveredCount
                        : "") +
                "}";
    }
}
