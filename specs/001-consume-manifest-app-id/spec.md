# Feature Specification: Consume Manifest app_id

**Feature Branch**: `feature/mr-217--add-and-consume-app-id-from-app-manifest`

**Created**: 2026-09-02

**Status**: Draft

**Input**: User description: "We're getting app details from the app_manifest file. We're expecting to get app_id (apart from appId) as well. Store this along side other app related data. Pull this stored app_id when a sub-app is launched and store as an in memory state "current_app_id".  When firestore data is pulled or stored, use the current_app_id as app_id parameter."

## Clarifications

### Session 2026-09-02

- Q: Where should the sub-app's manifest-provided `app_id` be stored on-device? → A: Reuse the existing on-device storage that already holds the sub-app catalog (the same place other manifest-derived details — title, language, URLs, icon — are stored) by adding `app_id` as a new field on it, rather than introducing a separate store.
- Q: What should happen when current_app_id cannot be established for an active sub-app? → A: Do not withhold the Firestore operation. Resolve `app_id` through a defined fallback order — current_app_id first, then the sub-app-reported payload's own `app_id`, then the literal value `"unknown"` as a last resort — logging a warning whenever current_app_id itself was missing, and never inferring a value by any other means.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sub-app catalog carries the manifest's app_id (Priority: P1)

The app manifest now includes an `app_id` value for each sub-app entry, separate from the existing on-device `appId`. When the container reads or refreshes the manifest, this `app_id` is captured and stored alongside that sub-app's other details (title, language, URLs), so it is available on-device without re-fetching the manifest.

**Why this priority**: Every downstream part of this feature depends on `app_id` actually being captured and persisted first. Without it, there's nothing to pull when a sub-app launches.

**Independent Test**: Refresh the app catalog from a manifest whose entries include `app_id`, then inspect the stored sub-app catalog and confirm each entry's `app_id` is present and matches the manifest.

**Acceptance Scenarios**:

1. **Given** the manifest source includes an `app_id` field on a sub-app entry, **When** the container fetches or refreshes the catalog, **Then** that sub-app's stored record includes the `app_id` value from the manifest.
2. **Given** a sub-app entry that already exists on-device, **When** the catalog is refreshed with an updated `app_id` for that entry, **Then** the stored record reflects the new `app_id`.

---

### User Story 2 - Launching a sub-app establishes the current app identifier (Priority: P2)

When a learner opens a sub-app from the home screen, the container looks up that sub-app's stored `app_id` and holds it as the current session's app identifier ("current_app_id") for as long as that sub-app is active.

**Why this priority**: This is the mechanism that makes the stored `app_id` usable at the moment it's needed — when the sub-app starts reporting data — but it has no observable effect until Firestore operations consume it (User Story 3).

**Independent Test**: Launch any sub-app from the catalog and confirm the container's current app identifier matches that sub-app's stored `app_id`, independent of what the sub-app itself later reports.

**Acceptance Scenarios**:

1. **Given** a sub-app with a stored `app_id`, **When** a learner launches it from the home screen, **Then** the container sets current_app_id to that sub-app's stored `app_id` before the sub-app can report any data.
2. **Given** a sub-app is already active with a current_app_id set, **When** the learner exits it and launches a different sub-app, **Then** current_app_id is updated to the newly launched sub-app's `app_id`.

---

### User Story 3 - Firestore operations trust the container's app identifier, not the sub-app's (Priority: P1)

Every time data is read from or written to Firestore on behalf of the active sub-app, the container uses current_app_id as the `app_id` parameter — not any `app_id` value the sub-app itself supplies in its reported payload.

**Why this priority**: This is the actual value delivered by the feature: it closes the gap where a sub-app (untrusted, independently-shipped web content) could supply an incorrect or manipulated `app_id`, ensuring Firestore records are always attributed to the correct sub-app as known by the container.

**Independent Test**: From an active sub-app, submit a payload whose own `app_id` differs from (or omits) the container's current_app_id, and confirm the resulting Firestore read/write uses current_app_id, not the payload's value.

**Acceptance Scenarios**:

1. **Given** a sub-app is active with a known current_app_id, **When** it reports data to be stored, **Then** the stored Firestore record's `app_id` field equals current_app_id.
2. **Given** a sub-app is active with a known current_app_id, **When** the container queries existing Firestore records for that sub-app, **Then** the query filters on current_app_id.
3. **Given** a sub-app reports data with its own `app_id` value that differs from current_app_id, **When** the container processes that data, **Then** the mismatched value is disregarded and current_app_id is used instead.
4. **Given** current_app_id has not been established for the active sub-app, **When** it reports data whose payload carries its own `app_id`, **Then** the container logs a warning and uses the payload's `app_id` as the Firestore value instead of withholding the operation.
5. **Given** current_app_id has not been established and the reported payload also carries no `app_id`, **When** the container processes that data, **Then** it logs a warning and writes/queries using the literal value `"unknown"` rather than guessing or withholding the operation.

---

### Edge Cases

