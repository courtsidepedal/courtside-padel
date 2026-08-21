// Build-time image optimization for content the CMS drops into
// public/images/uploads.
//
// Why this exists: Astro's built-in image pipeline (astro:assets) only
// optimizes images imported from src/. Files the CMS uploads land in
// public/ — which Astro deliberately passes straight through, untouched —
// so without this step, whatever the site owner uploads ships to
// production at whatever size/weight their phone or laptop produced it
// at. That conflicts with the brief's "fast load" + "automatic image
// optimization on build" requirements.
//
// What it does: runs before every `astro build` (see the "prebuild" script
// in package.json) and, for every jpg/jpeg/png under public/images/uploads:
//   - resizes down to a max width of 1600px if it's wider (never upscales)
//   - re-encodes in the SAME format/filename at a compressed quality
//
// It overwrites the file in place rather than writing a differently-named
// output. That's deliberate: the owner picks an image in the CMS media
// browser and the CMS stores that exact filename in the article's
// frontmatter. If optimization produced a different filename (e.g. a
// .webp sibling), every article would need its image path manually
// updated to benefit — which breaks the "no code, no manual steps"
// requirement. Same filename in, same filename out, just smaller.
//
// A manifest (.optimize-manifest.json, gitignored) tracks which files
// have already been processed at their current size, so re-running the
// build repeatedly doesn't keep re-compressing (and quality-degrading)
// the same already-optimized file.

import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'images', 'uploads');
const MANIFEST_PATH = path.join(UPLOADS_DIR, '.optimize-manifest.json');
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 78;
const PNG_QUALITY = 80;
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return []; // nothing uploaded yet — fine
    throw err;
  }

  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

async function loadManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

async function saveManifest(manifest) {
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

async function optimizeOne(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const original = await readFile(filePath);
  const image = sharp(original);
  const metadata = await image.metadata();

  const needsResize = (metadata.width ?? 0) > MAX_WIDTH;
  const pipeline = needsResize ? image.resize({ width: MAX_WIDTH }) : image;

  const encoded =
    ext === '.png'
      ? await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toBuffer()
      : await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();

  // Only overwrite if we actually made it smaller — never risk bloating
  // a file that was already efficiently encoded.
  if (encoded.length < original.length) {
    await writeFile(filePath, encoded);
    return { before: original.length, after: encoded.length, wrote: true };
  }
  return { before: original.length, after: original.length, wrote: false };
}

async function main() {
  const files = await walk(UPLOADS_DIR);

  if (files.length === 0) {
    console.log('[optimize-images] No uploads found yet — nothing to do.');
    return;
  }

  const manifest = await loadManifest();
  let processed = 0;
  let savedBytes = 0;

  for (const filePath of files) {
    const key = path.relative(UPLOADS_DIR, filePath);
    const fileStat = await stat(filePath);
    const fingerprint = `${fileStat.size}:${fileStat.mtimeMs}`;

    if (manifest[key] === fingerprint) {
      continue; // already optimized at this exact size/mtime — skip
    }

    const result = await optimizeOne(filePath);
    processed++;
    if (result.wrote) {
      savedBytes += result.before - result.after;
      const pct = Math.round((1 - result.after / result.before) * 100);
      console.log(`  \u2713 ${key} \u2014 ${pct}% smaller`);
    }

    // Re-stat after a possible overwrite so the manifest reflects the
    // final on-disk state, not the pre-optimization one.
    const finalStat = await stat(filePath);
    manifest[key] = `${finalStat.size}:${finalStat.mtimeMs}`;
  }

  await saveManifest(manifest);

  if (processed === 0) {
    console.log(`[optimize-images] ${files.length} image(s) already optimized, nothing to do.`);
  } else {
    console.log(
      `[optimize-images] Processed ${processed} image(s), ~${(savedBytes / 1024).toFixed(0)}KB saved.`
    );
  }
}

main().catch((err) => {
  console.error('[optimize-images] Failed:', err);
  // Non-fatal: don't block a deploy over an image optimization hiccup.
  process.exit(0);
});
