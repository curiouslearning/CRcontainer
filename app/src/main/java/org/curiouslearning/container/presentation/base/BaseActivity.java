package org.curiouslearning.container.presentation.base;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import org.curiouslearning.container.BuildConfig;

public abstract class BaseActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        hideActionBar();
    }

    protected void hideActionBar() {
        try {
            getSupportActionBar().hide();
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onBackPressed() {
        if (BuildConfig.ALLOW_BACK_NAVIGATION) {
            super.onBackPressed();
        }
    }
}
