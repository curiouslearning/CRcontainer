package org.curiouslearning.container.presentation.webapp;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.WebView;

public class MonsterStateManager {
    private final SharedPreferences sharedPref;
    private final WebView webView;
    private final String language;
    private final String languageInEnglishName;
    private final boolean isFtmApp;

    private Handler monsterStateCheckHandler;
    private Runnable monsterStateCheckRunnable;
    private boolean isMonsterCheckRunning;

    public MonsterStateManager(Context context, WebView webView, SharedPreferences sharedPref, 
                               String language, String languageInEnglishName, boolean isFtmApp) {
        this.webView = webView;
        this.sharedPref = sharedPref;
        this.language = language;
        this.languageInEnglishName = languageInEnglishName;
        this.isFtmApp = isFtmApp;
    }

    public void queryMonsterEvolutionState() {
        String javascript = "(function() {" +
                "  try {" +
                "    if (typeof window.getMonsterEvolutionState === \"function\") {" +
                "      var state = window.getMonsterEvolutionState();" +
                "      if (state && window.Android && window.Android.onMonsterEvolutionStateReceived) {" +
                "        window.Android.onMonsterEvolutionStateReceived(JSON.stringify(state));" +
                "        console.log(\"Monster evolution state sent to Android:\", state);" +
                "        return true;" +
                "      }" +
                "    } else {" +
                "      console.log(\"getMonsterEvolutionState API not available yet\");" +
                "    }" +
                "    return false;" +
                "  } catch (e) {" +
                "    console.error(\"Error getting monster evolution state: \" + e.message);" +
                "    return false;" +
                "  }" +
                "})();";

        webView.evaluateJavascript(javascript, null);
    }

    public void startPeriodicMonsterStateCheck() {
        if (monsterStateCheckHandler == null) {
            monsterStateCheckHandler = new Handler(Looper.getMainLooper());
        }

        if (monsterStateCheckRunnable == null) {
            monsterStateCheckRunnable = new Runnable() {
                @Override
                public void run() {
                    if (webView != null && isFtmApp) {
                        queryMonsterEvolutionState();
                        monsterStateCheckHandler.postDelayed(this, 5000);
                    } else {
                        isMonsterCheckRunning = false;
                    }
                }
            };
        }

        if (isMonsterCheckRunning) {
            return;
        }
        isMonsterCheckRunning = true;

        monsterStateCheckHandler.removeCallbacks(monsterStateCheckRunnable);
        monsterStateCheckHandler.postDelayed(monsterStateCheckRunnable, 5000);
    }

    public void stopPeriodicMonsterStateCheck() {
        if (monsterStateCheckHandler != null && monsterStateCheckRunnable != null) {
            monsterStateCheckHandler.removeCallbacks(monsterStateCheckRunnable);
        }
        isMonsterCheckRunning = false;
    }

    public void onResume() {
        if (webView != null && isFtmApp && !isMonsterCheckRunning) {
            startPeriodicMonsterStateCheck();
        }
    }

    public void onMonsterEvolutionStateReceived(String jsonState) {
        Log.d("MonsterStateManager", "Monster evolution state received: " + jsonState);
        try {
            org.json.JSONObject stateJson = new org.json.JSONObject(jsonState);
            boolean hasError = stateJson.has("error");

            if (!hasError) {
                int monsterPhase = computeMonsterPhase(stateJson);
                Integer stars = optIntFromAnyKey(stateJson,
                        "successStars", "success_stars", "stars", "totalStars", "total_stars");
                int successStars = (stars != null) ? stars : 0;

                if (languageInEnglishName != null && !languageInEnglishName.trim().isEmpty()) {
                    storeMonsterPhaseForLanguage(languageInEnglishName, monsterPhase, successStars,
                            stateJson.optLong("timestamp", System.currentTimeMillis()));
                }
                if (language != null && !language.trim().isEmpty()) {
                    storeMonsterPhaseForLanguage(language, monsterPhase, successStars,
                            stateJson.optLong("timestamp", System.currentTimeMillis()));
                }

                SharedPreferences.Editor editor = sharedPref.edit();
                editor.putBoolean("ftm_downloaded", true);
                editor.apply();

                Log.d("MonsterStateManager", "Stored monster phase. languageInEnglishName=\"" + languageInEnglishName
                        + "\", language=\"" + language + "\", phase=" + monsterPhase + ", stars=" + successStars);
            } else if (hasError) {
                Log.w("MonsterStateManager", "Monster state not ready: " + stateJson.optString("error", "UNKNOWN"));
            }
        } catch (org.json.JSONException e) {
            Log.e("MonsterStateManager", "Error parsing monster evolution state JSON", e);
        }
    }

    private int computeMonsterPhase(org.json.JSONObject stateJson) {
        Integer explicitPhase = optIntFromAnyKey(stateJson,
                "monsterPhase", "monster_phase", "phase", "monster_phase_index");
        if (explicitPhase != null) {
            return Math.max(0, Math.min(3, explicitPhase));
        }

        Integer stars = optIntFromAnyKey(stateJson,
                "successStars", "success_stars", "stars", "totalStars", "total_stars");
        int successStars = (stars != null) ? stars : 0;

        if (successStars >= 63) return 3;
        if (successStars >= 38) return 2;
        if (successStars >= 12) return 1;
        return 0;
    }

    private Integer optIntFromAnyKey(org.json.JSONObject obj, String... keys) {
        if (obj == null || keys == null) return null;
        for (String k : keys) {
            if (k == null) continue;
            if (obj.has(k)) {
                try {
                    return obj.getInt(k);
                } catch (Exception ignored) {}
            }
        }
        return null;
    }

    private void storeMonsterPhaseForLanguage(String language, int phase, int successStars, long timestamp) {
        try {
            if (language == null || language.trim().isEmpty()) {
                Log.w("MonsterStateManager", "Missing language key for monster phase; skipping");
                return;
            }
            String mapJson = sharedPref.getString("ftm_monster_phases_map", "{}");
            org.json.JSONObject phasesMap = new org.json.JSONObject(mapJson);
            org.json.JSONObject languageData = new org.json.JSONObject();
            languageData.put("monsterPhase", phase);
            languageData.put("successStars", successStars);
            languageData.put("timestamp", timestamp);
            phasesMap.put(language, languageData);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putString("ftm_monster_phases_map", phasesMap.toString());
            editor.apply();
            Log.d("MonsterStateManager", "Updated monster phase map for language: " + language);
        } catch (org.json.JSONException e) {
            Log.e("MonsterStateManager", "Error storing monster phase for language: " + language, e);
        }
    }
}
