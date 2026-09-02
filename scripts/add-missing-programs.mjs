#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";

const fp = "src/lib/seed/university-programs.ts";
let content = readFileSync(fp, "utf8");

// Universities that already have programs
const hasPrograms = new Set();
const matches = content.matchAll(/universityId: "([^"]+)"/g);
for (const m of matches) hasPrograms.add(m[1]);

console.log(`Already have programs: ${hasPrograms.size} universities`);

// All university IDs from seed data
const allUnis = [
  "u-bsu", "u-ada", "u-adcu", "u-gsu", "u-gtu-tech", "u-nmu", "u-amu",
  "u-unec", "u-wu", "u-khazar", "u-beu", "u-adpu", "u-lsu", "u-mgu",
  "u-asoiu", "u-atu", "u-bslu", "u-adlu", "u-bma", "u-acu", "u-asa",
  "u-ku", "u-tau", "u-paida", "u-adda", "u-maa", "u-bhos", "u-atmu",
  "u-msu", "u-sechenov", "u-bxa", "u-ait", "u-wcu", "u-au", "u-oyu",
  "u-beur", "u-bgu", "u-acu", "u-bbu", "u-aalsra", "u-asau", "u-nsu",
  "u-nmi", "u-qu", "u-gsu",
];

const missing = allUnis.filter(id => !hasPrograms.has(id));
console.log(`Missing programs: ${missing.length} universities`);
console.log(missing.join(", "));

// Program templates per university type
const PROGRAMS = {
  // State universities - affordable
  default: [
    { pid: "p-cs-bach", lang: "en", fee: 1500 },
    { pid: "p-econ-bach", lang: "az", fee: 1000 },
    { pid: "p-law-bach", lang: "az", fee: 1200 },
  ],
  // Medical
  medical: [
    { pid: "p-med-bach", lang: "en", fee: 3000 },
    { pid: "p-dent-bach", lang: "en", fee: 3500 },
  ],
  // Technical
  technical: [
    { pid: "p-cs-bach", lang: "en", fee: 2000 },
    { pid: "p-eng-bach", lang: "en", fee: 1800 },
  ],
  // Private - higher fees
  private: [
    { pid: "p-cs-bach", lang: "en", fee: 4000 },
    { pid: "p-mba-mast", lang: "en", fee: 6000 },
    { pid: "p-law-bach", lang: "en", fee: 3500 },
  ],
  // Arts/Culture
  arts: [
    { pid: "p-art-bach", lang: "az", fee: 1000 },
    { pid: "p-music-bach", lang: "az", fee: 1200 },
  ],
  // Education
  education: [
    { pid: "p-edu-bach", lang: "az", fee: 800 },
    { pid: "p-psych-bach", lang: "az", fee: 900 },
  ],
};

// University-specific program assignments
const UNI_PROGRAMS = {
  "u-adcu": "default",     // Architecture & Construction
  "u-gsu": "default",      // Ganja State
  "u-gtu-tech": "technical", // Technology
  "u-nmu": "medical",      // Nakhchivan Medical
  "u-adpu": "education",   // Pedagogical
  "u-lsu": "default",      // Lankaran State
  "u-mgu": "default",      // Mingachevir State
  "u-atu": "technical",    // Technical
  "u-bslu": "default",     // Slavic
  "u-adlu": "default",     // Languages
  "u-bma": "arts",         // Music Academy
  "u-acu": "default",      // Culture & Arts
  "u-asa": "arts",         // Academy of Arts
  "u-ku": "arts",          // Conservatory
  "u-tau": "technical",    // Turkey-Azerbaijan
  "u-paida": "default",    // Sports Academy
  "u-adda": "technical",   // Maritime Academy
  "u-maa": "technical",    // Aviation Academy
  "u-atmu": "default",     // Tourism
  "u-msu": "default",      // Lomonosov MSU
  "u-sechenov": "medical", // Sechenov
  "u-bxa": "arts",         // Choreography
  "u-ait": "default",      // Theology
  "u-wcu": "private",      // Western Caspian
  "u-au": "private",       // Azerbaijan University
  "u-oyu": "private",      // Odlar Yurdu
  "u-beur": "default",     // Eurasian
  "u-bgu": "education",    // Girls University
  "u-bbu": "private",      // Business
  "u-aalsra": "default",   // Labor Academy
  "u-asau": "default",     // Agricultural
  "u-nsu": "default",      // Nakhchivan State
  "u-nmi": "education",    // Teachers Institute
  "u-qu": "default",       // Karabakh
  "u-gsu": "default",      // Ganja State (duplicate)
};

let count = 0;
const newEntries = [];

for (const uid of missing) {
  const type = UNI_PROGRAMS[uid] || "default";
  const progs = PROGRAMS[type];

  for (const p of progs) {
    newEntries.push(`  {
    id: "up-${uid.replace("u-", "")}-${p.pid.replace("p-", "").replace("-bach", "").replace("-mast", "")}",
    universityId: "${uid}",
    programId: "${p.pid}",
    language: "${p.lang}",
    tuitionFee: ${p.fee},
    currency: "USD",
    scholarshipAvailable: true,
  },`);
    count++;
  }
}

// Insert before the closing ];
const closeIdx = content.lastIndexOf("];");
content = content.substring(0, closeIdx) + newEntries.join("\n") + "\n" + content.substring(closeIdx);

writeFileSync(fp, content, "utf8");
console.log(`\nAdded ${count} program entries for ${missing.length} universities`);
