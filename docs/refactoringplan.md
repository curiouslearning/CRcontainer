# Codebase Refactoring Plan

## Overview

This plan covers a full structural refactoring of the CuriousReader container app. No feature behavior changes. Goal: each file has one clear responsibility, package structure communicates architecture intent, and new contributors can navigate the codebase without a tour.

**Fixed constraints — must not change:**

| Setting | Current value | Notes |
|---|---|---|
| minSdk | 24 (Android 7.0 Nougat) | Low-end device support floor — must not increase |
| targetSdk | 35 (Android 15) | Must not change |
| compileSdk | 35 | Must not change |
| Java source compatibility | 1.8 (Java 8) | All code must compile at Java 8 language level |
| Java target compatibility | 1.8 (Java 8) | Output bytecode must target Java 8 |
| Java toolchain | 17 | Compiler version — fine, does not affect language features available in source |
| Gradle | 8.13 | Must not change as part of this refactor |

The Java 8 source compatibility constraint is the most consequential for the refactoring tasks. It means the following language features are off-limits regardless of what the toolchain version supports: sealed classes (Java 17), records (Java 16), text blocks (Java 15), pattern matching for `instanceof` (Java 16), and `var` (Java 10). Any new classes introduced during refactoring must use plain Java 8 class/interface/enum patterns only.

---

## Part 1 — Current State Assessment

MainActivity went from ~1,400 lines to 406 lines through two recent commits by extracting five manager classes: `VisualEffectsManager`, `ReferralManager`, `LanguageDialogManager`, `DebugOverlayManager`, and `StudyEnrollmentManager`. That extraction direction is correct and the listener interface pattern on each manager is the right seam — it decouples managers from the activity without introducing a framework dependency. The following items build on that foundation and address what still needs to be resolved.

### Issues to resolve

**1. All five managers are in `utilities/` — wrong package**

`DebugOverlayManager`, `LanguageDialogManager`, `ReferralManager`, `VisualEffectsManager`, and `StudyEnrollmentManager` all receive an `Activity` or `Context`, manage UI state, and show dialogs. They are presentation-layer coordinators, not utilities. `utilities/` should hold stateless helpers (string/date formatting, connectivity checks, file I/O). These managers need to move to a package that reflects what they actually are.

**2. `dismissLanguagePopupIfShowing()` in `MainActivity` silently no-ops**

`MainActivity` still holds a `Dialog dialog` field initialized to `null`. `dismissLanguagePopupIfShowing()` checks `dialog != null && dialog.isShowing()` — but the actual dialog lives inside `LanguageDialogManager`. The dismiss call never does anything. `StudyEnrollmentManager` calls back `onDismissLanguagePopupIfShowing()` expecting it to work. Fix: call `languageDialogManager.dismissDialog()` directly and remove the dead field.

**3. `StudyEnrollmentManager.StudyEnrollmentListener` has 6 callback methods including one that pulls state back out**

The listener requires `MainActivity` to implement `onDismissLanguagePopupIfShowing`, `onLoadApps`, `onShowLanguagePopup`, `onUpdateDebugOverlay`, `onCachePseudoId`, and `getSelectedLanguage`. `getSelectedLanguage` inverts the data flow — the manager is reaching back to pull state from the activity instead of receiving it. A shared `HomeViewModel` or a `StudyEnrollmentState` LiveData would replace all six callbacks cleanly.

**4. Dead code in `ReferralManager` — `isAttributionComplete` if/else branches**

In `onReferrerReceived`, `isAttributionComplete` is set to `true` and then immediately checked in an if/else — the else branch ("Attribution not complete") can never execute. Same pattern appears in `fetchFacebookDeferredData`. These unreachable branches should be removed.

**5. `LanguageDialogManager.showLanguagePopup()` re-inflates and re-observes on every call**

`dialog.setContentView(R.layout.language_popup)` is called inside `showLanguagePopup()`, so the layout re-inflates every time the dialog opens. The `getAllWebApps().observe(...)` call inside adds a new LiveData observer on each open — observers accumulate over the session. The dialog should be inflated once and the observer registered once.

**6. `VisualEffectsManager` stores wind `ObjectAnimator` instances as View tags**

Wind effect animators are stashed via `foliageView.setTag(R.id.wind_animator_x_tag, ...)`. Retrieving them requires unchecked `Object` casts. These should be class-level fields, consistent with how `breathingAnimator` is already handled.

**7. Button pulse animation lives inside `StudyEnrollmentManager`**

`ObjectAnimator.ofFloat(btnConfirm, "scaleX", ...)` is animation logic inside a class that is not responsible for visual effects. It should be extracted to `AnimationUtil` as a static helper, consistent with how every other animation in the codebase is handled.

**8. `CacheUtils.manifestVersionNumber` is set inside a LiveData observer in `LanguageDialogManager`**

Setting global static state inside an `onChanged` callback is a hidden side effect. `CacheUtils.manifestVersionNumber` should be updated in the repository layer when the manifest is fetched, not inside a dialog observer.

---

## Part 2 — Broader Codebase Issues

### Naming and typo debt

| Current | Correct |
|---|---|
| `presentation/viewmodals/` | `presentation/viewmodels/` |
| `HomeViewModal.java` | `HomeViewModel.java` |
| `data/respository/` | `data/repository/` |
| `WebApp.java` (Activity) | `WebAppActivity.java` |

`WebApp` as both an Activity name and a model class name (`data/model/WebApp.java`) is a naming collision that breaks IDE searches and import disambiguation. The Activity must be renamed.

### `WebApp.java` (Activity) — 554 lines, needs decomposition

Currently holds:

