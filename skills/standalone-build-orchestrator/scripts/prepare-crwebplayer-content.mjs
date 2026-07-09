#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const usage = `Usage:
  node prepare-crwebplayer-content.mjs --language isiZulu [--download] [--write-manifest]
  node prepare-crwebplayer-content.mjs --language isiZulu --assets-root app/src/main/assets --domain maharishi_cr-ftm-standalone.androidplatform.net --download-runtime --download --write-manifest

Options:
  --language NAME          Required. Language token to match against BookContent folder names.
  --repo OWNER/REPO        Default: curiouslearning/CRWebPlayer.
  --branch BRANCH          Default: develop.
  --assets-root PATH       Default: app/src/main/assets.
  --domain HOST            Default: maharishi_cr-ftm-standalone.androidplatform.net.
  --local-name NAME        Manifest language value. Defaults to --language.
  --english-name NAME      Manifest languageInEnglishName. Defaults from known aliases or --language.
  --download-runtime       Download root index.html, manifest.json, and dist/ from CRWebPlayer.
  --download               Download missing/matched BookContent folders.
  --write-manifest         Upsert manifest entries for matched books.
  --github-skill PATH      Default: skills/github-s3-content-pull/scripts/github-s3-content-pull.mjs.
  --content-cdn-base URL   Default: https://curiousreaderdev.curiouscontent.org. This host mirrors
                           the repo's path layout 1:1, so each book's own content/content.json
                           (fetched directly from here) is used as the asset manifest to download
                           every audio/image straight from the CDN, skipping GitHub's API entirely
                           for that book. GitHub is still used only to discover which BookContent
                           folder names match the requested language (one lightweight, non-recursive
                           call), and as a per-book fallback (via github-s3-content-pull.mjs's own
                           --cdn-base-url) when a book's content.json isn't available on the CDN.
  --no-content-cdn         Disable the CDN entirely and use the old pure-GitHub download path.
