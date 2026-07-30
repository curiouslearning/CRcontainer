---
name: test-subapp-locally
description: Run a local FeedTheMonster (FTM) or assessment-survey-js build inside the CRContainer Android app for end-to-end testing — redirect the deployed sub-app URL to a local dev server, set up port forwarding, link a local @curiouslearning/core, and verify the JS→native payload bridge and Firestore writes. Use whenever testing sub-app changes, the AppEventPayload bridge, analytics/metadata payloads, or any FTM/Assessment behavior against a real container build.
argument-hint: Which sub-app (FTM or Assessment), and whether you're also testing local @curiouslearning/core changes.
---

# Test a sub-app locally inside CRContainer

CRContainer loads sub-apps (FTM, Assessment) from the web URLs in its manifest. To test a
**local** sub-app build instead, the debug build rewrites the sub-app's URL to a local dev
server. This skill covers the full rig: URL redirect, port forwarding, optional local `core`
link, feature flags, and how to verify the payload bridge → Firestore.

## How the redirect works

In **debug builds only**, `WebAppsAdapter.maybeOverrideAppUrlForLocalDev()`
([WebAppsAdapter.java](../../../app/src/main/java/org/curiouslearning/container/presentation/adapters/WebAppsAdapter.java)) rewrites a sub-app URL when its host matches a configured list:

- Driven by two `BuildConfig` fields that [app/build.gradle](../../../app/build.gradle) reads from
  your gitignored `local.properties`:
  - `LOCAL_SUBAPP_MATCH_HOSTS` — comma-separated hosts to redirect (empty by default → no redirect)
  - `LOCAL_SUBAPP_REPLACEMENT_ORIGIN` — the local origin to redirect to (e.g. `http://localhost:8080`)
- It keeps only `scheme://authority`, **drops the path** (the dev server serves the app at root),
  and **preserves the query/fragment** (e.g. `?cr_lang=english`, `?data=hausa-sightwords`).
- Empty defaults live in `defaultConfig`, so release builds are never affected. Real values only
  ever exist in `local.properties`, which CI does not have — so the redirect is inert in the debug
  APK too. It is active **only** when you build from your own machine.

After the redirect, `WebApp.addContainerVersionToUrl()` appends `container_app_version=<versionName>`.

## Step-by-step

### 1. Find the sub-app's current host (it changes per environment)

The debug build loads its manifest from the `testing_branch` API
(`BuildConfig.API_URL` → `.../container_app_manifest/testing_branch/web_app_manifest.json`).
Fetch it and read the real `appUrl` host for your sub-app — don't assume:

```bash
curl -s "https://devcuriousreader.wpcomstaging.com/container_app_manifest/testing_branch/web_app_manifest.json" \
  | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);(j.web_apps||j.apps||j).forEach?.(a=>{}); const arr=j.web_apps||j.apps||j; (Array.isArray(arr)?arr:[]).forEach(a=>{const u=a.appUrl||a.app_url||a.url; if(u){try{console.log(new URL(u).host,' <- ',u)}catch(e){}}})})"
```

Known hosts as of this writing (verify each time — they migrate, e.g. to S3):

| Sub-app | testing_branch host | Dev port |
|---|---|---|
| FTM | `globallit-aws-s3-static-webapp-test-us-east-2.s3.us-west-2.amazonaws.com` | 8080 |
| Assessment | `assessmentdev.curiouscontent.org` | 8081 |

(Prod/dev fallback hosts: `feedthemonster.curiouscontent.org`, `feedthemonsterdev.curiouscontent.org`, `assessment.curiouscontent.org`.)

### 2. Point the debug build at your local dev server

Set both keys in **`local.properties`** (repo root) — *not* in `build.gradle`:

```properties
localSubappMatchHosts=<host from step 1>
localSubappReplacementOrigin=http://localhost:<dev port>
```

`local.properties` is gitignored, so these never get committed and are always absent on CI. That
matters: CI builds a debug APK and **commits it to the repo** for testers
([Fastfile](../../../app/fastlane/Fastfile)), so an active redirect in a tracked file would point
every tester at their own localhost. Config here is structurally incapable of that — nothing to
remember to revert. See [local.properties.example](../../../local.properties.example) for the
copy-paste block for each sub-app.

Both keys must be set for the redirect to activate; blank or missing = no redirect.

**Use `http://localhost`, not `http://10.0.2.2`.** Sub-apps register a **service worker**, which
only works in a secure context (HTTPS or `localhost`/`127.0.0.1`). `10.0.2.2` is treated as
insecure and the SW silently fails. `localhost` is reachable from the device via `adb reverse`
(step 4) and works for both emulator and physical device.

`localhost` and `127.0.0.1` are cleartext-permitted for debug builds in
[app/src/debug/res/xml/network_security_config.xml](../../../app/src/debug/res/xml/network_security_config.xml)
(wired via the debug [AndroidManifest.xml](../../../app/src/debug/AndroidManifest.xml)
`networkSecurityConfig`). Without it `targetSdk 35` blocks the load with
`net::ERR_CLEARTEXT_NOT_PERMITTED`. Add new hosts there if you switch off loopback.

Re-sync Gradle after editing `local.properties`.

**Sub-app identity survives the redirect.** The rewritten URL no longer contains the real host or
the sub-app's name, so `WebApp` keeps a `localDevOriginalUrl` extra (set only when a redirect
happened) and resolves two things from it rather than the loaded URL:

