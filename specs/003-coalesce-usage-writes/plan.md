# Implementation Plan: Coalesce Sub-App Usage Writes

**Branch**: `feature/MR-184` (feature directory `003-coalesce-usage-writes`) | **Date**: 2026-09-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-coalesce-usage-writes/spec.md`

## Summary

Today, `SubAppUsageTracker.onStop()` calls `flush()` — and therefore performs one Firestore write — every
time a sub-app Activity stops, whether the child genuinely left it or merely backgrounded it (Home button,
app switcher, a covering dialog). A fidgety child toggling foreground/background rapidly multiplies writes
with no corresponding increase in information. This feature inserts a batching layer between the timer's
drain and the real Firestore write: drained stretches accumulate in a small per-`appKey::language` buffer and
are sent on to Firestore only when the tracked session is definitively ending or a periodic interval (default
5 minutes) elapses — never on every toggle.

Three things drive the design more than anything else, all direct consequences of the dependencies named in
the spec's Input:

1. **MR-180/MR-178's per-segment cap must survive summation.** `SubAppUsageTimer.stopAndDrain()` already
   caps each drained stretch individually; coalescing must sum already-capped values, never re-cap the sum
   (spec FR-005). No change to `SubAppUsageTimer` is needed — it already hands out one capped/raw pair per
   drain, exactly as it does today.
2. **MR-183's write shape does not change.** Every flush — live or recovered-from-buffer — still writes
   exactly `cr_duration_seconds` and `cr_duration_raw_seconds` via the same `AppEventPayloadBuilder` `add`
   path. This feature changes *when* and *how often* that write happens, never its shape.
3. **MR-182's recovery marker and this feature's own buffer must never both claim the same seconds.** The
   existing `OpenStretchRecord` protects time the timer hasn't drained yet; once `stopAndDrain()` runs, that
   protection must hand off — atomically enough — to a new, independently-persisted pending-write record
   before the open-stretch marker is cleared. Recovered pending time is written as ordinary duration, never
   through `cr_recovered_seconds`/`cr_recovered_count` (spec FR-009), because it was already measured, not
   estimated.

The design adds one new package-local mechanism (`core/usage/flush`'s `CoalescingUsageFlusher` and its
persistence/recovery siblings) behind the `SubAppUsageFlusher` seam that already anticipates it — the
interface's javadoc literally reads "a seam for tests, and for MR-184's coalescing" — plus one small, additive
change to `SubAppUsageTracker`/`WebApp` so a genuine session end can be told apart from a transient background
toggle.

## Technical Context

**Language/Version**: Java 8 (`sourceCompatibility`/`targetCompatibility` `VERSION_1_8`), Java-only per
Constitution "Technology & Platform Constraints"

**Primary Dependencies**: No new dependencies. Existing: AndroidX, Firebase Firestore (via the
`AppEventEmitter` → `DefaultAppEventPayloadHandler` path), `androidx.annotation`. Gson is not needed for the
new persisted record — see [research.md](./research.md) D3.

**Storage**: `SharedPreferences`, in a new private file dedicated to this feature
(`sub_app_usage_pending_writes`), parallel to and independent of MR-182's `sub_app_usage_open_stretches` —
see [research.md](./research.md) D3–D4 for why the two must not share a file or a record shape.

**Testing**: JUnit + Mockito + Robolectric (already project dependencies). Unlike MR-182, no waiver applies
here — no bridge-facing class is touched (Constitution Principle VI / Development Workflow gate), but the new
`core/usage/flush` classes sit behind the same kind of injected seams `SubAppUsageTimerTest` already exercises
(`HeartbeatTicker`, `MonotonicClock`-free pure arithmetic, a fake `SubAppUsageFlusher` delegate), so unit
tests are written alongside the implementation, not deferred.

**Target Platform**: Android, `minSdk` 24 / `targetSdk` 36 / `compileSdk` 36

**Project Type**: Android container app — single Gradle module `app`, layer-first packages under
`org.curiouslearning.container`

**Performance Goals**: One `SharedPreferences.apply()` of a few dozen bytes per drained stretch folded into a
buffer — the same cost class as MR-182's heartbeat write, and strictly less frequent than today's per-toggle
Firestore write. The periodic flush is at most one Firestore write every 5 minutes per open `appKey::language`
pair, replacing what could otherwise be dozens.

**Constraints**: Must not change the total amount of usage time recorded for any activity (spec FR-014); must
not re-apply the per-segment cap to a coalesced sum (FR-005); must not delay a genuine session-end write
indefinitely (FR-003); must not write anything when a buffer is empty (FR-004); recovered buffered time must
land in the ordinary duration fields, never `cr_recovered_*` (FR-009); must tolerate a device restart between
a crash and the next launch without discarding already-drained pending time (FR-011); must not introduce a
second Firestore write path outside `AppEventEmitter` (unchanged constraint from MR-182/183).

**Scale/Scope**: Two identifiable sub-apps today (`feed-the-monster`, `assessment`); at most one active
coalescing buffer per `appKey::language` pair, so single-digit buffers in practice. Roughly 7 new classes in
`core/usage/flush`, one narrow interface extraction (`FlusherFactory`, shared with `OpenStretchRecovery`), one
new parameter on `SubAppUsageTracker.onStop()`/`flush()`, and one new call in `MainActivity`'s existing
recovery bootstrap.

## Constitution Check

*GATE: evaluated before Phase 0, re-evaluated after Phase 1 design.*

| Principle | Gate | Pre-Phase-0 | Post-Phase-1 |
|---|---|---|---|
| **I. WebView Sub-App Boundary & Isolation** | No native code reaches into sub-app internals; nothing here requires a sub-app change | ✅ PASS | ✅ PASS — purely a native batching layer between an already-drained measurement and its Firestore write; no bridge, manifest, or sub-app touch point |
| **II. SOLID (NON-NEGOTIABLE)** | Buffering, persistence, and recovery are separate classes, not new branches in `SubAppUsageTracker` or `FirestoreUsageFlusher` | ⚠️ AT RISK — the obvious shortcut is to add buffering fields directly to `FirestoreUsageFlusher` or an `if` in `SubAppUsageTracker.flush()` | ✅ PASS — `CoalescingUsageFlusher` is a new `SubAppUsageFlusher` implementation (Open/Closed: `FirestoreUsageFlusher` is unchanged and reused as its delegate); `PendingUsageWriteStore`/`SharedPreferencesPendingUsageWriteStore`/`PendingUsageWriteRecovery` mirror the single-responsibility split MR-182 already established for `OpenStretchStore`/`OpenStretchRecorder`/`OpenStretchRecovery` |
| **III. Composition Over Inheritance** | New behavior is constructor-injected collaborators, matching how `timer`/`flusher`/`recorder` already are | ✅ PASS | ✅ PASS — `CoalescingUsageFlusher` composes a delegate `SubAppUsageFlusher`, a `PendingUsageWriteStore`, and a `HeartbeatTicker` (the same interface MR-182 introduced, reused rather than duplicated); no new inheritance anywhere |
| **IV. Idiomatic Java & Android** | AndroidX only; no raw threads; async work must not outlive its owner; SDKs behind own interfaces | ✅ PASS | ✅ PASS — periodic flushing reuses `HeartbeatTicker`/`ExecutorHeartbeatTicker` verbatim rather than introducing a second scheduling mechanism; `SharedPreferences` stays behind a store interface |
| **V. Scalable Layered Package Architecture** | New code belongs beside the mechanism it extends; implementation classes package-private by default | ✅ PASS | ✅ PASS — everything new lands in `org.curiouslearning.container.core.usage.flush`, the package MR-182's own refactor (commit `e7d74ca`) already created for flush-related seams; only the two new interfaces and the recovery entry point need to be `public` |
| **VI. Secure, Validated Native↔Web Bridge** | Every inbound payload still passes the validator; no new JS-reachable capability | ✅ PASS | ✅ PASS — no payload shape change, no new field, no bridge-facing class touched at all; the Firestore write contract from MR-183/MR-182 is reused unmodified (see [contracts/](./contracts/usage-write-coalescing-contract.md)) |

**Verdict: PASS on the Core Principles**, with no unjustified deviations. Unlike MR-182, no Constitution
Development Workflow gate is left open — no bridge-facing class changes here, and tests ship with the
implementation.

## Project Structure

### Documentation (this feature)

```text
specs/003-coalesce-usage-writes/
├── spec.md              # Feature specification (/speckit-specify output)
├── plan.md              # This file (/speckit-plan output)
├── research.md          # Phase 0 output — decisions D1–D8 with alternatives
├── data-model.md        # Phase 1 output — PendingUsageWrite and the changed collaborators
├── quickstart.md        # Phase 1 output — how to prove it works, on-device and via unit tests
├── contracts/
│   └── usage-write-coalescing-contract.md   # Phase 1 output
├── checklists/
│   └── requirements.md  # Spec quality checklist (all items passing)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
app/src/main/java/org/curiouslearning/container/
├── core/
│   └── usage/
│       ├── flush/
│       │   ├── SubAppUsageFlusher.java             # unchanged — already the coalescing seam
│       │   ├── FirestoreUsageFlusher.java          # unchanged — reused as the coalescing delegate
│       │   ├── FlusherFactory.java                 # NEW — hoisted from OpenStretchRecovery's nested
│       │   │                                          interface, so both recoveries share one abstraction
│       │   ├── CoalescingUsageFlusher.java         # NEW — buffers per appKey::language, flushes on
│       │   │                                          finish or on a HeartbeatTicker interval
│       │   ├── CoalescingUsageFlushers.java        # NEW — process-wide registry, mirrors
│       │   │                                          SubAppUsageTimers so the buffer survives Activity
│       │   │                                          recreation
│       │   ├── PendingUsageWrite.java              # NEW — immutable persisted value: appKey, language,
│       │   │                                          crUserId, cappedSeconds, rawSeconds
│       │   ├── PendingUsageWriteStore.java         # NEW — interface: loadAll / save / delete
│       │   ├── SharedPreferencesPendingUsageWriteStore.java  # NEW — production impl, own prefs file
│       │   └── PendingUsageWriteRecovery.java      # NEW — launch-time pass, writes ordinary
│       │                                              (non-recovered) UsageSegments
│       ├── OpenStretchRecovery.java                # CHANGED — nested FlusherFactory removed, imports
│       │                                              the shared one; behavior otherwise unchanged
│       ├── SubAppUsageTracker.java                 # CHANGED — onStop()/flush() gain a "finishing"
│       │                                              signal that calls flusher.flushPending()
│       ├── SubAppUsageTimer.java                   # unchanged
│       ├── UsageSegment.java                       # unchanged
│       ├── OpenStretchRecord.java                  # unchanged
│       ├── OpenStretchRecorder.java                # unchanged
│       ├── OpenStretchStore.java                   # unchanged
│       ├── SharedPreferencesOpenStretchStore.java  # unchanged
│       └── SubAppUsageTimers.java                  # unchanged
├── MainActivity.java                               # CHANGED — recovery bootstrap also runs
│                                                       PendingUsageWriteRecovery, alongside
│                                                       OpenStretchRecovery
└── WebApp.java                                     # CHANGED — onStop() passes isFinishing() through

