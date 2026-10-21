package org.curiouslearning.container;

import android.app.Application;

import org.curiouslearning.container.core.context.AppContext;
import org.curiouslearning.container.integrations.AppIntegrations;
import org.curiouslearning.container.utilities.CountryProvider;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        AppContext.getInstance().init(this);

        // Facebook SDK + Sentry in the online flavor; a no-op in the standalone flavors, which do
        // not ship those libraries (see integrations/AppIntegrations in each flavor source set).
        AppIntegrations.init(this);
        // RiveInitializer is auto-initialized via AndroidManifest.xml (InitializationProvider)

        // MR-156: load the cached country and refresh it when the 7-day TTL lapses,
        // so the payload handler can stamp metadata.country with no event-time I/O.
        CountryProvider.init(this);
        CountryProvider.refreshCountryIfStale(this);
    }
}
