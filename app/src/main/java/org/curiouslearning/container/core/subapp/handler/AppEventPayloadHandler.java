package org.curiouslearning.container.core.subapp.handler;

import org.curiouslearning.container.core.subapp.payload.AppEventPayload;

public interface AppEventPayloadHandler {

    /**
     * Fire-and-forget form, used by the JS bridge where nothing on the caller side needs to know
     * when the write lands.
     */
    default void handle(AppEventPayload payload) {
        handle(payload, null);
    }

    /**
     * @param callback optional result signal; see {@link AppEventWriteCallback} for the contract and
     *                 for why {@code onQueued} — not {@code onWritten} — is the point at which a
     *                 caller may discard its own copy of the data. May be {@code null}.
     */
    void handle(AppEventPayload payload, AppEventWriteCallback callback);
}
