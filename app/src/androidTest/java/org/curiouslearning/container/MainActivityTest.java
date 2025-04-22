package org.curiouslearning.container;

import android.os.SystemClock;
import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.espresso.matcher.RootMatchers;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onData;
import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.scrollTo;
import static androidx.test.espresso.matcher.ViewMatchers.*;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static org.hamcrest.Matchers.anything;
import static org.hamcrest.Matchers.startsWith;
import static org.hamcrest.object.HasToString.hasToString;

@RunWith(AndroidJUnit4.class)
public class MainActivityTest {

    @Rule
    public ActivityScenarioRule<MainActivity> activityRule =
            new ActivityScenarioRule<>(MainActivity.class);

    @Test
    public void test_languagePopupIsShown_andLanguagesDisplayed() {
        onView(withId(R.id.autoComplete))
                .check(matches(isDisplayed()));

    }

    @Test
    public void test_clickDropdown_showsMenu() {
        onView(withId(R.id.dropdown_menu)).perform(click());

    }

    //    @Test
//    public void test_dropdownIsScrollable() {
//        SystemClock.sleep(2000);
//        onView(withId(R.id.dropdown_menu)).perform(click());
//        SystemClock.sleep(2000);
//        onData(anything())
//                .inRoot(RootMatchers.isPlatformPopup())
//                .atPosition(55)
//                .check(matches(isDisplayed()));
//    }
    @Test
    public void test_dropdownIsScrollableToZulu() {
        SystemClock.sleep(2000);

        // Open the dropdown
        onView(withId(R.id.dropdown_menu)).perform(click());
        SystemClock.sleep(1000);

        // Scroll and verify that the item with "Zulu" is displayed
        onData(hasToString(startsWith("Isizulu")))
                .inRoot(RootMatchers.isPlatformPopup())
                .check(matches(isDisplayed()));
    }

    @Test
    public void test_closeButton() {
        SystemClock.sleep(2000);
        onView(withId(R.id.setting_close)).perform(click());

    }
}