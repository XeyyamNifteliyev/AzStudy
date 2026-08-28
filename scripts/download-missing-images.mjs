import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

const LOGO_DIR = 'public/images/universities/logos';
const HERO_DIR = 'public/images/universities';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      const size = fs.statSync(dest).size;
      if (size > 726) {
        console.log(`  SKIP (already ${size}B): ${path.basename(dest)}`);
        return resolve();
      }
    }
    const timer = setTimeout(() => reject(new Error('timeout')), 15000);
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        clearTimeout(timer);
        let loc = res.headers.location;
        if (loc.startsWith('/')) loc = new URL(url).origin + loc;
        download(loc, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        clearTimeout(timer);
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const ws = fs.createWriteStream(dest);
      res.pipe(ws);
      ws.on('finish', () => { clearTimeout(timer); resolve(); });
      ws.on('error', (e) => { clearTimeout(timer); reject(e); });
    });
    req.on('error', (e) => { clearTimeout(timer); reject(e); });
  });
}

// Universities needing logos (generic favicon) and hero images
const downloads = [
  // === LOGOS ===
  // 1. İlahiyyat
  { slug: 'azerbaijan-institute-theology', type: 'logo', url: 'https://ait.edu.az/images/favicon/favicon-32x32.png' },
  // 2. İdman
  { slug: 'azerbaijan-state-sports-academy', type: 'logo', url: 'https://sport.edu.az/favicon.png' },
  // 3. Dəniz
  { slug: 'azerbaijan-state-maritime-academy', type: 'logo', url: 'https://adda.edu.az/template/images/logo/logo_az.png?v=1.4' },
  // 4. Turizm
  { slug: 'azerbaijan-tourism-management-university', type: 'logo', url: 'https://atmu.edu.az/assets/theme/img/logo.png?v1.2' },
  // 5. ADA - use SVG
  { slug: 'azerbaijan-diplomatic-academy', type: 'logo', url: 'https://www.ada.edu.az/assets/img/logo.svg' },
  // 6. Memarlıq - use main logo
  { slug: 'azerbaijan-university-architecture-construction', type: 'logo', url: 'https://azmiu.edu.az/img/logo.png' },
  // 7. Bakı Musiqi
  { slug: 'baku-music-academy', type: 'logo', url: 'https://musicacademy.edu.az/images/logo.png' },
  // 8. Lənkəran
  { slug: 'lankaran-state-university', type: 'logo', url: 'https://lsu.edu.az/new/logo.jpg' },
  // 9. Konservatoriya
  { slug: 'azerbaijan-national-conservatory', type: 'logo', url: 'https://amu.edu.az/extra-images/logoaz.png?v=2' },
  // 10. Türkiyə-Azərbaycan
  { slug: 'turkey-azerbaijan-university', type: 'logo', url: 'https://tau.edu.az/uploads/settings/logo69d5853bb4c27.svg' },
  // 11. MSU Bakı
  { slug: 'lomonosov-moscow-state-university-baku', type: 'logo', url: 'https://msu.az/i/favicons/android-icon-192x192.png' },
  // 12. Bakı Biznes
  { slug: 'baku-business-university', type: 'logo', url: 'https://bbu.edu.az/images/favicon.ico' },
  // 13. Mingəçevir - use MSU logo (different from MSU Bakı)
  { slug: 'mingachevir-state-university', type: 'logo', url: 'https://msu.edu.az/favicon.ico' },

  // === HERO IMAGES ===
  // 1. Dəniz Akademiyası
  { slug: 'azerbaijan-state-maritime-academy', type: 'hero', url: 'https://adda.edu.az/uploads/puzzle/Denizcilik-akademiyasi.png' },
  // 2. Turizm
  { slug: 'azerbaijan-tourism-management-university', type: 'hero', url: 'https://atmu.edu.az/upload/2020/01/31//-5133aa1d158046758252576630110489263.png' },
  // 3. Memarlıq - article image
  { slug: 'azerbaijan-university-architecture-construction', type: 'hero', url: 'https://azmiu.edu.az/upload/articles/1785404638819948210.jpg' },
  // 4. Musiqi - slider
  { slug: 'baku-music-academy', type: 'hero', url: 'https://musicacademy.edu.az/images/slider3/1a.jpg' },
  // 5. Türkiyə-Azərbaycan
  { slug: 'turkey-azerbaijan-university', type: 'hero', url: 'https://tau.edu.az/uploads/homePage/69f9847006935.png' },
  // 6. MSU Bakı - banner
  { slug: 'lomonosov-moscow-state-university-baku', type: 'hero', url: 'https://msu.az/assets/i/banners/open-doors-2026.png' },
  // 7. Bakı Mühəndislik (hero is tiny)
  { slug: 'baku-engineering-university', type: 'hero', url: 'https://beu.edu.az/images/hero.jpg' },
];

async function main() {
  let success = 0;
  let failed = 0;

  for (const dl of downloads) {
    let dest;
    if (dl.type === 'logo') {
      const ext = dl.url.endsWith('.svg') ? '.svg' : dl.url.endsWith('.ico') ? '.ico' : '.png';
      dest = path.join(LOGO_DIR, `${dl.slug}-logo${ext}`);
    } else {
      const dir = path.join(HERO_DIR, dl.slug);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const ext = dl.url.endsWith('.png') ? '.png' : '.jpg';
      dest = path.join(dir, `hero${ext}`);
    }

    try {
      await download(dl.url, dest);
      const size = fs.statSync(dest).size;
      if (size > 726) {
        console.log(`✅ ${dl.type}: ${dl.slug} (${size} bytes)`);
        success++;
      } else {
        console.log(`⚠️  ${dl.type}: ${dl.slug} too small (${size} bytes) — may be placeholder`);
        success++;
      }
    } catch (e) {
      console.log(`❌ ${dl.type}: ${dl.slug} — ${e.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} success, ${failed} failed`);
}

main();
