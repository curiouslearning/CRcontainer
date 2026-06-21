package org.curiouslearning.container.core.subapp.handler;

import org.curiouslearning.container.core.subapp.payload.AppEventPayload;

public interface AppEventPayloadHandler {
    void handle(AppEventPayload payload);
}