- Intent data extraction and view initialization
- WebView setup and URL building (4 separate `addXxxToUrl` methods)
- JavaScript bridge (`WebAppInterface` inner class)
- Monster evolution state querying and storage
- Periodic polling handler and runnable
- Orientation lock logic
- Firebase analytics event logging

Monster state management alone spans ~130 lines. It should become a `MonsterStateManager` class responsible for querying, parsing, and persisting the monster phase. The JavaScript bridge inner class should move to its own file.

### `InstallReferrerManager.java` — 509 lines

Handles Play Store availability checks, retry logic, and referrer URI parsing in the same class. Retry coordination and URI parsing should be separated:
- `InstallReferrerManager` — lifecycle and retry coordination
- `ReferrerParser` — pure parsing of the referrer URI into language, source, and UTM params (unit-testable in isolation)

### `AnimationUtil.java` — 306 lines of static methods

Already in good shape — stateless, static, single file. Consider splitting into `DialogAnimationUtil` and `ViewAnimationUtil` if it grows further, but not urgent now.

### `DefaultAppEventPayloadHandler.java` — 296 lines

Part of `core/subapp/` which already has the cleanest package organization in the codebase. Review for single-responsibility violations but no structural move needed.

### `AnalyticsUtils.java` — 310 lines of static methods

Mixes Firebase Analytics logging with Crashlytics and Sentry error reporting. Consider extracting Crashlytics/Sentry calls to a dedicated `ErrorReporter` class to keep analytics events separate from error handling.

### `BaseActivity` is nearly empty

Exists only to call `hideActionBar()`. Keep it — it is the right seam for future shared lifecycle hooks — but once action bar configuration moves to themes, it can be removed entirely.

---

## Part 3 — Directory Structure: Before and After

### Current structure

```
org.curiouslearning.container/
│
├── MainActivity.java                              ← root-level activity
├── MyApplication.java                             ← root-level application class
├── WebApp.java                                    ← root-level activity, name collides with model
│
├── core/
│   └── subapp/
│       ├── handler/
│       │   ├── AppEventPayloadHandler.java
│       │   └── DefaultAppEventPayloadHandler.java
│       ├── payload/
│       │   └── AppEventPayload.java
│       └── validation/
│           ├── AppEventPayloadValidator.java
│           └── ValidationResult.java
│
├── data/
│   ├── database/
│   │   ├── DatabaseHelper.java
│   │   ├── WebAppDao.java
│   │   └── WebAppDatabase.java
│   ├── local/
│   │   └── AppManifest.java
│   ├── model/
│   │   ├── WebApp.java                            ← same name as the Activity above
│   │   └── WebAppResponse.java
│   ├── remote/
│   │   ├── ApiService.java
│   │   └── RetrofitInstance.java
│   └── respository/                               ← typo
│       └── WebAppRepository.java
│
├── firebase/
│   └── AnalyticsUtils.java
│
├── installreferrer/
│   └── InstallReferrerManager.java
│
├── presentation/
│   ├── adapters/
│   │   ├── LanguageDropdownAdapter.java
│   │   └── WebAppsAdapter.java
│   ├── base/
│   │   └── BaseActivity.java
│   └── viewmodals/                                ← typo
│       └── HomeViewModal.java                     ← typo
│
├── security/
│   ├── CryptoUtils.java
│   └── KeyStoreManager.java
│
└── utilities/                                     ← mix of true utilities and presentation managers
    ├── AnimationUtil.java
    ├── AppUtils.java
    ├── AudioPlayer.java
    ├── CacheUtils.java
    ├── ConfigLoader.java
    ├── ConnectionUtils.java
    ├── DebugOverlayManager.java                   ← presentation manager, wrong package
    ├── DeepLinkHelper.java
    ├── FileUtils.java
    ├── ImageLoader.java
    ├── LanguageDialogManager.java                 ← presentation manager, wrong package
    ├── PulsingView.java
    ├── ReferralManager.java                       ← presentation coordinator, wrong package
    ├── SlackUtils.java
    ├── StudyEnrollmentManager.java                ← business logic, wrong package
    └── VisualEffectsManager.java                  ← presentation manager, wrong package
```

---

### After refactoring

