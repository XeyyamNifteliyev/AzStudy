#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
let content = readFileSync(filePath, 'utf8');

const trNames = {
  'Ganja State Technological University': 'Gence Devlet Teknoloji Üniversitesi',
  'Nakhchivan Medical University': 'Nahcivan Tibb Üniversitesi',
  'Azerbaijan State Oil and Industry University': 'Azerbaycan Devlet Petrol ve Sanayi Üniversitesi',
  'Baku Slavic University': 'Bakı Slav Üniversitesi',
  'Azerbaijan University of Languages': 'Azerbaycan Diller Üniversitesi',
  'Baku Music Academy': 'Bakı Müzik Akademisi',
  'Azerbaijan State University of Culture and Arts': 'Azerbaycan Devlet Kültür ve Sanat Üniversitesi',
  'Azerbaijan State Academy of Arts': 'Azerbaycan Devlet Güzel Sanatlar Akademisi',
  'Azerbaijan National Conservatory': 'Azerbaycan Milli Konservatuvarı',
  'Azerbaijan State Sports Academy': 'Azerbaycan Devlet Beden Terbiyesi ve Spor Akademisi',
  'Presidential Academy of Public Administration': 'Azerbaycan Cumhurbaşkanlığı Devlet İdarecilik Akademisi',
  'Azerbaijan State Maritime Academy': 'Azerbaycan Devlet Deniz Akademisi',
  'Azerbaijan Tourism and Management University': 'Azerbaycan Turizm ve Yönetim Üniversitesi',
  'Lomonosov Moscow State University Baku Branch': 'Lomonosov Moskova Devlet Üniversitesi Bakı Şubesi',
  'Sechenov First Moscow Medical University Baku Branch': 'Seçenov Birinci Moskova Devlet Tıp Üniversitesi Bakı Şubesi',
  'Baku Choreography Academy': 'Bakı Koreografi Akademisi',
  'Azerbaijan Institute of Theology': 'Azerbaycan İlahiyat Enstitüsü',
  'Azerbaijan University': 'Azerbaycan Üniversitesi',
  'Odlar Yurdu University': 'Odlar Yurdu Üniversitesi',
  'Baku Eurasian University': 'Bakı Avrasya Üniversitesi',
  'Baku Girls University': 'Bakı Kız Üniversitesi',
  'Azerbaijan Cooperative University': 'Azerbaycan Kooperatif Üniversitesi',
  'Baku Business University': 'Bakı İşletme Üniversitesi',
  'Azerbaijan Academy of Labor and Social Relations': 'Azerbaycan Emek ve Sosyal İlişkiler Akademisi',
  'Azerbaijan State Agricultural University': 'Azerbaycan Devlet Tarım Üniversitesi',
  'Nakhchivan State University': 'Nahcivan Devlet Üniversitesi',
  'Nakhchivan Teachers Institute': 'Nahcivan Öğretmenler Enstitüsü',
  'Karabakh University': 'Karabağ Üniversitesi'
};

// For each missing university, find the nameI18n block and add tr: after en:
for (const [enName, trName] of Object.entries(trNames)) {
  // Find the nameI18n block for this university
  const pattern = new RegExp(
    `(nameI18n:\\s*\\{[^}]*en:\\s*'${enName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}')`,
    'm'
  );
  
  if (!pattern.test(content)) {
    console.log(`⚠️ Not found: ${enName}`);
    continue;
  }
  
  // Check if tr already exists
  const blockRe = new RegExp(
    `(nameI18n:\\s*\\{[^}]*en:\\s*'${enName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[^}]*\\})`,
    'm'
  );
  const blockMatch = content.match(blockRe);
  
  if (blockMatch && blockMatch[0].includes('tr:')) {
    console.log(`✅ ${enName}: tr already exists`);
    continue;
  }
  
  // Find the en line and add tr after it
  const enLineRe = new RegExp(
    `(en:\\s*'${enName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}')`,
    'm'
  );
  
  content = content.replace(enLineRe, `$1,\n      tr: '${trName}'`);
  console.log(`✅ ${enName}: added tr`);
}

writeFileSync(filePath, content, 'utf8');
console.log('\n✅ All Turkish names added!');
