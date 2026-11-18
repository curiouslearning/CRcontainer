#!/usr/bin/env node
/*
 * Packages the Curious Learning assessments (assessment-survey-js) into an offline standalone flavor
 * so they work both ways they do in production:
 *
 *   * embedded  - Feed The Monster opens its in-game assessment overlay at the levels configured in
 *                 Statsig (`assessmentlevels`). The player itself is compiled into
 *                 feedTheMonster.js; it loads its data, audio, images and CSS from
 *                 `feedthemonster/assessment-survey/` next to FTM's index.html (FTM's own webpack
 *                 copies the same folders there from node_modules/@curiouslearning/assessment-survey).
 *   * standalone - the assessment opened directly from the catalog, like
 *                 https://assessment.curiouscontent.org/?data=urdu-lettersounds in production.
 *
 *   node tools/package-assessment.js --build <assessment-survey-js>/build \
 *        --keys english-lettersounds,english-sightwords,urdu-lettersounds,urdu-sightwords,pashto-lettersounds,pashto-sightwords \
 *        [--flavor soorty] [--source-ref "<commit> <note>"]   # provenance, when the build dir is not a git checkout
 *
 * Build the standalone bundle first, from the commit production runs (main), with the one-line patch
 * in tools/patches/assessment-survey-js-standalone-sw-attribute.patch applied:
 *
 *   git apply <CRcontainer>/tools/patches/assessment-survey-js-standalone-sw-attribute.patch
 *   npx cross-env NODE_ENV=production webpack -c webpack.config.js     # no wb:inject: no worker is shipped
 *
 * Output (both replaced wholesale on every run):
 *
 *   app/src/<flavor>/assets/feedthemonster/assessment-survey/   css/ img/ animation/ data/ audio/
 *       The one copy of the assessment content, used by BOTH modes (the standalone build's
 *       assets/ folder has exactly the layout the embedded player expects). Only the requested data
 *       keys are kept under data/ and audio/ (plus the shared Correct.wav and sound-effects/).
 *   app/src/<flavor>/assets/assessment/
 *       index.html, bundle.js, favicon.ico, manifest.json, PACKAGE_INFO.json. Opened from the
 *       catalog as https://<build-host>.androidplatform.net/assets/assessment/index.html?data=<key>.
 *
 * What is changed in the standalone index.html, and why (nothing in bundle.js is touched):
 *   1. data-asset-base-url, the stylesheet link and the loading gif point at
 *      /assets/feedthemonster/assessment-survey (the shared content above) instead of /assets.
 *   2. data-enable-service-worker="false" (needs the patch above). Production registers sw.js and
 *      waits for navigator.serviceWorker.ready before hiding the loading screen; sw.js imports
 *      Workbox from a Google CDN and its job is to cache files that the APK already serves, so it is
 *      not shipped and the bundle's supported no-worker path is used instead (the same path the
 *      embedded player always uses).
 *   3. The gsap <script> from cdnjs is removed. Nothing in the bundle uses it, and offline it only
 *      delays the window load event the app waits for.
 *   4. A seed script, the same as tools/package-ftm.js injects into FTM: the @curiouslearning/features
 *      cache ("CRFeatureFlags") gets the Android bridge gate mr-75 enabled when it has no value yet.
 *      In standalone mode assessment-survey-js only sends summary_data / user_sessions_data to the
 *      container when that Statsig gate is on; offline Statsig is unreachable and the gate would
 *      evaluate false, losing the result and the completion signal the container closes the screen
 *      on. Online, a value from Statsig replaces the seed.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const ANDROID_BRIDGE_GATE = 'mr-75';
const SHARED_URL_BASE = '/assets/feedthemonster/assessment-survey';
const SHARED_AUDIO = ['Correct.wav', 'sound-effects'];

function parseArgs(argv) {
    const args = { flavor: 'soorty', keys: null };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--build') args.build = argv[++i];
        else if (a === '--keys') args.keys = argv[++i].split(',').map(s => s.trim()).filter(Boolean);
        else if (a === '--flavor') args.flavor = argv[++i];
        else if (a === '--source-ref') args.sourceRef = argv[++i];
        else if (a === '-h' || a === '--help') { usage(); process.exit(0); }
        else { console.error('Unknown argument: ' + a); usage(); process.exit(2); }
    }
    if (!args.build || !args.keys || args.keys.length === 0) { usage(); process.exit(2); }
    return args;
}

function usage() {
    console.error('Usage: node tools/package-assessment.js --build <assessment-survey-js/build> --keys a-lettersounds,a-sightwords [--flavor soorty] [--source-ref "<commit> <note>"]');
}

function fail(msg) {
    console.error('package-assessment: ' + msg);
    process.exit(1);
}

function copyDir(src, dst) {
    fs.mkdirSync(dst, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const s = path.join(src, entry.name);
        const d = path.join(dst, entry.name);
        if (entry.isDirectory()) copyDir(s, d);
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
        const git = (cmd) => execSync(cmd, { cwd: dir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
        const dirty = git('git status --porcelain --untracked-files=no') !== '';
        return git('git rev-parse HEAD') + (dirty ? '-dirty' : '') + ' ' + (git('git branch --show-current') || '(detached)');
    } catch (e) {
        return 'unknown (not a git checkout)';
    }
}

function seedScript() {
    return `<script>
/* Injected by CRcontainer tools/package-assessment.js (offline standalone build). See that file for why. */
(function () {
  try {
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

function replaceOnce(html, pattern, replacement, what) {
    const matches = html.match(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'));
    if (!matches || matches.length !== 1) fail('index.html: expected exactly one ' + what + ', found ' + (matches ? matches.length : 0));
    return html.replace(pattern, replacement);
}

function patchIndexHtml(html) {
    if (html.includes('tools/package-assessment.js')) fail('index.html is already packaged');
    html = replaceOnce(html, /data-asset-base-url="[^"]*"/, `data-asset-base-url="${SHARED_URL_BASE}" data-enable-service-worker="false"`, 'data-asset-base-url');
    html = replaceOnce(html, /(id="assessment-stylesheet"[^>]*href=")assets\/css\//, `$1${SHARED_URL_BASE}/css/`, 'assessment stylesheet link');
    html = html.replace(/src="assets\/img\//g, `src="${SHARED_URL_BASE}/img/`);
    html = html.replace(/[ \t]*<script[^>]*src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap\/[^"]*"[^>]*><\/script>\s*\n?/g, '');
    html = replaceOnce(html, /<script[^>]*src="bundle\.js"[^>]*><\/script>/, m => seedScript() + '    ' + m, 'bundle.js script tag');
    if (/https?:\/\/(?!www\.googletagmanager)[^"']*\.(js|css)["']/.test(html.replace(/<!--[\s\S]*?-->/g, ''))) {
        fail('index.html still loads a remote script/stylesheet; it would not load offline');
    }
    return html;
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    const buildDir = path.resolve(args.build);
    const flavorAssets = path.join(REPO_ROOT, 'app', 'src', args.flavor, 'assets');
    const sharedOut = path.join(flavorAssets, 'feedthemonster', 'assessment-survey');
    const standaloneOut = path.join(flavorAssets, 'assessment');

    for (const required of ['index.html', 'bundle.js', 'assets/css', 'assets/img', 'assets/animation', 'assets/data', 'assets/audio']) {
        if (!fs.existsSync(path.join(buildDir, required))) fail('not an assessment-survey-js standalone build (missing ' + required + '): ' + buildDir);
    }
    const bundle = fs.readFileSync(path.join(buildDir, 'bundle.js'), 'utf8');
    if (!bundle.includes('data-enable-service-worker')) {
        fail('bundle.js does not read data-enable-service-worker; apply tools/patches/assessment-survey-js-standalone-sw-attribute.patch and rebuild');
    }
    if (/hot-update|webpack-dev-server/.test(fs.readdirSync(buildDir).join(' ')) || bundle.includes('webpack-dev-server')) {
        fail('build directory contains a dev-server build; run a production webpack build into a clean build/');
    }
    for (const key of args.keys) {
        if (!fs.existsSync(path.join(buildDir, 'assets', 'data', key + '.json'))) fail('no data file for ' + key);
        if (!fs.existsSync(path.join(buildDir, 'assets', 'audio', key))) fail('no audio folder for ' + key);
    }
    if (!fs.existsSync(path.join(flavorAssets, 'web_apps_manifest.json'))) fail('unknown flavor (no web_apps_manifest.json): ' + args.flavor);

    console.log('Source build : ' + buildDir);
    console.log('Flavor       : ' + args.flavor);
    console.log('Data keys    : ' + args.keys.join(', '));

    // Shared content (embedded + standalone).
    fs.rmSync(sharedOut, { recursive: true, force: true });
    for (const dir of ['css', 'img', 'animation']) copyDir(path.join(buildDir, 'assets', dir), path.join(sharedOut, dir));
    fs.mkdirSync(path.join(sharedOut, 'data'), { recursive: true });
    fs.mkdirSync(path.join(sharedOut, 'audio'), { recursive: true });
    for (const key of args.keys) {
        fs.copyFileSync(path.join(buildDir, 'assets', 'data', key + '.json'), path.join(sharedOut, 'data', key + '.json'));
        copyDir(path.join(buildDir, 'assets', 'audio', key), path.join(sharedOut, 'audio', key));
    }
    for (const shared of SHARED_AUDIO) {
        const src = path.join(buildDir, 'assets', 'audio', shared);
        if (!fs.existsSync(src)) fail('missing shared audio ' + shared);
        if (fs.statSync(src).isDirectory()) copyDir(src, path.join(sharedOut, 'audio', shared));
        else fs.copyFileSync(src, path.join(sharedOut, 'audio', shared));
    }

    // Every item audio file each assessment will request must be present.
    const missing = [];
    for (const key of args.keys) {
        const data = JSON.parse(fs.readFileSync(path.join(sharedOut, 'data', key + '.json'), 'utf8'));
        const audioDir = path.join(sharedOut, 'audio', key);
        const want = ['answer_feedback.mp3'];
        if (data.appType === 'assessment') {
            for (const b of data.buckets || []) for (const it of b.items || []) want.push(String(it.itemName).toLowerCase().trim() + '.mp3');
        }
        for (const f of want) if (!fs.existsSync(path.join(audioDir, f))) missing.push(key + '/' + f);
    }
    if (missing.length) console.warn('WARNING: audio referenced by data but not in the build (same as production): ' + missing.join(', '));

    // Standalone page.
    fs.rmSync(standaloneOut, { recursive: true, force: true });
    fs.mkdirSync(standaloneOut, { recursive: true });
    for (const f of ['bundle.js', 'bundle.js.LICENSE.txt', 'favicon.ico', 'manifest.json']) {
        if (fs.existsSync(path.join(buildDir, f))) fs.copyFileSync(path.join(buildDir, f), path.join(standaloneOut, f));
    }
    const html = patchIndexHtml(fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8'));
    fs.writeFileSync(path.join(standaloneOut, 'index.html'), html, 'utf8');

    const info = {
        packagedAt: new Date().toISOString(),
        sourceBuildDir: buildDir,
        source: args.sourceRef || gitInfo(path.dirname(buildDir)),
        dataKeys: args.keys,
        sharedContent: 'feedthemonster/assessment-survey (used by the FTM-embedded player and by this page)',
        serviceWorker: 'not shipped; index.html sets data-enable-service-worker="false"',
        indexHtmlChanges: ['asset base -> ' + SHARED_URL_BASE, 'data-enable-service-worker=false', 'gsap CDN script removed', 'CRFeatureFlags.gate:' + ANDROID_BRIDGE_GATE + '=true seed'],
        sizes: { standalonePage: mb(dirSize(standaloneOut)), sharedContent: mb(dirSize(sharedOut)) },
        missingAudio: missing,
    };
    fs.writeFileSync(path.join(standaloneOut, 'PACKAGE_INFO.json'), JSON.stringify(info, null, 2) + '\n');
    console.log('Standalone   : ' + info.sizes.standalonePage + '  (' + path.relative(REPO_ROOT, standaloneOut) + ')');
    console.log('Shared       : ' + info.sizes.sharedContent + '  (' + path.relative(REPO_ROOT, sharedOut) + ')');
}

main();
