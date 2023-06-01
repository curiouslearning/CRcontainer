package org.curiouslearning.container.data.remote;

import org.curiouslearning.container.data.model.WebApp;

import java.util.List;

public class ManifestResponse {
    private Version version;
    private List<WebApp> webApps;

    public Version getVersion() {
        return version;
    }

    public void setVersion(Version version) {
        this.version = version;
    }

    public List<WebApp> getWebApps() {
        return webApps;
    }

    public void setWebApps(List<WebApp> webApps) {
        this.webApps = webApps;
    }

    public static class Version {
        private double version;

        public double getVersion() {
            return version;
        }

        public void setVersion(double version) {
            this.version = version;
        }
    }
}
