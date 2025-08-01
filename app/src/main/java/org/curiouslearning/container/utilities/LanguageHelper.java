package org.curiouslearning.container.utilities;
import android.content.Context;

import java.util.*;

public class LanguageHelper {

    // Map of region codes to their prioritized languages
    private static final Map<String, List<String>> regionLanguageMap = new HashMap<>();

    static {
        // Add regional languages for India (IN)
        regionLanguageMap.put("IN", Arrays.asList(
                "Hindi", "Marathi", "Gujarati", "Bengali",
                "Tamil", "Telugu", "Kannada", "Malayalam", "Punjabi", "Odia"
        ));

        // You can add more countries and their top languages here as needed
        regionLanguageMap.put("PK", Arrays.asList("Urdu", "Punjabi", "Sindhi"));
        regionLanguageMap.put("BD", Arrays.asList("Bengali"));
    }

    // ✅ Safe & Play Store-compliant country detection (no permissions required)
    public static String getUserCountry() {
        return Locale.getDefault().getCountry(); // e.g., "IN" for India
    }

    // Method to sort languages based on user's region
    public static List<String> getSortedLanguageListForUserRegion(List<String> allLanguages) {
        String userCountry = getUserCountry();
        List<String> prioritizedLanguages = regionLanguageMap.getOrDefault(userCountry, new ArrayList<>());

        List<String> sortedList = new ArrayList<>();

        // Add regional languages first (if available in the original list)
        for (String lang : prioritizedLanguages) {
            if (allLanguages.contains(lang)) {
                sortedList.add(lang);
            }
        }

        // Add the rest of the languages keeping the original order
        for (String lang : allLanguages) {
            if (!sortedList.contains(lang)) {
                sortedList.add(lang);
            }
        }

        return sortedList;
    }
}