```
org.curiouslearning.container/
│
├── app/
│   └── MyApplication.java
│
├── core/
│   └── subapp/
│       ├── handler/
│       │   ├── AppEventPayloadHandler.java
│       │   └── DefaultAppEventPayloadHandler.java
│       ├── payload/
│       │   └── AppEventPayload.java
│       └── validation/
│           ├── AppEventPayloadValidator.java
│           └── ValidationResult.java
│
├── data/
│   ├── database/
│   │   ├── DatabaseHelper.java
│   │   ├── WebAppDao.java
│   │   └── WebAppDatabase.java
│   ├── local/
│   │   └── AppManifest.java
│   ├── model/
│   │   ├── WebAppModel.java                       ← renamed from WebApp.java
│   │   └── WebAppResponse.java
│   ├── remote/
│   │   ├── ApiService.java
│   │   └── RetrofitInstance.java
│   └── repository/                                ← typo fixed
│       └── WebAppRepository.java
│
├── attribution/                                   ← new package, replaces installreferrer/
│   ├── InstallReferrerManager.java
│   ├── ReferrerParser.java                        ← extracted from InstallReferrerManager
│   └── AttributionState.java                      ← extracted from ReferrerStatus
│
├── analytics/                                     ← new package, replaces firebase/
│   ├── AnalyticsUtils.java
│   └── ErrorReporter.java                         ← extracted Crashlytics/Sentry calls
│
├── deeplink/                                      ← new package
│   └── StudyEnrollmentManager.java                ← moved from utilities/
│
├── presentation/
│   ├── base/
│   │   └── BaseActivity.java
│   │
│   ├── home/                                      ← new sub-package
│   │   ├── HomeActivity.java                      ← renamed from MainActivity, moved here
│   │   ├── HomeViewModel.java                     ← renamed + typo fixed, moved here
│   │   ├── adapters/                              ← moved from presentation/adapters/
│   │   │   ├── LanguageDropdownAdapter.java
│   │   │   └── WebAppsAdapter.java
│   │   └── managers/                              ← new sub-package for presentation coordinators
│   │       ├── DebugOverlayManager.java           ← moved from utilities/
│   │       ├── LanguageDialogManager.java         ← moved from utilities/
│   │       ├── ReferralCoordinator.java           ← renamed + moved from utilities/
│   │       └── VisualEffectsManager.java          ← moved from utilities/
│   │
│   └── webapp/                                    ← new sub-package
│       ├── WebAppActivity.java                    ← renamed from WebApp.java, moved here
│       ├── WebAppJsBridge.java                    ← extracted from WebAppActivity
│       └── MonsterStateManager.java               ← extracted from WebAppActivity
│
├── security/
│   ├── CryptoUtils.java
│   └── KeyStoreManager.java
│
└── util/                                          ← renamed from utilities/, only true utilities remain
    ├── AnimationUtil.java
    ├── AppUtils.java
    ├── AudioPlayer.java
    ├── CacheUtils.java
    ├── ConfigLoader.java
    ├── ConnectionUtils.java
    ├── DeepLinkHelper.java
    ├── FileUtils.java
    ├── ImageLoader.java
    ├── PulsingView.java
    └── SlackUtils.java
```

---

## Part 4 — Step-by-Step Execution

Each task is independently shippable. Do them in phase order — later phases have dependencies on earlier ones, called out explicitly. Always confirm the build compiles and the app runs before moving to the next task.

**Java 8 source compatibility applies throughout.** The project sets `sourceCompatibility JavaVersion.VERSION_1_8` and `targetCompatibility JavaVersion.VERSION_1_8`. Every new class, interface, and method introduced across all phases must use only Java 8 language features. No sealed classes, records, text blocks, pattern matching `instanceof`, or `var`. Use enums, static inner classes, and anonymous inner classes where modern Java would use these constructs. The project's minSdk of 24 also means any Android API used in new code must be available from API 24 upward — check the API level annotation on anything unfamiliar before using it.

---

### Phase 1 — Bug fixes and low-risk cleanup

**Overall risk: Low**
All tasks in this phase are surgical — each touches one or two files, changes no feature logic, and has an obvious before/after. None require architectural decisions. The most complex is Task 1.3 (observer lifecycle), but even that is contained to a single class. If any task in this phase causes a regression, the change is small enough to revert immediately. These can be done in any order and have no dependencies on each other.

---

#### Task 1.1 — Fix `dismissLanguagePopupIfShowing`

**Risk:** Low — one method body replacement and one field deletion in a single file. No behavioral change, only makes existing behavior actually work.

**Files:** `MainActivity.java`

1. Open `MainActivity.java` and find the `Dialog dialog` field declaration near the top of the class. Delete that field entirely.
2. Find the `dismissLanguagePopupIfShowing()` method. Replace the entire body — the null check and `dialog.dismiss()` — with a single call to `languageDialogManager.dismissDialog()`.
3. Confirm there are no other usages of the `dialog` field anywhere else in `MainActivity` (there should not be — search for `this.dialog` and bare `dialog` references to be sure).
4. Build. Verify no compile errors. Test that triggering a study enrollment deep link while the language popup is open correctly dismisses the popup.

---

#### Task 1.2 — Remove dead `isAttributionComplete` else branches

**Risk:** Low — deleting unreachable code. No path through the program reaches these branches, so removing them changes nothing at runtime.

**Files:** `ReferralManager.java`

1. Open `ReferralManager.java` and navigate to the `onReferrerReceived` callback inside the `init()` method.
2. Find the block where `isAttributionComplete = true` is set, followed immediately by `if (isAttributionComplete) { ... } else { Log.d(..., "Attribution not complete...") }`. Delete the entire else branch. The if condition is always true so also remove the if wrapper — keep only the body.
3. Navigate to `fetchFacebookDeferredData()`. Find the identical pattern there and apply the same removal.
4. Build. Verify no compile errors.

---

#### Task 1.3 — Fix `LanguageDialogManager` accumulating observers

**Risk:** Medium — moving LiveData observer registration from a method into a constructor requires care around lifecycle owner validity. If the observer is registered before the activity is fully started, or if the dialog is shown from a context where the lifecycle is already destroyed, it could crash. Test by opening and closing the language popup several times in quick succession.

**Files:** `LanguageDialogManager.java`

1. Open `LanguageDialogManager.java`. The constructor currently just stores fields and creates `new Dialog(activity)`.
2. After the `new Dialog(activity)` line in the constructor, add a call to inflate the dialog layout once: set the content view on the dialog here instead of inside `showLanguagePopup()`.
3. Still in the constructor, move the entire `homeViewModal.getAllWebApps().observe(...)` block out of `showLanguagePopup()` and into the constructor. The `LifecycleOwner` is the `activity` parameter — cast it as needed since `Activity` implements `LifecycleOwner` in this project.
4. The observer body (populating the adapter, setting up the dropdown, wiring the item click listener) stays exactly as it is — only its location changes to the constructor.
5. Inside `showLanguagePopup()`, remove the `dialog.setContentView(...)` line and the entire `getAllWebApps().observe(...)` block that was there. The method now only needs to check `!dialog.isShowing()`, configure window properties, set up the close button and gesture detector, then call `dialog.show()` and trigger the open animation.
6. Build. Open the language popup multiple times in a single session and verify it shows correctly each time without duplicate entries in the dropdown.

