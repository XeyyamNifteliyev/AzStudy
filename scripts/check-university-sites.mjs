import https from 'https';
import http from 'http';

const universities = [
  // HERO MISSING
  { slug: 'azerbaijan-institute-theology', name: 'Azərbaycan İlahiyyat İnstitutu', url: 'https://ait.edu.az' },
  { slug: 'azerbaijan-state-sports-academy', name: 'Azərbaycan İdman Akademiyası', url: 'https://sport.edu.az' },
  { slug: 'baku-eurasian-university', name: 'Bakı Avrasiya Universiteti', url: 'https://baeu.edu.az' },
  { slug: 'lomonosov-moscow-state-university-baku', name: 'MSU Bakı Filialı', url: 'https://msu.az' },
  // HERO TINY
  { slug: 'baku-engineering-university', name: 'Bakı Mühəndislik Universiteti', url: 'https://beu.edu.az' },
  // LOGOS GENERIC (573-726B)
  { slug: 'mingachevir-state-university', name: 'Mingəçevir Dövlət Universiteti', url: 'https://msu.edu.az' },
  { slug: 'baku-business-university', name: 'Bakı Biznes Universiteti', url: 'https://bbu.edu.az' },
  { slug: 'baku-girls-university', name: 'Bakı Qızlar Universiteti', url: 'https://bgu.edu.az' },
  { slug: 'azerbaijan-state-academy-arts', name: 'Azərbaycan Rəssamlıq Akademiyası', url: 'https://adra.edu.az' },
  { slug: 'azerbaijan-state-maritime-academy', name: 'Azərbaycan Dəniz Akademiyası', url: 'https://adda.edu.az' },
  { slug: 'azerbaijan-academy-labor-social-relations', name: 'Əmək Akademiyası', url: 'https://asma.edu.az' },
  { slug: 'azerbaijan-tourism-management-university', name: 'Turizm Universiteti', url: 'https://atmu.edu.az' },
  { slug: 'azerbaijan-diplomatic-academy', name: 'ADA Universiteti', url: 'https://www.ada.edu.az' },
  { slug: 'azerbaijan-university-architecture-construction', name: 'Memarlıq Universiteti', url: 'https://azmiu.edu.az' },
  { slug: 'baku-music-academy', name: 'Bakı Musiqi Akademiyası', url: 'https://musicacademy.edu.az' },
  { slug: 'gance-state-technological-university', name: 'Gəncə Texnologiya', url: 'https://gtu.edu.az' },
  { slug: 'lankaran-state-university', name: 'Lənkəran Dövlət Universiteti', url: 'https://lsu.edu.az' },
  // EXTRA MISSING
  { slug: 'azerbaijan-national-conservatory', name: 'Milli Konservatoriya', url: 'https://amu.edu.az' },
  { slug: 'turkey-azerbaijan-university', name: 'Türkiyə-Azərbaycan Universiteti', url: 'https://tau.edu.az' },
];

async function fetchPage(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), timeout);
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { 
      timeout,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      followRedirects: true,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        clearTimeout(timer);
        fetchPage(res.headers.location, timeout).then(resolve).catch(reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { clearTimeout(timer); resolve(data); });
    });
    req.on('error', (e) => { clearTimeout(timer); reject(e); });
    req.on('timeout', () => { req.destroy(); clearTimeout(timer); reject(new Error('timeout')); });
  });
}

function extractImages(html) {
  const logos = [];
  const heroes = [];
  
  // Logo patterns
  const logoPatterns = [
    /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/gi,
    /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/gi,
    /<img[^>]*(?:logo|brand)[^>]*src=["']([^"']+)["']/gi,
    /<img[^>]*src=["']([^"']+)["'][^>]*(?:logo|brand)/gi,
  ];
  
  // Hero/header/banner patterns
  const heroPatterns = [
    /<img[^>]*(?:hero|banner|header|campus|university)[^>]*src=["']([^"']+)["']/gi,
    /<img[^>]*src=["']([^"']+)["'][^>]*(?:hero|banner|header|campus)/gi,
    /background-image:\s*url\(["']?([^"')]+)["']?\)/gi,
    /class=["'][^"']*(?:hero|banner|header)[^"']*["'][^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["']/gi,
  ];
  
  for (const pattern of logoPatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      logos.push(match[1]);
    }
  }
  
  for (const pattern of heroPatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      heroes.push(match[1]);
    }
  }
  
  return { logos: [...new Set(logos)].slice(0, 5), heroes: [...new Set(heroes)].slice(0, 5) };
}

async function main() {
  for (const uni of universities) {
    try {
      const html = await fetchPage(uni.url);
      const { logos, heroes } = extractImages(html);
      console.log(`\n✅ ${uni.name} (${uni.slug})`);
      console.log(`   URL: ${uni.url}`);
      if (logos.length > 0) console.log(`   LOGOS: ${logos.join(', ')}`);
      else console.log(`   LOGOS: (tapılmadı)`);
      if (heroes.length > 0) console.log(`   HEROES: ${heroes.join(', ')}`);
      else console.log(`   HEROES: (tapılmadı)`);
    } catch (e) {
      console.log(`\n❌ ${uni.name} (${uni.slug})`);
      console.log(`   URL: ${uni.url}`);
      console.log(`   XƏTA: ${e.message}`);
    }
  }
}

main();
