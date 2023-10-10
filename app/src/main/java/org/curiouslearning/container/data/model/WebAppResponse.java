package org.curiouslearning.container.data.model;

import org.curiouslearning.container.data.model.WebAppV1.WebAppV1;
import org.curiouslearning.container.data.model.WebAppV2.WebAppV2;
import java.util.List;

public class WebAppResponse {
    private String version;
    private List<WebApp> web_apps;

    public String getVersion() {
        return version;
    }

    public List<WebApp> getWebApps() {
        return web_apps;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public void setWebApp(List<WebApp> webApps) {
        this.web_apps = webApps;
    }
}