`;

const defaults = {
  repo: "curiouslearning/CRWebPlayer",
  branch: "develop",
  assetsRoot: "app/src/main/assets",
  domain: "maharishi_cr-ftm-standalone.androidplatform.net",
  githubSkill: "skills/github-s3-content-pull/scripts/github-s3-content-pull.mjs",
  contentCdnBase: "https://curiousreaderdev.curiouscontent.org",
};

const iconByBase = new Map([
  ["chakuscycle", "chakus_cycle.png"],
  ["cicadassong", "CicadasSong.png"],
  ["colours", "Colours.png"],
  ["coloursofnature", "colours_of_nature.png"],
  ["dadsboots", "dads_boots.png"],
  ["friends", "friends.png"],
  ["frogsstarrywish", "frogs_starry_wish.png"],
  ["hideandseek", "ftm_HideAndSeek_prod.png"],
  ["iamnotafraid", "i_am_not_afraid.png"],
  ["letsfly", "LetsFly_prod.png"],
  ["myfirstdayatthemarket", "my_first_day_at_the_market.png"],
  ["playground", "playground.png"],
  ["tallandshort", "ftm_tallandshort_prod.png"],
  ["thebeeandtheelephant", "ftm_TheBeeAndTheElephant_prod.png"],
  ["thelionrunsandthecowwalks", "the_lion_runs.png"],
  ["thelostdoll", "ftm_TheLostDoll_prod.png"],
  ["whatdayisit", "what_day_is_it.png"],
  ["whocanhelpme", "who_Can_Help_Me.png"],
]);

const imageStopWords = new Set([
  "assessment",
  "copy",
  "dev",
  "english",
  "french",
  "ftm",
  "icon",
  "prod",
  "sight",
  "swahili",
  "word",
  "zulu",
]);

const languageAliases = new Map([
  ["isizulu", { aliases: ["isizulu", "zulu"], local: "isiZulu", english: "Zulu" }],
  ["zulu", { aliases: ["isizulu", "zulu"], local: "isiZulu", english: "Zulu" }],
  ["luganda", { aliases: ["luganda", "lug"], local: "Luganda", english: "Luganda" }],
  ["swahili", { aliases: ["swahili"], local: "Swahili", english: "Swahili" }],
  ["hausa", { aliases: ["hausa"], local: "Hausa", english: "Hausa" }],
  ["hindi", { aliases: ["hindi"], local: "Hindi", english: "Hindi" }],
  ["nepali", { aliases: ["nepali", "nep"], local: "Nepali", english: "Nepali" }],
  ["marathi", { aliases: ["marathi"], local: "Marathi", english: "Marathi" }],
  ["bangla", { aliases: ["bangla"], local: "Bangla", english: "Bangla" }],
  ["french", { aliases: ["french"], local: "French", english: "French" }],
  ["ukrainian", { aliases: ["ukrainian", "ukr"], local: "Ukrainian", english: "Ukrainian" }],
  ["pashto", { aliases: ["pashto"], local: "Pashto", english: "Pashto" }],
  ["wolof", { aliases: ["wolof"], local: "Wolof", english: "Wolof" }],
  ["amharic", { aliases: ["amharic"], local: "Amharic", english: "Amharic" }],
  ["oromo", { aliases: ["oromo"], local: "Oromo", english: "Oromo" }],
  ["somali", { aliases: ["somali"], local: "Somali", english: "Somali" }],
  ["tigirigna", { aliases: ["tigirigna"], local: "Tigirigna", english: "Tigirigna" }],
]);

const args = parseArgs(process.argv.slice(2));
if (!args.language) fail(usage);

const repo = args.repo ?? defaults.repo;
const branch = args.branch ?? defaults.branch;
const assetsRoot = path.resolve(args.assetsRoot ?? defaults.assetsRoot);
const domain = args.domain ?? defaults.domain;
const githubSkill = path.resolve(args.githubSkill ?? defaults.githubSkill);
const contentCdnBase = args.noContentCdn ? null : (args.contentCdnBase ?? defaults.contentCdnBase);
const languageInfo = languageAliases.get(normalize(args.language)) ?? {
  aliases: [normalize(args.language)],
  local: args.language,
  english: args.language,
};
const localName = args.localName ?? languageInfo.local;
const englishName = args.englishName ?? languageInfo.english;
const manifestPath = path.join(assetsRoot, "web_apps_manifest.json");
const playerRoot = path.join(assetsRoot, "CRWebPlayerJs");
const bookContentRoot = path.join(playerRoot, "BookContent");
const imagesRoot = path.join(assetsRoot, "images");
const runtimeTargets = [
  {
    repoPath: "index.html", localPath: path.join(playerRoot, "index.html"), flattenRoot: true, singleFile: true,
    isPresent: () => existsSync(path.join(playerRoot, "index.html")),
  },
  {
    repoPath: "manifest.json", localPath: path.join(playerRoot, "manifest.json"), flattenRoot: true, singleFile: true,
    isPresent: () => existsSync(path.join(playerRoot, "manifest.json")),
  },
  {
    // A "dist exists" check alone can't tell a complete runtime from a partial one left behind by
    // an earlier rate-limited/interrupted run — check for the two files validateRuntime() actually
    // requires, not just the directory.
    repoPath: "dist", localPath: path.join(playerRoot, "dist"), flattenRoot: false, singleFile: false,
    isPresent: () => existsSync(path.join(playerRoot, "dist", "app.js")) && existsSync(path.join(playerRoot, "dist", "index.html")),
  },
];

const startTime = Date.now();
const stats = {
  runtimeFiles: 0,
  runtimeBytes: 0,
  booksAlreadyPresent: 0,
  booksViaCdn: 0,
  booksViaFallback: 0,
  bookFiles: 0,
  bookBytes: 0,
};

await mkdir(bookContentRoot, { recursive: true });
const manifestBefore = readManifest(manifestPath);
const assetImages = listAssetImages(imagesRoot);

console.log(`Target repository: ${repo}#${branch}`);
console.log(`Language match: ${args.language} (${languageInfo.aliases.join(", ")})`);
console.log(`Assets root: ${assetsRoot}`);
console.log(`Available manifest images: ${assetImages.length}`);
console.log(`Content source: ${contentCdnBase ? `CDN-first (${contentCdnBase}), GitHub fallback` : "GitHub only (--no-content-cdn)"}`);

