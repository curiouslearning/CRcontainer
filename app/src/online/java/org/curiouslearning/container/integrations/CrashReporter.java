package org.curiouslearning.container.integrations;

import java.util.Map;

import io.sentry.Breadcrumb;
import io.sentry.Sentry;
import io.sentry.SentryLevel;

/**
 * Error-reporting facade for the {@code online} flavor, backed by Sentry. The standalone flavors
 * ship a twin that only logs, since they do not contain the Sentry SDK.
 */
public final class CrashReporter {

    private CrashReporter() {
    }

    /** Reports a non-fatal condition as a Sentry message event. */
    public static void message(String message) {
        Sentry.captureMessage(message);
    }

    /** Attaches an INFO breadcrumb that later events will carry as context. */
    public static void breadcrumb(String category, String message, Map<String, Object> data) {
        Breadcrumb crumb = new Breadcrumb();
        crumb.setCategory(category);
        crumb.setLevel(SentryLevel.INFO);
        crumb.setMessage(message);
        if (data != null) {
            for (Map.Entry<String, Object> entry : data.entrySet()) {
                crumb.setData(entry.getKey(), entry.getValue());
            }
        }
        Sentry.addBreadcrumb(crumb);
    }
}
