# Test Coverage Report

Generated: 2026-06-15

## Summary

The current unit test suite runs successfully, and Jacoco now produces a usable report for the app codebase. The report is still thin, but it is no longer a zero-value tooling artifact.

## Verified Test Status

- Unit tests pass with `:app:testDebugUnitTest`
- `AnalyticsUtilsCustomEventsTest` is green after aligning the `joined_study` contract with the current reporting behavior
- The Jacoco report task now completes successfully
- Jacoco is configured against the transformed debug class output for the current AGP setup

## Coverage Snapshot

From the generated Jacoco report, aggregated across `org.curiouslearning.allSA_maharishi*` packages:

- Instruction coverage: `240 / 12,325` `(~1.95%)`
- Branch coverage: `9 / 978` `(~0.92%)`
- Line coverage: `61 / 2,602` `(~2.34%)`
- Method coverage: `8 / 393` `(~2.04%)`
- Class coverage: `1 / 96` `(~1.04%)`

The report still includes many generated classes and dependency artifacts in the overall XML, so these app-package totals are the meaningful numbers to track.

## Interpretation

This does not mean the app has no tests. It means the test surface is still very narrow relative to the size of the codebase.

Likely causes:

- Most of the app's logic is still concentrated inside activities and helpers that are not exercised by targeted unit tests.
- Existing tests focus on a narrow analytics path rather than the core behavior of the app.
- Many important code paths depend on Android framework state, which still needs better seams before unit tests can reach them reliably.

## Current Test Surface

What is currently covered by direct unit tests:

- `AnalyticsUtils` event payloads
- Basic example test scaffolding

What is effectively uncovered:

- `MainActivity`
- `WebApp`
- install referrer handling
- repository and database flow
- most utility classes

## Recommended Next Steps

1. Add proper unit-test seams around extracted helpers.
2. Move logic out of `MainActivity` and `WebApp` into testable classes.
3. Add focused unit tests for parsing, URL building, attribution, and analytics.
4. Keep Jacoco pointed at the transformed debug classes so future tests are counted without changing the Gradle or SDK versions.

## Location

- Jacoco HTML report: [app/build/reports/jacoco/jacocoTestReport/html/index.html](/D:/Projects/UpWork/Unity/CRContainer/app/build/reports/jacoco/jacocoTestReport/html/index.html)
- Jacoco XML report: [app/build/reports/jacoco/jacocoTestReport/jacocoTestReport.xml](/D:/Projects/UpWork/Unity/CRContainer/app/build/reports/jacoco/jacocoTestReport/jacocoTestReport.xml)