- What happens when a manifest entry is missing `app_id` (e.g., stale server data, or an entry not yet updated)? The sub-app should still be stored and launchable, but the container cannot establish a trustworthy current_app_id for it — the fallback order below applies once it reports data.
- What happens when a sub-app is launched and reports data before current_app_id has been established for it? The container MUST NOT guess a value; it falls back to the payload's own `app_id` if present, otherwise to the literal value `"unknown"`, logging a warning either way rather than silently proceeding or withholding the operation.
- What happens when a learner switches between sub-apps (returns home and launches another) — is current_app_id correctly replaced rather than left over from the previous sub-app?
- What happens when a sub-app's reported payload omits `app_id` entirely, and current_app_id is available? Processing succeeds using current_app_id — the payload's own `app_id` is only ever consulted as a fallback, never a source of truth.
- What happens when both current_app_id and the payload's `app_id` are missing? The container writes/queries using the literal value `"unknown"` and logs a warning; it never fabricates or infers an identifier from any other data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST recognize an `app_id` field on each sub-app entry in the app manifest, as a value distinct from the existing on-device `appId`.
- **FR-002**: System MUST store each sub-app's manifest-provided `app_id` in the same existing on-device storage that already holds that sub-app's other manifest-derived details (title, language, URLs, icon) — adding it as a new field there rather than introducing a separate store — so it can be retrieved on-device without re-fetching the manifest.
- **FR-003**: System MUST update a sub-app's stored `app_id` whenever the manifest is refreshed with a new value for that entry.
- **FR-004**: When a learner launches a sub-app, System MUST retrieve that sub-app's stored `app_id` and hold it as the current in-memory app identifier, current_app_id, before the sub-app can report any data.
- **FR-005**: System MUST update current_app_id to reflect whichever sub-app is currently active, replacing any previously held value when a different sub-app is launched.
- **FR-006**: System MUST use current_app_id as the `app_id` parameter for every Firestore read (query) and write (create or update) performed on behalf of the active sub-app, whenever current_app_id is available.
- **FR-007**: When current_app_id is not available, System MUST resolve `app_id` through this exact fallback order, and no other: (1) current_app_id, (2) the `app_id` value the sub-app's own reported payload carries, if any, (3) the literal value `"unknown"`. System MUST NOT infer, guess, or otherwise derive an `app_id` value outside this order, and MUST NOT withhold the Firestore operation while a value is available through this order.
- **FR-008**: System MUST continue to support existing sub-app catalog behavior (display, selection, launch by on-device `appId`) unchanged for sub-apps whose manifest entries include an `app_id`.
- **FR-009**: System MUST log a warning whenever current_app_id is not available and resolution falls back to the payload's `app_id` or to `"unknown"`, identifying which of the two occurred.
- **FR-010**: System MUST log each step of `app_id` handling introduced by this feature — manifest ingestion into storage, capture into current_app_id on sub-app launch, and resolution for a Firestore operation — using a log tag consistent with the component performing that step, so `app_id` issues are diagnosable from device logs without a code change.

### Key Entities

- **Sub-App Catalog Entry**: The on-device stored representation of one launchable sub-app option (title, language, URLs, on-device `appId`), held in the existing manifest-backed catalog storage. That same storage gains a new `app_id` field sourced from the manifest, representing that sub-app's identifier for reporting/analytics purposes.
- **Current App Identifier (current_app_id)**: A transient, in-memory value naming which sub-app catalog entry is currently active. Established when a sub-app is launched and used as the primary app identifier for all Firestore activity until a different sub-app is launched. When unavailable, Firestore activity falls back to the sub-app-reported payload's own `app_id`, then to the literal value `"unknown"` — see FR-007.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of Firestore records written while a sub-app is active carry an `app_id` matching the container's manifest-derived value for that sub-app whenever current_app_id was available, regardless of what the sub-app itself reports.
- **SC-002**: 100% of Firestore queries performed while a sub-app is active filter on the container's manifest-derived `app_id` for that sub-app whenever current_app_id was available.
- **SC-003**: After any manifest refresh, every sub-app entry that includes an `app_id` in the source manifest has that value available on-device without a further manifest fetch.
- **SC-004**: Across manual verification of every sub-app in the catalog, launching the sub-app always establishes the correct current app identifier before any data is reported, with zero observed Firestore writes carrying an `app_id` that wasn't produced by the defined resolution order.
- **SC-005**: 100% of the occasions current_app_id is unavailable produce exactly one warning log identifying whether resolution fell back to the payload's `app_id` or to `"unknown"`, and the Firestore operation still completes rather than being silently dropped.

## Assumptions

- The app manifest source (server-provided `container_app_manifest` and the bundled local asset fallback) will be updated to include an `app_id` field per sub-app entry; producing/versioning that manifest content is out of scope here — this feature covers consuming it.
- `app_id` from the manifest is a stable string identifier for a sub-app, distinct from the on-device numeric `appId` used only for local catalog selection/lookup, and matches the identifier already expected on Firestore records.
- Only one sub-app is active and reporting data at a time per container session, so a single current_app_id value is sufficient — no concurrent multi-value tracking is needed.
- Firestore documents already written using a sub-app-supplied `app_id` are out of scope for backfill or migration.
- current_app_id only needs to persist for the lifetime of the active sub-app session; it is not required to survive a full app process restart.
