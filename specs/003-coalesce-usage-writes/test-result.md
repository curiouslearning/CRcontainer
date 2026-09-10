# Test Results: Coalesce Sub-App Usage Writes

**Test plan**: [test-plan.md](./test-plan.md) · **Branch**: `feature/mr-184--summary-data-usage-coalesc`
**Executed by**: Claude Code (agent-driven `adb`), directed by QA (Miguel Felipe G Calo), against an Android
Studio emulator (`emulator-5554`, `sdk_gphone64_x86_64`), app `org.curiouslearning.container` v2.34.4
(versionCode 92). **cr_user_id**: `miguel-test1` · **Date**: 2026-09-10

## Before you cross-check against Firestore

**Method**: every case is verified two independent ways: (1) `adb logcat`, cleared before and dumped after
each case, filtered to `SubAppUsageTracker/UsageFlusher/CoalescingFlusher/PendingUsageWriteRecovery/
PendingUsageWriteStore/OpenStretchRecovery/OpenStretchStore/HeartbeatTicker`; and (2) direct on-device
inspection of `shared_prefs/sub_app_usage_pending_writes.xml` and `shared_prefs/sub_app_usage_open_stretches.xml`
via `adb shell run-as`. **I did not read Firestore itself** — no console/API access from this environment. Every
`cr_duration_seconds`/`cr_duration_raw_seconds` delta below is read from the `UsageFlusher: Flushed
UsageSegment{...}` log line at the moment of each write — the exact value `FirestoreUsageFlusher` hands to the
emitter (see [FirestoreUsageFlusher.java:60-61](../../app/src/main/java/org/curiouslearning/container/core/usage/flush/FirestoreUsageFlusher.java#L60-L61)),
so it should equal the `add` applied to `summary_data`. **Please verify these against the actual document** for
`cr_user_id=miguel-test1`, `appKey=feed-the-monster`, `language=English African` (`v1.8.1/j.v3.4`, the "Feed the
Monster" sub-app under English-African) and the `Sight Words` sub-app under the same language (referenced in
MT-US1-04).

I also found that the branch's own `tasks.md` (T013/T016/T022/T025/T028) already records the implementer's own
device-validation runs against a matching build — different session, different numbers (naturally), but the
same pass/fail outcomes reported below. I'm calling that out as corroboration, not as a substitute for this
independent pass.

---

## User Story 1 — Rapid switching doesn't flood the write pipeline

### MT-US1-01 — Bounded writes under rapid toggling — **PASS**

- Opened "Feed the Monster" (English-African), then toggled Home → Recents → reopen **11 times** in 30s
  (07:08:17–07:08:47Z), each toggle ~1.3–2s foreground (comfortably above MR-180's ~1.5s debounce floor, so
  every toggle should count).
- Mid-toggle logcat dump: **zero** `UsageFlusher: Flushed` lines.
- Mid-toggle `sub_app_usage_pending_writes.xml`:
  `feed-the-monster::english african` → `v1␟feed-the-monster␟English African␟miguel-test1␟8␟8` — proves
  folding into the buffer is happening with no real write yet.
- Finished for real (close button → `isFinishing()==true` path) at 07:09:09Z.
- Logcat after finish: **exactly one** line —
  `UsageFlusher: Flushed UsageSegment{appKey=feed-the-monster, language=English African, cappedSeconds=33, rawSeconds=33}`.
- `sub_app_usage_pending_writes.xml` and `sub_app_usage_open_stretches.xml` both `<map />` immediately after.

**Expected on `summary_data`**: `cr_duration_seconds` +33, `cr_duration_raw_seconds` +33, in a single `add`.
**Pass/Fail**: **PASS** — one write for 11 toggles, not 11.

### MT-US1-02 — Periodic flush fires without a finish — **PASS**

- Opened the sub-app, used it ~15s, Home-toggled once more (buffer only — no finish).
- Buffer confirmed non-empty right after backgrounding: `...miguel-test1␟24␟24` at 07:09:59Z (this is when the
  5-minute `HeartbeatTicker` armed, per `CoalescingUsageFlusher.flush()`'s "start ticker only when buffer was
  empty before this fold" rule).
- **Interval in effect**: `CoalescingUsageFlusher.DEFAULT_FLUSH_INTERVAL_MS` = 5 minutes (the default — no
  shortened test interval is wired into this build).
- Left the container entirely backgrounded, no further input, for the full interval.
- At **07:14:45Z** (4m46s after arming — inside normal scheduling jitter for a 5-minute interval), with zero
  further user action: `UsageFlusher: Flushed UsageSegment{appKey=feed-the-monster, language=English African,
  cappedSeconds=24, rawSeconds=24}`.
- `sub_app_usage_pending_writes.xml` and `open_stretches.xml` both empty afterward; ticker confirmed stopped
  (no further activity on it).

**Expected on `summary_data`**: `cr_duration_seconds` +24, `cr_duration_raw_seconds` +24, written with no
Home/finish action from the tester. **Pass/Fail**: **PASS**.

### MT-US1-03 — Empty buffer never writes — **PASS**

- Opened the sub-app and closed it (X button) after 0.4s — well under MR-180's ~1.5s debounce floor, so the
  whole segment should be discarded before it ever reaches the buffer.
- Logcat: **zero** lines from any of `SubAppUsageTracker/UsageFlusher/CoalescingFlusher`.
- `sub_app_usage_pending_writes.xml` and `open_stretches.xml`: both `<map />` — no orphaned entry either.

**Pass/Fail**: **PASS** — no write, and no leftover state from the discarded sub-second segment.

### MT-US1-04 — Independent batching per sub-app/language — **BLOCKED (navigation), not a defect**

- Buffered 5s into `feed-the-monster::english african` via a Home-toggle (confirmed via
  `sub_app_usage_pending_writes.xml`), intending to then open a second sub-app ("Sight Words",
  `sight-words::english african` or similar) and finish *that* one, to prove only its key flushes.
- **Could not reach the sub-app picker without finishing sub-app A first.** This container is single-task:
  `WebApp` has no `launchMode` override (defaults to `standard`) and no `onBackPressed()` override, and
  `MainActivity` sits *beneath* it in the same back stack. Once `WebApp` is merely stopped (Home), relaunching
  the container — via its launcher icon, via Recents, or via `am start -n .../.MainActivity` (which Android
  itself resolves to "bring the existing task to front," logged as `Warning: Activity not started, its current
  task has been brought to the front`) — always resumes `WebApp` (the last foreground Activity), never
  `MainActivity`'s grid. The only way back to the grid is the close button / Back, both of which call
  `finish()` (see [WebApp.java:634-644](../../app/src/main/java/org/curiouslearning/container/WebApp.java#L634-L644)),
  which is exactly the action this case needed to *not* take for sub-app A.
- What I actually reproduced by accident (documented so the log makes sense): my second `am start` and
  subsequent tap landed back inside the *same* Feed the Monster session, which had progressed from its splash
  into gameplay (a level-select screen) — the session simply continued and later flushed as one
  `cappedSeconds=23` write, all still `feed-the-monster`. No cross-key leakage occurred, but this run does not
  exercise a genuine two-key scenario.
- **FR-012 is still substantiated, just not by this device run**: `PendingUsageWrite.key()` and
  `CoalescingUsageFlushers` key everything by `appKey + "::" + language` (data-model.md §1,
  [CoalescingUsageFlushers.java](../../app/src/main/java/org/curiouslearning/container/core/usage/flush/CoalescingUsageFlushers.java)),
  so two different keys mechanically cannot share a `SharedPreferences` entry or a `HeartbeatTicker` instance —
  and the implementer's own `CoalescingUsageFlusherTest`/device notes in `tasks.md` cover this path.

**Pass/Fail**: **NOT INDEPENDENTLY VERIFIED on-device this session** — blocked by the container's own
single-task navigation model, not by any observed defect. Recommend either an intent-level repro (`am start`
targeting `.WebApp` directly with a second app's extras) or accepting the unit-test + code-structure evidence.

---

## User Story 2 — Coalesced totals are exactly correct

### MT-US2-01 — Per-segment cap survives coalescing — **PASS (via new unit test)**

Two real 30-minute-capped stretches are impractical by hand, and this build has no debug flag to lower
`SubAppUsageTimer.DEFAULT_CAP_MS` (30 min) — the test-plan's own guidance for this case is to rely on unit
coverage and treat a device pass as a sanity spot-check only.

The existing `CoalescingUsageFlusherTest.twoIndividuallyCappedSegmentsSumInFullNeverReCappedToASingleCap`
(`tasks.md` T016) proves the *coalescer* never re-caps a sum — but it hand-feeds already-capped numbers, so it
never proves the cap those numbers came from was real. I wrote a new test that closes that gap:
[`CoalescingUsageFlusherCapIntegrationTest`](../../app/src/test/java/org/curiouslearning/container/core/usage/CoalescingUsageFlusherCapIntegrationTest.java)
wires a real `SubAppUsageTimer` (its package-private test constructor, lowered cap, same pattern
`SubAppUsageTimerTest` already uses) into a real `CoalescingUsageFlusher`, reproducing the spec's own worked
example end to end: two 25-minute stretches against a 20-minute cap, each individually trimmed by the *real*
timer, folded and flushed together — asserting the coalesced write reports 2×cap (40 minutes' worth), not
re-capped to 1×cap.

```
Task :app:testDebugUnitTest
BUILD SUCCESSFUL
TEST-org.curiouslearning.container.core.usage.CoalescingUsageFlusherCapIntegrationTest.xml:
  tests="1" failures="0" errors="0"
```

**Pass/Fail**: **PASS** — 2×20-minute-cap = 40 minutes reported, never re-capped to 20. See "How to run the unit
tests" below to reproduce.

### MT-US2-02 — Raw duration always accompanies capped duration — **PASS**

Every single `UsageFlusher: Flushed` line observed across this entire session (7 of them) carried **both**
`cappedSeconds` and `rawSeconds`, always equal (all sessions were far under the 30-minute cap, so no trimming
occurred — `rawSeconds >= cappedSeconds` holds trivially as equality). No write was ever missing either field.

**Pass/Fail**: **PASS**.

### MT-US2-03 — Coalesced total equals what individual writes would have totaled — **PASS**

- Three stopwatch-timed ~10s stretches (07:18:54–07:19:18Z), each separated by a Home→Recents→reopen toggle,
  then finished for real.
- Result: `UsageFlusher: Flushed UsageSegment{appKey=feed-the-monster, language=English African,
  cappedSeconds=30, rawSeconds=30}` — an **exact** match to the 3×10s = 30s timed total, well inside the
  plan's "within one second per stretch" tolerance.

**Pass/Fail**: **PASS**.

---

## User Story 3 — Nothing is lost if the process dies with time only batched

### MT-US3-01 — Buffered time survives a process kill, recovers as ordinary duration — **PASS**

- Buffered 6s via a Home-toggle; confirmed persisted (`...miguel-test1␟6␟6`) and confirmed **no** `Flushed`
  line yet.
- `adb shell am force-stop org.curiouslearning.container` — confirmed dead (`pidof` empty).
- Relaunched. Logcat:
  ```
  PendingUsageWriteRecovery: Found 1 pending usage write(s) from a previous run
  UsageFlusher: Flushed UsageSegment{appKey=feed-the-monster, language=English African, cappedSeconds=6, rawSeconds=6}
  PendingUsageWriteRecovery: Recovered UsageSegment{appKey=feed-the-monster, language=English African, cappedSeconds=6, rawSeconds=6}
  ```
- Critically, the flushed segment's `toString()` carries **no** `recoveredSeconds=`/`recoveredCount=` suffix —
  `UsageSegment.toString()` only appends those when `isRecovered()` is true
  ([UsageSegment.java:60-61,65-71](../../app/src/main/java/org/curiouslearning/container/core/usage/UsageSegment.java#L60)),
  so their absence here is a structural proof, not just an inference, that this went through the plain
  4-argument constructor — i.e. `cr_recovered_seconds`/`cr_recovered_count` were **not** touched.
- `sub_app_usage_pending_writes.xml` empty immediately after.

**Expected on `summary_data`**: `cr_duration_seconds` +6, `cr_duration_raw_seconds` +6,
`cr_recovered_seconds`/`cr_recovered_count` **unchanged**. **Pass/Fail**: **PASS**.

### MT-US3-02 — Buffered time survives a device restart — **PASS**

- Buffered 4s via a Home-toggle; confirmed persisted and un-flushed.
- `adb reboot`, waited for `sys.boot_completed=1`.
- Relaunched post-boot (fresh task `t24`, confirming a genuine cold start, not a resumed process). Logcat:
  ```
  PendingUsageWriteRecovery: Found 1 pending usage write(s) from a previous run
  UsageFlusher: Flushed UsageSegment{appKey=feed-the-monster, language=English African, cappedSeconds=4, rawSeconds=4}
  PendingUsageWriteRecovery: Recovered UsageSegment{appKey=feed-the-monster, language=English African, cappedSeconds=4, rawSeconds=4}
  ```
  Again, no `recoveredSeconds`/`recoveredCount` in the segment. `pending_writes.xml` empty afterward.
- Did **not** separately re-run the "an open, undrained stretch is discarded across reboot" contrast case —
  that's MR-182's existing, unchanged behavior (`OpenStretchRecord`/`OpenStretchRecovery` are untouched by this
  feature per the contract §4), already covered by
  [specs/002-recover-usage-segments/quickstart.md](../002-recover-usage-segments/quickstart.md) Level 3.

**Pass/Fail**: **PASS** — buffered time is not boot-scoped, unlike an open stretch.

### MT-US3-03 — Pending record only clears once durably accepted — **PASS**

- Went offline via `adb shell svc wifi disable` / `svc data disable` (confirmed: `dumpsys connectivity` showed
  zero connected `NetworkAgentInfo`s — `AIRPLANE_MODE` broadcast itself is blocked by a permission denial from
  `adb shell`'s UID, so I used the interface-level equivalent instead).
- Repeated MT-US3-01's buffer→kill→relaunch **while still offline**. Recovery still ran and completed within
  ~700ms of relaunch — `Found 1 pending usage write(s)` → `Flushed ...cappedSeconds=4...` →
  `Recovered ...cappedSeconds=4...` — and `pending_writes.xml` went empty immediately, **without connectivity**.
  This confirms `onQueued()` fires on Firestore's local/offline queue acceptance, not a server ack (matching
  the contract's documented behavior).
- Restored connectivity (`svc wifi enable` / `svc data enable`, confirmed 2 network agents back). Cleared
  logcat first, then checked: **zero** new `Flushed`/`Recovered` lines appeared once online, and
  `pending_writes.xml` stayed empty — no replay, no double-queue.

**Pass/Fail**: **PASS** — the record cleared exactly once, at local acceptance, and was not replayed when
connectivity returned.

---

## User Story 4 — A clean exit leaves nothing behind

### MT-US4-01 — No orphaned buffer or marker after a normal session — **PASS**

Directly evidenced by every finishing flush observed this session (MT-US1-01, MT-US2-03, the MT-US1-04
continued session, and both recovery flushes in MT-US3-01/02/03): in every case,
`sub_app_usage_pending_writes.xml` and `sub_app_usage_open_stretches.xml` were both `<map />` immediately
after the write, and the next relaunch produced no recovery log line for that key.

**Pass/Fail**: **PASS** (n=6+ clean-exit observations, zero orphans in any of them).

### MT-US4-02 — **Ignored, per QA direction** (rotation edge case out of scope for this pass)

---

## Summary

| Case | Result |
|---|---|
| MT-US1-01 | ✅ PASS |
| MT-US1-02 | ✅ PASS |
| MT-US1-03 | ✅ PASS |
| MT-US1-04 | ⚠️ Blocked by app navigation, not a defect |
| MT-US2-01 | ✅ PASS (new unit test — see below) |
| MT-US2-02 | ✅ PASS |
| MT-US2-03 | ✅ PASS |
| MT-US3-01 | ✅ PASS |
| MT-US3-02 | ✅ PASS |
| MT-US3-03 | ✅ PASS |
| MT-US4-01 | ✅ PASS |
| MT-US4-02 | ⏭️ Ignored, per QA direction |

**10 of 11 in-scope cases verified and passing** (device + unit test combined). 1 blocked by the app's own
single-task navigation model (not a coalescing defect — recommend a follow-up with a direct-intent repro).
MT-US4-02 is out of scope for this pass per QA direction.

No coalescing-specific regression, data loss, or double-count was observed anywhere in this session.

---

## How to run the unit tests

**Prerequisite**: `JAVA_HOME` must point at a JDK. This machine has no system JDK on `PATH`, but Android
Studio ships one — I used its bundled JBR, found via the Start Menu shortcut's target
(`C:\apps\android\bin\studio64.exe` → `C:\apps\android\jbr`):

```powershell
$env:JAVA_HOME = "C:\apps\android\jbr"
$env:Path = "C:\apps\android\jbr\bin;$env:Path"
```

(Bash/git-bash equivalent: `export JAVA_HOME="C:\apps\android\jbr"; export PATH="/c/apps/android/jbr/bin:$PATH"`.)
If Android Studio is installed elsewhere on your machine, substitute its own install directory.

**Run just the new cap-integration test**:

```powershell
.\gradlew testDebugUnitTest --tests "org.curiouslearning.container.core.usage.CoalescingUsageFlusherCapIntegrationTest"
```

**Run the whole coalescing/flush test package** (what `quickstart.md` Level 1 calls for):

```powershell
.\gradlew testDebugUnitTest --tests "org.curiouslearning.container.core.usage.flush.*"
```

**Run the entire unit test suite** (what I ran to confirm no regressions — 61 tests, 0 failures, across all 10
test classes in the project, including the new one):

```powershell
.\gradlew testDebugUnitTest
```

**Read the results**: Gradle prints `BUILD SUCCESSFUL`/`BUILD FAILED` to the console, and per-class JUnit XML
reports land in `app/build/test-results/testDebugUnitTest/TEST-<fully.qualified.ClassName>.xml` (`tests=`,
`failures=`, `errors=` attributes on the `<testsuite>` element) — an HTML roll-up is also written to
`app/build/reports/tests/testDebugUnitTest/index.html`, viewable in a browser.

To also catch compile errors and lint issues in the same pass (the project's own T001/T026 baseline command):

```powershell
.\gradlew compileDebugJavaWithJavac testDebugUnitTest lint
```
