package org.curiouslearning.container.data.model.WebAppV2;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "web_app_table_v2")
public class WebAppV2 {

    @PrimaryKey(autoGenerate = false)
    private int appId;

    private String title;

    private String language;

    private String appUrl;

    private String appIconUrl;

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

}
