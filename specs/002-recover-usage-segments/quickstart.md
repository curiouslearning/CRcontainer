# Quickstart: Validating Recovered Usage Segments

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Contract**: [contracts/](./contracts/usage-write-and-payload-contract.md)

How to prove this feature works. With no unit tests on this branch, the device scenarios below are the only
verification there is — and they cover the thing a unit test could never fake anyway: an actual process kill
and an actual reboot.

**Package**: `org.curiouslearning.container` · **Branch**: `feature/MR-182`

---

## Prerequisites

- Branch checked out with the MR-166 usage stack present:
  ```powershell
  git rev-parse --abbrev-ref HEAD                      # feature/MR-182
  Test-Path app\src\main\java\org\curiouslearning\container\core\usage\SubAppUsageTracker.java
  ```
- A device or emulator, `adb` on PATH, and the app installed from this branch.
- Firestore access for the project, to read back `summary_data`.
- A known `cr_user_id`. The container shows it on the home screen and can render it as a QR code (MR-199);
  the debug language popup can also pin a custom one, which is useful for isolating a test run.

---

## Level 1 — Build only (no device)

There are no unit tests on this branch, so this proves nothing about behaviour — only that it compiles and
adds no new lint findings:

```powershell
.\gradlew compileDebugJavaWithJavac
.\gradlew lint
```

Lint reports 3 errors and 110 warnings, all pre-existing and unrelated to this feature (Picasso's
`NotificationPermission` in the manifest, two `android:tint` layouts) — verified against a clean baseline.

> **Read this before skipping any level below.** With the unit tests removed, Levels 2–6 are not a
> supplement to automated coverage — they are the *entire* verification of this feature. Every invariant
> that a test would have pinned down (the estimate arithmetic, the boot-token discard, the
> delete-only-when-queued rule, the `container_language` trust boundary) is now checked only here, by hand.

---

## Level 2 — The core scenario on a device (US1, US2)

**Proves**: time before a crash is recovered, and is labelled as an estimate.

1. Install and open the container, pick a language, note the `cr_user_id`.
2. Read the current `summary_data` document for that `cr_user_id` + `app_id` + `metadata.language`. Write down
   `cr_duration_seconds`, `cr_duration_raw_seconds`, `cr_recovered_seconds`, `cr_recovered_count` (the last
   two may be absent — that is correct for a document that has never been recovered).
3. Open a sub-app and leave it in the foreground, screen on, for **~3 minutes**. Watch the record being kept:
   ```powershell
   adb logcat -s SubAppUsageTracker:D UsageFlusher:D OpenStretch:D
   ```
4. Kill the process **without a clean exit** — this is the whole point, so do not press Back or Home first:
   ```powershell
   adb shell am force-stop org.curiouslearning.container
   ```
   `force-stop` skips `onStop`, so nothing is flushed. Confirm no flush appeared in logcat.
5. **Wait at least 10 minutes** before relaunching. This is the step that catches the wrong estimate: an
   implementation anchored on recovery time will report ~13 minutes (or the 30-minute cap), not ~3.
6. Relaunch the container. Recovery runs from `MainActivity.onCreate`.
7. Read the document again.

**Expected**:

| Field | Change |
|---|---|
| `cr_duration_seconds` | **+~180s**, within one heartbeat interval (60s) of the real 3 minutes |
| `cr_duration_raw_seconds` | **+ the same amount** — the difference between raw and capped is unchanged (FR-008, SC-004) |
| `cr_recovered_seconds` | **+ the same amount** |
| `cr_recovered_count` | **+1** |
| `metadata.language` | the language used in step 2, **not** whatever is selected now |
| any `cr_recovered` boolean | **absent** (FR-010) |

Then verify `cr_recovered_seconds <= cr_duration_seconds` (SC-003).

---

## Level 3 — The reboot case (US3)

**Proves**: an uninterpretable stretch is discarded, not guessed.

1. Open a sub-app, accumulate ~2 minutes.
2. `adb shell am force-stop org.curiouslearning.container`
3. Reboot: `adb reboot`, then wait for the device.
4. Open the container and read the document.

**Expected**: no change to **any** field — no duration, and critically **no `cr_recovered_count` increment**
(FR-005, US3 §2). A zero-length recovery being counted here is the specific failure this scenario exists to
catch. Launch the container a second time and confirm still no change: the record was deleted, not merely
skipped (US3 §3).

---

## Level 4 — No double counting (US4)

**Proves**: a clean session is written once.

1. Open a sub-app, use it ~2 minutes, then leave it with Back and return to the home screen. This flushes
   normally — confirm the write in logcat.
2. Note the document values.
3. Relaunch the container.

**Expected**: no further change, and no `cr_recovered_count` increment. Repeat with a **rotation** in the
middle of the session (a landscape sub-app calls `setRequestedOrientation()` and `WebApp` is rebuilt) and
confirm the session is still written exactly once (US4 §2).

---

## Level 5 — The silent sub-app (SC-009)

**Proves** the coverage argument in [research.md](./research.md) D3 — that recovery does not depend on a
sub-app reporting anything.

Run Level 2 twice: once with **FTM**, which reports events across the bridge, and once with the
**assessment** sub-app, which calls `window.Android` only for `cachedStatus`. The recovered value must be
accurate to within the same heartbeat interval in both cases. If the assessment run recovers nothing, or
recovers far less than the real session, the heartbeat has been wired to events rather than to the
container's own tick.

---

## Level 6 — Offline (FR-012)

**Proves** the record is not dropped before the write is durable.

1. Put the device in airplane mode.
2. Run Level 2's steps 3–6, still offline.
3. Confirm in logcat that recovery ran and the record was deleted (`onQueued` fired — Firestore accepted it
   locally).
4. Restore connectivity and confirm the document updates once, with `cr_recovered_count` **+1 and not +2**.

Step 4 is the important half: a `cr_recovered_count` of +2 means the record was replayed, which means cleanup
was gated on `onWritten()` instead of `onQueued()` (D6).

---

## Local sub-app builds

To run a local FTM or assessment build inside the container while testing — URL redirect, port forwarding,
linked local `@curiouslearning/core` — use the **`test-subapp-locally`** skill rather than reproducing the
setup here.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Nothing recovered at all | Sub-app was not identifiable, so it was never tracked (FR-014) — check `SubAppUsageTracker` logs for the `app_id`. Or `cr_user_id` was blank at launch |
| Recovered value ≈ time until relaunch | Estimate anchored on recovery time, not `lastAliveMs` (D2) |
| Recovered value always the 30-minute cap | Same cause, with a long idle gap |
| `cr_recovered_count` increments after a reboot | Boot token compared wrongly, or a discarded record written as zero-length (FR-005) |
| Recovered time in the wrong language document | `container_language` not set or not honoured — the handler is still stamping from live `AppContext` (D5) |
| `cr_duration_raw_seconds` grows faster than `cr_duration_seconds` on recovery | Recovered segment fed an uncapped value into the raw field (FR-008) |
| Count increments twice for one crash | Cleanup gated on `onWritten()` rather than `onQueued()` (D6) |
