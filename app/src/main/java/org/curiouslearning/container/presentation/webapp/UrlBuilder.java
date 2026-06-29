package org.curiouslearning.container.presentation.webapp;

import android.net.Uri;
import android.util.Log;
import io.sentry.Sentry;

public class UrlBuilder {

    public static String buildUrl(String appUrl, String pseudoId, String source, String campaignId, boolean isFtmApp) {
        String builtUrl = appUrl;

        if (isFtmApp) {
            Log.d("UrlBuilder", ">> url source and campaign params added to the subapp url: source=" + source + " campaignId=" + campaignId);
            if (source != null && !source.isEmpty()) {
                builtUrl = addParamToUrl(builtUrl, "source", source);
            } else {
                Sentry.captureMessage("Missing source when building URL for app: " + builtUrl);
                Log.w("UrlBuilder", "Missing source parameter for app: " + builtUrl);
            }
            
            if (campaignId != null && !campaignId.isEmpty()) {
                builtUrl = addParamToUrl(builtUrl, "campaign_id", campaignId);
            } else {
                Sentry.captureMessage("Missing campaign_id when building URL for app: " + builtUrl);
                Log.w("UrlBuilder", "Missing campaign_id parameter for app: " + builtUrl);
            }
        }

        if (builtUrl.contains("docs.google.com/forms")) {
            builtUrl = addCrUserIdToFormUrl(builtUrl, pseudoId);
        } else {
            builtUrl = addParamToUrl(builtUrl, "cr_user_id", pseudoId);
            if (pseudoId == null || pseudoId.isEmpty()) {
                Sentry.captureMessage("Missing cr_user_id for app: " + builtUrl);
                Log.e("UrlBuilder", "Missing cr_user_id when building URL");
            }
        }

        return builtUrl;
    }

    private static String addParamToUrl(String url, String param, String value) {
        Uri originalUri = Uri.parse(url);
        String separator = (originalUri.getQuery() == null) ? "?" : "&";
        return originalUri.toString() + separator + param + "=" + value;
    }

    private static String addCrUserIdToFormUrl(String appUrl, String pseudoId) {
        Uri originalUri = Uri.parse(appUrl);
        String separator = (originalUri.getQuery() == null) ? "?" : "&";
        return originalUri.toString() + pseudoId + separator + "cr_user_id=" + pseudoId;
    }
}