---

#### Task 1.4 — Fix `VisualEffectsManager` wind animator storage

**Risk:** Low — swapping View tag storage for class fields. Purely internal to `VisualEffectsManager`, no callers change.

**Files:** `VisualEffectsManager.java`

1. Open `VisualEffectsManager.java`. Add two class-level private fields: one for the wind translation animator and one for the wind rotation animator, matching the style of the existing `breathingAnimator` field.
2. In `addWindEffect()`, assign the two created animators to those new class fields instead of calling `foliageView.setTag(...)`. Remove both `setTag` calls.
3. In `pauseWindEffect()`, remove the `foliageView.getTag(...)` calls and the instanceof checks. Replace with direct null checks on the two class fields, then call `.pause()` on each.
4. In `resumeWindEffect()`, apply the same change — remove `getTag` and use the class fields directly.
5. Build. Run the app and verify the foliage wind animation still starts, pauses on background, and resumes on foreground.

---

#### Task 1.5 — Extract button pulse animation to `AnimationUtil`

**Risk:** Low — moving animation logic into a static helper. The only subtlety is returning the animator references so the caller can cancel them; get that return type right and nothing else can go wrong.

**Files:** `StudyEnrollmentManager.java`, `AnimationUtil.java`

1. Open `AnimationUtil.java`. Add a new public static method named `startPulseAnimation` that accepts a `View` parameter. Move the two `ObjectAnimator` constructions from `StudyEnrollmentManager` (the scaleX and scaleY animators) into this method. The method should return an `ObjectAnimator[]` of the two animators so the caller can cancel them later.
2. Open `StudyEnrollmentManager.java` and navigate to `showConfirmIdDialog()`. Replace the inline animator setup with a call to `AnimationUtil.startPulseAnimation(btnConfirm)`, storing the returned array.
3. In the confirm button's click listener, replace `scaleX.cancel()` and `scaleY.cancel()` with cancels on the elements of the returned array.
4. Build. Trigger a study enrollment deep link and verify the confirm button still pulses and stops pulsing on tap.

---

#### Task 1.6 — Remove `CacheUtils.manifestVersionNumber` side effect from `LanguageDialogManager`

**Risk:** Low — relocating one assignment to a more appropriate place. Verify the debug overlay still shows the correct manifest version after the move.

**Files:** `LanguageDialogManager.java`, `WebAppRepository.java`

1. Open `LanguageDialogManager.java`. Inside the `getAllWebApps` observer body, find the line that sets `CacheUtils.manifestVersionNumber`. Delete that line.
2. Open `WebAppRepository.java`. Find `getUpdatedAppManifest()` — this is where updated manifest data comes back from the network. After the manifest data is written to the database, add `CacheUtils.manifestVersionNumber = manifestVersion` here so the cache is updated at the correct layer.
3. Build. Verify the manifest version still appears correctly in the debug overlay.

---

### Phase 2 — Typo and rename fixes

**Overall risk: Medium**
No logic changes — these are pure identifier and directory renames. The risk is missing a reference: one stale import or one manifest entry left unchanged and the build breaks or the app crashes at launch. Use IDE rename tooling where possible to catch every reference automatically. The `WebApp` → `WebAppActivity` rename (Task 2.3) carries the highest individual risk because it touches `AndroidManifest.xml` — a mistake there silently prevents the sub-app screen from ever opening. Always run a full end-to-end test after completing this phase.

Do Task 2.1 before 2.3. Task 2.2 is independent.

---

#### Task 2.1 — Rename `HomeViewModal` → `HomeViewModel`

**Risk:** Medium — four files plus a package directory rename. IDE "Rename" refactor should catch all usages, but verify manually that no string-based reflection references remain.

**Files:** `HomeViewModal.java`, `MainActivity.java`, `ReferralManager.java`, `LanguageDialogManager.java`

1. In the file system, rename the package directory `presentation/viewmodals/` to `presentation/viewmodels/`.
2. Open `HomeViewModal.java`. Rename the file to `HomeViewModel.java`. Update the class declaration from `HomeViewModal` to `HomeViewModel`. Update the `package` declaration line to reflect the new `viewmodels` directory name.
3. Open `MainActivity.java`. Update the import from `viewmodals.HomeViewModal` to `viewmodels.HomeViewModel`. Update the field declaration and the `new HomeViewModal(...)` instantiation to use `HomeViewModel`.
4. Open `ReferralManager.java`. Apply the same import and type reference update.
5. Open `LanguageDialogManager.java`. Apply the same import and type reference update.
6. Search the entire project for any remaining references to `HomeViewModal` or `viewmodals` — update any found.
7. Build. Verify no compile errors.

---

#### Task 2.2 — Fix `respository` typo → `repository`

**Risk:** Low — one file, one package directory, minimal import surface. Straightforward.

**Files:** `WebAppRepository.java`, `HomeViewModel.java`

1. In the file system, rename the directory `data/respository/` to `data/repository/`.
2. Open `WebAppRepository.java`. Update the `package` declaration to use `repository`.
3. Open `HomeViewModel.java`. Update the import for `WebAppRepository` to use the corrected `repository` package path.
4. Search the project for any other imports referencing `data.respository` and update them.
5. Build. Verify no compile errors.

---

#### Task 2.3 — Rename `WebApp` Activity → `WebAppActivity`

