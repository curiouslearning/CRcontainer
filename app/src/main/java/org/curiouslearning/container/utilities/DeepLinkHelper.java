package org.curiouslearning.container.utilities;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import org.curiouslearning.container.MainActivity;

public class DeepLinkHelper {
    public static void handleDeepLink(Activity activity, Intent intent) {
        if (Intent.ACTION_VIEW.equals(intent.getAction())) {
            Uri uri = intent.getData();
            if (uri != null) {
                String host = uri.getHost();
                if ("www.curiouslearning.org".equals(host)) {
                    String path = uri.getPath();
                    if ("/app".equals(path)) {
                        String code = uri.getQueryParameter("code");
                        if (code != null) {
                            Intent mainIntent = new Intent(activity, MainActivity.class);
                            mainIntent.putExtra("code", code);
                            activity.startActivity(mainIntent);
                            return;
                        }
                    }
                }
            }
        }
        redirectToPlayStore(activity);
    }

    private static void redirectToPlayStore(Activity activity) {
        Intent marketIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=org.curiouslearning.container"));
        activity.startActivity(marketIntent);
    }
}

