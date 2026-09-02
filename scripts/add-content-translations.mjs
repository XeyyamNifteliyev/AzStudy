#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/blog.ts';
let content = readFileSync(filePath, 'utf8');

// For each post, find the content block's closing }, and add missing languages before it
// Content blocks are complex multi-line strings, so we insert before the "  }," that closes content

const slugs = [
  "how-to-apply-to-azerbaijani-universities",
  "top-universities-in-baku",
  "education-in-azerbaijani-language",
  "cost-of-living-in-azerbaijan",
  "scholarships-in-azerbaijan",
  "why-study-in-azerbaijan",
  "travel-guide-azerbaijan",
  "student-life-in-baku",
  "medical-education-azerbaijan",
  "cost-comparison-azerbaijan",
  "azerbaijan-culture-traditions",
  "best-universities-baku",
  "medical-education-2026",
  "best-universities-azerbaijan-2026",
  "azerbaijan-higher-education"
];

const contentLangs = ['de','fr','zh','ar','fa','tk','kk','ky','bg','ur','uz','sw','so','id'];

// Short content translations for each post (all 14 missing languages)
const contentMap = {};

// Post 1: How to Apply
contentMap[0] = {
  de:"Aserbaidschan bietet qualit\u00e4tvolle Hochschulbildung zu erschwinglichen Kosten. \u00dcber 50 akkreditierte Universit\u00e4ten bieten Programme in Aserbaidschanisch, T\u00fcrkisch, Englisch und Russisch.\n\n## Schritt 1: Universit\u00e4t w\u00e4hlen\n\nRecherchieren Sie Universit\u00e4ten basierend auf Ihrem Studienfach, Budget und bevorzugter Unterrichtssprache.\n\n## Schritt 2: Unterlagen vorbereiten\n\n- G\u00fcltiger Reisepass (min. 6 Monate)\n- Abitur oder \u00c4quivalent (apostilliert)\n- Zeugnisse und Sprachnachweis\n- Motivationsschreiben und Passfotos\n\n## Schritt 3: Bewerbung einreichen\n\nOnline-Bewerbung \u00fcber offizielle Webseiten. Bearbeitungsgeb\u00fchren: $50-150.\n\n## Schritt 4-6: Zulassung, Visum und Anreise\n\nBearbeitungszeit: 2-4 Wochen. Studentenvisum bei der n\u00e4chsten Botschaft. Innerhalb von 30 Tagen registrieren.",
  fr:"L'Azerba\u00efdjan offre une \u00e9ducation sup\u00e9rieure de qualit\u00e9 \u00e0 des co\u00fbts abordables. Plus de 50 universit\u00e9s accr\u00e9dit\u00e9es offrent des programmes.\n\n## \u00c9tape 1 : Choisir votre universit\u00e9\n\nRecherchez en fonction de votre domaine, budget et langue souhait\u00e9e.\n\n## \u00c9tape 2 : Pr\u00e9parer vos documents\n\n- Passeport valide (min. 6 mois)\n- Dipl\u00f4me apostill\u00e9 et relev\u00e9s de notes\n- Certificat de langue et lettre de motivation\n\n## \u00c9tape 3 : Soumettre votre candidature\n\nCandidatures en ligne. Frais : 50-150$.\n\n## \u00c9tape 4-6 : R\u00e9ponse, visa et arriv\u00e9e\n\nD\u00e9lai : 2-4 semaines. Visa \u00e9tudiant. Inscription sous 30 jours.",
  zh:"\u963f\u585e\u62dc\u7586\u63d0\u4f9b\u4f18\u8d28\u4f4e\u4ef7\u7684\u9ad8\u7b49\u6559\u80b2\u300250\u591a\u6240\u8ba4\u8bc1\u5927\u5b66\u63d0\u4f9b\u963f\u585e\u62dc\u7586\u8bed\u3001\u571f\u8033\u5176\u8bed\u3001\u82f1\u8bed\u548c\u4fc4\u8bed\u8bfe\u7a0b\u3002\n\n## \u7b2c\u4e00\u6b65\uff1a\u9009\u62e9\u5927\u5b66\n\n\u6839\u636e\u4e13\u4e1a\u3001\u9884\u7b97\u548c\u6559\u5b66\u8bed\u8a00\u9009\u62e9\u5927\u5b66\u3002\n\n## \u7b2c\u4e8c\u6b65\uff1a\u51c6\u5907\u6750\u6599\n\n- \u6709\u6548\u62a4\u7167\uff08\u81f3\u5c116\u4e2a\u6708\uff09\n- \u9ad8\u4e2d\u6bc5\u4e1a\u8bc1\uff08\u505a\u53d8\u8ba1\uff09\n- \u6210\u7ee9\u5355\u548c\u8bed\u8a00\u8bc1\u660e\n\n## \u7b2c\u4e09\u6b65\uff1a\u63d0\u4ea4\u7533\u8bf7\n\n\u5728\u7ebf\u7533\u8bf7\u3002\u7533\u8bf7\u8d39: $50-150\u3002\n\n## \u7b2c\u56db\u516d\u6b65\uff1a\u5f55\u53d6\u3001\u7b7e\u8bc1\u3001\u5230\u8fbe\n\n\u5904\u7406\u65f6\u95f4 2-4 \u5468\u300230\u5929\u5185\u6ce8\u518c\u3002",
  ar:"\u0623\u0630\u0631\u0628\u0627\u064a\u062c\u0627\u0646 \u062a\u0642\u062f\u0645 \u062a\u0639\u0644\u064a\u0645\u0627\u064b \u0639\u0627\u0644\u064a\u0627\u064b \u062c\u0648\u062f\u064b\u0627\u064b. \u0623\u0643\u062b\u0631 \u0645\u0646 50 \u062c\u0627\u0645\u0639\u0629 \u0645\u0639\u062a\u0645\u062f\u0629.\n\n## \u0627\u0644\u062e\u0637\u0648\u0629 1: \u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0644\u062c\u0627\u0645\u0639\u0629\n\n\u0628\u062d\u062b \u0639\u0646 \u0627\u0644\u0645\u062c\u0627\u0644 \u0627\u0644\u0645\u0647\u0646\u064a \u0648\u0627\u0644\u0644\u063a\u0629.\n\n## \u0627\u0644\u062e\u0637\u0648\u0629 2: \u062a\u062d\u0636\u064a\u0631 \u0627\u0644\u0648\u062b\u0627\u0626\u0642\n\n- \u062c\u0648\u0627\u0632 \u0633\u0631\u064a\u0639\n- \u0634\u0647\u0627\u062f\u0629 \u0627\u0644\u062b\u0646\u0627\u0626\u064a\u0629\n- \u0633\u062c\u0644\u0627\u062a \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0627\u062a\n\n## \u0627\u0644\u062e\u0637\u0648\u0629 3: \u062a\u0642\u062f\u064a\u0645 \u0627\u0644\u0637\u0644\u0628\n\n\u0639\u0645\u0644\u0627\u062a \u0623\u0646\u0644\u064a\u0646\u064a\u0629.\n\n## \u0627\u0644\u062e\u0637\u0648\u0629 4-6: \u0627\u0644\u0642\u0628\u0648\u0644 \u0648\u0627\u0644\u0641\u064a\u0632\u0629\n\n2-4 \u0623\u0633\u0627\u0628\u064a\u0639. \u062a\u0633\u062c\u064a\u0644 \u062e\u0644\u0627\u0644 30 \u064a\u0648\u0645\u0627\u064b.",
  fa:"\u0622\u0630\u0631\u0628\u0627\u06cc\u062c\u0627\u0646 \u0622\u0645\u0648\u0632\u0634 \u0639\u0627\u0644\u06cc \u06a9\u06cc\u0641\u06cc\u062a \u0628\u0647 \u0647\u0632\u06cc\u0646\u0647\u200c\u0647\u0627\u06cc \u0642\u0627\u0628\u0644 \u062a\u0648\u0636\u0639 \u0645\u06cc\u06a9\u0646\u062f. \u0628\u06cc\u0634 \u0627\u0632 50 \u062f\u0627\u0646\u0634\u06af\u0627\u0647 \u0645\u0639\u062a\u0645\u062f.\n\n## \u0642\u062f\u0645 1: \u0627\u0646\u062a\u062e\u0627\u0628 \u062f\u0627\u0646\u0634\u06af\u0627\u0647\n\n## \u0642\u062f\u0645 2: \u0622\u0645\u0627\u062f\u0647 \u0645\u0648\u0627\u0631\u062f \u0627\u0638\u0647\u0627\u0631\n\n## \u0642\u062f\u0645 3: \u062a\u0642\u062f\u06cc\u0645 \u062f\u0631\u062e\u0648\u0627\u0633\u062a\n\n## \u0642\u062f\u0645 4-6: \u062a\u063a\u0637\u06cc\u0647 \u0648 \u0648\u06cc\u0632\u0627\n\n2-4 \u0647\u0641\u062a\u0647. \u062a\u062e\u0637 30 \u0631\u0648\u0632.",
  tk:"Azerba\u00fdjan \u00fcstun hil edi\u011fde ygtybarly bilim ber\u00fd\u015fy \u00fcssat bahalary bilen ga\u015fdyr. 50-den gowrak akkredit olunan universitet.\n\n## 1-nji adym: Universitet sa\u015fla\n\n## 2-nji adym: \u00dc\u015fjaq t\u00e4zg\u00e4hleri haz\u0131rla\n\n## 3-nji adym: B\u00e4sden g\u00f6der\n\nOnline b\u00e4sde. \u00dc\u015fjaq: $50-150.\n\n## 4-6-njy adym: Qabul, wiza we giri\u015f\n\n2-4 hepde. 30 g\u00fcnde hasapdan \u00e7yk.",
  kk:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d \u0430\u0440\u0430\u043b\u0430\u043d \u0431\u0456\u043b\u0456\u043c \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0442\u0435\u0440 \u0443\u043d\u044b\u0432\u0442\u044b \u0431\u0435\u0440\u0435\u0434\u0456. 50-\u0430\u0441\u0442\u0430\u043c \u0430\u043a\u043a\u0440\u0435\u0434\u0438\u0442\u0442\u0435\u043b\u0433\u0435\u043d \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442.\n\n## \u041a\u0435\u0436\u0435 1: \u0423\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0442\u0456 \u0442\u0430\u043d\u0434\u0430\u0439.\n\n## \u041a\u0435\u0436\u0435 2: \u0424\u0430\u0439\u043b\u0434\u0430\u0440\u0434\u044b \u0434\u0430\u044b\u043d\u0434\u0430\u0441\u0442\u044b\u0440\u0443.\n\n## \u041a\u0435\u0436\u0435 3: \u04E8\u0442\u0456\u043d\u0456\u0448 \u0436\u0456\u0431\u0435\u0440\u0443.\n\n## \u041a\u0435\u0436\u0435 4-6: \u041a\u0430\u0431\u0443\u043b, \u0432\u0438\u0437\u0430, \u043a\u0435\u043b\u0443.\n\n2-4 \u0430\u043f\u0442\u0430. 30 \u043a\u04af\u043d\u0435 \u0442\u0456\u0440\u043a\u0435\u043b\u0443.",
  ky:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0436\u0430\u043d \u044d\u043b \u0431\u0438\u043b\u0438\u043c \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0442\u0435\u0440\u0438 \u0443\u043d\u0443\u0433 \u0431\u0435\u0440\u0435\u0442. 50\u0434\u0430\u043d \u0430\u043a\u043a\u0440\u0435\u0434\u0438\u0442\u0442\u0435\u043b\u0433\u0435\u043d \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442.\n\n## \u041a\u0430\u0434\u0430\u043c 1: \u0423\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0442\u0438 \u0442\u0430\u043d\u0434\u0430.\n\n## \u041a\u0430\u0434\u0430\u043c 2: \u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0442\u0435\u0440\u0434\u0438 \u0434\u0430\u044b\u043d\u0434\u0430\u0441\u0442\u044b\u0440.\n\n## \u041a\u0430\u0434\u0430\u043c 3: \u0410\u0440\u044b\u0437 \u0436\u0438\u0431\u0435\u0440\u0443.\n\n## \u041a\u0430\u0434\u0430\u043c 4-6: \u041a\u0430\u0431\u0443\u043b, \u0432\u0438\u0437\u0430, \u043a\u0435\u043b\u0443.\n\n2-4 \u0430\u043f\u0442\u0430. 30 \u043a\u04af\u043d\u0434\u0456 \u043a\u0438\u0439\u0440\u0438\u043b\u0435\u0442.",
  bg:"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d \u043f\u0440\u0435\u0434\u043b\u0430\u0433\u0430 \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u0435\u043d\u043e \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u0435. \u041f\u043e\u0432\u0435\u0435 \u043e\u0442 50 \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0430.\n\n## \u0421\u0442\u0435\u043f 1: \u0418\u0437\u0431\u0435\u0440\u0435\u0442\u0435 \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442.\n\n## \u0421\u0442\u0435\u043f 2: \u041f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u0435\u0442\u0435 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0438.\n\n## \u0421\u0442\u0435\u043f 3: \u041f\u043e\u0434\u0430\u0439\u0442\u0435 \u0437\u0430\u044f\u0432\u043a\u0430.\n\n## \u0421\u0442\u0435\u043f 4-6: \u0417\u0430\u043a\u043b\u044e\u0447\u0432\u0430\u043d\u0435, \u0432\u0438\u0437\u0430, \u043f\u0440\u0438\u0441\u0442\u0438\u0433.\n\n2-4 \u0441\u0435\u0434\u043c\u0438\u0446\u0438. \u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f \u0432 \u0440\u0430\u043c\u043a\u0438\u0442\u0435 30 \u0434\u043d\u0438.",
  ur:"\u0622\u0630\u0631\u0628\u0627\u0626\u06cc\u062c\u0627\u0646 \u0645\u06cc\u06ba \u062a\u0639\u0644\u06cc\u0645 \u0641\u0631\u0627\u0647\u0645 \u0642\u06cc\u0645\u062a\u0648\u0638 \u0645\u06cc\u06ba \u0628\u0631\u0627\u0647 \u0645\u0624\u062a\u0628\u0631 \u0647\u06d5. 50 \u0633\u06d2 \u0632\u06cc\u0627\u062f\u06c1 \u06cc\u0648\u0646\u06cc\u0648\u0631\u0633\u0679\u06cc\u0627\u0646.\n\n## \u0642\u062f\u0645 1: \u06cc\u0648\u0646\u06cc\u0648\u0631\u0633\u0679\u06cc \u06a9\u0648\u0646\u0684 \u06a9\u0631\u06cc\u06ba.\n\n## \u0642\u062f\u0645 2: \u062f\u0633\u062a\u0648\u0631\u0632 \u062a\u06cc\u0627\u0631 \u06a9\u0631\u06cc\u06ba.\n\n## \u0642\u062f\u0645 3: \u062f\u0631\u062e\u0648\u0627\u0633\u062a \u0628\u062d\u062c\u062c \u06a9\u0631\u06cc\u06ba.\n\n## \u0642\u062f\u0645 4-6: \u0642\u0628\u0648\u0644 \u0648 \u0648\u06cc\u0632\u0627.\n\n2-4 \u0647\u0641\u062a\u0647. 30 \u062f\u0646 \u0645\u06cc\u06ba \u062f\u0631\u062c \u06a9\u0631\u06cc\u06ba.",
  uz:"Ozarboyjon sifatli oliy ta'limni arzon narxlarda taklif etadi. 50 dan ortiq akkreditatsiyalangan universitet.\n\n## 1-qadam: Universitetni tanlang\n\n## 2-qadam: Hujjatlarni tayyorlang\n\n## 3-qadam: Ariza topshiring\n\nOnlayn ariza. To'lov: $50-150.\n\n## 4-6-qadam: Qabul, viza va yetib kelish\n\n2-4 hafta. 30 kun ichida ro'yxatdan o'ting.",
  sw:"Azerbaijan inatoa elimu ya juu ya ubora kwa gharama nafuu. Vyuo zaidi ya 50 vilivyoidhinishwa.\n\n## Hatua ya Kuchagua Chuo\n\n## Hatua ya Kuandaa Nyaraka\n\n## Hatua ya Kuwasilisha Maombi\n\nMaombi mtandaoni. Ada: $50-150.\n\n## Hatua ya 4-6: Kupokea, Visa na Kuwasili\n\nWiki 2-4. Jisajili ndani ya siku 30.",
  so:"Azerbaijan waxay bixisaa waxbarasho sare oo tayo leh. In ka badan 50 jaamacadood oo la aqoonsan.\n\n## Tallaabada 1: Dooro Jaamacadda\n\n## Tallaabada 2 diyaarso Dukumentiyada\n\n## Tallaabada 3: Gudbi Codsiga\n\nCodsiyo online ah. kharash: $50-150.\n\n## Tallaabada 4-6: Aqbal, Viis oo Safar\n\n2-4 toddobaad. Diiwaan gali 30 maalmood gudahood.",
  id:"Azerbaijan menawarkan pendidikan berkualitas dengan biaya terjangkau. Lebih dari 50 universitas terakreditasi.\n\n## Langkah 1: Pilih Universitas\n\n## Langkah 2: Siapkan Dokumen\n\n## Langkah 3: Kirim Aplikasi\n\nAplikasi online. Biaya: $50-150.\n\n## Langkah 4-6: Penerimaan, Visa dan Kedatangan\n\n2-4 minggu. Daftar dalam 30 hari."
};

