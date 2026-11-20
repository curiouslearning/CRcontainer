# Quickstart: Verify Soorty Assessments (CLT-167)

**Plan**: [plan.md](./plan.md)

## Level 1 — Unit tests

```bash
./gradlew testSoortyDebugUnitTest
```

Expect `StandaloneAssessmentCompletionTest` and `LocalWebContentTest` green.

## Level 2 — Packaged content check (no device)

From the repo root, confirm the six keys and their audio:

```bash
python3 - <<'EOF'
import json, os
base = 'app/src/soorty/assets/feedthemonster/assessment-survey'
for k in ['english-lettersounds','english-sightwords','urdu-lettersounds','urdu-sightwords','pashto-lettersounds','pashto-sightwords']:
    d = json.load(open(f'{base}/data/{k}.json', encoding='utf-8'))
    files = set(os.listdir(f'{base}/audio/{k}'))
    names = {i['itemName'] for b in d['buckets'] for i in b['items']}
    miss = [n for n in names if not any(n + e in files for e in ('.mp3', '.wav'))]
    print(k, len(names), 'items, missing audio:', len(miss))
EOF
grep -c drag-drop-assessment-ui app/src/mwfShared/assets/feedthemonster/index.html app/src/soorty/assets/assessment/index.html
```

Expect 0 missing for every key and 1 match in each `index.html`.

## Level 3 — Offline in a browser (optional)

Serve the merged assets (`mwfShared/assets` + `soorty/assets`) under
`https://soorty_urdu_english_cr-ftm-standalone.androidplatform.net/assets/` with all other hosts blocked
(Playwright `context.route`). Open `/assets/assessment/index.html?data=<key>` and
`/assets/feedthemonster/index.html?cr_lang=<lang>`; expect no 404 under `assessment-survey/`, wrapper class
`as-ui-mode-new`, stylesheet `drag-drop-style.css`.

## Level 4 — On device (CLT-167 acceptance)

```bash
./gradlew assembleSoortyRelease   # or the CI debug APK
```

1. Fresh install, **airplane mode on before first launch**.
2. Urdu (default): open *Assessment Letter Sounds Urdu*, then *Assessment Sight Words Urdu* → starts, Urdu audio plays, new drag-and-drop UI; at the end returns to the catalog after ~3 s.
3. Switch language to Pashto, then English → repeat for both tiles.
4. FTM per language → in debug mode use the **Assessment** dev button (or reach a configured level after the phone has been online once) → embedded assessment in the FTM language, new UI, FTM resumes the level; play several more levels to check for gameplay problems.
5. Record results on CLT-167.