if (args.downloadRuntime) {
  if (!existsSync(githubSkill)) fail(`Missing github-s3-content-pull script: ${githubSkill}`);
  await mkdir(playerRoot, { recursive: true });
  console.log("Runtime files:");
  for (const target of runtimeTargets) {
    if (target.isPresent()) {
      console.log(`already present ${target.repoPath}`);
      continue;
    }
    if (target.singleFile && contentCdnBase) {
      const buffer = await tryFetchBytes(`${contentCdnBase.replace(/\/+$/, "")}/${target.repoPath}`);
      if (buffer) {
        await mkdir(path.dirname(target.localPath), { recursive: true });
        await writeFile(target.localPath, buffer);
        stats.runtimeFiles += 1;
        stats.runtimeBytes += buffer.length;
        console.log(`download ${target.repoPath} (via cdn, ${formatBytes(buffer.length)})`);
        continue;
      }
      console.log(`cdn miss for ${target.repoPath}; falling back to GitHub`);
    }
    console.log(`download ${target.repoPath}`);
    const outcome = downloadRepoPath({
      githubSkill,
      repo,
      branch,
      repoPath: target.repoPath,
      out: playerRoot,
      flattenRoot: target.flattenRoot,
      cdnBaseUrl: contentCdnBase,
    });
    stats.runtimeFiles += outcome.files;
    stats.runtimeBytes += outcome.bytes;
  }
  console.log(`Runtime totals so far: ${stats.runtimeFiles} file(s), ${formatBytes(stats.runtimeBytes)}`);
}

const runtimeValidation = validateRuntime(playerRoot);
console.log("Runtime validation:");
console.log(`- index.html: ${runtimeValidation.indexHtml ? "ok" : "missing"}`);
console.log(`- manifest.json: ${runtimeValidation.manifestJson ? "ok" : "missing"}`);
console.log(`- dist/app.js: ${runtimeValidation.distAppJs ? "ok" : "missing"}`);
console.log(`- dist/index.html: ${runtimeValidation.distIndexHtml ? "ok" : "missing"}`);

let remoteBooks;
try {
  remoteBooks = await listRemoteBookContent(repo, branch);
} catch (error) {
  if (isGitHubRateLimit(error)) {
    console.warn(`GitHub listing rate-limited; falling back to local BookContent folders only.`);
    remoteBooks = listLocalBookContent(bookContentRoot);
  } else {
    throw error;
  }
}
const matchedBooks = dedupeBooks(
  remoteBooks.filter((name) => matchesLanguage(name, languageInfo.aliases)),
  manifestBefore,
  bookContentRoot
);

console.log(`Matched ${matchedBooks.length} BookContent folder(s):`);
for (const book of matchedBooks) console.log(`- ${book} -> icon ${iconForBook(book, assetImages)}`);

if (args.download) {
  if (!existsSync(githubSkill)) fail(`Missing github-s3-content-pull script: ${githubSkill}`);
  for (const [index, book] of matchedBooks.entries()) {
    const localBookPath = path.join(bookContentRoot, book);
    // Same reasoning as the runtime targets above: a book folder can exist but be incomplete
    // (e.g. audios/images present from an earlier interrupted run, but no content.json) — check
    // for the file validateBooks() actually requires, not just the folder.
    if (existsSync(path.join(localBookPath, "content", "content.json"))) {
      console.log(`already present ${book}`);
      stats.booksAlreadyPresent += 1;
      continue;
    }
    console.log(`download ${book}`);
    const cdnResult = contentCdnBase
      ? await downloadBookViaContentJson(book, { contentCdnBase, bookContentRoot })
      : null;
    if (cdnResult) {
      stats.booksViaCdn += 1;
      stats.bookFiles += cdnResult.files;
      stats.bookBytes += cdnResult.bytes;
    } else {
      if (contentCdnBase) console.log(`  content.json fast path unavailable for ${book}; falling back to GitHub walk`);
      const outcome = downloadRepoPath({
        githubSkill,
        repo,
        branch,
        repoPath: `BookContent/${book}`,
        out: playerRoot,
        flattenRoot: false,
        cdnBaseUrl: contentCdnBase,
      });
      stats.booksViaFallback += 1;
      stats.bookFiles += outcome.files;
      stats.bookBytes += outcome.bytes;
    }
    console.log(
      `  progress: ${index + 1}/${matchedBooks.length} books processed ` +
        `(${stats.booksViaCdn} cdn, ${stats.booksViaFallback} fallback, ${stats.booksAlreadyPresent} skipped) — ` +
        `${stats.bookFiles} file(s), ${formatBytes(stats.bookBytes)} so far, ${formatDuration(Date.now() - startTime)} elapsed`
    );
  }
}