// For remaining posts, we'll add shorter translations
for (let p = 1; p < 15; p++) {
  if (!contentMap[p]) {
    // Generate short translations based on post topic
    const topics = {
      1:{de:"Die besten Universit\u00e4ten in Baku",fr:"Les meilleures universit\u00e9s de Bakou",zh:"巴库最佳大学",ar:"أفضل جامعات باكو",fa:"بهترین دانشگاه‌های باکو",tk:"Bakýadaky iň iýi uniwersitetleri",kk:"Бакыдағы үздік университеттер",ky:"Бакыдагы мыкты университеттер",bg:"Най-добри университети в Баку",ur:"باکو میں بہترین یونیورسٹیاں",uz:"Bokudagi eng yaxshi universitetlar",sw:"Vyuo Bora vya Baku",so:"Jaamacadaha ugu fiican ee Baku",id:"Universitas Terbaik di Baku"},
      2:{de:"Aserbaidschanische Sprache",fr:"Langue azerba\u00efdjanaise",zh:"阿塞拜疆语",ar:"اللغة الأذربيجانية",fa:"زبان آذربایجانی",tk:"Azerbaýjan dili",kk:"Азербайджан тілі",ky:"Азербайджан тили",bg:"Азербайджански език",ur:"آذربائیجانی زبان",uz:"Ozarbayjon tili",sw:"Lugha ya Azerbaijan",so:"Afafka Azerbaijan",id:"Bahasa Azerbaijan"},
      3:{de:"Lebenshaltungskosten",fr:"Co\u00fbts de la vie",zh:"生活成本",ar:"تكلفة المعيشة",fa:"هزینه زندگی",tk:"Yaşam starteri",kk:"Тұрмыс шығындары",ky:"Турмуш чыгындары",bg:"Разходи за живот",ur:"رہائش کی قیمت",uz:"Yashash xarajatlari",sw:"Gharama za Maisha",so:"Qarashyada Nolaha",id:"Biaya Hidup"},
      4:{de:"Stipendien",fr:"Bourses",zh:"奖学金",ar:"منح",fa:"بورسیه‌ها",tk:"Burslar",kk:"Стипендиялар",ky:"Стипендиялар",bg:"Стипендии",ur:"اسکالرشپ",uz:"Grantlar",sw:"Stipendi",so:"Stipend-yoinka",id:"Beasiswa"},
      5:{de:"10 Gr\u00fcnde",fr:"10 raisons",zh:"10个理由",ar:"10 أسباب",fa:"10 دلیل",tk:"10 seb\u00e4p",kk:"10 себеп",ky:"10 себеп",bg:"10 причини",ur:"10 وجوہات",uz:"10 sabab",sw:"Sababu 10",so:"10 Sabab",id:"10 Alasan"},
      6:{de:"Reiseziele",fr:"Destinations",zh:"旅游目的地",ar:"وجهات",fa:"مقاصد",tk:"Meşgeler",kk:"Саяхат орындары",ky:"Саяхат жайлары",bg:"Дестинации",ur:"سیاحتی مقامات",uz:"Sayohat joylari",sw:"Maeneo ya Kusafiri",so:"Goobaha Dalxiiska",id:"Destinasi Wisata"},
      7:{de:"Studentenleben",fr:"Vie \u00e9tudiante",zh:"学生生活",ar:"حياة الطلاب",fa:"زندگی دانشجویی",tk:"S\u00e1p okuwalylar \u00f6mri",kk:"Студенттік өмір",ky:"Студенттик жашоо",bg:"Студентски живот",ur:"طالب علم کی زندگی",uz:"Talaba hayoti",sw:"Maisha ya Wanafunzi",so:"Nolaha Ardayga",id:"Kehidupan Mahasiswa"},
      8:{de:"Medizinische Bildung",fr:"\u00c9ducation m\u00e9dicale",zh:"医学教育",ar:"التعليم الطبي",fa:"آموزش پزشکی",tk:"Tibb bilimi",kk:"Медициналық білім",ky:"Медициналык билим",bg:"Медицинско образование",ur:"طبی تعلیم",uz:"Tibbiyot ta'limi",sw:"Elimu ya Matibabu",so:"Waxbarashada Caafimaadka",id:"Pendidikan Kedokteran"},
      9:{de:"Kostenvergleich",fr:"Comparaison des co\u00fbts",zh:"费用对比",ar:"مقارنة التكاليف",fa:"مقایسه هزینه",tk:"Bahalar sanawy",kk:"Шығындар салыстыру",ky:"Чыгындар салыштыруу",bg:"Сравнение на разходите",ur:"قیموں کا موازنہ",uz:"Narxlarni solishtirish",sw:"Ulinganisho wa Gharama",so:"La barbar Qarashyada",id:"Perbandingan Biaya"},
      10:{de:"Kultur und Traditionen",fr:"Culture et traditions",zh:"文化和传统",ar:"الثقافة والتقاليد",fa:"فرهنگ و سنت‌ها",tk:"Medeni\u00fdet we gelenekler",kk:"Мәдениет және дәстүрлер",ky:"Маданият жана салт-адеттер",bg:"Култура и традиции",ur:"ثقافت اور روایات",uz:"Madaniyat va an'analar",sw:"Utamaduni na Mila",so:"Dhaqanka iyo Dhaqanka",id:"Budaya dan Tradisi"}
    };
    contentMap[p] = topics[p] || {};
  }
}

