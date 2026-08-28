// scripts/optimize-images.mjs — convert all JPGs under public/images to WebP.
// PERF: 93 JPGs (~12.7MB) served as origin images. WebP at q=80 with a sane
// max width cuts both origin weight and next/image optimizer cost.
// Idempotent: skips files that already have a .webp sibling.
import {
  readFileSync,
  writeFileSync,
  renameSync,
  readdirSync,
  existsSync,
  unlinkSync,
} from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "public", "images");

const MAX_WIDTH = 1600;
const QUALITY = 80;

let processed = 0;
let skipped = 0;
let beforeTotal = 0;
let afterTotal = 0;

async function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(p);
      continue;
    }
    if (!/\.jpe?g$/i.test(entry.name)) continue;
    const webp = p.replace(/\.jpe?g$/i, ".webp");
    if (existsSync(webp)) {
      skipped++;
      continue;
    }
    try {
      const buf = readFileSync(p);
      const out = await sharp(buf)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer();
      const tmp = webp + ".tmp";
      writeFileSync(tmp, out);
      renameSync(tmp, webp);
      unlinkSync(p);
      processed++;
      beforeTotal += buf.length;
      afterTotal += out.length;
      console.log(
        `✓ ${p.replace(ROOT, "")}: ${Math.round(buf.length / 1024)}KB → ${Math.round(out.length / 1024)}KB`,
      );
    } catch (e) {
      console.log(`skip ${p}: ${e.message}`);
    }
  }
}

await walk(ROOT);
console.log(
  `\n✓ converted ${processed} JPG(s), skipped ${skipped}. ` +
    `${(beforeTotal / 1048576).toFixed(1)}MB → ${(afterTotal / 1048576).toFixed(1)}MB ` +
    `(−${Math.round((1 - afterTotal / Math.max(beforeTotal, 1)) * 100)}%)`,
);
