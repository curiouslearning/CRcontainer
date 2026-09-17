# Quickstart: Validate Consume Manifest app_id

Validates the three user stories end-to-end on a real build. See
[data-model.md](./data-model.md) for field/entity details and
[contracts/bridge-and-firestore-contract.md](./contracts/bridge-and-firestore-contract.md) for the
exact before/after field mapping — not duplicated here.

## Prerequisites

- A debug build installed on a device/emulator (see the `test-subapp-locally` skill for wiring a
  local sub-app build into this container if you need to control the JS payload sent).
- Access to the manifest response the container fetches (`ApiService.getWebApps`) — either the
  real dev endpoint updated to include `app_id` per entry, or a local override you control.
- Access to the Firestore project's console (or emulator) for the `summary_data` /
  `user_sessions_data` collections.
- `adb` on `PATH` and a running device/emulator (see logcat filter guidance already in this
  project for tags `WebApp` and `WebView`).

## 1. Catalog ingestion (User Story 1)

1. Ensure the manifest source returns `app_id` on at least one sub-app entry.
2. Force a catalog refresh: clear the app's data (or bump/change the manifest `version` so
   `WebAppRepository.getUpdatedAppManifest` detects a change) and relaunch the container.
3. Inspect the on-device catalog:
   ```bash
   adb shell run-as org.curiouslearning.container sqlite3 \
     databases/web_apps_database "SELECT appId, app_id, title FROM web_app_table;"
   ```
   (Debug build; `run-as` requires a debuggable package.)
4. **Expected**: every entry whose manifest source included `app_id` shows a matching non-null
   `app_id` column value.

## 2. current_app_id on launch (User Story 2)

1. From the home screen, launch any sub-app that has a stored `app_id` (per step 1).
2. Tail the logcat filter already documented for this project (`tag:WebView | tag:WebApp` in
   Android Studio, or `adb logcat WebView:* WebApp:* *:S` from the CLI) and look for the existing
   `AppEventHandler` log line emitted on the first payload the sub-app reports — it logs the
   `app_id` actually used.
3. **Expected**: the logged value matches the sub-app's stored `app_id` from step 1, regardless of
   what the sub-app itself sends.
4. Exit and launch a **different** sub-app; repeat. **Expected**: the logged value updates to the
   newly launched sub-app's `app_id`.

## 3. Firestore attribution trusts the container, not the sub-app (User Story 3)

1. Using a local sub-app build (`test-subapp-locally` skill) or browser devtools against the dev
   deployment, send a bridge payload via the documented `AppEventPayload` JS call with `app_id`
   set to an arbitrary/incorrect value (or omitted entirely).
2. Confirm the container still accepts the payload (no "Missing app_id" rejection in logcat).
3. In the Firestore console, find the resulting document in `user_sessions_data` or
   `summary_data`.
4. **Expected**: the document's `app_id` field equals the *launched sub-app's* manifest-derived
   `app_id` (from step 1/2), not the spoofed or omitted value the payload carried.
5. Repeat with the sub-app's `app_id` field omitted entirely from the JS payload. **Expected**:
   processing still succeeds and the Firestore document is written with the correct
   container-resolved `app_id`.

## 4. Missing current_app_id — fallback chain and warning logs (edge case)

1. Launch a sub-app whose catalog entry has no stored `app_id` (e.g. one not yet updated by the
   server-side manifest rollout).
2. Trigger a bridge payload from it that **does** carry its own `app_id`.
3. **Expected**: logcat (`AppEventHandler` tag) shows a **warning** naming the fallback to the
   payload's `app_id`; the Firestore document is still written, with `app_id` equal to whatever
   the payload sent — not withheld, not guessed.
4. Repeat, this time with the payload's `app_id` also omitted.
5. **Expected**: logcat shows a warning naming the fallback to `"unknown"`; the Firestore document
   is still written, with `app_id` equal to the literal string `"unknown"`.

## Done

All checks passing confirms the feature's success criteria (spec SC-001–SC-005): Firestore
attribution prefers the container-controlled value, catalog ingestion picks up `app_id` without an
extra fetch, a missing current_app_id degrades through a fixed, logged fallback order rather than
being silently dropped or guessed, and every step introduced by this feature is visible in logcat
under its component's existing tag.
