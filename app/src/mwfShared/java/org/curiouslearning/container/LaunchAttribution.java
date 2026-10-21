package org.curiouslearning.container;

import android.util.Log;

/**
 * Standalone-flavor twin of the online {@code LaunchAttribution}. The offline builds are
 * sideloaded, so there is no Play Install Referrer to read and no Facebook deferred deep link to
 * resolve; neither library is in these APKs. {@code MainActivity} drives its first screen from
 * local state instead.
 */
final class LaunchAttribution {

    private LaunchAttribution() {
    }

    static void start(MainActivity host) {
        host.setReferrerDebugStatus("N/A (standalone build: no Install Referrer, no Facebook SDK)");
        Log.i("LaunchAttribution", "Standalone build: install attribution not collected");
    }
}
