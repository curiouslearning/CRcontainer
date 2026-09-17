package org.curiouslearning.container.core.subapp.payload;

import java.util.Map;

public class AppEventPayload {

    public String cr_user_id;
    public String app_id;
    public String collection;
    public Object data;
    public Map<String, String> options;
    public Map<String, Object> metadata;
    public Map<String, Object> attribution;
    public String timestamp;
    public String schema_version;

    /**
     * The language this payload's data belongs to, overriding live {@code AppContext} state. <b>Java
     * only</b> — {@code AppEventEmitter.emitJson} rejects it from a sub-app, which must not relabel its own.
     */
    public String container_language;
}
