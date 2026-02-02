package org.curiouslearning.container.utilities;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.util.Log;

public class AppUtils {

    public static String getAppVersionName(Context context) {
        String versionName = "";
        try {
            PackageManager packageManager = context.getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
            versionName = packageInfo.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            Log.d("WebView",e.toString());
        }
        return versionName;
    }

    public static String convertEpochToDate(long epochMillis) {
        java.util.Date date = new java.util.Date(epochMillis);
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd MMM yyyy hh:mm a", java.util.Locale.getDefault());
        sdf.setTimeZone(java.util.TimeZone.getDefault());
        return sdf.format(date);
    }
}