**Risk:** Medium — `AndroidManifest.xml` must be updated in the same change or the app will crash when trying to launch a sub-app. The name collision with `data/model/WebApp.java` means IDE tooling may behave unexpectedly during the rename — verify the model class is untouched after the refactor.

**Files:** `WebApp.java`, `AndroidManifest.xml`, `WebAppsAdapter.java`

1. Open `WebApp.java` at the root package. Rename the file to `WebAppActivity.java`. Rename the class declaration from `WebApp` to `WebAppActivity`.
2. Open `AndroidManifest.xml`. Find the `<activity android:name=".WebApp"` entry. Change it to `.WebAppActivity`. Keep all other attributes on that entry unchanged.
3. Open `WebAppsAdapter.java` — this is where tapping an app card fires an Intent to launch the sub-app. Find `new Intent(context, WebApp.class)` and update it to `WebAppActivity.class`. Update the import accordingly.
4. Search the entire project for any other references to `WebApp.class` used in Intent construction and update them.
5. Build. Tap a sub-app card and verify it launches correctly.

---

### Phase 3 — Package moves (no logic changes)

**Overall risk: Low**
Every task in this phase is a file move with a package declaration update and corresponding import updates. Zero logic changes. The main failure mode is a missed import somewhere that only shows up at runtime rather than compile time — which is rare in Java since most class references are compile-time. The high-volume task is 3.4 (renaming `utilities/` → `util/`) which touches the most files, but it is still mechanical. Use IDE "Move" or "Rename Package" tooling to catch all cross-file references in one pass.

**Prerequisite:** Phase 2 must be complete before starting Phase 3, so all class names and the `HomeViewModel` rename are already in place.

Do Tasks 3.1 and 3.2 before 3.4. Task 3.3 can be done alongside 3.1.

---

#### Task 3.1 — Move managers to `presentation/home/managers/`

**Risk:** Low — package declaration and import updates only, no logic changes. Four files move, one file (`MainActivity`) updates its imports.

**Files:** `DebugOverlayManager.java`, `LanguageDialogManager.java`, `VisualEffectsManager.java`, `ReferralManager.java`, `MainActivity.java`

1. Create the directory path `presentation/home/managers/` in the source tree.
2. Move `DebugOverlayManager.java` from `utilities/` into `presentation/home/managers/`. Update its `package` declaration to `org.curiouslearning.container.presentation.home.managers`.
3. Repeat for `LanguageDialogManager.java`, `VisualEffectsManager.java`, and `ReferralManager.java`.
4. Open `MainActivity.java`. Update the four import statements for these classes to point to the new package.
5. Open any other file that imports these classes (check `DebugOverlayManager` is only used in `MainActivity`; `ReferralManager` is also referenced by `DebugOverlayManager` — its import within that file needs updating too).
6. Build. Verify no compile errors.

---

#### Task 3.2 — Move `StudyEnrollmentManager` to `deeplink/`

**Risk:** Low — one file moves, one import updates.

**Files:** `StudyEnrollmentManager.java`, `MainActivity.java`

1. Create the directory `deeplink/` in the source tree.
2. Move `StudyEnrollmentManager.java` from `utilities/` into `deeplink/`. Update its `package` declaration to `org.curiouslearning.container.deeplink`.
3. Open `MainActivity.java`. Update the import for `StudyEnrollmentManager` to the new package.
4. Build. Verify no compile errors.

---

#### Task 3.3 — Move `WebAppActivity` to `presentation/webapp/`

**Risk:** Low — same as other package moves, but requires a manifest update. Test sub-app launch immediately after.

**Prerequisite:** Task 2.3 must be done first.

**Files:** `WebAppActivity.java`, `AndroidManifest.xml`, `WebAppsAdapter.java`

1. Create the directory `presentation/webapp/` in the source tree.
2. Move `WebAppActivity.java` from the root package into `presentation/webapp/`. Update its `package` declaration to `org.curiouslearning.container.presentation.webapp`.
3. Open `AndroidManifest.xml`. Update the activity entry to the full new class path: `org.curiouslearning.container.presentation.webapp.WebAppActivity`.
4. Open `WebAppsAdapter.java`. Update the import for `WebAppActivity` to the new package.
5. Build. Tap a sub-app card and verify it launches correctly.

---

#### Task 3.4 — Rename `utilities/` → `util/`

**Risk:** Low but high volume — 11 files get package declaration updates, and every file across the codebase that imports from `utilities` needs its import updated. The risk is a missed import. Use IDE "Replace in Path" to catch all occurrences in one pass rather than updating file by file.

**Prerequisite:** Tasks 3.1 and 3.2 must be done first so the five managers are already gone from `utilities/`.

**Files:** Every remaining file in `utilities/`, plus every file that imports from it.

1. Rename the `utilities/` directory to `util/`.
2. Open every `.java` file remaining in `util/` and update its `package` declaration from `utilities` to `util`. The affected files are: `AnimationUtil`, `AppUtils`, `AudioPlayer`, `CacheUtils`, `ConfigLoader`, `ConnectionUtils`, `DeepLinkHelper`, `FileUtils`, `ImageLoader`, `PulsingView`, `SlackUtils`.
3. Search the entire project for any import containing `org.curiouslearning.container.utilities` and update each one to `org.curiouslearning.container.util`. This will touch `MainActivity`, `WebAppActivity`, `ReferralManager` (now in managers), `DebugOverlayManager`, `LanguageDialogManager`, `StudyEnrollmentManager`, `WebAppRepository`, `WebApp.java` model files, and others.
4. Use IDE "Replace in Path" or grep to find all occurrences before manually updating — this is high volume.
5. Build. Verify no compile errors.

---

### Phase 4 — Class decomposition

