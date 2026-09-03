# Implementation Plan: Consume Manifest app_id

**Branch**: `feature/mr-217--add-and-consume-app-id-from-app-manifest` | **Date**: 2026-09-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-consume-manifest-app-id/spec.md`

## Summary

The app manifest will start carrying a string `app_id` per sub-app entry, alongside the existing
on-device numeric `appId`. This plan stores `app_id` as a new column on the existing sub-app
catalog table (no new store), carries it through the same intent-extra path already used for
every other per-entry field when a sub-app launches, holds it as `current_app_id` in the existing
`AppContext` keyed store (the same mechanism already used for `HOSTNAME`/`LANGUAGE`/`CAMPAIGN_ID`/
`SOURCE`), and makes it the primary source for every Firestore-facing use of `app_id` in
`DefaultAppEventPayloadHandler` — so a sub-app's own `app_id` can no longer silently override a
known-good value. When current_app_id is unavailable, resolution falls back — in this exact order,
never guessed — to the sub-app-reported payload's own `app_id`, then to the literal `"unknown"`,
logging a warning whenever that fallback happens. Every step this feature touches (manifest
ingestion, launch-time capture, Firestore resolution) logs through the existing tag already
established for that component. No new classes, interfaces, or storage mechanisms are introduced;
every step reuses an existing seam.

## Technical Context

**Language/Version**: Java (AndroidX), per project constitution — no Kotlin sources

**Primary Dependencies**: Android Room (on-device catalog storage), Retrofit2 + Gson (manifest fetch/parse), Firebase Firestore SDK (`user_sessions_data`, `summary_data`), existing `AppContext` (SharedPreferences-backed keyed store)

**Storage**: Room/SQLite — `web_app_table` via `WebAppDatabase` / `DatabaseHelper` / `WebAppDao` (reused, gains one column); `AppContext`'s `app_context_cache` SharedPreferences (reused, gains one key) for the transient `current_app_id`

**Testing**: JUnit unit tests under `app/src/test` (existing pattern, e.g. `AnalyticsUtilsCustomEventsTest.java`); manual on-device verification via the `test-subapp-locally` workflow for the bridge/Firestore path

**Target Platform**: Android (existing `compileSdk`/`targetSdk`/`minSdk` in `app/build.gradle`)

**Project Type**: Mobile app — single Android module (`app/`)

**Performance Goals**: N/A — one extra Room column read on catalog load and one extra `AppContext` key read/write per sub-app launch; negligible relative to existing manifest sync and WebView load costs

**Constraints**: Must not break sub-apps whose manifest entries have no `app_id` yet (server rollout may lag this change) — catalog entry stays launchable, and Firestore operations for it still complete via the defined fallback order rather than being withheld (spec FR-007, revised this session); every step introduced by this feature must log through the existing per-component tag, with a warning specifically when current_app_id is unavailable (spec FR-009, FR-010); resolution must never guess/infer a value outside the defined order (current_app_id → payload's own `app_id` → literal `"unknown"`); Java-only, AndroidX-only (constitution IV); no new abstraction/class where an existing seam already fits (explicit user direction: small footprint, reuse over abstraction)

**Scale/Scope**: Handful of sub-app catalog entries (single digits today); exactly one sub-app active/reporting at a time per the existing one-`WebApp`-activity-at-a-time launch model

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment |
|---|---|
| I. WebView Sub-App Boundary & Isolation | **PASS.** Change stays inside the existing manifest→catalog→bridge-handler seam. Native code still only reaches a sub-app through the documented `AppEventPayload` contract; no sub-app-specific coupling is introduced into shared navigation/manifest code. |
| II. SOLID (NON-NEGOTIABLE) | **PASS.** Single Responsibility is preserved: parsing stays in the Gson-mapped model, persistence in Room, session state in `AppContext`, Firestore writing in `DefaultAppEventPayloadHandler`. No new conditional branching is added for a new *kind* of event (Open/Closed doesn't apply — this is one new attribute flowing through existing seams, not a new behavior variant), and the handler continues depending on the existing `AppContext` abstraction rather than a concrete new type (Dependency Inversion). |
| III. Composition Over Inheritance | **PASS.** No new class hierarchy. Per explicit user direction, no new interface/abstraction is introduced for a single attribute where `AppContext` (composition-friendly, already injected/looked up the same way everywhere) already fits. |
| IV. Idiomatic Java & Android Platform Standards | **PASS.** Stays Java/AndroidX. No new `Thread`/`AsyncTask` usage is introduced by this feature — the existing (pre-existing, out-of-scope) `AsyncTask`-based DAO calls are reused as-is, not expanded. |
| V. Scalable Layered Package Architecture | **PASS.** All changes land in packages that already own this concern: `data/model`, `data/database`, `core/context`, `core/subapp/{payload,validation,handler}`, `presentation/adapters`, and the existing `WebApp`/`WebAppsAdapter` launch path. No new top-level package. |
| VI. Secure, Validated Native↔Web Bridge | **PASS, with a noted tradeoff.** `current_app_id` is now the *primary* identifier (closing the original trust gap: a sub-app's own `app_id` can no longer override a known-good value). The revised FR-007 reintroduces the sub-app-supplied `payload.app_id` as a second-tier fallback, only when current_app_id is unavailable, and only ever as an explicitly logged, degraded case (`"unknown"` is the final fallback, never a guess). This is a deliberate, user-directed choice to keep Firestore operations completing rather than silently dropping data, not a silent regression: every fallback occurrence is logged at warning level (FR-009), giving the observability Principle VI asks for ("surfaced," never silent) even though the value's trust level is lower than current_app_id. `AppEventPayloadValidator` no longer hard-requires `app_id` in the incoming payload, since the container no longer depends on it being present. |

No violations — Complexity Tracking is not needed. The Principle VI tradeoff above is a deliberate, explicit design choice (not an unjustified violation) and is logged/observable per FR-009, so it does not require a Complexity Tracking entry.

## Project Structure

### Documentation (this feature)

```text
specs/001-consume-manifest-app-id/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── bridge-and-firestore-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
app/src/main/java/org/curiouslearning/container/
├── data/
│   ├── model/
│   │   └── WebApp.java                          # + app_id field (Room column, Gson-mapped)
│   ├── database/
│   │   └── DatabaseHelper.java                  # Room @Database version bump (2 → 3)
│   └── remote/
│       └── RetrofitInstance.java                # + debug log (tag "AppConfig"): app_id coverage per manifest sync
├── core/
│   ├── context/
│   │   └── AppContextKey.java                   # + CURRENT_APP_ID key
│   └── subapp/
│       ├── payload/AppEventPayload.java         # unchanged shape; app_id becomes fallback-only
│       ├── validation/AppEventPayloadValidator.java  # drop hard-required app_id check
│       └── handler/DefaultAppEventPayloadHandler.java # + private resolveAppId(payload): current_app_id →
│                                                        #   payload.app_id (warn) → "unknown" (warn); replaces
│                                                        #   every payload.app_id use for a Firestore field/query
├── presentation/adapters/
│   └── WebAppsAdapter.java                      # + "app_id" intent extra on sub-app launch (debug log, tag "WebAppsAdapter")
└── WebApp.java                                  # getIntentData(): set AppContextKey.CURRENT_APP_ID (debug log, tag "WebApp")

app/src/test/java/org/curiouslearning/container/
└── (new/extended unit tests for validator + handler app_id resolution behavior)
```

**Structure Decision**: Single existing Android module (`app/`), no new module or package. Every
touched file already owns the layer it's modified in (constitution Principle V); the feature adds
one field, one enum constant, one intent extra, and swaps an identifier source in the existing
handler — nothing structurally new.

## Complexity Tracking

*No violations — table intentionally omitted.*