- `isFtmApp` — otherwise false under redirect, silently disabling the monster-evolution polling.
- `AppContextKey.HOSTNAME` → `attribution.hostname` in Firestore — otherwise recorded as
  `localhost`, corrupting the field you're likely verifying.

So expect the **real** sub-app host in `attribution.hostname` even while running locally.

### 3. (Optional) Link a local `@curiouslearning/core`

Only if you're also testing un-published `core` changes (the payload schema / `AndroidInterface`
live in `@curiouslearning/core`, a separate repo at `c:\CuriousLearning\core`):

```bash
cd c:/CuriousLearning/core && npm run build && npm link
cd c:/CuriousLearning/FeedTheMonsterJS && npm link @curiouslearning/core    # or assessment-survey-js
```

The dev-server build log should show `../core/dist/index.js [built]`, confirming the link is used.
Rebuild `core` (`npm run build`) after each core change. Unlink later with
`npm unlink @curiouslearning/core` then `npm install`.

### 4. Start the dev server + forward the port

```bash
# FTM
cd c:/CuriousLearning/FeedTheMonsterJS && npm run dev      # serves :8080
# Assessment
cd c:/CuriousLearning/assessment-survey-js && npm run dev  # serves :8081

# Forward device localhost -> host dev server (re-run if the emulator/adb restarts)
adb reverse tcp:8080 tcp:8080      # match the dev port
adb reverse --list                 # verify
```

### 5. Enable the feature flags that gate the sub-app→native path

- **FTM**: `mr-75` (`FEATURE_ANDROID_EVENT_BUBBLE`) must be enabled for your test user, or FTM
  never registers the Android strategy and nothing bubbles. Loaded via `@curiouslearning/features`
  (Statsig) — see [feedTheMonster.ts](../../../../FeedTheMonsterJS/src/feedTheMonster.ts) `initAndroidModule()`.
- **Assessment**: the summary path is gated by `enableAndroidSummary`; the user-sessions path fires
  when `appType === Assessment.TYPE` — see assessment `App.ts` `notifySummaryData` / completion handler.

### 6. Run the debug app and watch Logcat

Run the **debug** variant on the connected device. Open the sub-app tile and confirm the redirect:

```
WebAppsAdapter: DEBUG sub-app URL override: https://<host>/...?<query> -> http://localhost:<port>/?<query>
```

Complete a level/puzzle (FTM) or finish an assessment, then watch the bridge + handler:

```
WebApp:          BRIDGE_PARSED: collection=... app_id=... cr_user_id=...
WebApp:          BRIDGE_VALIDATED -> handler.handle()
AppEventHandler: Handling summary_data / user_sessions_data payload
AppEventHandler: ... saved docId=...   (or "Updated summary payload")
```

Entry point: `WebAppInterface.logMessage()` in
[WebApp.java](../../../app/src/main/java/org/curiouslearning/container/WebApp.java);
storage in [DefaultAppEventPayloadHandler.java](../../../app/src/main/java/org/curiouslearning/container/core/subapp/handler/DefaultAppEventPayloadHandler.java).

### 7. Verify Firestore

Check the `summary_data` and `user_sessions_data` collections for the new doc, with the expected
top-level fields (`cr_user_id`, `app_id`, `collection`, `metadata`, `data`, timestamps).

## Gotchas

- **Service worker caching**: the dev build writes `sw.js` and precaches the bundle. If the WebView
  serves a stale sub-app, clear the container app's storage (or uninstall/reinstall) so it refetches.
- **`adb reverse` is not persistent**: it resets when the emulator or adb server restarts. Re-run it.
- **"Invalid Host header"** from webpack-dev-server: IP/localhost hosts pass by default; if it
  appears, add `allowedHosts: 'all'` to the sub-app's `devServer` config.
- **Wrong host**: if you never see the override log, the manifest host changed — redo step 1.
- **Release safety**: never rely on path in the redirect; only `scheme://authority` + query survive.

## Cleanup

Nothing to revert in tracked files — the redirect config lives only in your gitignored
`local.properties`. Just tear down the forwarding when you're done:

```bash
adb reverse --remove-all
```

Leave the `local.properties` keys in place (or comment them out) for next time.

## Key files

| File | Role |
|---|---|
| `local.properties` (gitignored) | `localSubappMatchHosts` / `localSubappReplacementOrigin` — your actual values |
| [local.properties.example](../../../local.properties.example) | tracked template documenting both keys |
| [app/build.gradle](../../../app/build.gradle) | reads those keys into `LOCAL_SUBAPP_*` `BuildConfig` fields (debug) + empty defaults |
| [WebAppsAdapter.java](../../../app/src/main/java/org/curiouslearning/container/presentation/adapters/WebAppsAdapter.java) | `maybeOverrideAppUrlForLocalDev()` redirect logic + `localDevOriginalUrl` extra |
| [app/src/debug/res/xml/network_security_config.xml](../../../app/src/debug/res/xml/network_security_config.xml) | cleartext allowlist (localhost, 127.0.0.1) |
| [WebApp.java](../../../app/src/main/java/org/curiouslearning/container/WebApp.java) | bridge entry `logMessage()`, `addContainerVersionToUrl()`, `BRIDGE_*` logs |
| [DefaultAppEventPayloadHandler.java](../../../app/src/main/java/org/curiouslearning/container/core/subapp/handler/DefaultAppEventPayloadHandler.java) | Firestore routing + `AppEventHandler` logs |