const validation = validateBooks(matchedBooks, bookContentRoot);
console.log("Validation:");
console.log(`- valid books: ${validation.valid.length}`);
console.log(`- missing content folders: ${validation.missingContent.length}`);
console.log(`- missing content.json: ${validation.missingContentJson.length}`);
console.log(`- missing audios folders: ${validation.missingAudios.length}`);
console.log(`- missing images folders: ${validation.missingImages.length}`);
for (const [label, values] of Object.entries({
  missingContent: validation.missingContent,
  missingContentJson: validation.missingContentJson,
  missingAudios: validation.missingAudios,
  missingImages: validation.missingImages,
})) {
  if (values.length) console.log(`${label}: ${values.join(", ")}`);
}

let manifestSummary = null;
if (args.writeManifest) {
  const manifest = readManifest(manifestPath);
  const before = manifest.web_apps.length;
  const added = upsertManifestEntries(manifest, matchedBooks, {
    domain,
    localName,
    englishName,
    assetImages,
  });
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Manifest updated: ${manifestPath}`);
  console.log(`- existing entries before: ${before}`);
  console.log(`- added entries: ${added}`);
  console.log(`- total entries now: ${manifest.web_apps.length}`);
  manifestSummary = { added, total: manifest.web_apps.length };
}

console.log("");
console.log("=== Summary ===");
console.log(`Elapsed: ${formatDuration(Date.now() - startTime)}`);
if (args.downloadRuntime) {
  console.log(`Runtime files: ${stats.runtimeFiles} file(s), ${formatBytes(stats.runtimeBytes)}`);
}
if (args.download) {
  console.log(
    `Books matched: ${matchedBooks.length} ` +
      `(${stats.booksViaCdn} via CDN, ${stats.booksViaFallback} via GitHub fallback, ${stats.booksAlreadyPresent} already present)`
  );
  console.log(`Book content downloaded: ${stats.bookFiles} file(s), ${formatBytes(stats.bookBytes)}`);
}
console.log(`Validation: ${validation.valid.length}/${matchedBooks.length} book(s) valid`);
if (manifestSummary) {
  console.log(`Manifest: ${manifestSummary.added} added, ${manifestSummary.total} total`);
}

function dedupeBooks(bookNames, manifest, localRoot) {
  const preferredNames = new Set([
    ...manifest.web_apps
      .map((entry) => String(entry.appUrl ?? "").match(/[?&]book=([^&]+)/)?.[1])
      .filter(Boolean),
    ...safeLocalDirNames(localRoot),
  ]);
  const byKey = new Map();
  for (const book of bookNames) {
    const key = normalize(book);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, book);
      continue;
    }
    if (preferredNames.has(book) && !preferredNames.has(existing)) {
      byKey.set(key, book);
    }
  }
  return [...byKey.values()].sort((a, b) => a.localeCompare(b));
}

function safeLocalDirNames(localRoot) {
  if (!existsSync(localRoot)) return [];
  return readdirSync(localRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function parseArgs(values) {
  const parsed = {};
  for (let i = 0; i < values.length; i += 1) {
    const key = values[i];
    if (!key.startsWith("--")) fail(`Unexpected argument: ${key}\n\n${usage}`);
    const name = key.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (["download", "downloadRuntime", "writeManifest", "noContentCdn"].includes(name)) {
      parsed[name] = true;
      continue;
    }
    const value = values[i + 1];
    if (!value || value.startsWith("--")) fail(`Missing value for ${key}`);
    parsed[name] = value;
    i += 1;
  }
  return parsed;
}

function downloadRepoPath({ githubSkill, repo, branch, repoPath, out, flattenRoot, cdnBaseUrl }) {
  const command = [
    githubSkill,
    "download",
    "--repo", repo,
    "--branch", branch,
    "--path", repoPath,
    "--out", out,
  ];
  if (flattenRoot) command.push("--flatten-root");
  if (cdnBaseUrl) command.push("--cdn-base-url", cdnBaseUrl);
  // Capture stdout (instead of inheriting it) so the per-file/per-dir lines can still be echoed to
  // the terminal here while also parsing the trailing "Downloaded N files, M bytes total" summary
  // back into this script's own running tally. stderr stays inherited so failures are still visible.
  const result = spawnSync(process.execPath, command, { stdio: ["ignore", "pipe", "inherit"], encoding: "utf8" });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.status !== 0) fail(`Download failed for ${repoPath}`);
  const match = result.stdout?.match(/Downloaded (\d+) files, (\d+) bytes total/);
  return match ? { files: Number(match[1]), bytes: Number(match[2]) } : { files: 0, bytes: 0 };
}

// Fast path: a book's own content/content.json (mirrored on the CDN, same as the runtime files)
// enumerates every audio/image asset it needs via embedded { path, mime } file references. Fetching
// it directly and downloading only those referenced assets from the CDN skips GitHub's API (and its
// rate limit) entirely for that book. Any single miss aborts and lets the caller fall back to the
// GitHub-driven walk for the whole book, so a book is never left partially populated by this path.
async function downloadBookViaContentJson(book, { contentCdnBase, bookContentRoot }) {
  const base = contentCdnBase.replace(/\/+$/, "");
  const contentJsonUrl = `${base}/BookContent/${book}/content/content.json`;
  const contentJsonBuffer = await tryFetchBytes(contentJsonUrl);
  if (!contentJsonBuffer) return null;

  let parsed;
  try {
    parsed = JSON.parse(contentJsonBuffer.toString("utf8"));
  } catch {
    return null;
  }

  const assetPaths = collectAssetPaths(parsed);
  const contentDir = path.join(bookContentRoot, book, "content");
  await mkdir(contentDir, { recursive: true });

  let missed = false;
  const results = await mapWithConcurrency(assetPaths, 12, async (relPath) => {
    if (missed) return null;
    const assetUrl = `${base}/BookContent/${book}/content/${relPath}`;
    const assetBuffer = await tryFetchBytes(assetUrl);
    if (!assetBuffer) {
      console.log(`  cdn miss for asset ${relPath} in ${book}`);
      missed = true;
      return null;
    }
    return { relPath, buffer: assetBuffer };
  });
  if (missed) return null;
  const downloadedFiles = results;

  await writeFile(path.join(contentDir, "content.json"), contentJsonBuffer);
  for (const { relPath, buffer } of downloadedFiles) {
    const targetPath = path.join(contentDir, ...relPath.split("/"));
    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, buffer);
  }

  const totalBytes = contentJsonBuffer.length + downloadedFiles.reduce((sum, f) => sum + f.buffer.length, 0);
  const fileCount = downloadedFiles.length + 1;
  console.log(`  via CDN content.json: ${fileCount} file(s), ${formatBytes(totalBytes)} for ${book}`);
  return { files: fileCount, bytes: totalBytes };
}

// Recursively collects relative asset paths from a content.json tree. A "path" string counts as an
// asset reference when its containing object also has a "mime" field (the standard H5P file
// descriptor shape) or the path itself is already under a known asset folder (audios/, images/) —
// this stays schema-tolerant without picking up unrelated "path"-named strings elsewhere in the tree.
function collectAssetPaths(node, found = new Set()) {
  if (Array.isArray(node)) {
    for (const item of node) collectAssetPaths(item, found);
    return [...found];
  }
  if (node && typeof node === "object") {
    const value = node.path;
    if (typeof value === "string" && !/^https?:\/\//i.test(value)) {
      const looksLikeAsset = Boolean(node.mime) || /^(audios|images)\//i.test(value);
      if (looksLikeAsset) found.add(value);
    }
    for (const key of Object.keys(node)) collectAssetPaths(node[key], found);
  }
  return [...found];
}

// Runs `worker` over `items` with at most `limit` in flight at once. Plain Promise.all would fire
// every request simultaneously (rude to the CDN and easy to trip connection limits); a fully
// sequential loop is correct but slow for the ~100 files a typical book needs.
async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function runWorker() {
    while (nextIndex < items.length) {
      const current = nextIndex++;
      results[current] = await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runWorker));
  return results;
}

async function tryFetchBytes(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch {
    return null;
  }
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log2(bytes) / 10), units.length - 1);
  const value = bytes / 2 ** (10 * exponent);
  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
}

function formatDuration(ms) {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m${seconds}s` : `${seconds}s`;
}

