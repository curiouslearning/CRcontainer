# Specification Quality Checklist: Recover Open Usage Segments

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-09-03
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

**Status: all items pass (iteration 2).** 20 functional requirements, 9 success criteria, 4 prioritized user
stories, 0 open markers.

- **Iteration 1 (2026-09-03)**: two failures, both from a single open question on FR-016 — how a recovered
  stretch's duration is estimated, given that its end is unknown. The source ticket says a recovered segment
  is "flushed capped" but never says what value is capped, and the candidates differed by orders of magnitude
  on the same session.

- **Iteration 2 (2026-09-03)**: resolved. The estimate is a last-known-alive point minus the start, limited
  per FR-007. The follow-up question — whether inbound sub-app events could *be* that signal rather than a
  container-maintained one — was answered "they advance it, they do not define it", on two grounds checked
  against the code:

  - **Coverage.** `SubAppIdResolver` on the MR-166 epic branch tracks two sub-apps, `feed-the-monster` and
    `assessment`. Only the first reports analytics events over the bridge; assessment-survey-js calls the
    bridge solely for `cachedStatus`. A purely event-driven signal would leave every assessment session
    unrecoverable while still being tracked. Event reporting is also behind the `mr-75` feature flag, so even
    FTM's stream can be switched off.
  - **Independence.** Container-measured usage exists to be a measurement of the same sessions that does not
    depend on the sub-app. Deriving its recovery estimate from sub-app events would fold the sub-app back
    into the number it is meant to cross-check.

  Split across FR-016 (the estimate), FR-017 (container-maintained, bounded interval), FR-018 (events
  sharpen it), FR-019 (no usage write, no battery cost), FR-020 (never advanced ⇒ nothing written), with
  SC-008 and SC-009 making the bounded error and the cross-sub-app equivalence measurable.

- **Resolved during authoring, recorded in Assumptions rather than as clarifications** (each had a defensible
  default, so none consumed a marker):

  - The open-stretch note must carry the language and the child identifier, not just the sub-app and start
    time — the destination record is keyed on all three, and the identifier is overridable in non-release
    builds, so re-reading it at recovery could misattribute the time. Captured in **FR-002**.
  - Multiple sub-apps may hold open stretches at once, since accumulation is process-wide rather than tied to
    one screen. Captured in **FR-013**.
  - The note must not be discarded before the write is durably accepted, or an offline recovery would be
    lost. Captured in **FR-012**.

- **Deliberately left to planning**: the numeric last-known-alive interval. The spec constrains it to be
  bounded and to bound the error; picking the value trades precision against write frequency.
