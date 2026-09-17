package org.curiouslearning.container.core.usage.flush;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.curiouslearning.container.core.subapp.handler.AppEventWriteCallback;
import org.curiouslearning.container.core.usage.UsageSegment;
import org.curiouslearning.container.core.usage.heartbeat.HeartbeatTicker;

/**
 * Buffers drained {@link UsageSegment}s per {@code appKey::language}, persisting the running sum on every
 * fold, and forwards to a delegate {@link SubAppUsageFlusher} — the real Firestore write — only when the
 * tracked session is genuinely ending ({@link #flushPending()}) or a periodic interval elapses. Never
 * re-caps a coalesced sum: {@link UsageSegment#cappedSeconds} from every fold is summed directly.
 *
 * <p>One instance covers exactly one {@code appKey::language} key — see {@link CoalescingUsageFlushers} for
 * how instances survive Activity recreation.
 */
public final class CoalescingUsageFlusher implements SubAppUsageFlusher {

    private static final String TAG = "CoalescingFlusher";

    /** 5 minutes — a starting default per the spec's own Assumptions, not a fixed constant. */
    static final long DEFAULT_FLUSH_INTERVAL_MS = 5L * 60L * 1000L;

    private final SubAppUsageFlusher delegate;
    private final PendingUsageWriteStore store;
    private final HeartbeatTicker ticker;
    private final long flushIntervalMs;

    private final String appKey;
    private final String language;
    private final String crUserId;
    private final String key;

    private long bufferedCappedSeconds;
    private long bufferedRawSeconds;

    public CoalescingUsageFlusher(@NonNull SubAppUsageFlusher delegate,
                                  @NonNull PendingUsageWriteStore store,
                                  @NonNull HeartbeatTicker ticker,
                                  @NonNull String appKey,
                                  @NonNull String language,
                                  @NonNull String crUserId) {
        this(delegate, store, ticker, appKey, language, crUserId, DEFAULT_FLUSH_INTERVAL_MS);
    }

    /** Visible for tests, so the periodic flush can be exercised without waiting 5 real minutes. */
    CoalescingUsageFlusher(@NonNull SubAppUsageFlusher delegate,
                           @NonNull PendingUsageWriteStore store,
                           @NonNull HeartbeatTicker ticker,
                           @NonNull String appKey,
                           @NonNull String language,
                           @NonNull String crUserId,
                           long flushIntervalMs) {
        this.delegate = delegate;
        this.store = store;
        this.ticker = ticker;
        this.appKey = appKey;
        this.language = language;
        this.crUserId = crUserId;
        this.key = PendingUsageWrite.key(appKey, language);
        this.flushIntervalMs = flushIntervalMs;
    }

    /**
     * Folds {@code segment} into the buffer and persists the new running total, calling {@code callback}'s
     * {@code onQueued()} synchronously once that persist completes — this, not a real Firestore write, is
     * what a coalescing flusher considers "safe to discard the other copy" (see the usage-write-coalescing
     * contract §2). Starts the periodic ticker only when the buffer was empty before this fold; a fidgety
     * child folding many segments in a row must not keep pushing the periodic flush further out.
     */
    @Override
    public synchronized void flush(UsageSegment segment, @Nullable AppEventWriteCallback callback) {

        if (segment == null || segment.isEmpty()) {
            return;
        }

        boolean wasEmpty = isBufferEmpty();

        bufferedCappedSeconds += segment.cappedSeconds;
        bufferedRawSeconds += segment.rawSeconds;

        persist();

        if (wasEmpty) {
            ticker.start(this::onTick, flushIntervalMs);
        }

        if (callback != null) {
            callback.onQueued();
        }
    }

    /**
     * Forces whatever is buffered out to the delegate now, bypassing the ticker. Fire-and-forget, per the
     * interface: the in-memory buffer, the persisted record, and the ticker are all left untouched until the
     * delegate reports {@code onQueued()} — a failure leaves everything exactly as it was, so the next tick
     * or finish retries the same amount.
     */
    @Override
    public void flushPending() {

        UsageSegment segment;

        synchronized (this) {
            if (isBufferEmpty()) {
                return;
            }
            segment = new UsageSegment(appKey, language, bufferedCappedSeconds, bufferedRawSeconds);
        }

        delegate.flush(segment, new AppEventWriteCallback() {
            @Override
            public void onQueued() {
                onDelegateQueued(segment);
            }

            @Override
            public void onFailed(Exception e) {
                Log.w(TAG, "Coalesced usage flush failed for " + key + "; buffer kept for retry", e);
            }
        });
    }

    private synchronized void onDelegateQueued(UsageSegment flushed) {

        // Subtract only what this flush actually covered — a fold that raced in after the segment above
        // was snapshotted must survive to the next flush, not be silently dropped by this one's success.
        bufferedCappedSeconds -= flushed.cappedSeconds;
        bufferedRawSeconds -= flushed.rawSeconds;

        if (isBufferEmpty()) {
            ticker.stop();
            store.delete(key);
        } else {
            persist();
        }
    }

    /** Visible for tests; the production caller is the {@link HeartbeatTicker}. */
    void onTick() {
        flushPending();
    }

    private boolean isBufferEmpty() {
        return bufferedCappedSeconds == 0L && bufferedRawSeconds == 0L;
    }

    private void persist() {
        try {
            store.save(new PendingUsageWrite(appKey, language, crUserId, bufferedCappedSeconds, bufferedRawSeconds));
        } catch (Exception e) {
            // A failed persist costs accuracy on a crash that may never happen; it must not cost the session.
            Log.w(TAG, "Could not persist pending usage for " + key, e);
        }
    }
}