app/src/test/java/org/curiouslearning/container/core/usage/
├── SubAppUsageTimerTest.java                       # unchanged
└── flush/
    ├── CoalescingUsageFlusherTest.java             # NEW
    ├── PendingUsageWriteRecoveryTest.java          # NEW
    └── SharedPreferencesPendingUsageWriteStoreTest.java  # NEW (Robolectric)
```

**Structure Decision**: Layer-first, per Principle V. Every new class lands in `core/usage/flush`, the
package MR-182's refactor already carved out for exactly this kind of flush-adjacent seam — no new top-level
package. `MainActivity` and `WebApp` are touched only as call sites: one new recovery invocation, one new
boolean threaded through an existing lifecycle call. Neither gains any coalescing logic of its own.

## Phase Sequencing

The design has one hard ordering constraint and is otherwise parallelisable:

1. **`FlusherFactory` extraction** — a pure refactor of `OpenStretchRecovery`'s existing nested interface
   into its own file. Zero behavior change; lands first so both recovery classes can depend on it without a
   merge conflict later.
2. **`PendingUsageWrite` + `PendingUsageWriteStore` + `SharedPreferencesPendingUsageWriteStore`** — pure value
   and persistence seam, independent of everything else.
3. **`CoalescingUsageFlusher` + `CoalescingUsageFlushers`** — depends on 2 for persistence and reuses
   `HeartbeatTicker` (already exists, no change). This is the core of the feature and the most test-heavy
   step.
4. **`PendingUsageWriteRecovery`** — depends on 1 and 2, not on 3 (recovery talks to the store and a
   `FlusherFactory` directly, bypassing the coalescer entirely, per [research.md](./research.md) D6).
5. **Wiring**: `SubAppUsageTracker` gains the `finishing` signal and calls `flushPending()`;
   `SubAppUsageTracker.create()` resolves its flusher via `CoalescingUsageFlushers.getInstance(...)` instead
   of `new FirestoreUsageFlusher(crUserId)`; `WebApp.onStop()` passes `isFinishing()`; `MainActivity` adds the
   `PendingUsageWriteRecovery` call beside the existing `OpenStretchRecovery` one.

Step 5 is the only step that touches already-shipped, behavior-bearing code (`SubAppUsageTracker`, `WebApp`,
`MainActivity`); steps 1–4 are pure additions and can be reviewed, and tested, independently of it.

## Complexity Tracking

*No unjustified Constitution deviations — table intentionally omitted.*
