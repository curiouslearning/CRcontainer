package org.curiouslearning.container.utilities;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import org.curiouslearning.container.MainActivity;

public class DeepLinkHelper {
    public static String handleDeepLink(Activity activity, Intent intent) {
        if (Intent.ACTION_VIEW.equals(intent.getAction())) {
            Uri uri = intent.getData();
            if (uri != null) {
                String scheme = uri.getScheme();
                String host = uri.getHost();
                String path = uri.getPath();
                String code = uri.getQueryParameter("code");
                if ("https".equals(scheme) && "www.curiouslearning.org".equals(host)
                        && "/app".equals(path) && code != null) {
                    Intent mainIntent = new Intent(activity, MainActivity.class);
                    mainIntent.putExtra("code", code);
                    activity.startActivity(mainIntent);
                    return code;
                }
            }
        }
        redirectToPlayStore(activity);
        return "";
    }

    private static void redirectToPlayStore(Activity activity) {
        Intent marketIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=org.curiouslearning.container"));
        activity.startActivity(marketIntent);
    }
}

