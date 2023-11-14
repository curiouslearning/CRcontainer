package org.curiouslearning.container.utilities;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import org.curiouslearning.container.MainActivity;

public class DeepLinkHelper {
    public static String handleDeepLink(Activity activity, Intent intent) {
        if (Intent.ACTION_VIEW.equals(intent.getAction())) {
            Uri uri = intent.getData();
            String scheme = uri.getScheme();
            String host = uri.getHost();
            String pathPrefix = uri.getPath();
            if (scheme != null && scheme.equals("curiousreader")
                    && host != null && host.equals("app")
                    && pathPrefix != null && pathPrefix.startsWith("/language")) {

                String language = pathPrefix.substring("/language=".length());
                Intent mainIntent = new Intent(activity, MainActivity.class);
                mainIntent.putExtra("language", language);
                activity.startActivity(mainIntent);
                return language;
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

