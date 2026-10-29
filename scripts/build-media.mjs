// Generates optimized web media from the untouched originals in source/media.
//
//   npm run media            -> only builds what is missing
//   npm run media -- --force -> rebuilds everything
//
// Output: public/media/<id>/...  and  src/data/media-manifest.json
//         public/media/petr/...  and  src/data/portrait-manifest.json (portraits from source/img)
import { execFileSync } from "node:child_process";
import { copyFile, mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "source", "media");
const OUT = path.join(ROOT, "public", "media");
const MANIFEST = path.join(ROOT, "src", "data", "media-manifest.json");
const FORCE = process.argv.includes("--force");

/** Portrait crops of Petr, cut from the originals in source/img (pixel boxes in the original). */
const PORTRAITS = {
  hero: { file: "petr-hoodie.png", crop: { left: 440, top: 0, width: 787, height: 984 } },
  avatar: { file: "petr-hoodie.png", crop: { left: 610, top: 10, width: 520, height: 520 } },
  about: { file: "petr-suit.png", crop: { left: 200, top: 60, width: 875, height: 1094 } },
};
const PORTRAIT_WIDTHS = [160, 480, 768, 1080];

/** Responsive widths for the still artwork. Widths above the original are skipped. */
const IMAGE_WIDTHS = [480, 768, 1080, 1536];
/** Responsive widths for the 16:9 video poster frames. */
const POSTER_WIDTHS = [640, 1280];
/** Poster frame time: the typographic layout frame of each motion study. */
const POSTER_TIME = "00:00:04.20";

const fresh = async (target, source) => {
  if (FORCE || !existsSync(target)) return false;
  const [t, s] = await Promise.all([stat(target), stat(source)]);
  return t.mtimeMs >= s.mtimeMs;
};

async function writeVariants(input, dir, base, widths, maxWidth) {
  // Every listed width that fits, plus the native width so the largest variant is never upscaled or lost.
  const unique = [...new Set([...widths.filter((w) => w <= maxWidth), maxWidth])].sort((a, b) => a - b);
  for (const w of unique) {
    const avif = path.join(dir, `${base}-${w}.avif`);
    const webp = path.join(dir, `${base}-${w}.webp`);
    if (!(await fresh(avif, input))) {
      await sharp(input).resize({ width: w }).avif({ quality: 52, effort: 5 }).toFile(avif);
    }
    if (!(await fresh(webp, input))) {
      await sharp(input).resize({ width: w }).webp({ quality: 78 }).toFile(webp);
    }
  }
  return unique;
}

async function dominant(input) {
  // Average color, used as the placeholder behind images while they load.
  const { data } = await sharp(input).resize(1, 1).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return `#${[...data].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

async function main() {
  const files = await readdir(SRC);
  const ids = [...new Set(files.filter((f) => /^\d+\.jpg$/.test(f)).map((f) => f.split(".")[0]))].sort();
  const manifest = {};

  for (const id of ids) {
    const dir = path.join(OUT, id);
    await mkdir(dir, { recursive: true });
    const jpg = path.join(SRC, `${id}.jpg`);
    const gif = path.join(SRC, `${id}.gif`);
    const mp4 = path.join(SRC, `${id}.mp4`);

    const meta = await sharp(jpg).metadata();
    const imageWidths = await writeVariants(jpg, dir, "image", IMAGE_WIDTHS, meta.width);

    // Full-resolution original for the image viewer (byte-identical copy).
    const full = path.join(dir, "full.jpg");
    if (!(await fresh(full, jpg))) await copyFile(jpg, full);

    const entry = {
      width: meta.width,
      height: meta.height,
      color: await dominant(jpg),
      imageWidths,
      gif: null,
      video: null,
    };

    if (existsSync(gif)) {
      const target = path.join(dir, "motion.gif");
      if (!(await fresh(target, gif))) await copyFile(gif, target);
      const g = await sharp(gif).metadata();
      entry.gif = { width: g.width, height: g.pageHeight ?? g.height };
    }

    if (existsSync(mp4)) {
      const target = path.join(dir, "motion.mp4");
      if (!(await fresh(target, mp4))) await copyFile(mp4, target);
      const posterJpg = path.join(dir, "poster.jpg");
      if (!(await fresh(posterJpg, mp4))) {
        execFileSync(ffmpegPath, [
          "-hide_banner", "-loglevel", "error", "-y",
          "-ss", POSTER_TIME, "-i", mp4, "-frames:v", "1", "-q:v", "3", posterJpg,
        ]);
      }
      const p = await sharp(posterJpg).metadata();
      const posterWidths = await writeVariants(posterJpg, dir, "poster", POSTER_WIDTHS, p.width);
      entry.video = { width: p.width, height: p.height, duration: 5, posterWidths };
    }

    manifest[id] = entry;
    process.stdout.write(`media ${id} ✓\n`);
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(manifest).length} entries to ${path.relative(ROOT, MANIFEST)}`);
}

async function portraits() {
  const dir = path.join(OUT, "petr");
  await mkdir(dir, { recursive: true });
  await mkdir(path.join(ROOT, "source", "img", "crops"), { recursive: true });
  const out = {};
  for (const [name, { file, crop }] of Object.entries(PORTRAITS)) {
    const input = path.join(ROOT, "source", "img", file);
    const cropped = path.join(ROOT, "source", "img", "crops", `${name}.png`);
    if (!(await fresh(cropped, input))) await sharp(input).extract(crop).png().toFile(cropped);
    const widths = await writeVariants(cropped, dir, name, PORTRAIT_WIDTHS, crop.width);
    out[name] = { width: crop.width, height: crop.height, color: await dominant(cropped), imageWidths: widths };
    process.stdout.write(`portrait ${name} ✓\n`);
  }
  const target = path.join(ROOT, "src", "data", "portrait-manifest.json");
  await writeFile(target, JSON.stringify(out, null, 2) + "\n");
}

main().then(portraits).catch((err) => {
  console.error(err);
  process.exit(1);
});
