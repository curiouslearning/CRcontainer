package org.curiouslearning.container.core.usage;

import android.util.Log;

import androidx.annotation.NonNull;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;

/**
 * The production {@link HeartbeatTicker}: one daemon thread from a {@link ScheduledExecutorService},
 * cancelled on {@link #stop()}, so a forgotten ticker can never hold the process alive.
 */
public final class ExecutorHeartbeatTicker implements HeartbeatTicker {

    private static final String TAG = "HeartbeatTicker";

    private static final ThreadFactory THREAD_FACTORY = runnable -> {
        Thread thread = new Thread(runnable, "sub-app-usage-heartbeat");
        thread.setDaemon(true);
        return thread;
    };

    private final ScheduledExecutorService executor =
            Executors.newSingleThreadScheduledExecutor(THREAD_FACTORY);

    /** Non-null only while a tick is scheduled. */
    private ScheduledFuture<?> scheduled;

    @Override
    public synchronized void start(@NonNull Runnable tick, long intervalMs) {

        stop();

        // A thrown tick would silently cancel all future ticks, so it is caught here rather than allowed
        // to escape into the executor.
        Runnable guarded = () -> {
            try {
                tick.run();
            } catch (Exception e) {
                Log.w(TAG, "Heartbeat tick failed; the recovery estimate may be short by one interval", e);
            }
        };

        scheduled = executor.scheduleWithFixedDelay(guarded, intervalMs, intervalMs, TimeUnit.MILLISECONDS);
    }

    @Override
    public synchronized void stop() {

        if (scheduled != null) {
            scheduled.cancel(false);
            scheduled = null;
        }
    }
}
