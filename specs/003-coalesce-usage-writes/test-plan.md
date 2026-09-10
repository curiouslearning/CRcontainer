# Test Plan: Coalesce Sub-App Usage Writes

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Research**: [research.md](./research.md) | **Data model**: [data-model.md](./data-model.md) | **Contract**: [contracts/](./contracts/usage-write-coalescing-contract.md)

**Branch**: `feature/MR-184` · **Package**: `org.curiouslearning.container.core.usage.flush`

This plan covers **manual, human-executed testing only** — a tester on a real device or emulator, `adb`, and
the Firestore console. There is no automated suite backing this plan; every case below is something a person
runs and records a pass/fail against. [quickstart.md](./quickstart.md) is the quick-start command reference.

---

## User Story 1 — Rapid switching doesn't flood the write pipeline

**MT-US1-01 — Bounded writes under rapid toggling**
*Covers*: FR-001, FR-003, SC-001

- **Preconditions**: container installed, `cr_user_id` known, logcat cleared.
- **Steps**:
  1. `adb logcat -s SubAppUsageTracker:D UsageFlusher:D CoalescingFlusher:D`
  2. Open a sub-app, then rapidly alternate Home and reopening it (via recents) **10+ times** over less than
     a minute — well inside the 5-minute flush interval.
  3. Watch the log: confirm repeated drain/fold activity, but **no** `UsageFlusher: Flushed ...` line during
     the toggling.
  4. Finish the sub-app for real (its close button, or Back out of it entirely).
  5. Read the `summary_data` document for that `cr_user_id`/`app_id`/language.
- **Expected**: exactly **one** `UsageFlusher: Flushed ...` line appears, at step 4 — not one per toggle.
  `cr_duration_seconds` increases by the sum of every toggle's on-screen time (allow ~1.5s per toggle for
  MR-180's debounce to discard genuinely trivial taps).
- **Pass/Fail**: _______ **Tested by / date**: _______

**MT-US1-02 — Periodic flush fires without a finish**
*Covers*: FR-002

- **Preconditions**: as above.
- **Steps**:
  1. Open a sub-app, accumulate at least a minute of usage, then Home-toggle a couple of times (buffering,
     not finishing).
  2. Leave the container running in the background and wait out the default 5-minute interval (or, on a
     debug build with a shortened test interval, wait that interval instead — confirm which is in effect
     before starting, and record it in the notes).
  3. Watch logcat for a `UsageFlusher: Flushed ...` line appearing on its own, with no further user action.
  4. Read the document.
- **Expected**: a write appears at (approximately) the configured interval, with no Home/finish action
  needed to trigger it; the document reflects the buffered time.
- **Pass/Fail**: _______ **Tested by / date**: _______

**MT-US1-03 — Empty buffer never writes**
*Covers*: FR-004

- **Steps**:
  1. Open the container without opening any sub-app, or open and close a sub-app fast enough that MR-180's
     debounce discards the whole segment (well under ~1.5s).
  2. Wait out (or trigger) a flush interval / finish.
- **Expected**: no `UsageFlusher: Flushed ...` line, and no document change.
- **Pass/Fail**: _______ **Tested by / date**: _______

**MT-US1-04 — Independent batching per sub-app/language**
*Covers*: FR-012

- **Steps**:
  1. Open sub-app A in language X, use it briefly, Home-toggle (buffers, does not flush).
  2. Open sub-app B (or A in language Y), use it briefly, then finish it for real.
  3. Read both documents (A/X and B/Y or A/Y).
- **Expected**: only the finished key's document changes; the other key's buffered time is still pending
  (confirm via on-device inspection:
  `adb shell run-as org.curiouslearning.container cat shared_prefs/sub_app_usage_pending_writes.xml`,
  looking for two separate keyed entries, or one remaining after the finished one is deleted).
- **Pass/Fail**: _______ **Tested by / date**: _______

---

## User Story 2 — Coalesced totals are exactly correct

**MT-US2-01 — Per-segment cap survives coalescing**
*Covers*: FR-005, SC-003

