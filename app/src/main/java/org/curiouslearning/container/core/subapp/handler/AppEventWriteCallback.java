package org.curiouslearning.container.core.subapp.handler;

/**
 * Optional per-emit result signal for {@link AppEventPayloadHandler#handle}.
 *
 * <p>Two distinct success signals, because they mean different things on a device that is offline
 * most of the time:
 *
 * <ul>
 *   <li>{@link #onQueued()} — the write has been handed to the Firestore SDK and is durable in its
 *       local persistence queue. This is the point at which a caller holding the only other copy of
 *       the measurement (e.g. a coalesced usage buffer) can safely discard it.</li>
 *   <li>{@link #onWritten(String)} — the server acknowledged the write. Offline this fires late, or
 *       never. Do not gate local cleanup on it; a caller that did would replay its buffer on every
 *       launch and double-count.</li>
 * </ul>
 *
 * <p><b>Timing:</b> {@code onQueued()} fires synchronously for {@code user_sessions_data} (a direct
 * add), but asynchronously for {@code summary_data}, which must first resolve its upsert query.
 * Callers must act inside the callback rather than assume it ran by the time the emit call returns.
 *
 * <p><b>Contract:</b> {@code onQueued()} at most once, and always before the terminal call. Exactly
 * one terminal call — {@link #onWritten(String)} or {@link #onFailed(Exception)} — per emit.
 *
 * <p>All methods default to no-ops so callers implement only what they need.
 */
public interface AppEventWriteCallback {

    /**
     * The write was issued to the Firestore SDK and is durable locally. Safe point to release any
     * caller-side copy of the data.
     */
    default void onQueued() {
    }

    /**
     * The server acknowledged the write.
     *
     * @param docId id of the document written, or {@code null} when it is not known at this call
     *              site (an update to an existing doc reports its id; a create reports the new one).
     */
    default void onWritten(String docId) {
    }

    /**
     * The payload was rejected before any write (validation, unsupported collection, bad data
     * shape), or the write itself failed server-side.
     */
    default void onFailed(Exception e) {
    }
}
