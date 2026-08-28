import fs from 'fs';
import path from 'path';

const msgsDir = path.join(process.cwd(), 'src', 'messages');

const badges = {
  en: 'Free Application',
  az: 'Pulsuz müraciət',
  tr: 'Ücretsiz Başvuru',
  ru: 'Бесплатная заявка',
  de: 'Kostenlose Bewerbung',
  fr: 'Candidature gratuite',
  ar: 'طلب مجاني',
  fa: 'درخواست رایگان',
  zh: '免费申请',
  bg: 'Безплатна заявка',
  ur: 'مفت درخواست',
  uz: "Bepul ariza",
  sw: 'Maombi ya Bure',
  so: 'Codsi Bilaash ah',
  id: 'Aplikasi Gratis',
  tk: 'Mugsuz arza',
  kk: 'Тегін өтініш',
  ky: 'Бекер арыз берүү',
};

let updated = 0;
for (const [locale, badge] of Object.entries(badges)) {
  const filePath = path.join(msgsDir, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${locale}: file not found`);
    continue;
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const obj = JSON.parse(raw);
  
  if (!obj.HomePage) {
    console.log(`Skipping ${locale}: no HomePage`);
    continue;
  }
  if (!obj.HomePage.cta) {
    console.log(`Skipping ${locale}: no HomePage.cta`);
    continue;
  }
  if (obj.HomePage.cta.badge) {
    console.log(`Skipping ${locale}: badge already exists`);
    continue;
  }
  
  // Add badge as the first key in the cta object
  const newCta = { badge, ...obj.HomePage.cta };
  obj.HomePage.cta = newCta;
  
  // Write back with same formatting (2-space indent)
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  console.log(`Updated ${locale}: added badge="${badge}"`);
  updated++;
}

console.log(`\nDone: ${updated} files updated`);