**Overall risk: Medium**
This phase involves actual logic movement, not just renames. Each task creates a new class boundary and introduces a new dependency surface (constructor parameters, callback interfaces, LiveData). The risk in each task is getting the new interface wrong — passing the wrong dependencies, missing a lifecycle call, or introducing a state leak. Tasks 4.1 and 4.2 carry the most surface area because `WebAppActivity` is the largest class and the JS bridge has tricky callback wiring. Task 4.4 (LiveData for `StudyEnrollmentManager`) is the most architecturally significant change and requires the most careful testing. Do not batch multiple tasks in a single commit — ship each one separately so regressions are easy to isolate.

**Prerequisite:** All of Phase 3 must be complete. Tasks 4.1 and 4.2 must be done in order (4.2 depends on 4.1). Tasks 4.3, 4.4, and 4.5 are independent of each other and of 4.1/4.2.

---

#### Task 4.1 — Extract `MonsterStateManager` from `WebAppActivity`

**Risk:** Medium — moving ~130 lines of logic including an async polling loop and SharedPreferences writes into a new class. The lifecycle delegation (`onPause`/`onResume`/`onDestroy`) must be wired correctly or the polling handler will either keep running after the activity is gone (memory leak) or fail to restart when the user returns. Test by backgrounding and foregrounding the FTM app multiple times and verifying monster phase updates stop and resume correctly.

**Files:** `WebAppActivity.java` (new: `MonsterStateManager.java` in `presentation/webapp/`)

1. Create a new file `MonsterStateManager.java` in `presentation/webapp/`.
2. Define the class with a constructor that accepts `SharedPreferences`, the `language` string, and the `languageInEnglishName` string — these are the only external dependencies the monster logic needs.
3. Move the following fields from `WebAppActivity` into `MonsterStateManager`: `monsterStateCheckHandler`, `monsterStateCheckRunnable`, `isMonsterCheckRunning`.
4. Move the following methods from `WebAppActivity` into `MonsterStateManager`: `queryMonsterEvolutionState()`, `startPeriodicMonsterStateCheck()`, `computeMonsterPhase()`, `optIntFromAnyKey()`, `storeMonsterPhaseForLanguage()`. Move the `onMonsterEvolutionStateReceived()` handling logic from `WebAppInterface` into `MonsterStateManager` as well (it will be called by the JS bridge in the next task).
5. Add three lifecycle delegation methods to `MonsterStateManager`: `onPageFinished(WebView webView)` which triggers the initial query and starts periodic checks, `onPause()` which removes callbacks, and `onResume(WebView webView)` which restarts periodic checks.
6. Back in `WebAppActivity`, remove all the moved fields and methods. Instantiate `MonsterStateManager` in `initViews()` or alongside the other field initializations.
7. In the `WebViewClient.onPageFinished` callback inside `loadWebView()`, replace the direct `queryMonsterEvolutionState` and `startPeriodicMonsterStateCheck` calls with `monsterStateManager.onPageFinished(view)`.
8. In `WebAppActivity.onPause()`, `onResume()`, and `onDestroy()`, replace the direct handler/runnable cleanup with `monsterStateManager.onPause()` and `monsterStateManager.onResume(webView)` calls.
9. Build. Launch an FTM app and verify the monster phase still updates correctly.

---

#### Task 4.2 — Extract `WebAppJsBridge` from `WebAppActivity`

**Risk:** Medium — the JS bridge runs on a background thread (WebView JS thread) and the callback methods must be thread-safe. Any `runOnUiThread` calls that currently live implicitly in the inner class via the outer `Activity` reference must be preserved explicitly through the callback interface. Missing one will cause silent failures or crashes.

**Prerequisite:** Task 4.1 must be complete.

**Files:** `WebAppActivity.java` (new: `WebAppJsBridge.java` in `presentation/webapp/`)

1. Create a new file `WebAppJsBridge.java` in `presentation/webapp/`.
2. Define a `WebAppJsBridgeCallback` interface inside it with three methods: one for `cachedStatus(boolean)`, one for `closeWebView()`, and one for `setOrientation(String)`.
3. Move the entire body of the `WebAppInterface` inner class into `WebAppJsBridge` as a top-level class. Its constructor should accept: `SharedPreferences`, the `urlIndex` string, a `MonsterStateManager` instance, and a `WebAppJsBridgeCallback`.
4. Inside the moved class, replace all references to outer class fields (`sharedPref`, `urlIndex`, `goBack`, etc.) with the constructor parameters. The `onMonsterEvolutionStateReceived` method now delegates to `monsterStateManager.onMonsterEvolutionStateReceived(jsonState)`.
5. The `cachedStatus`, `closeWebView`, and `setContainerAppOrientation` JS interface methods now call through to the callback interface.
6. Back in `WebAppActivity`, remove the `WebAppInterface` inner class entirely. Have `WebAppActivity` implement `WebAppJsBridgeCallback`. Instantiate `WebAppJsBridge` and pass it to `webView.addJavascriptInterface(bridge, "Android")`.
7. Implement the three callback methods in `WebAppActivity` — each one calls the corresponding method that was previously inline in the inner class.
8. Build. Launch a sub-app and verify the JS bridge still works (cached status, close button, orientation changes).

---

#### Task 4.3 — Extract `ReferrerParser` from `InstallReferrerManager`

**Risk:** Low — pure logic extraction into a static method with no side effects. The extracted code does not change, only its location. First-install attribution flow should be verified on a fresh install after this change.

**Files:** `InstallReferrerManager.java` (new: `ReferrerParser.java` in `attribution/`)