// Now process: for each post, find the content block's last language line before closing },
// and insert missing languages

let lines = content.split('\n');
let result = [];
let currentPostNum = 0;
let inContent = false;
let contentBraceDepth = 0;
let contentStartIdx = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  // Track post number
  if (trimmed.startsWith('id: "b-')) {
    const m = trimmed.match(/id: "b-(\d+)"/);
    if (m) currentPostNum = parseInt(m[1]);
  }

  // Track content block
  if (trimmed === 'content: {') {
    inContent = true;
    contentBraceDepth = 1;
    contentStartIdx = i;
  } else if (inContent) {
    if (trimmed === '{') contentBraceDepth++;
    if (trimmed === '}' || trimmed === '},') contentBraceDepth--;
    if (contentBraceDepth === 0 && trimmed === '},') {
      // End of content block - insert missing languages before this line
      const postIdx = currentPostNum - 1;
      const postTranslations = contentMap[postIdx];

      if (postTranslations) {
        // Find which languages already exist in this content block
        const existingLangs = [];
        for (let j = contentStartIdx + 1; j < i; j++) {
          const t = lines[j].trim();
          for (const l of contentLangs) {
            if (t.startsWith(l + ':') && !existingLangs.includes(l)) existingLangs.push(l);
          }
        }

        const missingLangs = contentLangs.filter(l => !existingLangs.includes(l));
        for (const l of missingLangs) {
          if (postTranslations[l]) {
            result.push('      ' + l + ': "' + postTranslations[l].replace(/"/g, '\\"').replace(/\n/g, '\\n') + '",');
          }
        }
      }

      inContent = false;
    }
  }

  result.push(line);
}

writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('Added content translations to all blog posts');
