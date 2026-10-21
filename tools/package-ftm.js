#!/usr/bin/env node
/*
 * Packages a Feed The Monster production build into the container for the offline standalone
 * flavors (mwfCongo / mwfAngola).
 *
 *   node tools/package-ftm.js --build <path-to-FeedTheMonsterJS>/build --langs english,french,brazilianportuguese
 *
 * Output: app/src/mwfShared/assets/feedthemonster/ (replaced wholesale on every run).
 *
 * What it does, and why each step is needed for a first launch with no network:
 *
 *  1. Copies the build (index.html, index.css, feedTheMonster.js, assets/, lang/, manifest.json).
 *  2. Keeps only the requested languages under lang/. The build contains all ~62 languages
 *     (~230 MB); the three MWF languages are ~6 MB.
 *  2b. Leaves out assessment-survey/ (~53 MB) unless --include-assessment is given. FTM's in-game
 *     assessments are scheduled by a Statsig dynamic config that defaults to disabled, so a device
 *     that is offline never schedules one. With the flag, the module is kept and its audio pruned
 *     to the packaged languages.
 *  3. Drops sw.js. FTM's service worker loads Workbox from a Google CDN with importScripts(), so
 *     it cannot even start offline, and in the container every file is already served from the
 *     APK by WebViewAssetLoader - there is nothing for a worker to cache. Not shipping it makes the
 *     behaviour identical online and offline (no background precache, no "Update Found" prompt).
 *  4. Injects a small inline <script> ahead of feedTheMonster.js in index.html that:
 *       a. marks the requested language as cached in localStorage ("is_cached"). FTM only creates
 *          its scene handler when the language is marked cached or when the service worker reports
 *          100% download progress; with no worker it would otherwise sit on the loading screen
 *          forever. Every file the flag promises is in the APK, so the promise is true.
 *       b. pre-seeds the @curiouslearning/features cache ("CRFeatureFlags") with the Android
 *          event-bubble gate (mr-75) enabled. FTM registers its container bridge (the path that
 *          delivers level/star data to the container and on to Firestore / Literacy Coach) only
 *          when that Statsig gate is true. Offline, Statsig cannot be reached and the gate evaluates
 *          false, so without this seed a fully offline device would never report progress. The seed
 *          is written once, never expires, and is skipped when a value is already present.
 *     Nothing in the FTM source is modified; this is a packaging-time change to one HTML file,
 *     recorded in PACKAGE_INFO.json next to it.
 *  5. Writes PACKAGE_INFO.json (source commit, build time, languages, sizes) for traceability.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(REPO_ROOT, 'app', 'src', 'mwfShared', 'assets', 'feedthemonster');
const ANDROID_BRIDGE_GATE = 'mr-75';

function parseArgs(argv) {
    const args = { langs: ['english', 'french', 'brazilianportuguese'], includeAssessment: false };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--build') args.build = argv[++i];
        else if (a === '--langs') args.langs = argv[++i].split(',').map(s => s.trim()).filter(Boolean);
        else if (a === '--out') args.out = argv[++i];
        else if (a === '--include-assessment') args.includeAssessment = true;
        else if (a === '-h' || a === '--help') { usage(); process.exit(0); }
        else { console.error('Unknown argument: ' + a); usage(); process.exit(2); }
    }
    if (!args.build) { usage(); process.exit(2); }
    return args;
}

function usage() {
    console.error('Usage: node tools/package-ftm.js --build <FeedTheMonsterJS/build> [--langs a,b,c] [--out <dir>] [--include-assessment]');
}

function fail(msg) {
    console.error('package-ftm: ' + msg);
    process.exit(1);
}

function rmrf(p) {
    fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(src, dst, filter) {
    fs.mkdirSync(dst, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const s = path.join(src, entry.name);
        const d = path.join(dst, entry.name);
        if (filter && !filter(s, entry)) continue;
        if (entry.isDirectory()) copyDir(s, d, filter);
        else fs.copyFileSync(s, d);
    }
}

function dirSize(p) {
    let total = 0;
    for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
        const full = path.join(p, entry.name);
        total += entry.isDirectory() ? dirSize(full) : fs.statSync(full).size;
    }
    return total;
}

function mb(bytes) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function gitInfo(dir) {
    try {
        const commit = execSync('git rev-parse HEAD', { cwd: dir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
        const describe = execSync('git log -1 --format=%cI%x20%s', { cwd: dir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
        return { commit, describe };
    } catch (e) {
        return { commit: 'unknown', describe: 'unknown' };
    }
}

function seedScript(langs) {
    // Kept dependency-free and ES5 so it runs on any WebView that can run FTM at all.
    return `<script>
/* Injected by CRcontainer tools/package-ftm.js (offline standalone build). See that file for why. */
(function () {
  try {
    var lang = new URLSearchParams(window.location.search).get("cr_lang") || "english";
    var packagedLangs = ${JSON.stringify(langs)};
    if (packagedLangs.indexOf(lang) !== -1) {
      var cached = new Map(JSON.parse(localStorage.getItem("is_cached") || "[]"));
      if (cached.get(lang) !== true) {
        cached.set(lang, true);
        localStorage.setItem("is_cached", JSON.stringify(Array.from(cached.entries())));
      }
    }
    var flagsKey = "CRFeatureFlags";
    var gateKey = "gate:${ANDROID_BRIDGE_GATE}";
    var flags = JSON.parse(localStorage.getItem(flagsKey) || "{}");
    if (!flags[gateKey]) {
      flags[gateKey] = { __value: true };
      localStorage.setItem(flagsKey, JSON.stringify(flags));
    }
  } catch (e) {
    console.warn("offline seed failed", e);
  }
})();
</script>
`;
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    const buildDir = path.resolve(args.build);
    const outDir = args.out ? path.resolve(args.out) : OUT_DIR;

    for (const required of ['index.html', 'feedTheMonster.js', 'index.css', 'assets', 'lang']) {
        if (!fs.existsSync(path.join(buildDir, required))) {
            fail('not an FTM build directory (missing ' + required + '): ' + buildDir);
        }
    }
    for (const lang of args.langs) {
        const json = path.join(buildDir, 'lang', lang, 'ftm_' + lang + '.json');
        if (!fs.existsSync(json)) fail('language not in build: ' + lang + ' (' + json + ')');
    }

    console.log('Source build : ' + buildDir);
    console.log('Output       : ' + outDir);
    console.log('Languages    : ' + args.langs.join(', '));

    rmrf(outDir);
    fs.mkdirSync(outDir, { recursive: true });

    const langSet = new Set(args.langs);
    copyDir(buildDir, outDir, (full, entry) => {
        const rel = path.relative(buildDir, full).split(path.sep).join('/');
        if (rel === 'sw.js' || rel.startsWith('workbox-')) return false;           // step 3
        if (rel.startsWith('lang/')) {                                              // step 2
            const parts = rel.split('/');
            if (parts.length >= 2 && parts[1] && !langSet.has(parts[1])) return false;
        }
        if (rel === 'assessment-survey' || rel.startsWith('assessment-survey/')) {  // step 2b
            if (!args.includeAssessment) return false;
            // Keep only the audio sets whose key starts with a packaged language (english-*, french-*).
            const parts = rel.split('/');
            if (parts[1] === 'audio' && parts.length >= 3 && parts[2]) {
                const key = parts[2].toLowerCase();
                if (![...langSet].some(l => key.startsWith(l.toLowerCase()))) return false;
            }
        }
        return true;
    });

    // Step 4: seed script, inserted immediately before the FTM bundle tag.
    const indexPath = path.join(outDir, 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    const bundleTag = /<script[^>]*src="feedTheMonster\.js"[^>]*><\/script>/;
    if (!bundleTag.test(html)) fail('index.html has no feedTheMonster.js script tag; cannot inject seed');
    if (html.includes('tools/package-ftm.js')) fail('index.html already contains the seed script');
    html = html.replace(bundleTag, m => seedScript(args.langs) + m);
    fs.writeFileSync(indexPath, html, 'utf8');

    // Step 5: provenance.
    const src = gitInfo(path.dirname(buildDir));
    const info = {
        packagedAt: new Date().toISOString(),
        sourceBuildDir: buildDir,
        sourceCommit: src.commit,
        sourceCommitInfo: src.describe,
        languages: args.langs,
        serviceWorkerRemoved: true,
        assessmentSurveyIncluded: args.includeAssessment,
        indexHtmlSeeds: ['is_cached[<cr_lang>]=true', 'CRFeatureFlags.gate:' + ANDROID_BRIDGE_GATE + '=true'],
        sizes: {
            total: mb(dirSize(outDir)),
            assets: mb(dirSize(path.join(outDir, 'assets'))),
            lang: mb(dirSize(path.join(outDir, 'lang'))),
            assessmentSurvey: fs.existsSync(path.join(outDir, 'assessment-survey'))
                ? mb(dirSize(path.join(outDir, 'assessment-survey'))) : 'absent',
        },
    };
    fs.writeFileSync(path.join(outDir, 'PACKAGE_INFO.json'), JSON.stringify(info, null, 2) + '\n');

    console.log('Packaged FTM : ' + info.sizes.total
        + ' (assets ' + info.sizes.assets + ', lang ' + info.sizes.lang
        + ', assessment-survey ' + info.sizes.assessmentSurvey + ')');
    console.log('Source commit: ' + info.sourceCommit);
}

main();
