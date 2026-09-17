# Feature Specification: Coalesce Sub-App Usage Writes

**Feature Branch**: `feature/MR-184`

**Created**: 2026-09-09

**Status**: Draft

**Input**: User description: "As the app usage tracker, I need to coalesce write-volume for
foreground/background timer toggles so that a fidgety child switching apps rapidly doesn't generate a
Firestore write per toggle — while still capping and persisting time correctly. Builds on the sub-second
debounce (MR-180) by batching writes in memory, flushing on stop/finish or periodically (default every 5
min, tunable per MR-189's write-volume data). The 30-minute idle cap (MR-178/MR-180) applies per segment,
not to the coalesced sum — so two capped 20-minute segments must total 40 minutes, not get re-capped to 30.
Both cr_duration_seconds and cr_duration_raw_seconds from stopAndDrain() flow through to the write (per
MR-183). Coalescing also opens a new loss window that MR-182's recovery marker doesn't cover, so the
pending buffer needs its own persistence and recovery path — but recovered pending time is a real
measurement, not an estimate, so it must not touch the cr_recovered_* fields."

**Source ticket**: [MR-184](https://curiouslearning.atlassian.net/browse/MR-184) (Task under epic MR-166)

## User Scenarios & Testing *(mandatory)*

The people served by this feature are the **data analysts and program staff** who use container-measured
sub-app usage to answer "how long are children actually spending in each literacy app?", and, indirectly,
the **Firestore budget and infrastructure** the program pays for. The child using the device is unaffected:
nothing here changes what they see or do.

### User Story 1 - Rapid switching doesn't flood the write pipeline (Priority: P1)

Today, every time a sub-app leaves the foreground for good — the child presses Home, opens another app,
switches sub-apps — the container writes that stretch of time to Firestore immediately. A fidgety child who
bounces in and out of a sub-app dozens of times in a few minutes produces dozens of writes for what is, from
an analyst's perspective, one sitting. This story batches that time in memory and sends it in a small,
bounded number of writes instead of one per toggle.

**Why this priority**: This is the entire purpose of the ticket. Left unfixed, write volume scales with how
fidgety a child is rather than with how long they actually play, which inflates Firestore cost and load
without adding any information. Every other story here exists to make the batching safe, not to deliver the
batching itself.

**Independent Test**: Rapidly foreground and background one sub-app many times over a few minutes, well
inside one flush interval, then wait for a flush to occur. The number of writes produced is small and does
not grow with the number of toggles. Delivers the core value on its own.

**Acceptance Scenarios**:

1. **Given** a child toggles a sub-app between foreground and background far more times than there are flush
   intervals in that span, **When** the toggling stops, **Then** the number of usage writes produced is
   bounded by the number of flush intervals elapsed (plus, at most, one for the session ending), not by the
   number of toggles.
2. **Given** no toggling has happened and no time has accumulated since the last flush, **When** a periodic
   flush interval elapses, **Then** no write is produced — an empty buffer is never sent.
3. **Given** a single sub-app session with no rapid switching at all, **When** the session ends normally,
   **Then** its behavior is unchanged from today: the time is written once, promptly.

---

### User Story 2 - Coalesced totals are exactly correct (Priority: P1)

Batching writes must not change how much time is reported, nor how the existing per-segment session-length
cap applies. Two capped 20-minute stretches, folded into the same batched write, must total 40 minutes — the
cap belongs to each stretch individually, and re-applying it to the combined total would silently and
wrongly erase real, measured time.

**Why this priority**: A batching mechanism that saves writes but corrupts totals is worse than no batching
at all, since the error is invisible to anyone reading the usage record. This is exactly as critical as
Story 1 — the two together are what "coalesce... while still capping and persisting time correctly" means.

**Independent Test**: Produce several already-capped stretches of usage in immediate succession, force a
flush, and read the resulting write. The written capped duration equals the sum of the individual stretches,
not a value re-limited to the per-segment maximum.

**Acceptance Scenarios**:

1. **Given** two stretches of usage that were each individually capped at the 30-minute per-segment maximum,
   **When** both are folded into the same coalesced write, **Then** the write reports 40 minutes of capped
   duration, not 30.
2. **Given** any number of stretches folded into one coalesced write, **When** the write is produced,
   **Then** its capped duration equals the sum of each stretch's own capped duration, and its raw duration
   equals the sum of each stretch's own raw (uncapped) duration.
3. **Given** a coalesced write is produced, **When** it is compared to what today's per-toggle writes would
   have totaled for the same activity, **Then** the two totals are identical — coalescing changes only how
   many writes occur, never the amount of time recorded.
4. **Given** a coalesced write, **When** it is inspected, **Then** it carries both the capped duration and
   the raw duration, exactly as every individual flush does today.

---

### User Story 3 - Nothing is lost if the process dies with time only batched (Priority: P1)

Batching time in memory instead of writing it immediately creates a new way for it to be lost: if the
container process dies after time has been drained into the batch but before that batch has been sent, that
time is neither in Firestore nor still tracked by the existing crash-recovery mechanism for in-progress
sessions, which only covers time that hasn't been drained yet. This story gives the batched-but-unsent total
its own durable record, so it survives a crash and shows up on the next launch — as ordinary, already-measured
time, not as a recovery estimate.

**Why this priority**: Without this, the feature would trade a cost problem (too many writes) for a data-loss
problem (missing time), which is a worse trade for a program whose whole point is measuring usage accurately.
It carries the same priority as Stories 1 and 2 because all three are required for the feature to be net
positive.

**Independent Test**: Drain usage time into the batch, kill the container process before the next scheduled
flush, then relaunch. The usage record increases by exactly the batched amount, written as ordinary duration,
with no change to the recovered-time or recovery-count figures.

**Acceptance Scenarios**:

1. **Given** time has been drained into the batch but not yet sent, **When** the container process is killed
   and relaunched, **Then** the usage record for that child, sub-app, and language increases by exactly the
   batched amount, as if it had been flushed just before the kill.
2. **Given** batched time is recovered on the next launch, **When** the usage record is read, **Then** the
   recovered amount appears in the same ordinary duration fields as any other flush — it does **not**
   increment the recovered-time or recovery-count figures used to flag estimates, because it is a completed
   measurement, not a guess.
3. **Given** the device restarts between the crash and the next launch, **When** the container is launched
   after the restart, **Then** the batched time is still recovered — unlike an in-progress, undrained
   stretch, already-drained batched time does not depend on the run of the device it was measured in.
4. **Given** nothing has been drained into the batch at the moment of a crash, **When** the container is
   relaunched, **Then** nothing extra is written — an empty batch recovers to nothing.

---

### User Story 4 - A clean exit leaves nothing behind (Priority: P2)

Both the existing in-progress-session marker and the new batched-time record exist only to survive an
unclean death. If either survives a session that actually ended cleanly, the next launch risks recovering
time that was already accounted for, double-counting it.

**Why this priority**: Double-counting is a worse failure than under-counting because it is invisible and
looks like genuine engagement. It is P2 because it is a safety constraint on Stories 1-3 rather than value
delivered on its own — those stories must exist first for there to be anything to clean up after.

**Independent Test**: Use a sub-app long enough to trigger batching, let the session end normally (flushed
and accepted), relaunch the container, and confirm nothing changes and nothing is recovered.

**Acceptance Scenarios**:

1. **Given** a batched write was durably accepted, **When** the container is later relaunched, **Then** no
   leftover record of that batch remains, and nothing from it is recovered again.
2. **Given** a sub-app session ends cleanly with an empty batch, **When** the container is relaunched,
   **Then** no batch record and no in-progress-session marker exist for that sub-app.
3. **Given** a batch is recovered on launch and successfully written, **When** the container is relaunched a
   second time, **Then** that same batch is not recovered again.

---

### Edge Cases

- **A toggle happens at the exact moment a periodic flush fires**: the stretch just closing is either folded
  into the flush in progress or held for the next one — it is never split, duplicated, or dropped.
- **Several sub-apps or languages are batching time at once**: each child/sub-app/language combination is
  batched and flushed independently; one combination's flush or recovery does not affect another's.
- **A periodic flush is attempted but rejected or fails** (e.g. offline): the batch is not cleared until the
  write has been durably accepted for eventual delivery, exactly as today's single-segment flush behaves.
- **A flush was already in flight when the process died**: on relaunch, that time is recovered from the
  persisted batch and written once — it is never left permanently pending nor written twice.
- **Time is sitting in the batch and also, separately, a segment is still open (undrained) when the process
  dies**: both are recovered — the still-open segment through the existing in-progress-session recovery, and
  the already-drained batch through this feature's own recovery — and together they account for exactly the
  time that was genuinely accumulated, with no overlap between the two.
- **The periodic flush interval is very long relative to a short session**: the session-ending flush still
  fires when the sub-app session is definitively over, so time does not wait indefinitely for the next
  periodic tick.
- **First launch after install, or after stored data is cleared**: no batch exists, nothing is recovered, and
  this is not an error condition.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST accumulate multiple drained usage stretches for the same child, sub-app, and
  language in memory rather than writing each one to the durable usage record as soon as it is drained.
- **FR-002**: The system MUST flush the accumulated batch to the durable usage record periodically, at a
  default interval of 5 minutes, with that interval adjustable independently of the coalescing logic itself
  so it can be tuned against observed write-volume data.
- **FR-003**: The system MUST also flush the accumulated batch promptly when the tracked session for that
  sub-app and language is definitively ending, so batched time is not left unwritten indefinitely after a
  child has genuinely finished using it.
- **FR-004**: The system MUST NOT produce a write when the accumulated batch holds no time — an empty batch
  is never flushed.
- **FR-005**: The capped duration written on a flush MUST equal the sum of the individually-capped durations
  of every stretch folded into that batch; the per-segment session-length cap MUST NOT be re-applied to the
  combined total.
- **FR-006**: The raw (uncapped) duration written on a flush MUST equal the sum of the raw durations of every
  stretch folded into that batch, and MUST be written alongside the capped duration on every flush, matching
  the existing single-segment guarantee.
- **FR-007**: The system MUST persist the accumulated-but-unflushed batch to storage that survives the
  container process being killed, kept up to date as stretches are folded into it.
- **FR-008**: On container launch, the system MUST recover any persisted batch left by a previous run and
  write it to the usage record, exactly as if it had been flushed immediately before the process died.
- **FR-009**: Recovered batched time MUST be written using the same ordinary capped/raw duration fields as a
  live flush, and MUST NOT increment or otherwise contribute to the recovered-time or recovery-count figures
  reserved for estimated (rather than measured) time.
- **FR-010**: The system MUST clear the persisted batch record only once its contents have been durably
  accepted for eventual delivery, so a rejected or offline write is retried rather than lost.
- **FR-011**: Persisted batched time MUST NOT be discarded because of a device restart between the crash and
  the next launch — already-drained batched time is a completed measurement, not an in-progress stretch tied
  to a particular uninterrupted run of the device.
- **FR-012**: The system MUST batch and flush each child/sub-app/language combination independently, so
  activity in one combination cannot delay, merge with, or be lost alongside another's.
- **FR-013**: When a sub-app session ends cleanly and its batch (if any) has been flushed and accepted, the
  system MUST leave no persisted batch record and no orphaned in-progress-session marker behind for that
  session.
- **FR-014**: The total amount of usage time recorded for a period of activity MUST be identical whether or
  not coalescing occurs — coalescing MUST change only the number of writes produced, never the recorded
  amount of time.

### Key Entities

- **Coalesced write buffer**: an in-memory (and durably persisted) running total of capped and raw seconds
  for one child/sub-app/language combination, accumulated from multiple drained stretches since the last
  flush. Grows as stretches are folded in; resets to empty once its contents are durably written. Distinct
  from, and covers a different span of time than, the existing in-progress-session marker (MR-182), which
  tracks time that has not yet been drained at all.
- **Flush trigger**: the event that causes a buffer to be written out — either a periodic interval (default
  5 minutes, tunable) or the definitive end of the tracked session for that sub-app and language. A trigger
  that finds an empty buffer produces no write.
- **Persisted pending record**: the on-disk counterpart of the coalesced write buffer, existing solely so a
  process kill between drains and a flush does not lose the batched time. Recovered on the next launch and
  written as ordinary duration, never as a recovery estimate. Removed once its contents are durably flushed,
  whether that happens live or via recovery.
- **Usage record**: the existing per-child, per-sub-app, per-language accumulation of container-measured
  usage that coalesced writes are folded into. Its shape is fixed by MR-183 and is not changed here.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For a session containing far more foreground/background toggles than flush intervals, the
  number of usage writes produced is bounded by the number of flush intervals (plus at most one for session
  end) rather than by the toggle count — e.g., 20 toggles inside a single 5-minute interval produce at most 2
  writes instead of 20, at least a 90% reduction in write volume for that activity.
- **SC-002**: The total duration recorded for any coalesced session is identical, to the second, to what
  would have been recorded had every stretch been written individually — coalescing never gains or loses
  time.
- **SC-003**: A session made of multiple stretches each capped at the 30-minute per-segment maximum
  accumulates its full sum when coalesced (e.g., two 20-minute stretches record 40 minutes total), and is
  never re-capped to the per-segment maximum.
- **SC-004**: Every coalesced write carries both a capped and a raw duration, with 100% coverage — no
  coalesced write is ever missing one of the two.
- **SC-005**: 100% of batched time pending at the moment of an unclean process death is present in the usage
  record after the next launch, including across a device restart in between.
- **SC-006**: Recovered batched time never appears in, or increases, the recovered-time or recovery-count
  figures reserved for estimated stretches — it is indistinguishable, in the ordinary duration fields, from
  time that was flushed live.
- **SC-007**: After any session that ends cleanly, zero leftover batch or session markers remain that could
  cause a double-count or a phantom recovery on a later launch.

## Assumptions

- **The mechanisms this builds on already exist and are unchanged.** The sub-second debounce (MR-180), the
  30-minute per-segment session-length cap (MR-178/MR-180), and the usage record's field shape (MR-183) are
  in place; this feature changes only how often a drained stretch is written, not how a stretch itself is
  measured or capped.
- **5 minutes is a starting default, not a fixed constant.** The exact periodic interval is expected to be
  tuned against real write-volume data gathered under MR-189; this spec requires the interval to exist and be
  adjustable, not a specific final value.
- **"Session end" reuses the existing trigger that writes today.** The point at which a sub-app's tracked
  session is considered definitively over is the same point that causes an immediate write today; this
  feature does not redefine when a session ends, only what happens at the periodic points in between.
- **The in-progress-session marker from MR-182 is unchanged.** It continues to cover only time that has not
  yet been drained from the timer. This feature adds a second, independent durable record for time that has
  been drained but not yet flushed — the two never need to represent the same span of time simultaneously.
- **Already-drained batched time is a measurement, not an estimate.** Unlike a recovered in-progress stretch
  (MR-182), which fills in for an unknown end point, batched time was already measured exactly via the
  existing debounce-and-cap logic before it entered the batch; recovering it is retrieving a completed
  number, not estimating one. This is why it belongs in the ordinary duration fields rather than the
  recovered-time fields.
- **This is a cost and data-integrity change, not a product change.** No child-facing behavior, screen, or
  content is added or altered.
- **Delivery target.** This work builds on the usage-tracking stack that currently lives on the MR-166 epic
  branch rather than on `develop`, and is expected to merge into that epic alongside its sibling tasks.
