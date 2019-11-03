package com.trantronghien85.graphql_client.utils;

import android.content.Context;
import android.content.SharedPreferences;

import com.google.gson.Gson;
import com.trantronghien85.App;


/**
 * Created by admin on 6/1/2018.
 */

public class SharedPrefs {
    private static final String PREFS_NAME = "share_prefs";
    private static SharedPrefs mInstance;
    private SharedPreferences mSharedPreferences;

    private SharedPrefs() {
        mSharedPreferences = App.getContext()
                .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    public static SharedPrefs getInstance() {
        if (mInstance == null) {
            mInstance = new SharedPrefs();
        }
        return mInstance;
    }

    public static void destroy() {
        if (mInstance != null) {
            mInstance = null;
        }
    }

    /**
     * you can save a object using gson
     *
     * @param key
     * @param data
     * @param <T>
     */
    public <T> void put(String key, T data) {
        SharedPreferences.Editor editor = mSharedPreferences.edit();
        if (data instanceof String) {
            editor.putString(key, (String) data);
        } else if (data instanceof Boolean) {
            editor.putBoolean(key, (Boolean) data);
        } else if (data instanceof Float) {
            editor.putFloat(key, (Float) data);
        } else if (data instanceof Integer) {
            editor.putInt(key, (Integer) data);
        } else if (data instanceof Long) {
            editor.putLong(key, (Long) data);
        } else {
            editor.putString(key, getGSon().toJson(data));
        }
        editor.apply();
    }

    /**
     * you can get a object form SharedPrefs
     *
     * @param key
     * @param anonymousClass
     * @param <T>
     * @return
     */
    @SuppressWarnings("unchecked")
    public <T> T get(String key, Class<T> anonymousClass) {
        if (anonymousClass == String.class) {
            return (T) mSharedPreferences.getString(key, "");
        } else if (anonymousClass == Boolean.class) {
            return (T) Boolean.valueOf(mSharedPreferences.getBoolean(key, false));
        } else if (anonymousClass == Float.class) {
            return (T) Float.valueOf(mSharedPreferences.getFloat(key, 0));
        } else if (anonymousClass == Integer.class) {
            return (T) Integer.valueOf(mSharedPreferences.getInt(key, 0));
        } else if (anonymousClass == Long.class) {
            return (T) Long.valueOf(mSharedPreferences.getLong(key, 0));
        } else {
            return getGSon().fromJson(mSharedPreferences.getString(key, ""), anonymousClass);
        }
    }

    /**
     * ìf you want to change defaultValue when getOject form SharedPrefs
     *
     * @param key
     * @param anonymousClass
     * @param defaultValue
     * @param <T>
     * @return
     */
    @SuppressWarnings("unchecked")
    public <T> T get(String key, Class<T> anonymousClass, T defaultValue) {
        if (anonymousClass == String.class) {
            return (T) mSharedPreferences.getString(key, (String) defaultValue);
        } else if (anonymousClass == Boolean.class) {
            return (T) Boolean.valueOf(mSharedPreferences.getBoolean(key, (Boolean) defaultValue));
        } else if (anonymousClass == Float.class) {
            return (T) Float.valueOf(mSharedPreferences.getFloat(key, (Float) defaultValue));
        } else if (anonymousClass == Integer.class) {
            return (T) Integer.valueOf(mSharedPreferences.getInt(key, (Integer) defaultValue));
        } else if (anonymousClass == Long.class) {
            return (T) Long.valueOf(mSharedPreferences.getLong(key, (Long) defaultValue));
        } else {
            return getGSon()
                    .fromJson(mSharedPreferences.getString(key, ""), anonymousClass);
        }
    }

    /**
     * @param key remove follow key
     */
    public void remove(String key) {
        mSharedPreferences.edit().remove(key).commit();
    }

    /**
     * clear all data
     */
    public void clear() {
        mSharedPreferences.edit().clear().apply();
    }

    private Gson getGSon() {
        return new Gson();
    }
}

