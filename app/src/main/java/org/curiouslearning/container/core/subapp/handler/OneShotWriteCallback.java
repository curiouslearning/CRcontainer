package org.curiouslearning.container.core.subapp.handler;

import android.util.Log;

import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Wraps a caller-supplied {@link AppEventWriteCallback} so an emit path can invoke it freely without
 * null checks, and so the "at most one {@code onQueued}, exactly one terminal call" contract holds
 * even on the paths that fan out (query failure falling back to a create, a listener firing after an
 * early return, an emitter's catch-all running after the handler already reported).
 *
 * <p>A null delegate is absorbed into a no-op, which is what makes {@code handle(payload)} — the
 * fire-and-forget form used by the JS bridge — free of callback plumbing at the call site.
 *
 * <p>{@link #wrap} is idempotent, so the emitter can wrap once and the handler can wrap again
 * without either losing the shared once-only state.
 */
public final class OneShotWriteCallback implements AppEventWriteCallback {

    private static final String TAG = "AppEventHandler";

    private final AppEventWriteCallback delegate;
    private final AtomicBoolean queued = new AtomicBoolean(false);
    private final AtomicBoolean finished = new AtomicBoolean(false);

    private OneShotWriteCallback(AppEventWriteCallback delegate) {
        this.delegate = delegate;
    }

    public static OneShotWriteCallback wrap(AppEventWriteCallback delegate) {
        if (delegate instanceof OneShotWriteCallback) {
            return (OneShotWriteCallback) delegate;
        }
        return new OneShotWriteCallback(delegate);
    }

    @Override
    public void onQueued() {
        if (delegate == null || !queued.compareAndSet(false, true)) {
            return;
        }
        try {
            delegate.onQueued();
        } catch (Exception e) {
            Log.e(TAG, "Write callback threw in onQueued", e);
        }
    }

    @Override
    public void onWritten(String docId) {
        if (delegate == null || !finished.compareAndSet(false, true)) {
            return;
        }
        try {
            delegate.onWritten(docId);
        } catch (Exception e) {
            Log.e(TAG, "Write callback threw in onWritten", e);
        }
    }

    @Override
    public void onFailed(Exception cause) {
        if (delegate == null || !finished.compareAndSet(false, true)) {
            return;
        }
        try {
            delegate.onFailed(cause);
        } catch (Exception e) {
            Log.e(TAG, "Write callback threw in onFailed", e);
        }
    }
}
