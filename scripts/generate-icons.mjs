// scripts/generate-icons.mjs — SE-8: derive apple-icon.png + icon-192/512.png
// (maskable-friendly) from src/app/icon.svg. Run: node scripts/generate-icons.mjs
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = await readFile(join(root, "src/app/icon.svg"));

// Apple touch icon: 180x180, full-bleed square (iOS applies its own mask).
await sharp(svg)
  .resize(180, 180)
  .png()
  .toFile(join(root, "src/app/apple-icon.png"));

// PWA maskable icons: safe zone is 80% of the canvas, so add padding.
const maskable = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="#003d9b"/>
    <g transform="translate(76 76) scale(5.625)">
      <rect width="64" height="64" rx="14" fill="#003d9b"/>
      <path fill="#fb7800" d="M32 16 54 26 32 36 10 26z"/>
      <path fill="#fff" d="M18 30v8c0 3.3 6.3 6 14 6s14-2.7 14-6v-8l-14 7z"/>
      <path fill="#fff" d="M50 27v7h2v-7z"/>
    </g>
  </svg>`,
);
await sharp(maskable)
  .resize(512, 512)
  .png()
  .toFile(join(root, "public/icon-512.png"));
await sharp(maskable)
  .resize(192, 192)
  .png()
  .toFile(join(root, "public/icon-192.png"));

console.log(
  "generated: src/app/apple-icon.png, public/icon-512.png, public/icon-192.png",
);
