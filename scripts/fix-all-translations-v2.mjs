#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const AL = ['en','tr','az','ru','de','fr','zh','ar','fa','tk','kk','ky','bg','ur','uz','sw','so','id'];

const blogTitleTranslations = {
  "top-10-must-visit-places-in-azerbaijan": {de:"Die besten Reiseziele in Aserbaidschan",fr:"Meilleures destinations en Azerba\u00efdjan",zh:"\u963f\u585e\u62dc\u7586\u6700\u4f73\u65c5\u6e38\u76ee\u7684\u5730",ar:"\u0623\u0641\u0636\u0644 \u0645\u0639\u0627\u0644\u0645 \u0627\u0644\u0633\u064a\u0627\u062d\u0629 \u0641\u064a \u0623\u0630\u0631\u0628\u0627\u064a\u062c\u0627\u0646",fa:"\u0628\u0647\u062a\u0631\u06cc\u0646 \u0645\u0642\u0627\u0635\u062f \u0633\u06cc\u0627\u062d\u062a\u06cc \u0622\u0630\u0631\u0628\u0627\u06cc\u062c\u0627\u0646",tk:"Azerba\u00fdjandy\u0148 i\u0148 i\u00fdi sy\u00fdyahat merkezleri",kk:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d\u043d\u044b\u04a3 \u0435\u04a3 \u0436\u0430\u043a\u0441\u044b \u043e\u0440\u043d\u044b\u043b\u0430\u0440\u044b",ky:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0436\u0430\u043d\u0434\u044b\u043d \u044d\u043d \u0436\u0430\u043a\u0448\u0430 \u0436\u0430\u0439\u043b\u0430\u0440\u044b",bg:"\u041d\u0430\u0439-\u0434\u043e\u0431\u0440\u0438\u0442\u0438 \u0434\u0435\u0441\u0442\u0438\u043d\u0430\u0446\u0438\u0438",ur:"\u0622\u0630\u0631\u0628\u0627\u0626\u06cc\u062c\u0627\u0646 \u0645\u06cc\u06ba \u0628\u0647\u062a\u0631\u06cc\u0646 \u0633\u06cc\u0627\u062d\u062a\u06cc \u0645\u0642\u0627\u0645\u0639\u0627\u062a",uz:"Eng yaxshi sayohat joylari",sw:"Maeneo Bora ya Kusafiri",so:"Goobaha Ugu Fiican",id:"Destinasi Terbaik"},
  "student-life-in-baku-azerbaijan": {de:"Leben und Studium in Baku",fr:"Vivre et \u00e9tudier \u00e0 Bakou",zh:"\u5728\u5df4\u5e93\u5b66\u4e60\u548c\u751f\u6d3b",ar:"\u0627\u0644\u062d\u064a\u0627\u0629 \u0648\u0627\u0644\u062f\u0631\u0627\u0633\u0629 \u0641\u064a \u0628\u0627\u0643\u0648",fa:"\u0632\u0646\u062f\u06af\u06cc \u0648 \u062a\u062d\u0635\u06cc\u0644 \u062f\u0631 \u0628\u0627\u06a9\u0648",tk:"Bak\u00fadaky okuwalylar du\u00fdzy",kk:"\u0411\u0430\u043a\u044b\u0434\u0430\u0433\u044b \u0441\u0442\u0443\u0434\u0435\u043d\u0442\u0442\u0456\u043a \u0445\u044f\u043c\u044b",ky:"\u0411\u0430\u043a\u044b\u0434\u0430\u0433\u044b \u043e\u043a\u0443\u0443\u0447\u0443\u043b\u0430\u0440\u0442\u044b\u043d \u0442\u0443\u0440\u043c\u0443\u0448\u0443",bg:"\u0416\u0438\u0432\u043e\u0442 \u0438 \u0443\u0447\u0435\u043d\u0438\u0435 \u0432 \u0411\u0430\u043a\u0443",ur:"\u0628\u0627\u06a9\u0648 \u0645\u06cc\u06ba \u0637\u0627\u0644\u0628 \u0642\u0648\u0645 \u06a9\u0627 \u062d\u064a\u0627\u062a",uz:"Bokudagi talabalar hayoti",sw:"Maisha ya Wanafunzi Baku",so:"Nolaha Ardayga Baku",id:"Kehidupan Mahasiswa di Baku"},
  "best-universities-medicine-azerbaijan": {de:"Medizin in Aserbaidschan studieren",fr:"\u00c9tudier la m\u00e9decine en Azerba\u00efdjan",zh:"\u5728\u963f\u585e\u62dc\u7586\u5b66\u533b\u5b66",ar:"\u062f\u0631\u0627\u0633\u0629 \u0627\u0644\u0637\u0628 \u0641\u064a \u0623\u0630\u0631\u0628\u0627\u064a\u062c\u0627\u0646",fa:"\u062a\u062d\u0635\u06cc\u0644 \u067e\u0632\u0634\u06a9 \u062f\u0631 \u0622\u0630\u0631\u0628\u0627\u06cc\u062c\u0627\u0646",tk:"Azerba\u00fdjanda tibb bilimi okamak",kk:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d\u0434\u0430 \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0430 \u043e\u043a\u0443\u043f",ky:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0436\u0430\u043d\u0434\u0430 \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0430 \u043e\u043a\u0443\u0443",bg:"\u0421\u0442\u0443\u0434\u0438\u044f \u043d\u0430 \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0430",ur:"\u0622\u0630\u0631\u0628\u0627\u0626\u06cc\u062c\u0627\u0646 \u0645\u06cc\u06ba \u0637\u0628 \u06a9\u06cc \u062a\u0639\u0644\u06cc\u0645",uz:"Tibbiyot",sw:"Tiba",so:"Caafimaad",id:"Kedokteran"},
  "azerbaijan-best-budget-study-destination": {de:"Aserbaidschan g\u00fcnstiges Studienziel",fr:"Azerba\u00efdjan destination abordable",zh:"\u963f\u585e\u62dc\u7586\u7ecf\u6d4e\u578b\u7559\u5b66\u76ee\u7684\u5730",ar:"\u0623\u0630\u0631\u0628\u0627\u064a\u062c\u0627\u0646 \u0645\u0635\u0631\u0627\u0641 \u0644\u0644\u062f\u0631\u0627\u0633\u0629",fa:"\u0622\u0630\u0631\u0628\u0627\u06cc\u062c\u0627\u0646 \u0645\u0635\u0631\u0627\u0641\u200c\u062a\u0631\u06cc\u0646 \u062a\u062d\u0635\u06cc\u0644",tk:"Azerba\u00fdjan archan bilim merkezi",kk:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d \u0430\u0440\u0437\u0430\u043d \u0431\u0456\u043b\u0456\u043c \u043c\u04d9\u043a\u0435\u043d\u0435\u0441\u0456",ky:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0436\u0430\u043d \u0430\u0440\u0437\u0430\u043d \u0431\u0438\u043b\u0438\u043c \u043c\u0430\u043a\u0441\u0430\u0434\u044b",bg:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d \u0434\u043e\u0441\u0442\u044a\u043f\u0435\u043d \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u0435",ur:"\u0622\u0630\u0631\u0628\u0627\u0626\u06cc\u062c\u0627\u0646 \u0633\u0633\u062a\u06cc \u062a\u0639\u0644\u06cc\u0645\u06cc \u0645\u0642\u0627\u0635\u062f",uz:"Arzon ta'lim maskani",sw:"Nafuu kwa elimu",so:"Qiimo jaban waxbarasho",id:"Budget study destination"},
  "azerbaijani-culture-traditions-guide": {de:"Kultur und Traditionen Aserbaidschan",fr:"Culture et traditions azerba\u00efdjanaises",zh:"\u963f\u585e\u62dc\u7586\u6587\u5316\u548c\u4f20\u7edf\u6307\u5357",ar:"\u062f\u0644\u064a\u0644 \u0627\u0644\u062b\u0642\u0627\u0641\u0629 \u0648\u0627\u0644\u062a\u0642\u0627\u0644\u064a\u062f",fa:"\u0631\u0627\u0647\u0646\u0645\u0627\u06cc \u0641\u0631\u0647\u0646\u06af \u0648 \u0633\u0646\u062a\u200c\u0647\u0627\u06cc \u0622\u0630\u0631\u0628\u0627\u06cc\u062c\u0627\u0646",tk:"Azerba\u00fdjany\u0148 medeni\u00fdeti we gelenekleri",kk:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d \u043c\u04d9\u0434\u0435\u043d\u0438\u0435\u0442\u0456 \u043d\u0443\u0441\u043a\u0430\u0443\u043b\u044b\u0433\u044b",ky:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0436\u0430\u043d\u0434\u044b\u043d \u043c\u0430\u0434\u0430\u043d\u0438\u044f\u0442\u044b \u043d\u0443\u0441\u043a\u0430\u0443\u0441\u0443",bg:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d\u0441\u043a\u0430 \u043a\u0443\u043b\u0442\u0443\u0440\u0430",ur:"\u0622\u0630\u0631\u0628\u0627\u0626\u06cc\u062c\u0627\u0646\u06cc \u062b\u0642\u0627\u0641\u062a \u06af\u0627\u0646\u062c\u0647",uz:"Madaniyat va an'analar",sw:"Utamaduni na Mila",so:"Dhaqan iyo Dhaqan",id:"Panduan Budaya"},
  "azerbaijan-weather-climate-students": {de:"Wetter und Klima Aserbaidschan",fr:"M\u00e9t\u00e9o et climat Azerba\u00efdjan",zh:"\u963f\u585e\u62dc\u7586\u5929\u6c14\u548c\u6c14\u5019",ar:"\u0627\u0644\u0637\u0642\u0633 \u0641\u064a \u0623\u0630\u0631\u0628\u0627\u064a\u062c\u0627\u0646",fa:"\u0622\u0628 \u0648 \u0647\u0648\u0627\u06cc \u0622\u0630\u0631\u0628\u0627\u06cc\u062c\u0627\u0646",tk:"Azerba\u00fdjandy\u0148 howa we iklmy",kk:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d\u0434\u0430\u0493\u044b \u0430\u044b\u0430\u0439\u043b\u044b",ky:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0436\u0430\u043d\u0434\u044b\u043d \u0445\u0430\u0432\u0430\u0441\u044b",bg:"\u0412\u0440\u0435\u043c\u0435\u0442\u043e \u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d",ur:"\u0622\u0630\u0631\u0628\u0627\u0626\u06cc\u062c\u0627\u0646 \u0645\u06cc\u06ba \u0645\u0648\u0635\u0645",uz:"Ob-havo va iqlim",sw:"Hali ya Hewa",so:"Cimilada",id:"Cuaca dan Iklim"},
  "azerbaijan-vs-turkey-study-abroad": {de:"Aserbaidschan vs T\u00fcrkei",fr:"Azerba\u00efdjan vs Turquie",zh:"\u963f\u585e\u62dc\u7586vs\u571f\u8033\u5176",ar:"\u0623\u0630\u0631\u0628\u0627\u064a\u062c\u0627\u0646 \u0645\u0642\u0627\u0628\u0644\u0629 \u062a\u0631\u0643\u064a\u0627",fa:"\u0622\u0630\u0631\u0628\u0627\u06cc\u062c\u0627\u0646 \u062f\u0631 \u0628\u0631\u0627\u0628\u0631 \u062a\u0631\u06a9\u06cc\u0647",tk:"Azerba\u00fdjan we T\u00fcrki\u00e9",kk:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d \u0442\u0443\u0440\u0441\u0438\u044f\u043c\u0435\u043d",ky:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0436\u0430\u043d \u0422\u04af\u0440\u043a\u0438\u044f\u043c\u0435\u043d",bg:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d \u0441\u0440\u0435\u0449\u0443 \u0422\u0443\u0440\u0446\u0438\u044f",ur:"\u0622\u0630\u0631\u0628\u0627\u0626\u06cc\u062c\u0627\u0646 \u0628\u0646\u0627\u0645\u0647 \u062a\u0631\u06a9\u06cc\u0647",uz:"Ozarboyjon va Turkiya",sw:"Azerbaijan dhidi ya Uturuki",so:"Azerbaijan vs Turkey",id:"Azerbaijan vs Turki"},
  "student-visa-azerbaijan-complete-guide": {de:"Studentenvisum Aserbaidschan",fr:"Visa \u00e9tudiant Azerba\u00efdjan",zh:"\u963f\u585e\u62dc\u7586\u5b66\u751f\u7b7e\u8bc1",ar:"\u0641\u064a\u0632\u0629 \u0627\u0644\u0637\u0627\u0644\u0628",fa:"\u0648\u06cc\u0632\u0627\u06cc \u062f\u0646\u0628\u0627\u0644\u0645\u0634\u062a\u063a\u0644\u0627\u0646",tk:"Azerba\u00fdjan wiza giwlagy",kk:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d \u0432\u0438\u0437\u0430\u0441\u044b",ky:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0436\u0430\u043d \u0432\u0438\u0437\u0430\u0441\u044b",bg:"\u0421\u0442\u0443\u0434\u0435\u043d\u0442\u0441\u043a\u0430 \u0432\u0438\u0437\u0430",ur:"\u0637\u0627\u0644\u0628 \u0648\u06cc\u0632\u0627 \u0622\u0630\u0631\u0628\u0627\u0626\u06cc\u062c\u0627\u0646",uz:"Talaba vizasi",sw:"Visa ya Mwanafunzi",so:"Fiisaha Ardayga",id:"Visa Pelajar"},
  "top-engineering-programs-azerbaijan": {de:"Top Ingenieurprogramme Aserbaidschan",fr:"Meilleurs programmes ing\u00e9nierie Azerba\u00efdjan",zh:"\u963f\u585e\u62dc\u7586\u6700\u4f73\u5de5\u7a0b\u9879\u76ee",ar:"\u0623\u0641\u0636\u0644 \u0628\u0631\u0627\u0645\u062c \u0627\u0644\u0647\u0646\u062f\u0633\u0629",fa:"\u0628\u0647\u062a\u0631\u06cc\u0646 \u0628\u0631\u0646\u0627\u0645\u0647\u200c\u0647\u0627\u06cc \u0645\u0647\u0646\u062f\u0633\u06cc",tk:"Azerba\u00fdjandy\u0148 i\u0148 i\u00fdi muhandislik programmalary",kk:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d\u043d\u044b\u04a3 \u0435\u04a3 \u0438\u043d\u0436\u0435\u043d\u0435\u0440\u043b\u0456\u043a \u0431\u0430\u0433\u044b\u0442\u0442\u0430\u0440\u044b",ky:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0436\u0430\u043d\u0434\u044b\u043d \u044d\u043d \u0438\u043d\u0436\u0435\u043d\u0435\u0440\u043b\u0438\u043a \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430\u043b\u0430\u0440\u044b",bg:"\u0422\u043e\u043f \u0438\u043d\u0436\u0435\u043d\u0435\u0440\u043d\u0438 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u0438",ur:"\u0628\u0647\u062a\u0631\u06cc\u0646 \u0625\u0646\u062c\u0646\u06cc\u0631\u0646\u063a \u067e\u0631\u0648\u063a\u0631\u0627\u0645",uz:"Eng yaxshi muhandislik dasturlari",sw:"Programu Bora za Uhandisi",so:"Barnaamijyada Engineering",id:"Program Studi Teknik"}
};

// Content translations - short single-paragraph summaries for each post
const blogContentTranslations = {};
for (const [slug, titleMap] of Object.entries(blogTitleTranslations)) {
  const contentSummary = {
    de: titleMap.de + " \u2014 Ein umfassender Leitfaden f\u00fcr internationale Studierende.",
    fr: titleMap.fr + " \u2014 Un guide compl\u00e8te pour les \u00e9tudiants internationaux.",
    zh: titleMap.zh + " \u2014 \u56fd\u9645\u5b66\u751f\u5b8c\u5168\u6307\u5357\u3002",
    ar: titleMap.ar + " \u2014 \u062f\u0644\u064a\u0644 \u0634\u0627\u0645\u0644 \u0644\u0644\u0637\u0627\u0644\u0628 \u0627\u0644\u062f\u0648\u0644\u064a\u064a\u0646.",
    fa: titleMap.fa + " \u2014 \u0631\u0627\u0647\u0646\u0645\u0627\u06cc \u06a9\u0627\u0645\u0644 \u0628\u0631\u0627\u06cc \u062f\u0646\u0628\u0627\u0644\u0645\u0634\u062a\u063a\u0644\u0627\u0646.",
    tk: titleMap.tk + " \u2014 Doly giwlagy.",
    kk: titleMap.kk + " \u2014 Tol\u0131q n\u00faska\u0131.",
    ky: titleMap.ky + " \u2014 Toluk nuskasy.",
    bg: titleMap.bg + " \u2014 \u0426\u044f\u043b\u043e\u0441\u0442\u0435\u043d \u043d\u0430\u0440\u044a\u0447\u043d\u0438\u043a.",
    ur: titleMap.ur + " \u2014 \u0645\u06a9\u0645\u0644 \u0631\u0648\u062f\u0646\u0627\u0645\u06c1.",
    uz: titleMap.uz + " \u2014 To'liq qo'llanma.",
    sw: titleMap.sw + " \u2014 Mwongozo kamili.",
    so: titleMap.so + " \u2014 Hage buuxda.",
    id: titleMap.id + " \u2014 Panduan lengkap."
  };
  blogContentTranslations[slug] = contentSummary;
}

// Helper function: find block by type and slug, add missing langs
function addLangs(content, slug, blockType, translations) {
  const slugIdx = content.indexOf('slug: "' + slug + '"');
  if (slugIdx === -1) return { content, updated: false };

  // Find the block type after slug
  const blockIdx = content.indexOf(blockType + ': {', slugIdx);
  if (blockIdx === -1 || blockIdx > slugIdx + 1000) return { content, updated: false };

  // Find the closing }, at 4-space indent (title/excerpt blocks)
  // Use line-by-line approach after blockIdx
  const afterBlock = content.substring(blockIdx);
  const lines = afterBlock.split('\n');
  let closeLineIdx = -1;
  let depth = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    // Count braces (not in strings)
    for (const ch of trimmed) {
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    if (depth === 0) {
      closeLineIdx = i;
      break;
    }
  }

  if (closeLineIdx === -1) return { content, updated: false };

  // Check which langs already exist in this block
  const blockLines = lines.slice(0, closeLineIdx);
  const existingLangs = AL.filter(l => blockLines.some(line => line.trim().startsWith(l + ':')));
  const missing = AL.filter(l => !existingLangs.includes(l));

  if (missing.length === 0) return { content, updated: false };

  // Find the actual position of the closing line in the full content
  let lineCount = 0;
  let closePos = -1;
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '\n') lineCount++;
    if (lineCount === blockIdx.split('\n').length - 1 + closeLineIdx) {
      closePos = i + 1;
      break;
    }
  }

  // Simpler: just find the position by searching for the closing pattern
  const searchFrom = blockIdx + blockType.length;
  let pos = searchFrom;
  let d = 1;
  while (pos < content.length && d > 0) {
    const ch = content[pos];
    if (ch === '"') {
      // Skip string content
      pos++;
      while (pos < content.length && content[pos] !== '"') {
        if (content[pos] === '\\') pos++; // skip escaped char
        pos++;
      }
    } else if (ch === '`') {
      // Skip template literal
      pos++;
      while (pos < content.length && content[pos] !== '`') {
        if (content[pos] === '\\') pos++;
        pos++;
      }
    } else if (ch === '{') {
      d++;
    } else if (ch === '}') {
      d--;
    }
    pos++;
  }
  
  const closeBracePos = pos - 1;
  const blockContent = content.substring(blockIdx, closeBracePos);
  const existingCheck = AL.filter(l => blockContent.includes(l + ':'));
  const missingCheck = AL.filter(l => !existingCheck.includes(l));
  
  if (missingCheck.length === 0) return { content, updated: false };

  // Add comma to last line before closing if needed
  const beforeClose = content.substring(0, closeBracePos);
  const lastNl = beforeClose.lastIndexOf('\n');
  const lastLine = beforeClose.substring(lastNl + 1, closeBracePos).trim();

  let insertAt = closeBracePos;
  if (!lastLine.endsWith(',') && !lastLine.endsWith('{')) {
    const lastQ = content.lastIndexOf('"', closeBracePos - 1);
    content = content.substring(0, lastQ + 1) + ',' + content.substring(lastQ + 1);
    insertAt = lastQ + 2;
  }

  // Build new language lines
  let newLines = '';
  for (const l of missingCheck) {
    if (translations[l]) {
      const val = translations[l].replace(/"/g, '\\"');
      newLines += '\n      ' + l + ': "' + val + '",';
    }
  }

  content = content.substring(0, insertAt) + newLines + '\n    ' + content.substring(insertAt);
  return { content, updated: true };
}

// Process blog.ts
let blog = readFileSync('src/lib/seed/blog.ts', 'utf8');
let blogUpdates = 0;

for (const [slug, trans] of Object.entries(blogTitleTranslations)) {
  const r = addLangs(blog, slug, 'title', trans);
  blog = r.content;
  if (r.updated) blogUpdates++;
}

for (const [slug, trans] of Object.entries(blogContentTranslations)) {
  const r = addLangs(blog, slug, 'excerpt', trans);
  blog = r.content;
  if (r.updated) blogUpdates++;
  
  const r2 = addLangs(blog, slug, 'content', trans);
  blog = r2.content;
  if (r2.updated) blogUpdates++;
}

writeFileSync('src/lib/seed/blog.ts', blog, 'utf8');
console.log('Blog: ' + blogUpdates + ' blocks updated');

// Process universities.ts
let uni = readFileSync('src/lib/seed/universities.ts', 'utf8');
let uniUpdates = 0;

const uniTagline = {de:"F\u00fchrende Universit\u00e4t in Aserbaidschan",fr:"Universit\u00e9 de premier plan en Azerba\u00efdjan",zh:"\u963f\u585e\u62dc\u7586\u9886\u5148\u5927\u5b66",ar:"\u062c\u0627\u0645\u0639\u0629 \u0631\u0627\u0626\u062f\u0629 \u0641\u064a \u0623\u0630\u0631\u0628\u0627\u064a\u062c\u0627\u0646",fa:"\u062f\u0627\u0646\u0634\u06af\u0627\u0647 \u067e\u06cc\u0634\u0648 \u062f\u0631 \u0622\u0630\u0631\u0628\u0627\u06cc\u062c\u0627\u0646",tk:"Azerba\u00fdjandy\u0148 ileri gelen uniwersiteti",kk:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d\u043d\u044b\u04a3 \u0436\u0435\u0442\u0435\u043a\u0448\u0456 \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0456",ky:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0436\u0430\u043d\u0434\u044b\u043d \u0436\u0435\u0442\u0435\u043a\u0447\u0438 \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0438",bg:"\u0412\u043e\u0434\u0435\u0449\u0430 \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442",ur:"\u0622\u0630\u0631\u0628\u0627\u0626\u06cc\u062c\u0627\u0646 \u0645\u06cc\u06ba \u0627\u06cc\u06a9 \u0634\u0627\u0646\u062f\u0627\u0631 \u06cc\u0648\u0646\u06cc\u0648\u0631\u0633\u0679\u06cc",uz:"Yetakchi universitet",sw:"Chuo kikuu kinachoongoza",so:"Jaamacada hogaamaysa",id:"Universitas unggulan"};

// Find all slug+tagline blocks in universities.ts
const slugLines = uni.split('\n');
const slugPositions = [];
for (let i = 0; i < slugLines.length; i++) {
  const m = slugLines[i].match(/slug:\s*'([^']+)'/);
  if (m) slugPositions.push({ slug: m[1], line: i });
}

for (const { slug } of slugPositions) {
  const r = addLangs(uni, slug, 'tagline', uniTagline);
  uni = r.content;
  if (r.updated) uniUpdates++;
}

writeFileSync('src/lib/seed/universities.ts', uni, 'utf8');
console.log('Universities: ' + uniUpdates + ' tagline blocks updated');
