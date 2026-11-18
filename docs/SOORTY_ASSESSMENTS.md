# Assessments in the Soorty standalone APK

The `soorty` flavor ships the letter-sounds and sight-words assessments for **English, Urdu and
Pashto**, fully offline, in both of the ways production runs them:

| Mode | How it opens | What runs |
|------|--------------|-----------|
| Embedded | Feed The Monster reaches a level configured in Statsig (`assessmentlevels`) | The player compiled into the packaged `feedTheMonster.js` (`@curiouslearning/assessment-survey` 1.3.0), shown over the game |
| Standalone | Catalog tile, e.g. *Assessment Letter Sounds Urdu* | assessment-survey-js `main` (`cfc0183`, the 1.3.0 source) production build |

Both read the same content: `app/src/soorty/assets/feedthemonster/assessment-survey/`
(`data/`, `audio/`, `img/`, `css/`, `animation/`), the layout FTM's own webpack build uses. The
standalone page lives in `app/src/soorty/assets/assessment/` and is opened as
`https://soorty_urdu_english_cr-ftm-standalone.androidplatform.net/assets/assessment/index.html?data=<lang>-<type>`.
Data keys: `english|urdu|pashto` × `lettersounds|sightwords`. Size: ~37 MB shared content + ~1 MB page.

## Catalog

`app/src/soorty/assets/web_apps_manifest.json` (version `soorty-3`) lists two assessments per
language right after that language's FTM tile, `app_id: "assessment"` (the value assessment-survey-js
stamps on its payloads), icons `images/assessment_letter_sounds.png` / `assessment_sight_words.png`
(the production assessment icons, as used in the Hausa packaged build). The numeric `appId`s 9101–9106
are local Room keys only (9001–9003 are taken by the Urdu GDL books); swap in the production ids if they need to match.

## Returning to the container when a standalone assessment ends

`WebApp` (only when `BuildConfig.OFFLINE_STANDALONE`, only for a non-FTM screen whose app key is
`assessment`; the Play Store build is unchanged):

1. assessment-survey-js tracks its `completed` analytics event, then sends `summary_data` and finally
   `user_sessions_data` with `event_type: "activity_completed"`
   (`StandaloneAssessmentCompletion.isCompletionPayload`).
2. Every bridge write of that screen is tracked through `AppEventWriteCallback`. After the completion
   payload the screen waits until all writes are durable in Firestore's local queue and, online,
   acknowledged by the server (up to 5 s; offline it never is), with a hard cap of 10 s.
3. Then the end screen stays up for **3 s**, `app_exit` is logged to Firebase Analytics, the page is
   unloaded (`about:blank`, so the web Firebase/Statsig SDKs flush on `pagehide`) and the activity
   finishes, back to the catalog.

FTM-embedded assessments never close anything: FTM carries on with the level, as in production.

## Container change for the embedded player

`LocalWebContent` used to answer everything under `feedthemonster/assessment-survey/` with an
immediate 404 (the MWF builds do not ship it, and the packaged FTM skips an assessment whose data
`HEAD` probe fails). It now serves a file from that directory when the flavor packages it and only
404s files that are genuinely absent, so the MWF flavors behave exactly as before.

## Rebuilding / repackaging

```bash
# 1. Build the standalone bundle from production's commit with one patch.
git clone https://github.com/curiouslearning/assessment-survey-js && cd assessment-survey-js
git checkout cfc01833054223756f4f22d34742b8c54fefe98d          # or the current main
git apply <CRcontainer>/tools/patches/assessment-survey-js-standalone-sw-attribute.patch
npm ci
npx cross-env NODE_ENV=production webpack -c webpack.config.js   # no wb:inject: no service worker is shipped

# 2. Package (delete the two output folders first; the script replaces them).
cd <CRcontainer>
node tools/package-assessment.js --build <assessment-survey-js>/build --flavor soorty \
  --keys english-lettersounds,english-sightwords,urdu-lettersounds,urdu-sightwords,pashto-lettersounds,pashto-sightwords

# 3. Build
./gradlew testSoortyDebugUnitTest assembleSoortyRelease
```

The patch adds a `data-enable-service-worker` attribute to `src/standalone.ts` (default `true`, so
production is unaffected; worth upstreaming). Production's standalone page registers `sw.js`
(Workbox from a Google CDN) and waits for `navigator.serviceWorker.ready` before hiding its loading
screen; in the APK every file is already local, so the packaged page uses the bundle's no-worker
path, the same one the embedded player always uses. `tools/package-assessment.js` documents the
other `index.html` changes (shared asset base, gsap CDN tag removed, `mr-75` bridge-gate seed so
results reach the container offline).

## Verified (headless Chromium, packaged files served like `LocalWebContent`, no network)

* Standalone, all 6 keys: loading screen clears in ~3 s offline, a full run completes, the bridge
  receives `summary_data` + `user_sessions_data` (`activity_completed`), no asset misses.
* Embedded, all 6 keys inside the packaged FTM page: `HEAD` probe 200, player loads over the game,
  completes (`loaded → completed → reward-trigger → closed → summary`), no asset misses.
* Not verified here: on a device/emulator (no Android SDK in the session), and the real Statsig
  trigger in FTM.

## Known differences from production

* **When FTM opens an embedded assessment** is decided by the Statsig dynamic config
  `assessmentlevels`. A device that has never reached Statsig has no config, so FTM schedules no
  assessment until it has been online once (Statsig caches its values afterwards).
* **Embedded-assessment Firebase events are off in the packaged FTM build**: the FTM bundle in
  `mwfShared` was built without the `FIREBASE_*` `.env` values that production's FTM deploy injects
  (`AssessmentSurveyManager.resolveAnalyticsConfig` then passes no config). Results still reach
  the container via FTM. Fix: rebuild FTM with production's `.env` and re-run `tools/package-ftm.js`.
* The standalone page's own Firebase/Statsig events need the network, as in production; offline they
  are dropped by the web SDKs. The container's Firebase Analytics and Firestore writes queue offline.
