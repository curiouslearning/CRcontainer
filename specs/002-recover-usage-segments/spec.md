# Feature Specification: Recover Open Usage Segments

**Feature Branch**: `feature/MR-182`

**Created**: 2026-09-03

**Status**: Draft

**Input**: User description: "MR-182 — Recover open usage segments after crash or process death"

**Source ticket**: [MR-182](https://curiouslearning.atlassian.net/browse/MR-182) (Task under epic MR-166)

## Clarifications

### Session 2026-09-03

- Q: How is a recovered stretch's duration estimated, given that its end is unknown? → A: Track a
  last-known-alive point for each open stretch and estimate the duration as that point minus the start,
  limited to the per-session maximum. Do **not** estimate from the moment of recovery, which would count
  every minute the device sat idle between the kill and the next launch as play time.
- Q: Can inbound sub-app events serve as the last-known-alive signal instead of a periodic one? → A: They
  advance it, but they do not define it. The signal is maintained by the container on its own while a
  sub-app is in the foreground with the screen on, and any inbound sub-app event advances it to at least
  the moment that event arrived. Two reasons events cannot be the sole source: a sub-app that reports no
  events would become unrecoverable despite being tracked, and container-measured usage exists specifically
  to be a measurement that does not depend on the sub-app's cooperation.

## User Scenarios & Testing *(mandatory)*

The people served by this feature are the **data analysts and program staff** who use container-measured
sub-app usage to answer "how long are children actually spending in each literacy app?". The child using
the device is unaffected: nothing here changes what they see or do.

### User Story 1 - Time spent before a crash is not lost (Priority: P1)

Today, container-measured usage time is only recorded when the container gets a chance to close out a
session cleanly. On the low-end devices this program targets, the container is frequently killed outright
— out-of-memory, a crash, a battery-saver kill, or the operating system reclaiming the process — and when
that happens the entire open stretch of time is discarded. An analyst looking at a child who played for
twenty minutes and then hit a crash sees zero minutes for that stretch. This story makes that time appear
in the usage record on the next launch of the container instead of vanishing.

**Why this priority**: This is the whole purpose of the ticket. Without it, usage figures are silently
biased downward, and biased *most* on exactly the cheapest, most-constrained devices — the population the
program most needs accurate numbers for. Every other story here refines or protects this one.

**Independent Test**: Open a sub-app, let time accumulate, kill the container process without letting it
shut down cleanly, then relaunch the container. The usage record for that child and sub-app increases by
the recovered stretch of time. Delivers the core value on its own.

**Acceptance Scenarios**:

1. **Given** a child has been using a sub-app for several minutes, **When** the container process is killed
   without a clean shutdown and the container is launched again, **Then** the usage record for that child,
   sub-app, and language increases by the recovered time.
2. **Given** a recovered stretch of time is written, **When** an analyst reads the usage record, **Then**
   the recovered time is included in the same total as normally-measured time, in the same record, keyed on
   the same child, sub-app, and language.
3. **Given** the container was killed while no sub-app was open, **When** the container is launched again,
   **Then** nothing is recovered and no usage is written.
4. **Given** a session killed after two minutes of use, **When** the container is launched eight hours later,
   **Then** the recovered time is approximately two minutes — not eight hours, and not the 30-minute maximum.
5. **Given** a sub-app that reports no events of its own, **When** its session is killed after several
   minutes, **Then** the recovered time is still approximately the time used, at the same accuracy as for a
   sub-app that reports events frequently.
6. **Given** a session killed immediately after a sub-app was opened, **When** the container is launched
   again, **Then** nothing is written, rather than a zero-length recovery being counted.

---

### User Story 2 - Recovered time is identifiable and separable (Priority: P2)

A recovered stretch of time has a known beginning and an unknown end, so it is an **estimate**, not a
measurement. An analyst must be able to see how much of any total came from estimates, so a figure can be
reported with an honest margin, recomputed excluding estimates, or weighted. This story records the
recovered portion and the number of recovery events alongside the total, rather than folding the estimate
invisibly into it.

**Why this priority**: Without this, Story 1 quietly degrades data quality instead of improving it — totals
get bigger and less trustworthy at the same time, with no way to tell which. It is P2 only because Story 1
must exist first for there to be anything to label.

**Independent Test**: Produce one recovered stretch of time, then read the usage record. The recovered
seconds and a recovery count are present and consistent with the change in the total.

**Acceptance Scenarios**:

1. **Given** a recovered stretch of time is written, **When** the usage record is read, **Then** it carries
   a recovered-seconds amount and a recovery count reflecting that event, both accumulating across events
   rather than being overwritten.
2. **Given** several recovery events over the life of an install, **When** the usage record is read,
   **Then** the recovery count equals the number of recovery events and the recovered seconds equal their
   sum.
3. **Given** any usage record, **When** its recovered seconds are compared to its total measured seconds,
   **Then** the recovered amount never exceeds the total.
4. **Given** a recovered stretch of time is written, **When** the limited and unlimited usage totals are
   compared before and after, **Then** both increase by the same amount, so the difference between them —
   which exists to show how much genuinely-measured time the session-length limit trimmed — is unchanged by
   recovery.
5. **Given** the usage record, **When** it is inspected for a simple yes/no "was this ever recovered" flag,
   **Then** no such flag exists — the information is carried by the accumulating amount and count instead.

---

### User Story 3 - Untrustworthy stretches are discarded, never guessed (Priority: P3)

The record of an open, unfinished stretch of time is only meaningful within a single uninterrupted run of
the device. If the device restarted between the loss and the recovery, the beginning of the stretch can no
longer be located in time, and any duration derived from it would be a fabrication — potentially an enormous
one. This story requires such a stretch to be thrown away entirely: not written as time, and not written as
a zero-length recovery either, since a zero-length recovery would still inflate the count of recovery events
and make the recovered-time average meaningless.

**Why this priority**: It protects Stories 1 and 2 from producing absurd outliers, but only matters once
recovery exists at all. Restarts between a kill and the next launch are common enough that this is not a
theoretical concern.

**Independent Test**: Produce an open, unfinished stretch of time, restart the device, then launch the
container. No usage and no recovery counters are written for that stretch.

**Acceptance Scenarios**:

1. **Given** an open, unfinished stretch of time from before a device restart, **When** the container is
   launched after the restart, **Then** no usage time is written for it.
2. **Given** that same discarded stretch, **When** the usage record is read, **Then** the recovery count has
   not increased — it was not recorded as a zero-length recovery.
3. **Given** a discarded stretch, **When** the container is launched a second time, **Then** the stretch is
   not reconsidered or re-discarded; it is gone.

---

### User Story 4 - A clean session is never counted twice (Priority: P3)

Recovery works by leaving behind a note that a stretch of time is open. If that note survives a session that
ended cleanly, the next launch would recover a stretch that was already written, double-counting it. This
story requires the note to be cleared whenever a session is closed out normally.

**Why this priority**: Double-counting is a worse failure than under-counting, because it is invisible —
under-counted time looks like a quiet child, but double-counted time looks like real engagement that never
happened. It is P3 because it is a constraint on Story 1 rather than value on its own.

**Independent Test**: Use a sub-app, leave it normally, relaunch the container. The total does not change on
the second launch, and no recovery is recorded.

**Acceptance Scenarios**:

1. **Given** a sub-app session that ended normally and was written, **When** the container is launched again,
   **Then** nothing is recovered and the total is unchanged.
2. **Given** a sub-app session interrupted by a screen rotation that rebuilds the sub-app screen, **When**
   the session later ends normally, **Then** it is written once, with no recovery recorded.
3. **Given** a sub-app the container cannot identify, **When** its session is interrupted by a process kill,
   **Then** nothing is recovered for it, consistent with it not being tracked in the first place.

---

### Edge Cases

- **Two sub-apps interrupted at once**: if more than one sub-app had an open stretch of time when the
  container died, each is recovered into its own usage record. One unidentifiable or unrecoverable stretch
  does not prevent the others from being recovered.
- **A second kill during recovery**: if the container is killed again before a recovered stretch has been
  handed off for writing, the stretch is either recovered on a subsequent launch or lost — it is never
  written twice.
- **No network at recovery time**: recovery does not require connectivity. The write follows the same
  offline-tolerant path as ordinary usage writes, and the open-stretch note is not discarded until the write
  has been durably accepted for eventual delivery.
- **The child identifier changed between the loss and the recovery**: the recovered time is attributed to the
  identifier and language that were in effect when the stretch began, not whatever is current at recovery.
- **An open stretch older than the session-length limit**: it is subject to the same per-session limit as any
  other stretch, so a stretch left open for hours cannot contribute more than that limit.
- **The screen turns off, then the process is killed**: the stretch was already closed at screen-off, so its
  last-known-alive point stops advancing there. The recovered estimate ends at screen-off and does not absorb
  the dark period.
- **A sub-app reports an event after its stretch was closed**: the event does not reopen the stretch or
  advance a last-known-alive point that no longer exists.
- **A sub-app that reports events far more often than the container's own interval**: the estimate simply
  gets more precise; no additional usage is written, and the recovered value is still bounded by the
  per-session limit.
- **The device clock is corrected mid-session**: a wall-clock adjustment must not turn a recovered stretch
  into a negative or wildly inflated duration.
- **A stretch that estimates to zero seconds**: nothing is written — neither time nor a recovery count —
  since a zero-second recovery only distorts the recovery statistics.
- **First launch after install, or after the app's stored data is cleared**: no note exists, nothing is
  recovered, and this is not an error condition.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST record that a stretch of sub-app usage is open at the moment it begins, in
  storage that survives the container process being killed.
- **FR-002**: The open-stretch record MUST carry everything needed to write the time to the correct usage
  record later without consulting current state: the sub-app it belongs to, the language it was launched in,
  the child identifier in effect at the time, when it began, and which uninterrupted run of the device it
  began in.
- **FR-003**: The system MUST clear the open-stretch record whenever the stretch is closed out and written
  normally, so a cleanly-ended session is never recovered.
- **FR-004**: On container launch, the system MUST look for open-stretch records left behind by a previous
  run and attempt to recover each one.
- **FR-005**: The system MUST discard an open-stretch record whose originating run of the device does not
  match the current one, writing neither usage time nor recovery counters for it, and MUST remove it so it is
  not reconsidered.
- **FR-006**: A recovered stretch MUST be written to the same usage record as normally-measured time for the
  same child, sub-app, and language, contributing to the same total.
- **FR-007**: A recovered stretch MUST be limited to the same per-session maximum of 30 minutes that applies
  to normally-measured stretches, applied per stretch and not per write.
- **FR-008**: A recovered stretch MUST contribute the **same, limited** value to both the total usage amount
  and the unlimited usage amount, so the difference between those two — which measures how much
  genuinely-measured time the limit trimmed — is not affected by recovery estimates.
- **FR-009**: A recovered stretch MUST additionally record the recovered amount of time and increment a count
  of recovery events, both as accumulating values rather than replaced ones.
- **FR-010**: The system MUST NOT write a single yes/no "recovered" flag on the usage record, because such a
  flag, once set, permanently marks the record and destroys the information about how much of the total was
  affected.
- **FR-011**: The system MUST NOT write anything for a recovered stretch that estimates to zero seconds.
- **FR-012**: Recovery MUST NOT require network connectivity, and MUST NOT discard an open-stretch record
  until its write has been durably accepted for eventual delivery.
- **FR-013**: The system MUST recover multiple independent open stretches from a single previous run, and
  MUST NOT let one unrecoverable stretch prevent the recovery of the others.
- **FR-014**: The system MUST NOT record an open stretch for a sub-app it cannot identify, consistent with
  such sub-apps not being tracked at all.
- **FR-015**: Recovery MUST NOT delay or block the container's startup as experienced by the child, and MUST
  NOT surface any error or message to the child if it fails.
- **FR-016**: The system MUST maintain a **last-known-alive point** for each open stretch, and MUST derive a
  recovered stretch's estimated duration as that point minus the stretch's start, limited per FR-007 and
  never negative. The duration MUST NOT be derived from the moment of recovery, which would count time the
  device spent idle between the kill and the next launch as usage.
- **FR-017**: The last-known-alive point MUST be advanced by the container on its own, at a bounded interval,
  for as long as the stretch is open — that is, while the sub-app is in the foreground and the screen is on.
  It MUST NOT depend on the sub-app reporting anything, so that the accuracy of a recovered stretch is
  bounded by that interval rather than by the sub-app's behavior.
- **FR-018**: Any inbound event from the sub-app MUST additionally advance the last-known-alive point to at
  least the moment that event arrived, improving the estimate for chatty sub-apps without any sub-app being
  required to be chatty.
- **FR-019**: Advancing the last-known-alive point MUST NOT itself write to the usage record, and MUST NOT
  measurably affect battery or responsiveness while a sub-app is open.
- **FR-020**: A stretch whose last-known-alive point was never advanced past its start MUST be treated per
  FR-011 as estimating to zero and MUST NOT be written.

### Key Entities

- **Open-stretch record**: the note left behind while a sub-app session is in progress, marking that time is
  currently being accumulated and could be lost. Carries the sub-app, the language, the child identifier, the
  moment it began, an identifier for the uninterrupted run of the device it began in, and its
  last-known-alive point. Created when a stretch starts, updated as that point advances, removed when the
  stretch is written or discarded. At most one exists per sub-app at a time; several may exist across
  different sub-apps.
- **Last-known-alive point**: the latest moment at which the stretch was known to still be in progress. It is
  what makes a recovered duration an estimate of the session rather than of the gap until the next launch.
  Advanced by the container at a bounded interval while the sub-app is foregrounded with the screen on, and
  also by any inbound sub-app event. Its interval sets the worst-case over-count of a recovered stretch.
- **Device-run identifier**: a value that distinguishes one uninterrupted run of the device from another, so
  an open-stretch record from before a restart can be recognized as no longer interpretable. Must tolerate
  small clock corrections without falsely appearing to be a different run.
- **Recovered stretch**: an open-stretch record that has been turned into an estimated duration, limited to
  the per-session maximum, ready to be written. Distinguished from a normally-measured stretch by
  contributing to the recovered amount and recovery count.
- **Usage record**: the existing per-child, per-sub-app, per-language accumulation of container-measured
  usage that recovered stretches are written into. Its shape is fixed by MR-183 and is not redefined here.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For a session ended by a process kill, 100% of the recoverable time appears in the usage record
  on the next container launch, where today 0% of it does.
- **SC-002**: Across a device fleet, the total container-measured usage attributed to sessions ending in a
  process kill rises from zero to a non-zero figure, and the share of that figure that is estimated rather
  than measured is readable directly from the usage record.
- **SC-003**: For any usage record, an analyst can compute the measured-only total by subtracting the
  recovered amount, and that subtraction never yields a negative number.
- **SC-004**: The relationship between the limited and unlimited usage totals remains interpretable as "how
  much the 30-minute session limit trimmed from measured play" — recovery contributes exactly zero to the
  difference between them, verifiable on any record.
- **SC-005**: No usage record shows an increase in its total across a container launch that followed a clean
  session exit, confirming zero double-counting.
- **SC-006**: No usage or recovery counters are attributable to stretches that spanned a device restart.
- **SC-008**: A recovered stretch over-states the real session by no more than the container's own
  last-known-alive interval, regardless of how long the device sat idle before the next launch, and
  regardless of whether the sub-app reports events. Verifiable by killing a session of known length and
  relaunching after a long delay.
- **SC-009**: Recovery accuracy is equivalent across sub-apps that report events frequently and sub-apps that
  report none, so no sub-app is measured worse than another because of how talkative it is.
- **SC-007**: Container startup time as experienced by the child is unchanged, with no added visible delay and
  no user-facing errors from recovery.

## Assumptions

- **The measurement this extends already exists.** The container-measured usage mechanism from MR-166 —
  per-stretch accumulation, the 30-minute per-stretch limit decided in MR-178, sub-app identification, and the
  write path — is in place. This feature adds durability to it; it does not rebuild it.
- **The record shape is already settled.** MR-183 is complete and defines the usage record's fields. The
  recovered-amount and recovery-count fields named in MR-182 follow that definition and are not designed here.
- **The 30-minute per-stretch limit applies unchanged**, per the decision recorded in MR-178, and is not
  reopened by this feature.
- **The child identifier is captured at the start of the stretch, not re-read at recovery.** The container
  can, in non-release builds, have its identifier overridden for testing; re-reading it at recovery time could
  attribute recovered time to the wrong record, so the identifier in force when the stretch began is the one
  persisted and used.
- **Multiple sub-apps may have open stretches simultaneously**, since usage accumulation is process-wide
  rather than tied to a single screen. Recovery is therefore specified per sub-app rather than as a single
  slot.
- **Sub-app events are a bonus, not the mechanism.** Of the two sub-apps the container can identify today,
  one reports events over the bridge and the other reports none, and event reporting is behind a feature
  flag that can be turned off. An event-driven estimate alone would therefore leave a tracked sub-app
  permanently unrecoverable, and would also make the container's independent measurement depend on the thing
  it exists to cross-check. Events are used only to sharpen an estimate the container can already make.
- **The last-known-alive interval is a tunable, not a constant fixed here.** The spec requires it to be
  bounded and to bound the error (FR-017, SC-008); choosing the number is a planning decision that trades
  precision against write frequency.
- **A recovered stretch is not the same evidence as a measured one.** The point of the separate recovered
  amount and count is that downstream consumers may legitimately exclude or discount recovered time; this
  feature makes that possible rather than deciding it.
- **This feature is a data-quality change, not a product change.** No child-facing behavior, screen, or
  content is added or altered.
- **Delivery target.** This work builds on the usage-tracking stack that currently lives on the MR-166 epic
  branch rather than on `develop`, and is expected to merge into that epic alongside its sibling tasks.
