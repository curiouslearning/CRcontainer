<!--
Sync Impact Report
Version change: (none) → 1.0.0
Rationale: Initial ratification — first governing constitution for this repository.

Modified principles: n/a (new document)

Added sections:
- Core Principles: I. WebView Sub-App Boundary & Isolation
- Core Principles: II. SOLID Object-Oriented Design (NON-NEGOTIABLE)
- Core Principles: III. Composition Over Inheritance
- Core Principles: IV. Idiomatic Java & Android Platform Standards
- Core Principles: V. Scalable Layered Package Architecture
- Core Principles: VI. Secure, Validated Native↔Web Bridge
- Technology & Platform Constraints
- Development Workflow & Quality Gates
- Governance

Removed sections: n/a (new document)

Templates requiring updates:
- .specify/templates/plan-template.md — ⚠ pending manual check (Constitution Check gates should
  reference these principle names once a feature plan next runs)
- .specify/templates/spec-template.md — ✅ no principle-specific references to reconcile
- .specify/templates/tasks-template.md — ⚠ pending manual check (task categorization should keep
  interface/composition seams as first-class task boundaries)
- .claude/skills/*/  — ✅ no changes required; commands read this file at run time

Deferred items / TODOs: none — all placeholders resolved from repository context
(README.md, app/build.gradle, existing package layout under
app/src/main/java/org/curiouslearning/container/**, .circleci/config.yml, .coderabbit.yaml).
-->

# CRcontainer Constitution

## Core Principles

### I. WebView Sub-App Boundary & Isolation
The app's purpose is to host independently-developed, web-based literacy sub-apps
(e.g. Feed The Monster, assessment-survey-js) inside Android `WebView` instances and
give them a consistent shell: manifest-driven discovery, language selection, launch,
and event reporting back to native code. Native code MUST treat sub-app web content as
an untrusted, independently-versioned client:
- A sub-app's UI, routing, and internal state live entirely in its web bundle. Native
  code MUST NOT reach into a sub-app's DOM or JS runtime beyond the documented bridge
  contract (`AppEventPayload` and related handler/validator classes).
- The manifest + language-selection mechanism that lists and launches sub-apps MUST
  stay decoupled from any single sub-app's implementation — adding, removing, or
  updating a sub-app MUST NOT require changes to unrelated sub-apps or to core
  navigation code, only to manifest data and, where genuinely needed, a scoped
  handler.
- WebView configuration (JS bridge exposure, allowed origins/schemes, caching,
  mixed-content policy) is defined once per sub-app "host" component and MUST NOT be
  duplicated ad hoc at call sites.

Rationale: the container's whole value proposition is letting many independently
shipped web apps share one native shell without re-acquiring users or coupling native
release cycles to web content changes. Isolation at this boundary is what keeps that
promise scalable.

### II. SOLID Object-Oriented Design (NON-NEGOTIABLE)
All new and modified native code MUST follow SOLID:
- **Single Responsibility**: a class has one reason to change. Payload parsing,
  validation, persistence, network access, and presentation logic MUST live in
  separate classes (mirroring the existing `payload` / `validation` / `handler`
  split under `core/subapp`), not folded into Activities, Fragments, or Adapters.
- **Open/Closed**: new sub-app behaviors, event types, or data sources are added by
  introducing new implementations of an existing interface/abstract type, not by
  adding branches to existing classes' conditionals (e.g. a new event kind gets its
  own `AppEventPayloadHandler`, not a new `if` in `DefaultAppEventPayloadHandler`).
- **Liskov Substitution**: any implementation of an interface (handler, validator,
  repository, adapter) MUST be usable anywhere the interface is expected without the
  caller needing to know the concrete type or special-case it.
- **Interface Segregation**: interfaces expose only the methods their callers
  actually need. Prefer several narrow interfaces (e.g. a reader-only repository
  contract vs. a writer contract) over one broad interface most implementers stub out.
- **Dependency Inversion**: high-level modules (ViewModels, presentation logic,
  orchestration) depend on abstractions (interfaces), not on concrete `data`,
  `firebase`, or `remote` implementations. Concrete types are wired at construction
  time (constructor injection), not instantiated inline deep in business logic.

Rationale: this app grows by adding sub-apps, event types, and data backends over
its lifetime. SOLID is what keeps each addition a localized, reviewable change
instead of a growing set of conditionals in shared classes.

### III. Composition Over Inheritance
Behavior is built by composing small, focused collaborators (constructor-injected
interfaces/strategies), not by growing class hierarchies:
- Concrete inheritance is reserved for genuine Android framework contracts
  (`Activity`, `Fragment`, `ViewModel`, `RecyclerView.Adapter`, etc.) and for sharing
  implementation across trivially-related siblings. It MUST NOT be used to share
  unrelated behavior between classes ("utility base classes") or to fake a plugin
  system.
- Cross-cutting or swappable behavior (validation rules, payload handling strategies,
  network vs. local data sourcing, feature flags) MUST be expressed as an interface
  implemented by one or more small classes and injected into the class that needs it.
- A class MUST favor holding a reference to a collaborator over extending it. Before
  adding a new subclass, prefer asking whether the differing behavior can instead be
  a constructor parameter.

Rationale: composition keeps sub-app-specific or backend-specific variations
isolated and independently testable, and avoids the fragile-base-class problems that
deep inheritance trees create as the number of sub-apps and event types grows.

### IV. Idiomatic Java & Android Platform Standards
The codebase is Java-only (no Kotlin sources are introduced) and MUST follow current
Android platform conventions:
- Use AndroidX libraries exclusively; no `android.support.*` legacy imports.
- Lifecycle-aware components (`ViewModel`, `LiveData`/lifecycle-aware observers,
  `Lifecycle`-registered listeners) are used for anything tied to Activity/Fragment
  lifecycle; manual lifecycle bookkeeping in Activities/Fragments is avoided where a
  lifecycle-aware alternative exists.
- Background and async work uses the project's established concurrency primitives
  (Executors / `ListenableFuture` / lifecycle-scoped callbacks) — no unmanaged raw
  `Thread`s or fire-and-forget `AsyncTask`-style code (deprecated since API 30).
  All async paths MUST guard against work completing after the owning UI component
  is destroyed.
- Firebase, Room (`data/database`), and other SDK integrations are wrapped behind
  the project's own interfaces in `data/respository`-style layers, not called
  directly from `presentation`.
- Follow standard Java naming and style (PascalCase types, camelCase members,
  package names lower-case) and keep public API surfaces `final` where extension is
  not intended, consistent with the Open/Closed principle above.
- New third-party dependencies MUST be justified (license, maintenance status, APK
  size/permission impact) before being added to `app/build.gradle`.

Rationale: consistency with current Android/Java idioms keeps the app maintainable
by any Android engineer without requiring familiarity with a bespoke house style,
and avoids accumulating deprecated-API debt in a long-lived container app.

### V. Scalable Layered Package Architecture
Code is organized by architectural layer first, feature/sub-app concern second,
following and extending the existing structure under
`org.curiouslearning.container`:
- `core/` — cross-cutting domain logic with no Android framework or IO dependency
  where possible (e.g. `core/subapp/{handler,payload,validation}`, `core/context`).
  New sub-app bridge concerns belong here, split by responsibility as in Principle II.
- `data/` — persistence and remote access (`data/local`, `data/remote`,
  `data/database`, `data/respository`, `data/model`). All data access is exposed to
  the rest of the app through repository interfaces defined here.
- `presentation/` — UI: Activities/Fragments, `presentation/adapters`,
  `presentation/viewmodals` (ViewModels), `presentation/base` for shared framework
  glue only.
- `firebase/`, `installreferrer/`, `security/`, `utilities/` — integration-specific
  or cross-cutting support packages, each scoped to one concern.
- A new package is added only when a layer or bounded concern doesn't already have a
  home; new sub-app types extend `core/subapp` and `data` contracts rather than
  spawning parallel top-level packages.
- Package-private visibility is the default for implementation classes; a class is
  made `public` only when another layer/package legitimately depends on it through
  an interface.

Rationale: a predictable, layer-first structure is what lets the app keep adding
sub-apps, data backends, and native features without engineers guessing where new
code belongs or duplicating existing seams.

### VI. Secure, Validated Native↔Web Bridge
Every payload crossing the JS↔native bridge is treated as untrusted input:
- All inbound payloads from a WebView MUST pass through an `AppEventPayloadValidator`
  (or a more specific validator implementing the same contract) before being acted
  on; validation failures are surfaced via `ValidationResult`, never silently ignored
  or allowed to throw uncaught into WebView JS callback code.
- `WebView` instances hosting sub-apps MUST have JavaScript interface exposure,
  allowed navigation origins, and file/content access scoped to the minimum the
  sub-app needs; no sub-app WebView is configured with broader access "for
  convenience."
- Secrets, tokens, and analytics identifiers passed to or read from sub-app web
  content MUST go through the `security/` package's existing abstractions, not be
  inlined at call sites.

Rationale: the container mediates between many independently-shipped web codebases
(not all authored by this team) and the native app's data/analytics/device
capabilities; the bridge is the app's actual attack surface and its main source of
cross-team defects, so it gets explicit, non-negotiable rules.

## Technology & Platform Constraints

- Language: Java only for `app/src/main/java`. Kotlin MAY be evaluated in a future
  amendment but is out of scope until this constitution is amended.
- Build: Gradle (Groovy DSL) as already configured in `build.gradle` /
  `app/build.gradle`; `compileSdk`/`targetSdk`/`minSdk` values are tracked in
  `app/build.gradle` and changed deliberately, not incidentally, in feature work.
- Sub-app delivery: sub-apps are fetched per the manifest mechanism
  (`container_app_manifest` endpoints); local sub-app development redirects
  (`WebAppsAdapter.maybeOverrideAppUrlForLocalDev()`-style hooks) MUST remain
  no-ops in release builds and configurable only through gitignored local
  properties, never committed defaults.
- Testing: unit tests live under `app/src/test`; new `core/` and `data/` classes
  MUST be written so their public seams (interfaces from Principles II/III) can be
  unit-tested without a device/emulator. Instrumented tests are used only where
  Android framework behavior genuinely requires them.
- Crash/error reporting and analytics integrations (Firebase Crashlytics, Sentry)
  are configured once centrally and consumed elsewhere through the project's own
  abstractions, not re-initialized per feature.

## Development Workflow & Quality Gates

- Pull requests target `develop`/`test`/`main` per the existing CircleCI and
  CodeRabbit configuration (`.circleci/config.yml`, `.coderabbit.yaml`); automated
  review findings and CI checks MUST be resolved or explicitly justified before
  merge.
- A change that adds or modifies a bridge-facing class (Principle VI) or a new
  sub-app integration (Principle I) MUST include or update unit tests for its
  validation/handler logic.
- Reviewers MUST check new/changed classes against Principles II–III (SOLID,
  composition) and V (package placement) before approval; a class added to the
  wrong layer or that inlines a concrete dependency instead of depending on an
  interface is a request-changes finding, not a style nit.
- Deviations from any Core Principle require an explicit note in the PR description
  stating the principle, the reason for the deviation, and why a compliant
  alternative was rejected.

## Governance

This constitution supersedes conflicting team conventions and prior undocumented
practice for all new and modified code in this repository. Existing code is not
required to be retrofitted solely for compliance, but any file touched by a feature
change MUST be brought into compliance with the principles relevant to that change.

**Amendment procedure**: amendments are proposed via the `/speckit-constitution`
workflow (or an equivalent PR editing this file directly), must state the rationale
and version bump under Semantic Versioning (MAJOR for incompatible governance or
principle removal/redefinition, MINOR for a new principle or materially expanded
guidance, PATCH for clarification/wording), and take effect once merged. The Sync
Impact Report at the top of this file MUST be updated with every amendment.

**Compliance review**: every PR is expected to be reviewable against these
principles by any team member without additional context; a plan or task list
produced by the Spec Kit workflow MUST include an explicit Constitution Check
against the Core Principles above before implementation begins.

**Version**: 1.0.0 | **Ratified**: 2026-08-31 | **Last Amended**: 2026-08-31
