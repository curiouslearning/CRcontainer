package org.curiouslearning.container.data.model;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "web_app_table")
public class WebApp {

    @PrimaryKey(autoGenerate = false)
    private int appId;

    private String title;

    private String language;

    private String appUrl;

    private String appIconUrl;

    private String languageInEnglishName;

    // Sourced from the manifest's "app_id" key. Kept snake_case (unlike this entity's other
    // on-device-only fields) so Gson maps it 1:1 with no @SerializedName, matching the precedent
    // already set by AppEventPayload.app_id for cross-boundary/Firestore-facing identifiers.
    // Distinct from appId above (the local Room primary key/selection index) — nullable since a
    // manifest entry may predate this field's server-side rollout.
    private String app_id;

    public int getAppId() {
        return appId;
    }

    public void setAppId(int appId) {
        this.appId = appId;
    }

    public String getAppUrl() {
        return appUrl;
    }

    public void setAppUrl(String appUrl) {
        this.appUrl = appUrl;
    }

    public String getAppIconUrl() {
        return appIconUrl;
    }

    public void setAppIconUrl(String appIconUrl) {
        this.appIconUrl = appIconUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getLanguage() {
        return language;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLanguageInEnglishName() {
        return languageInEnglishName;
    }

    public void setLanguageInEnglishName(String languageInEnglishName) {
        this.languageInEnglishName = languageInEnglishName;
    }

    public String getApp_id() {
        return app_id;
    }

    public void setApp_id(String app_id) {
        this.app_id = app_id;
    }

}
