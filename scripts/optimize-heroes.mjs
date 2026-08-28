// scripts/optimize-heroes.mjs — recompress all university hero.webp to ≤1200px, q=75
// PERF-A: cankaya was 3.3MB, kadir-has 1.47MB — LCP killers. This normalizes.
// Reads via fs buffer (avoids Windows/OneDrive file-lock issues with sharp's
// direct file IO), writes a temp file, then renames over the original.
import {
  readFileSync,
  writeFileSync,
  renameSync,
  readdirSync,
  existsSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const base = join(root, "public", "images", "universities");

const WIDTH = 1200;
const QUALITY = 75;

let total = 0;
let processed = 0;
for (const dir of readdirSync(base, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const hero = join(base, dir.name, "hero.webp");
  if (!existsSync(hero)) continue;
  try {
    const buf = readFileSync(hero);
    const before = buf.length;
    const out = await sharp(buf)
      .resize({ width: WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();
    const tmp = hero + ".tmp";
    writeFileSync(tmp, out);
    renameSync(tmp, hero);
    total += out.length;
    processed++;
    console.log(
      `✓ ${dir.name}: ${Math.round(before / 1024)}KB → ${Math.round(out.length / 1024)}KB`,
    );
  } catch (e) {
    console.log(`skip ${dir.name}: ${e.message}`);
  }
}
console.log(
  `\n✓ optimized ${processed} heroes, total ${Math.round(total / 1024 / 1024)}MB`,
);