1. Create a new file `ReferrerParser.java` in the `attribution/` package (create that package directory if it does not yet exist — `InstallReferrerManager` currently lives in `installreferrer/` so decide at this point whether to move it too, or create `attribution/` alongside).
2. Define a `ParsedReferrer` value class inside `ReferrerParser` (or as its own file) with fields: `language`, `source`, `campaign_id`, `deferred_deeplink`.
3. Add a static `parse(String referrerString)` method to `ReferrerParser` that contains the URI parsing logic currently embedded inside the `onReferrerReceived` callback in `InstallReferrerManager` — the logic that builds a Uri from the referrer string and extracts the language and UTM parameters.
4. In `InstallReferrerManager.onReferrerReceived()`, replace the inline parsing logic with a call to `ReferrerParser.parse(referrerString)` and use the returned `ParsedReferrer` object to get `language`, `source`, etc.
5. Build. Verify no compile errors and that the attribution flow still works on first install.

---

#### Task 4.4 — Replace `StudyEnrollmentListener` with LiveData

**Risk:** Medium-high — this is the most architecturally significant change in Phase 4. It introduces a new state model (`StudyEnrollmentState`), changes how `MainActivity` reacts to enrollment events, and removes the inverted `getSelectedLanguage()` pull. The full study enrollment flow (deep link arrival → confirm dialog → success dialog → load apps or show language popup) must be tested end to end. Pay particular attention to the case where the activity is backgrounded mid-flow.

**Prerequisite:** Task 2.1 (HomeViewModel rename) must be done.

**Files:** `StudyEnrollmentManager.java`, `MainActivity.java`, `HomeViewModel.java`

**Java 8 constraint note:** Do not use sealed classes, records, or `var` here. `StudyEnrollmentState` must be a plain Java 8 class using an enum for the state type. Sealed classes are a Java 17 language feature and will fail to compile at the project's `sourceCompatibility JavaVersion.VERSION_1_8` setting.

1. In the `deeplink/` package, create `StudyEnrollmentState.java`. Define it as a plain Java class containing a public enum `Type` with values: `DISMISS_LANGUAGE_POPUP`, `LOAD_APPS`, `SHOW_LANGUAGE_POPUP`, `UPDATE_DEBUG_OVERLAY`, `CACHE_PSEUDO_ID`. Give the class a `Type type` field and a nullable `String language` field (used only when type is `LOAD_APPS`). Add static factory methods for each type so call sites read cleanly without constructors.
2. In `StudyEnrollmentManager`, add a `MutableLiveData<StudyEnrollmentState>` field. Add a public getter that exposes it as `LiveData<StudyEnrollmentState>`.
3. Replace each `listener.onXxx()` call in `StudyEnrollmentManager` with a `liveData.postValue(StudyEnrollmentState.dismissLanguagePopup())` etc. call using the factory methods. For the inverted `getSelectedLanguage()` pull — remove it from the listener entirely and instead pass `selectedLanguage` as a direct parameter to `handleStudyEnrollmentLink()` at the call site.
4. Remove the `StudyEnrollmentListener` interface from `StudyEnrollmentManager` entirely.
5. In `HomeViewModel`, expose the LiveData from `StudyEnrollmentManager` — either by holding a reference to the manager or by wiring through the ViewModel.
6. In `MainActivity`, remove the `StudyEnrollmentListener` anonymous implementation from the constructor. Instead, observe `StudyEnrollmentManager`'s LiveData in `onCreate` and handle each state with a switch on `state.type` — each case calls the same method that was previously in the listener callback body.
7. Update the `handleStudyEnrollmentLink()` call in `handleIncomingIntent()` to pass `selectedLanguage` as a parameter.
8. Build. Trigger a study enrollment deep link end to end and verify the full flow works.

---

#### Task 4.5 — Unify URL building in `WebAppActivity`

**Risk:** Low — replacing four small methods with one. The main risk is the forms URL edge case, which appends the pseudoId in a different position than regular URLs. Verify all three URL types (forms, welcome video, standard app) produce identical output before and after.

**Files:** `WebAppActivity.java`

1. Open `WebAppActivity.java`. Identify the four URL building methods: `addCrUserIdToUrl`, `addCrUserIdToFormUrl`, `addSourceToUrl`, `addCampaignIdToUrl`.
2. Create a single new private method `buildAppUrl(String baseUrl)` that uses `Uri.Builder` to construct the final URL. Inside it: always append `cr_user_id`; conditionally append `source` if the source string is non-empty; conditionally append `campaign_id` if the campaign ID string is non-empty. Handle the forms URL special case (appending the pseudoId differently) and the welcome video special case (no back button) via simple checks inside this method.
3. In `loadWebView()`, replace the chain of `addXxxToUrl` method calls and the `if (appUrl.contains("docs.google.com/forms"))` / `else if` / `else` branching with a single call to `buildAppUrl(appUrl)`.
4. Delete the four old URL methods.
5. Build. Test launching a forms URL, a welcome video URL, and a regular sub-app URL and verify each builds correctly.

---

### Phase 5 — Future-facing improvements

**Overall risk: Medium to High**
These are the largest structural changes in the plan and the only ones that require team design alignment before starting. Task 5.1 is a straightforward rename but touches the manifest LAUNCHER entry — a mistake here means the app doesn't launch at all. Task 5.2 is the highest-risk change in the entire plan: it moves flow-decision logic that currently lives in `HomeActivity` into a new coordinator class, touching every manager in the process. Get the coordinator interface wrong and the home screen flow breaks entirely. Do not start Task 5.2 without a design review session.

**Prerequisite:** All of Phases 1–4 should be complete. These two tasks are the largest architectural moves and require the most design alignment before starting.

---

