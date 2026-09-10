# Quickstart: Validating Coalesced Usage Writes

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Contract**: [contracts/](./contracts/usage-write-coalescing-contract.md)

Unlike MR-182, this feature ships with unit tests — most invariants below are checked automatically. The
device levels remain necessary for what a unit test cannot fake: real Activity lifecycle toggling, a real
process kill, and a real device restart.

**Package**: `org.curiouslearning.container` · **Branch**: `feature/MR-184`

---

## Prerequisites

- Branch checked out with this feature's classes present:
  ```powershell
  git rev-parse --abbrev-ref HEAD                      # feature/MR-184
  Test-Path app\src\main\java\org\curiouslearning\container\core\usage\flush\CoalescingUsageFlusher.java
  ```
- A device or emulator, `adb` on PATH, and the app installed from this branch.
- Firestore access for the project, to read back `summary_data`.
- A known `cr_user_id` (shown on the home screen / as a QR code per MR-199; the debug language popup can pin a
  custom one for isolating a test run).

---

## Level 1 — Unit tests (no device)

```powershell
.\gradlew testDebugUnitTest --tests "org.curiouslearning.container.core.usage.flush.*"
```

**Proves**, without a device:

- `CoalescingUsageFlusherTest`: multiple folded segments sum correctly (SC-002, SC-003 — two 20-minute capped
  segments total 40, not re-capped to 30); an empty buffer never calls through to the delegate (FR-004); the
  ticker starts on first fold and stops once the buffer empties; `flushPending()` forces an immediate real
  flush and empties the buffer; a delegate `onFailed()` keeps the persisted record for retry.
- `PendingUsageWriteRecoveryTest`: a recovered record is written via the plain `UsageSegment` constructor —
  assert `recoveredSeconds == 0` and `recoveredCount == 0` on the flushed segment (FR-009); the record is
  deleted only after `onQueued()`; a record surviving a simulated boot-token mismatch (there is none checked —
  assert recovery does **not** discard on any boot signal, unlike `OpenStretchRecovery`) still recovers
  (FR-011).
- `SharedPreferencesPendingUsageWriteStoreTest` (Robolectric): a saved record round-trips unchanged through
  `save`/`loadAll`; a malformed stored value is skipped, not thrown (mirrors
  `SharedPreferencesOpenStretchStore`'s existing tolerance).

Also run the full build to catch anything these targeted tests don't:

```powershell
.\gradlew compileDebugJavaWithJavac lint
```

---

## Level 2 — Bounded write volume under rapid toggling (US1)

**Proves**: the core scenario — a fidgety child does not multiply writes.

1. Install and open the container, pick a language, note the `cr_user_id`.
2. Open a sub-app, then rapidly alternate Home and reopening it (via recents) **10+ times** over less than a
   minute — each toggle should stay well under the 5-minute flush interval. Watch logcat:
   ```powershell
   adb logcat -s SubAppUsageTracker:D UsageFlusher:D CoalescingFlusher:D
   ```
3. Confirm in logcat: many `stopAndDrain`/fold events, but **no** `UsageFlusher: Flushed ...` (the real
   Firestore write log line) during the toggling itself.
4. Either wait out the 5-minute interval, or finish the sub-app for real (tap the close button / Back) to
   trigger `isFinishing()`.
5. Confirm exactly **one** `UsageFlusher: Flushed ...` line appears at that point, and read the document.

**Expected**: `cr_duration_seconds` increases by the sum of every toggle's on-screen time (allow ~1.5s per
toggle for MR-180's debounce to discard genuinely trivial taps), in a single write — not one write per toggle
(SC-001).

---

## Level 3 — Per-segment cap survives coalescing (US2)

**Proves**: two capped 20-minute segments write 40 minutes, not 30 (spec's own example, SC-003).

This is impractical to run for real at 30-minute segments on a device; rely on `CoalescingUsageFlusherTest`
for the arithmetic (Level 1) and use this device pass only as a sanity spot-check with the per-segment cap
temporarily lowered in a debug build (see `SubAppUsageTimer`'s test constructor for the pattern), or skip to
Level 4 if the unit test already covers it convincingly.

---

## Level 4 — Nothing lost on a process kill mid-buffer (US3)

**Proves**: the pending-buffer's own recovery path, independent of MR-182's.

1. Open a sub-app, use it briefly, then Home-button out (not finish) — this drains a segment into the buffer
   but does **not** trigger a real Firestore write. Confirm via logcat: a fold happened, no `Flushed` line.
2. Read `summary_data` now — the buffered time should **not** yet be present.
3. Kill the process without a clean exit:
   ```powershell
   adb shell am force-stop org.curiouslearning.container
   ```
4. Relaunch the container. Recovery runs from `MainActivity.onCreate`, alongside MR-182's.
5. Read the document again.

**Expected**:

| Field | Change |
|---|---|
| `cr_duration_seconds` | **+** the buffered amount from step 1 |
| `cr_duration_raw_seconds` | **+** the same amount |
| `cr_recovered_seconds` | **unchanged** — this is a measurement, not an estimate (FR-009) |
| `cr_recovered_count` | **unchanged** |

The last two rows are the point of this whole feature's safety story: if either increments, buffered time is
being recovered through the wrong path.

---

## Level 5 — Device restart does not discard pending time (US3, edge case)

**Proves**: unlike an open, undrained stretch, already-drained buffered time is not boot-scoped (FR-011).

Repeat Level 4, but insert `adb reboot` (and wait for the device) between steps 3 and 4 instead of relaunching
immediately. **Expected**: identical to Level 4 — the buffered time still recovers. Contrast with MR-182's own
Level 3 (`specs/002-recover-usage-segments/quickstart.md`), where a reboot correctly discards an *open*
stretch — the two features are supposed to disagree on this, for the reasons in
[research.md](./research.md) D3.

---

## Level 6 — A clean exit leaves nothing behind (US4)

**Proves**: no orphaned buffer or marker after a normal session.

1. Open a sub-app, use it, Home-toggle a few times (building up a buffer), then finish it for real (close
   button / Back).
2. Confirm the real Firestore write happens at that point (logcat `Flushed` line).
3. Relaunch the container.

**Expected**: no change to the document on relaunch, and no recovery log lines
(`CoalescingFlusher`/`UsageFlusher recovered ...`) for that key — nothing was left pending.

---

## Local sub-app builds

To run a local FTM or assessment build inside the container while testing, use the **`test-subapp-locally`**
skill rather than reproducing the setup here.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| A write happens on every Home toggle | `isFinishing()` not being read correctly, or not reaching `SubAppUsageTracker.onStop()` — check D1 |
| No write ever happens, even after finishing | `flushPending()` not called on the `finishing` path, or the flusher resolved via `CoalescingUsageFlushers` isn't the same instance the buffer was folded into |
| `cr_duration_seconds` is short after coalescing | The per-segment cap was re-applied to the coalesced sum instead of only at drain time — check `CoalescingUsageFlusher` sums `cappedSeconds` directly, never re-derives from raw |
| `cr_recovered_seconds`/`cr_recovered_count` increment after a buffered-time recovery | `PendingUsageWriteRecovery` built a segment via `UsageSegment.recovered(...)` instead of the plain constructor (D6) |
| Buffered time vanishes across a reboot | `PendingUsageWriteRecovery` (or its store) is applying a boot-token check that does not belong on this record type (D3) |
| Two writes appear for time that should have been recovered once | `PendingUsageWrite` deleted before `onQueued()`, or deleted twice — check the delete is gated on the recovery flush's own callback, not a shared one |
