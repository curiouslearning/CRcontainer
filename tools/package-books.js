#!/usr/bin/env node
/*
 * Packages Curious Reader interactive books into the container for the offline standalone
 * flavors (mwfCongo / mwfAngola).
 *
 *   node tools/package-books.js --source <path-to-CRWebPlayer>/BookContent --books ChakusCycleFrench,ColoursFrenchLv4
 *   node tools/package-books.js --verify            (only re-check what is already packaged)
 *
 * Output: app/src/mwfShared/assets/CRWebPlayerJs/BookContent/<book>/ (each listed book is replaced
 * wholesale). The player itself (index.html, dist/, manifest.json) lives next to BookContent and is
 * copied by hand from the CRWebPlayer build; this script does not touch it.
 *
 * What it does per book:
 *  1. Copies <source>/<book>/content/ (content.json, images/, audios/).
 *  2. Converts every .wav under audios/ to .mp3 with ffmpeg (libmp3lame, VBR quality 5) and rewrites
 *     the references in content.json. The authored books carry large WAV narration (one French book
 *     is 42 MB, 35 MB of it WAV); MP3 brings a book down to a fraction of that with no audible loss
 *     on a phone speaker. This is the same shape as the English books already packaged. Pass
 *     --no-convert to copy audio untouched (needs no ffmpeg).
 *  3. Verifies that every image/audio path referenced by content.json exists in the package, so a
 *     missing page asset is a build failure here rather than a blank page on a device with no network.
 *
 * Requires ffmpeg on PATH unless --no-convert is given.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(REPO_ROOT, 'app', 'src', 'mwfShared', 'assets', 'CRWebPlayerJs', 'BookContent');

function usage() {
    console.error('Usage: node tools/package-books.js --source <CRWebPlayer/BookContent> --books a,b,c [--no-convert] [--out <dir>]');
    console.error('       node tools/package-books.js --verify [--out <dir>]');
}

function parseArgs(argv) {
    const args = { books: [], convert: true, verifyOnly: false };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--source') args.source = argv[++i];
        else if (a === '--books') args.books = argv[++i].split(',').map(s => s.trim()).filter(Boolean);
        else if (a === '--out') args.out = argv[++i];
        else if (a === '--no-convert') args.convert = false;
        else if (a === '--verify') args.verifyOnly = true;
        else if (a === '-h' || a === '--help') { usage(); process.exit(0); }
        else { console.error('Unknown argument: ' + a); usage(); process.exit(2); }
    }
    if (!args.verifyOnly && (!args.source || args.books.length === 0)) { usage(); process.exit(2); }
    return args;
}

function fail(msg) { console.error('package-books: ' + msg); process.exit(1); }

function copyDir(src, dst) {
    fs.mkdirSync(dst, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const s = path.join(src, entry.name);
        const d = path.join(dst, entry.name);
        if (entry.isDirectory()) copyDir(s, d);
        else fs.copyFileSync(s, d);
    }
}

function walk(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, out); else out.push(full);
    }
    return out;
}

function dirSize(dir) { return walk(dir).reduce((n, f) => n + fs.statSync(f).size, 0); }
function mb(bytes) { return (bytes / (1024 * 1024)).toFixed(1) + ' MB'; }

function haveFfmpeg() {
    const r = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return r.status === 0;
}

/** Converts every .wav in <bookDir>/content/audios to .mp3 and rewrites content.json. */
function convertWavToMp3(bookDir) {
    const audiosDir = path.join(bookDir, 'content', 'audios');
    if (!fs.existsSync(audiosDir)) return { converted: 0 };
    const wavs = fs.readdirSync(audiosDir).filter(f => /\.wav$/i.test(f));
    for (const wav of wavs) {
        const src = path.join(audiosDir, wav);
        const dst = path.join(audiosDir, wav.replace(/\.wav$/i, '.mp3'));
        execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-codec:a', 'libmp3lame', '-q:a', '5', dst], { stdio: 'inherit' });
        fs.unlinkSync(src);
    }
    if (wavs.length > 0) {
        const jsonPath = path.join(bookDir, 'content', 'content.json');
        let json = fs.readFileSync(jsonPath, 'utf8');
        // References look like "audios\/files-620444870e78d.wav" (JSON-escaped slash) or "audios/....wav".
        json = json.replace(/(audios\\?\/[^"\\]+?)\.wav(?=")/gi, '$1.mp3');
        fs.writeFileSync(jsonPath, json, 'utf8');
    }
    return { converted: wavs.length };
}

/** Every image/audio the player will request for this book must be in the package. */
function verifyBook(bookDir) {
    const contentDir = path.join(bookDir, 'content');
    const jsonPath = path.join(contentDir, 'content.json');
    if (!fs.existsSync(jsonPath)) return ['content/content.json missing'];
    const text = fs.readFileSync(jsonPath, 'utf8');
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) { return ['content.json is not valid JSON: ' + e.message]; }
    const refs = new Set();
    const re = /"((?:images|audios)\\?\/[^"\\]+?\.(?:mp3|wav|ogg|png|jpe?g|webp|gif|svg))"/gi;
    let m;
    while ((m = re.exec(text)) !== null) refs.add(m[1].replace(/\\\//g, '/'));
    const problems = [];
    for (const ref of refs) {
        if (!fs.existsSync(path.join(contentDir, ref))) problems.push('referenced but missing: content/' + ref);
    }
    void parsed;
    return problems;
}

/** WAV narration plays fine but is ~10x the size of MP3; reported as a size warning, not a failure. */
function wavCount(bookDir) {
    return walk(path.join(bookDir, 'content')).filter(f => /\.wav$/i.test(f)).length;
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    const outDir = args.out ? path.resolve(args.out) : OUT_DIR;

    if (!args.verifyOnly) {
        const source = path.resolve(args.source);
        for (const book of args.books) {
            if (!fs.existsSync(path.join(source, book, 'content', 'content.json'))) {
                fail('not a book directory (no content/content.json): ' + path.join(source, book));
            }
        }
        if (args.convert && !haveFfmpeg()) fail('ffmpeg not found on PATH (install it, or pass --no-convert)');

        for (const book of args.books) {
            const src = path.join(source, book);
            const dst = path.join(outDir, book);
            const before = dirSize(src);
            fs.rmSync(dst, { recursive: true, force: true });
            copyDir(src, dst);
            const { converted } = args.convert ? convertWavToMp3(dst) : { converted: 0 };
            console.log(`${book}: ${mb(before)} -> ${mb(dirSize(dst))}` + (converted ? ` (${converted} WAV -> MP3)` : ''));
        }
    }

    // Verify everything that is packaged, not just what was touched.
    let failed = false;
    const books = fs.existsSync(outDir) ? fs.readdirSync(outDir).filter(b => fs.statSync(path.join(outDir, b)).isDirectory()) : [];
    let total = 0;
    for (const book of books.sort()) {
        const bookDir = path.join(outDir, book);
        const problems = verifyBook(bookDir);
        const size = dirSize(bookDir);
        total += size;
        const wavs = wavCount(bookDir);
        if (wavs) console.warn(`WARN ${book}: ${wavs} WAV file(s) still packaged (${mb(size)}); re-run with --books ${book} to convert`);
        if (problems.length) {
            failed = true;
            console.error(`VERIFY FAIL ${book}:`);
            for (const p of problems.slice(0, 10)) console.error('   ' + p);
            if (problems.length > 10) console.error(`   ... ${problems.length - 10} more`);
        }
    }
    console.log(`Packaged books: ${books.length}, total ${mb(total)} (${outDir})`);
    if (failed) process.exit(1);
}

main();