- **Preconditions**: this case needs two individually-capped stretches. Two real 30-minute stretches are
  impractical to run by hand; use a debug build with the per-segment cap temporarily lowered (see
  `SubAppUsageTimer`'s test constructor for the pattern used elsewhere in this codebase), or coordinate with
  engineering to get a build with a short test cap for this case specifically. Record which cap value was
  used.
- **Steps**:
  1. Note the document's `cr_duration_seconds` before starting.
  2. Produce one stretch that runs past the (lowered) cap, Home-toggle (buffer, don't finish).
  3. Produce a second stretch that also runs past the cap, then finish for real.
  4. Read the document.
- **Expected**: `cr_duration_seconds` increases by **twice** the cap value — the two capped stretches sum in
  full, they are not re-capped to a single cap's worth when coalesced into one write.
- **Pass/Fail**: _______ **Tested by / date**: _______

**MT-US2-02 — Raw duration always accompanies capped duration**
*Covers*: FR-006, SC-004

- **Steps**:
  1. Repeat MT-US1-01's toggling scenario (or reuse its result).
  2. Read `cr_duration_seconds` and `cr_duration_raw_seconds` on the resulting write.
- **Expected**: both fields are present and both increased on that same write; `cr_duration_raw_seconds`'s
  increase is `>=` `cr_duration_seconds`'s increase.
- **Pass/Fail**: _______ **Tested by / date**: _______

**MT-US2-03 — Coalesced total equals what individual writes would have totaled**
*Covers*: FR-014, SC-002

- **Steps**:
  1. Note `cr_duration_seconds` before starting.
  2. Use a sub-app for a known total amount of time (e.g., three ~1-minute stretches separated by Home
     toggles, timed with a stopwatch), then finish for real.
  3. Read the document.
- **Expected**: the increase in `cr_duration_seconds` matches the summed, timed usage to within one second
  per stretch (MR-180 debounce/whole-second flooring tolerance) — the same accuracy a tester would expect if
  every stretch had been written individually.
- **Pass/Fail**: _______ **Tested by / date**: _______

---

## User Story 3 — Nothing is lost if the process dies with time only batched

**MT-US3-01 — Buffered time survives a process kill, recovers as ordinary duration**
*Covers*: FR-007, FR-008, FR-009, SC-005, SC-006

- **Steps**:
  1. Note `cr_duration_seconds`, `cr_duration_raw_seconds`, `cr_recovered_seconds`, `cr_recovered_count`
     (the last two may be absent — correct for a document never recovered).
  2. Open a sub-app, use it briefly, Home-toggle (buffers, does **not** write — confirm via logcat, no
     `Flushed` line).
  3. Confirm the buffer is actually persisted: `adb shell run-as org.curiouslearning.container cat
     shared_prefs/sub_app_usage_pending_writes.xml` shows an entry for the key.
  4. Kill the process without a clean exit: `adb shell am force-stop org.curiouslearning.container`.
  5. Relaunch the container.
  6. Read the document again.
- **Expected**:

  | Field | Change |
  |---|---|
  | `cr_duration_seconds` | **+** the buffered amount from step 2 |
  | `cr_duration_raw_seconds` | **+** the same amount |
  | `cr_recovered_seconds` | **unchanged** |
  | `cr_recovered_count` | **unchanged** |

  The last two rows are the point of this whole feature's safety story — if either increments, buffered time
  is being recovered through the wrong path (mixed up with MR-182's estimate recovery).
- **Pass/Fail**: _______ **Tested by / date**: _______

**MT-US3-02 — Buffered time survives a device restart, unlike an open stretch**
*Covers*: FR-011, SC-005, SC-006

- **Steps**: repeat MT-US3-01, but insert `adb reboot` (and wait for the device to fully come back) between
  steps 4 and 5 instead of relaunching immediately.
- **Expected**: identical to MT-US3-01 — the buffered time still recovers. For contrast, repeat with an
  **open, undrained** stretch instead (don't Home-toggle first — kill while the segment is still open) and
  confirm that one is correctly **discarded** across the reboot per MR-182's existing behavior
  ([specs/002-recover-usage-segments/quickstart.md](../002-recover-usage-segments/quickstart.md) Level 3) —
  the two are supposed to disagree on this.
- **Pass/Fail**: _______ **Tested by / date**: _______

**MT-US3-03 — Pending record only clears once durably accepted**
*Covers*: FR-010

- **Steps**:
  1. Put the device in airplane mode.
  2. Run MT-US3-01 steps 2–6 while still offline.
  3. Confirm via logcat that recovery ran and the pending-write file entry is gone (Firestore accepted it
     locally, into its offline queue).
  4. Restore connectivity and confirm the document updates **once** — `cr_duration_seconds` increases by
     exactly the buffered amount, not double.
- **Expected**: step 4 is the important half — a doubled increase means the pending record was deleted too
  early (before durable local acceptance) and got replayed, or deleted too late and got queued twice.
- **Pass/Fail**: _______ **Tested by / date**: _______

---

## User Story 4 — A clean exit leaves nothing behind

**MT-US4-01 — No orphaned buffer or marker after a normal session**
*Covers*: FR-013, SC-007

- **Steps**:
  1. Open a sub-app, use it, Home-toggle a few times (building a buffer), then finish it for real.
  2. Confirm the real write happens at that point (logcat `Flushed` line) and note the document.
  3. Inspect on-device state: both
     `shared_prefs/sub_app_usage_pending_writes.xml` and `shared_prefs/sub_app_usage_open_stretches.xml`
     should have **no entry** for that key.
  4. Relaunch the container.
- **Expected**: no change to the document on relaunch, and no recovery log lines for that key — nothing was
  left pending in either store.
- **Pass/Fail**: _______ **Tested by / date**: _______

**MT-US4-02 — A rotation mid-buffer doesn't orphan or double-count**
*Covers*: FR-013 (edge case)

- **Steps**:
  1. Open a landscape-capable sub-app, use it, Home-toggle once (buffers).
  2. Reopen it and trigger a rotation (`setRequestedOrientation()` path / physically rotate if the sub-app
     supports it), which recreates the `WebApp` Activity.
  3. Finish for real.
  4. Read the document and inspect on-device state as in MT-US4-01.
- **Expected**: the buffered time from before the rotation is included in the final write exactly once; no
  leftover entries after.
- **Pass/Fail**: _______ **Tested by / date**: _______
