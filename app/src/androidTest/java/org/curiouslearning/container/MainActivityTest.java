package org.curiouslearning.container;

import android.os.SystemClock;
import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.espresso.matcher.RootMatchers;
import androidx.test.espresso.contrib.RecyclerViewActions;

import org.junit.FixMethodOrder;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;

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
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class MainActivityTest {

    @Rule
    public ActivityScenarioRule<MainActivity> activityRule =
            new ActivityScenarioRule<>(MainActivity.class);

    @Test
    public void test01_languagePopupIsShown_andLanguagesDisplayed() {
        onView(withId(R.id.autoComplete))
                .check(matches(isDisplayed()));

    }

    @Test
    public void test02_clickDropdown_showsMenu() {
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
    public void test03_dropdownIsScrollableToZulu() {
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
    public void test04_closeButton() {
        SystemClock.sleep(2000);
        onView(withId(R.id.setting_close)).perform(click());

    }
    @Test
    public void test05_languageChangeViaSettingsButton() {
        SystemClock.sleep(2000);

        onView(withId(R.id.dropdown_menu)).perform(click());
        SystemClock.sleep(1000);

        onData(hasToString(startsWith("Isizulu")))
                .inRoot(RootMatchers.isPlatformPopup())
                .check(matches(isDisplayed())).perform(click());

        SystemClock.sleep(3000);
        onView(withId(R.id.settings)).perform(click());
        SystemClock.sleep(1000);
        onView(withId(R.id.dropdown_menu)).perform(click());
        SystemClock.sleep(1000);

        onData(hasToString(startsWith("हिन्दी")))
                .inRoot(RootMatchers.isPlatformPopup())
                .check(matches(isDisplayed())).perform(click());

    }
    @Test
    public void test06_webappScreenIsScrollable(){
        SystemClock.sleep(2000);
        onView(withId(R.id.recycleView))
                .perform(RecyclerViewActions.scrollToPosition(15));
        SystemClock.sleep(2000);
        onView(withId(R.id.recycleView))
                .perform(RecyclerViewActions.scrollToPosition(0));
    }
    @Test
    public void test07_clickSettingButton() {
        SystemClock.sleep(1000);
        onView(withId(R.id.settings)).perform(click());
        SystemClock.sleep(1000);
        onView(withId(R.id.dropdown_menu)).perform(click());
    }
}