function validateRuntime(root) {
  return {
    indexHtml: existsSync(path.join(root, "index.html")),
    manifestJson: existsSync(path.join(root, "manifest.json")),
    distAppJs: existsSync(path.join(root, "dist", "app.js")),
    distIndexHtml: existsSync(path.join(root, "dist", "index.html")),
  };
}

async function listRemoteBookContent(repo, branch) {
  const [owner, repoName] = repo.split("/");
  if (!owner || !repoName) fail(`Invalid repo value: ${repo}`);
  const url = `https://api.github.com/repos/${owner}/${repoName}/contents/BookContent?ref=${encodeURIComponent(branch)}`;
  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "codex-standalone-build-orchestrator",
    "x-github-api-version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} ${response.statusText}: ${url}`);
  }
  const entries = await response.json();
  return entries
    .filter((entry) => entry.type === "dir")
    .map((entry) => path.posix.basename(entry.path))
    .sort((a, b) => a.localeCompare(b));
}

function matchesLanguage(bookName, aliases) {
  const normalized = normalize(bookName);
  return aliases.some((alias) => normalized.includes(normalize(alias)));
}

function validateBooks(bookNames, root) {
  const result = {
    valid: [],
    missingContent: [],
    missingContentJson: [],
    missingAudios: [],
    missingImages: [],
  };
  for (const book of bookNames) {
    const content = path.join(root, book, "content");
    const contentJson = path.join(content, "content.json");
    const audios = path.join(content, "audios");
    const images = path.join(content, "images");
    let ok = true;
    if (!existsSync(content)) {
      result.missingContent.push(book);
      ok = false;
    }
    if (!existsSync(contentJson)) {
      result.missingContentJson.push(book);
      ok = false;
    }
    if (!existsSync(audios)) {
      result.missingAudios.push(book);
      ok = false;
    }
    if (!existsSync(images)) {
      result.missingImages.push(book);
      ok = false;
    }
    if (ok) result.valid.push(book);
  }
  return result;
}

