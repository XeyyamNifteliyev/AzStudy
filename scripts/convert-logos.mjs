// scripts/convert-logos.mjs — convert university logo PNGs to WebP (PERF §12.4-H).
// Keeps transparency (sharp handles alpha for webp by default).
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  renameSync,
  existsSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, "..", "public", "images", "universities", "logos");

let processed = 0;
let beforeTotal = 0;
let afterTotal = 0;

for (const f of readdirSync(dir)) {
  if (!/\.png$/i.test(f)) continue;
  const webp = join(dir, f.replace(/\.png$/i, ".webp"));
  if (existsSync(webp)) continue;
  const src = join(dir, f);
  try {
    const buf = readFileSync(src);
    // Logos are small and depicted at ~40px in cards; 200px is plenty of
    // headroom for the optimizer to downscale without quality loss.
    const out = await sharp(buf)
      .resize({ width: 200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    const tmp = webp + ".tmp";
    writeFileSync(tmp, out);
    renameSync(tmp, webp);
    processed++;
    beforeTotal += buf.length;
    afterTotal += out.length;
    console.log(
      `✓ ${f}: ${Math.round(buf.length / 1024)}KB → ${Math.round(out.length / 1024)}KB`,
    );
  } catch (e) {
    console.log(`skip ${f}: ${e.message}`);
  }
}

console.log(
  `\n✓ converted ${processed} PNG logo(s). ` +
    `${(beforeTotal / 1048576).toFixed(2)}MB → ${(afterTotal / 1048576).toFixed(2)}MB ` +
    `(−${Math.round((1 - afterTotal / Math.max(beforeTotal, 1)) * 100)}%)`,
);
