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
}
