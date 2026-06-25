#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
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
  --download               Download missing/matched BookContent folders through github-content-folder.
  --write-manifest         Upsert manifest entries for matched books.
  --github-skill PATH      Default: skills/github-content-folder/scripts/github-folder.mjs.
`;

const defaults = {
  repo: "curiouslearning/CRWebPlayer",
  branch: "develop",
  assetsRoot: "app/src/main/assets",
  domain: "maharishi_cr-ftm-standalone.androidplatform.net",
  githubSkill: "skills/github-content-folder/scripts/github-folder.mjs",
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
  { repoPath: "index.html", localPath: path.join(playerRoot, "index.html"), flattenRoot: true },
  { repoPath: "manifest.json", localPath: path.join(playerRoot, "manifest.json"), flattenRoot: true },
  { repoPath: "dist", localPath: path.join(playerRoot, "dist"), flattenRoot: false },
];

await mkdir(bookContentRoot, { recursive: true });
const manifestBefore = readManifest(manifestPath);
const assetImages = listAssetImages(imagesRoot);

console.log(`Target repository: ${repo}#${branch}`);
console.log(`Language match: ${args.language} (${languageInfo.aliases.join(", ")})`);
console.log(`Assets root: ${assetsRoot}`);
console.log(`Available manifest images: ${assetImages.length}`);

if (args.downloadRuntime) {
  if (!existsSync(githubSkill)) fail(`Missing github-content-folder script: ${githubSkill}`);
  await mkdir(playerRoot, { recursive: true });
  console.log("Runtime files:");
  for (const target of runtimeTargets) {
    if (existsSync(target.localPath)) {
      console.log(`already present ${target.repoPath}`);
      continue;
    }
    console.log(`download ${target.repoPath}`);
    downloadRepoPath({
      githubSkill,
      repo,
      branch,
      repoPath: target.repoPath,
      out: playerRoot,
      flattenRoot: target.flattenRoot,
    });
  }
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
  if (!existsSync(githubSkill)) fail(`Missing github-content-folder script: ${githubSkill}`);
  for (const book of matchedBooks) {
    const localBookPath = path.join(bookContentRoot, book);
    if (existsSync(localBookPath)) {
      console.log(`already present ${book}`);
      continue;
    }
    console.log(`download ${book}`);
    downloadRepoPath({
      githubSkill,
      repo,
      branch,
      repoPath: `BookContent/${book}`,
      out: playerRoot,
      flattenRoot: false,
    });
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
    if (["download", "downloadRuntime", "writeManifest"].includes(name)) {
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

function downloadRepoPath({ githubSkill, repo, branch, repoPath, out, flattenRoot }) {
  const command = [
    githubSkill,
    "download",
    "--repo", repo,
    "--branch", branch,
    "--path", repoPath,
    "--out", out,
  ];
  if (flattenRoot) command.push("--flatten-root");
  const result = spawnSync(process.execPath, command, { stdio: "inherit" });
  if (result.status !== 0) fail(`Download failed for ${repoPath}`);
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
