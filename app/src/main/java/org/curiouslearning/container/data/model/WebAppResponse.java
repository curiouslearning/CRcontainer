package org.curiouslearning.container.data.model;


import org.curiouslearning.container.data.model.WebAppV1.WebAppV1;
import org.curiouslearning.container.data.model.WebAppV2.WebAppV2;

import java.util.ArrayList;
import java.util.List;

public class WebAppResponse {
    private String version;
    private Integer majorVersion;

    private List<WebApp> web_apps;
    private List<WebAppV1> web_apps_v1;
    private List<WebAppV2> web_apps_v2;

    public String getVersion() {
        return version;
    }

    public List<WebApp> getWebApps() {
        majorVersion = Integer.parseInt(version.split("\\.")[0]);
        List<WebApp> convertedWebApps = new ArrayList<>();
        if (majorVersion == 2) {
            for (WebAppV1 webAppV1 : web_apps_v1) {
                WebApp webApp = new WebApp();
                webApp.setAppId(webAppV1.getAppId());
                webApp.setTitle(webAppV1.getTitle());
                webApp.setLanguage(webAppV1.getLanguage());
                webApp.setAppUrl(webAppV1.getAppUrl());
                webApp.setAppIconUrl(webAppV1.getAppIconUrl());
                convertedWebApps.add(webApp);
            }
            return convertedWebApps;
        } else if (majorVersion == 3) {
            for (WebAppV2 webAppV2 : web_apps_v2) {
                WebApp webApp = new WebApp();
                webApp.setAppId(webAppV2.getAppId());
                webApp.setTitle(webAppV2.getTitle());
                webApp.setLanguage(webAppV2.getLanguage());
                webApp.setAppUrl(webAppV2.getAppUrl());
                webApp.setAppIconUrl(webAppV2.getAppIconUrl());
                convertedWebApps.add(webApp);
            }
            return convertedWebApps;
        } else {
            return web_apps;
        }
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public void setWebApp(List<WebApp> webApps) {
        this.web_apps = webApps;
    }
}