function readManifest(filePath) {
  if (!existsSync(filePath)) return { version: "1.0", web_apps: [] };
  const manifest = JSON.parse(readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
  if (Array.isArray(manifest)) return { version: "1.0", web_apps: manifest };
  if (!Array.isArray(manifest.web_apps)) manifest.web_apps = [];
  manifest.version ??= "1.0";
  return manifest;
}

function upsertManifestEntries(manifest, bookNames, options) {
  const existingBooks = new Set(
    manifest.web_apps
      .map((entry) => String(entry.appUrl ?? "").match(/[?&]book=([^&]+)/)?.[1])
      .filter(Boolean)
  );
  const existingByBook = new Map(
    manifest.web_apps
      .map((entry) => [String(entry.appUrl ?? "").match(/[?&]book=([^&]+)/)?.[1], entry])
      .filter(([book]) => Boolean(book))
  );
  let nextAppId = manifest.web_apps.reduce((max, entry) => Math.max(max, Number(entry.appId) || 0), 0) + 1;
  let added = 0;
  for (const book of bookNames) {
    const selectedIcon = iconForBook(book, options.assetImages);
    if (existingBooks.has(book)) {
      const existing = existingByBook.get(book);
      if (existing && !existing.appIconUrl) {
        existing.appIconUrl = selectedIcon;
        console.log(`manifest existing ${book}: filled icon ${selectedIcon}`);
      } else {
        console.log(`manifest existing ${book}: icon ${existing?.appIconUrl ?? selectedIcon}`);
      }
      continue;
    }
    manifest.web_apps.push({
      appId: nextAppId++,
      appIconUrl: selectedIcon,
      title: `Curious Reader ${titleForBook(book, options.englishName)}`,
      appUrl: `https://${options.domain}/assets/CRWebPlayerJs/index.html?book=${encodeURIComponent(book)}`,
      language: options.localName,
      languageInEnglishName: options.englishName,
    });
    console.log(`manifest add ${book}: icon ${selectedIcon}`);
    added += 1;
  }
  return added;
}

function iconForBook(book, assetImages) {
  const matched = bestAssetImageForBook(book, assetImages);
  if (matched) return matched;
  const base = baseBookKey(book);
  return iconByBase.get(base) ?? "assessment_icon_prod.png";
}

function bestAssetImageForBook(book, assetImages) {
  if (!assetImages?.length) return null;
  const bookWords = meaningfulWords(stripLanguageAndLevel(book));
  const bookKey = normalize(bookWords.join(""));
  let best = null;
  for (const imageName of assetImages) {
    const imageWords = meaningfulWords(path.basename(imageName, path.extname(imageName)));
    const imageKey = normalize(imageWords.join(""));
    if (!imageKey) continue;
    const score = matchScore(bookWords, bookKey, imageWords, imageKey) + imagePriority(imageName);
    if (!best || score > best.score || (score === best.score && imageName.length < best.name.length)) {
      best = { name: imageName, score };
    }
  }
  return best && best.score >= 20 ? best.name : null;
}

function matchScore(bookWords, bookKey, imageWords, imageKey) {
  let score = 0;
  if (imageKey === bookKey) score += 100;
  if (imageKey.includes(bookKey) || bookKey.includes(imageKey)) score += 70;
  const imageSet = new Set(imageWords);
  const overlap = bookWords.filter((word) => imageSet.has(word));
  score += overlap.length * 15;
  if (overlap.length === bookWords.length && bookWords.length > 0) score += 35;
  if (imageWords.some((word) => bookKey.includes(word) && word.length >= 4)) score += 10;
  return score;
}

function imagePriority(imageName) {
  const normalized = normalize(imageName);
  let priority = 0;
  if (normalized.includes("prod")) priority += 5;
  if (normalized.includes("dev")) priority -= 5;
  if (normalized.includes("copy")) priority -= 3;
  return priority;
}

function meaningfulWords(value) {
  return String(value ?? "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .map((word) => normalize(word))
    .filter((word) => word && !imageStopWords.has(word));
}

function titleForBook(book, englishName) {
  const withoutLanguage = stripLanguageAndLevel(book);
  const spaced = withoutLanguage
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\bLv(\d+)\b/g, "Level $1")
    .trim();
  return `${spaced} ${englishName}`.replace(/\s+/g, " ");
}

function stripLanguageAndLevel(book) {
  let value = book;
  for (const info of languageAliases.values()) {
    for (const alias of info.aliases) {
      value = value.replace(new RegExp(alias, "ig"), "");
    }
  }
  return value;
}

function baseBookKey(book) {
  return normalize(stripLanguageAndLevel(book).replace(/Lv\d+$/i, ""));
}

function normalize(value) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function listAssetImages(localRoot) {
  if (!existsSync(localRoot)) return [];
  return readdirSync(localRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
    .sort((a, b) => a.localeCompare(b));
}

function listLocalBookContent(localRoot) {
  if (!existsSync(localRoot)) return [];
  return readdirSync(localRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function isGitHubRateLimit(error) {
  const message = String(error?.message ?? error);
  return message.includes("GitHub API 403") || message.includes("GitHub API 429") || message.includes("rate limit exceeded");
}


function fail(message) {
  console.error(message);
  process.exit(1);
}
