package org.curiouslearning.container.core.context;

import android.content.Context;
import android.content.SharedPreferences;

import java.util.Set;

/**
 * Generic, app-wide key/value store. Not tied to any specific sub-app or
 * feature; any part of the app can stash a value here and read it back
 * later without recomputing or re-fetching it.
 *
 * Backed directly by SharedPreferences, which Android already keeps as an
 * in-memory map after first load (reads don't hit disk) and persists to
 * disk asynchronously, so no separate in-memory cache is kept here. Call
 * {@link #init(Context)} once (e.g. from the Application class) before any
 * other method is used.
 *
 * Only simple values are supported (String, Boolean, Integer, Long, Float,
 * Double) — no arrays, collections, or other object types.
 */
public class AppContext {

    private static final String PREFS_NAME = "app_context_cache";

    private static volatile AppContext instance;

    private volatile SharedPreferences prefs;

    private AppContext() {
    }

    public static AppContext getInstance() {
        if (instance == null) {
            synchronized (AppContext.class) {
                if (instance == null) {
                    instance = new AppContext();
                }
            }
        }
        return instance;
    }

    public synchronized void init(Context context) {
        if (prefs == null) {
            prefs = context.getApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        }
    }

    public void set(AppContextKey key, Object value) {
        if (value == null) {
            throw new IllegalArgumentException("AppContext does not support null values");
        }
        String name = key.name();
        SharedPreferences.Editor editor = requirePrefs().edit();
        if (value instanceof String) {
            editor.putString(name, (String) value);
        } else if (value instanceof Boolean) {
            editor.putBoolean(name, (Boolean) value);
        } else if (value instanceof Integer) {
            editor.putInt(name, (Integer) value);
        } else if (value instanceof Long) {
            editor.putLong(name, (Long) value);
        } else if (value instanceof Float) {
            editor.putFloat(name, (Float) value);
        } else if (value instanceof Double) {
            editor.putFloat(name, ((Double) value).floatValue());
        } else {
            throw new IllegalArgumentException("AppContext only supports simple values "
                    + "(String, Boolean, Integer, Long, Float, Double); got " + value.getClass());
        }
        editor.apply();
    }

    @SuppressWarnings("unchecked")
    public <T> T get(AppContextKey key) {
        return (T) requirePrefs().getAll().get(key.name());
    }

    public boolean contains(AppContextKey key) {
        return requirePrefs().contains(key.name());
    }

    public void remove(AppContextKey key) {
        requirePrefs().edit().remove(key.name()).apply();
    }

    public void clear(Set<AppContextKey> keys) {
        SharedPreferences.Editor editor = requirePrefs().edit();
        for (AppContextKey key : keys) {
            editor.remove(key.name());
        }
        editor.apply();
    }

    public void clearAll() {
        requirePrefs().edit().clear().apply();
    }

    private SharedPreferences requirePrefs() {
        if (prefs == null) {
            throw new IllegalStateException("AppContext.init(Context) must be called before use");
        }
        return prefs;
    }
}
