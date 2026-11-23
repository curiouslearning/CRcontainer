# Contract: Packaged Assessments in the Soorty APK

**Plan**: [../plan.md](../plan.md)

All URLs are served by `WebViewAssetLoader` / `LocalWebContent` on
`https://soorty_urdu_english_cr-ftm-standalone.androidplatform.net` from merged flavor assets (`main` + `mwfShared` + `soorty`).

## C1 — Shared content

| Path | Must exist for |
|------|----------------|
| `/assets/feedthemonster/assessment-survey/data/<key>.json` | all 6 keys |
| `/assets/feedthemonster/assessment-survey/audio/<key>/*` | all 6 keys; one file per `itemName` |
| `/assets/feedthemonster/assessment-survey/audio/{Correct.wav,sound-effects/}` | shared SFX |
| `/assets/feedthemonster/assessment-survey/{css,img,animation}/` | both UIs (`css/style.css`, `css/drag-drop-style.css`) |

- `HEAD` and `GET` on an existing file → `200`.
- A missing file under `assessment-survey/` → fast `404` (never a hang).
- Content MUST equal npm `@curiouslearning/assessment-survey@<version>` `public/` for these keys (version recorded in `PACKAGE_INFO.json`).

## C2 — Standalone entry

`GET /assets/assessment/index.html?data=<key>`

- Loads `bundle.js` (production build of the recorded commit), no service worker, no CDN script.
- Seeds `CRFeatureFlags` gates `mr-75`, `drag-drop-assessment-ui` (if absent) before the bundle runs.
- Emits `summary_data` then `user_sessions_data` (`activity_completed`) through the Android bridge at the end; the container then waits for writes to settle (≤10 s), shows the end screen 3 s, logs `app_exit`, loads `about:blank` and finishes.

## C3 — Embedded entry (FTM)

`GET /assets/feedthemonster/index.html?cr_lang=<english|urdu|pashto>`

- `index.html` seeds `is_cached[<cr_lang>]`, gates `mr-75`, `drag-drop-assessment-ui`.
- FTM creates `<assessment-survey-player data-key="<cr_lang>-<type>" asset-base-url="/assets/feedthemonster/assessment-survey" data-base-url="…" embed-mode="true" host-theme="ftm-dim">` after a `HEAD` probe of C1's data file returns 200.
- The container never closes FTM on embedded completion.

## C4 — Packaging commands (reproducibility)

```bash
node tools/package-assessment.js --build <assessment-survey-js>/build --flavor soorty \
  --keys english-lettersounds,english-sightwords,urdu-lettersounds,urdu-sightwords,pashto-lettersounds,pashto-sightwords
node tools/package-ftm.js --build <FeedTheMonsterJS>/build ...   # writes mwfShared/assets/feedthemonster
```

Both scripts inject `SEEDED_GATES = ['mr-75', 'drag-drop-assessment-ui']` and record them in `PACKAGE_INFO.json`.