#### Task 5.1 — Rename `MainActivity` → `HomeActivity` and move to `presentation/home/`

**Risk:** Medium — rename and manifest update. The LAUNCHER intent filter must point to the new path or the app will not open. Cold-launch test is the primary verification.

**Files:** `MainActivity.java`, `AndroidManifest.xml`

1. Move `MainActivity.java` from the root package into `presentation/home/`. Update its `package` declaration.
2. Rename the class from `MainActivity` to `HomeActivity` and rename the file accordingly.
3. Open `AndroidManifest.xml`. Find the `<activity>` entry for `MainActivity` — it should be the one with the `LAUNCHER` intent filter. Update `android:name` to the full new path: `org.curiouslearning.container.presentation.home.HomeActivity`.
4. Search the project for any remaining references to `MainActivity.class` or `MainActivity` used as a type and update them.
5. Build. Cold-launch the app and verify the home screen appears.

---

#### Task 5.2 — Introduce `HomeCoordinator` for flow decisions

**Risk:** High — this moves the core flow logic of the home screen into a new class. Every user journey through the app (first launch, returning user, referral deep link, study enrollment) passes through this logic. If the coordinator's interface is incomplete or the handoff from `HomeActivity` is wrong, multiple flows can break simultaneously and be hard to untangle. Design the interface on paper first, review it, then implement.

**Note:** Do not begin without a design review session.

**Files:** `HomeActivity.java`, all managers in `presentation/home/managers/` (new: `HomeCoordinator.java`)

1. Before writing any code, document the flow decisions that currently live in `HomeActivity`: when to show the language popup, when to call `loadApps`, how to respond to referral completion, how to respond to study enrollment outcomes. These become the `HomeCoordinator` interface.
2. Create `HomeCoordinator.java` in `presentation/home/`. Its constructor receives `HomeViewModel`, `LanguageDialogManager`, `ReferralCoordinator` (renamed from `ReferralManager`), and `StudyEnrollmentManager`.
3. Move the logic from `HomeActivity`'s listener callback implementations (`onLanguageReceived`, `onShowLanguagePopup`, `onReferrerStatusUpdate`, `onLanguageSelected`) into `HomeCoordinator` methods.
4. `HomeActivity` now calls `homeCoordinator.onLanguageReceived(language)` etc. instead of containing the decision logic itself.
5. `HomeActivity` retains only direct UI operations: showing/hiding views, starting/stopping animations, setting up the RecyclerView. All "what to do next" logic lives in `HomeCoordinator`.
6. Build. Run the full user journey: cold start, language selection, referral deep link, study enrollment deep link.

---

## Part 5 — What Must Not Change

**SDK and build configuration — strictly frozen:**
- `minSdk` must stay at 24. Do not use any API that requires a higher minimum, and do not add any `@RequiresApi` annotations that raise the effective floor.
- `targetSdk` and `compileSdk` must stay at 35.
- Java source and target compatibility must stay at Java 8. Do not introduce sealed classes, records, text blocks, pattern matching `instanceof`, `var`, or any other post-Java-8 language feature. New classes must use plain Java 8 patterns: classes, interfaces, enums, and anonymous inner classes.
- Gradle must stay at 8.13. No wrapper or plugin version bumps as part of this work.

**Feature behavior — strictly frozen:**
- Firebase Analytics event names and parameter keys
- Referrer attribution flow (Google Play referrer + Facebook App Links)
- Study enrollment deep-link parsing and consent storage
- Monster evolution phase thresholds and storage key names
- WebView settings (DOM storage, JavaScript, cache mode)
- Any `SharedPreferences` key names — changing these breaks existing installs silently
- Feature flags and gating logic

---

## Summary Checklist

| Phase | Task | Risk | Files Touched |
|---|---|---|---|
| 1 | Fix `dismissLanguagePopupIfShowing` | Low | MainActivity |
| 1 | Remove dead attribution else-branches | Low | ReferralManager |
| 1 | Fix LanguageDialogManager accumulating observers | Medium | LanguageDialogManager |
| 1 | Fix wind animator field storage | Low | VisualEffectsManager |
| 1 | Extract pulse animation to AnimationUtil | Low | StudyEnrollmentManager, AnimationUtil |
| 1 | Remove CacheUtils side effect from dialog observer | Low | LanguageDialogManager, WebAppRepository |
| 2 | Rename `HomeViewModal` → `HomeViewModel` | Medium | 4 files + package dir |
| 2 | Fix `respository` typo | Low | 1 file + package dir |
| 2 | Rename `WebApp` Activity → `WebAppActivity` | Medium | WebApp, Manifest |
| 3 | Move managers to `presentation/home/managers/` | Low | 4 files + MainActivity imports |
| 3 | Move `StudyEnrollmentManager` to `deeplink/` | Low | 1 file + MainActivity import |
| 3 | Move `WebAppActivity` to `presentation/webapp/` | Low | WebAppActivity, Manifest, WebAppsAdapter |
| 3 | Rename `utilities/` → `util/` | Low | all remaining utilities + all importers |
| 4 | Extract `MonsterStateManager` | Medium | WebAppActivity (large) |
| 4 | Extract `WebAppJsBridge` | Medium | WebAppActivity |
| 4 | Extract `ReferrerParser` | Low | InstallReferrerManager |
| 4 | Replace `StudyEnrollmentListener` with LiveData | Medium | StudyEnrollmentManager, MainActivity, HomeViewModel |
| 4 | Unify URL building | Low | WebAppActivity |
| 5 | Rename `MainActivity` → `HomeActivity` | Medium | Manifest |
| 5 | Introduce `HomeCoordinator` | High | HomeActivity, all managers |
