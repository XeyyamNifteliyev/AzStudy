#!/usr/bin/env node
/**
 * Adds the "Consent" namespace (GDPR banner copy) to every locale in
 * src/messages/*.json. Idempotent: existing keys are left untouched.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "src/messages");
const locales = [
  "en",
  "az",
  "ru",
  "tr",
  "de",
  "fr",
  "ar",
  "fa",
  "zh",
  "tk",
  "kk",
  "ky",
  "bg",
  "ur",
  "uz",
  "sw",
  "so",
  "id",
];

const copy = {
  en: {
    title: "We value your privacy",
    description:
      "We use cookies and analytics to understand how visitors use the site and improve it. Analytics only run after you accept.",
    accept: "Accept analytics",
    decline: "Decline",
  },
  az: {
    title: "Məxfiliyiniz bizim üçün vacibdir",
    description:
      "Saytdan necə istifadə olunduğunu anlamaq və təkmilləşdirmək üçün cookie və analitikadan istifadə edirik. Analitika yalnız razılıq verdikdən sonra işə düşür.",
    accept: "Analitikaya icazə ver",
    decline: "İmtina et",
  },
  ru: {
    title: "Мы ценим вашу конфиденциальность",
    description:
      "Мы используем cookie и аналитику, чтобы понимать, как посетители пользуются сайтом, и улучшать его. Аналитика включается только после вашего согласия.",
    accept: "Разрешить аналитику",
    decline: "Отказаться",
  },
  tr: {
    title: "Gizliliğinize değer veriyoruz",
    description:
      "Ziyaretçilerin siteyi nasıl kullandığını anlamak ve geliştirmek için çerezler ve analitik kullanıyoruz. Analitik yalnızca onayınızdan sonra çalışır.",
    accept: "Analitiğe izin ver",
    decline: "Reddet",
  },
  de: {
    title: "Wir schätzen Ihre Privatsphäre",
    description:
      "Wir verwenden Cookies und Analysedienste, um zu verstehen, wie Besucher die Website nutzen, und sie zu verbessern. Analytik läuft erst nach Ihrer Zustimmung.",
    accept: "Analytik erlauben",
    decline: "Ablehnen",
  },
  fr: {
    title: "Nous respectons votre vie privée",
    description:
      "Nous utilisons des cookies et des outils d'analyse pour comprendre comment les visiteurs utilisent le site et l'améliorer. L'analyse ne démarre qu'après votre accord.",
    accept: "Autoriser l'analyse",
    decline: "Refuser",
  },
  ar: {
    title: "نحن نقدر خصوصيتك",
    description:
      "نستخدم ملفات تعريف الارتباط وأدوات التحليل لفهم كيفية استخدام الزوار للموقع وتحسينه. يبدأ التحليل فقط بعد موافقتك.",
    accept: "السماح بالتحليلات",
    decline: "رفض",
  },
  fa: {
    title: "ما برای حریم خصوصی شما ارزش قائلیم",
    description:
      "ما از کوکی‌ها و ابزارهای تحلیل برای درک نحوه استفاده بازدیدکنندگان از سایت و بهبود آن استفاده می‌کنیم. تحلیل فقط پس از موافقت شما شروع می‌شود.",
    accept: "اجازه تحلیل",
    decline: "رد کردن",
  },
  zh: {
    title: "我们重视您的隐私",
    description:
      "我们使用 Cookie 和分析工具来了解访问者如何使用网站并改进它。只有在您同意后才会启动分析。",
    accept: "允许分析",
    decline: "拒绝",
  },
  tk: {
    title: "Biz siziň şahsy syryňyza sarpa goýýarys",
    description:
      "Menzilleriň saýty nädip ulanýandygyna düşünmek we ony gowulandyrmak üçin kuki we analitika ulanýarys. Analitika diňe razylygyňyzdan soň işe girýär.",
    accept: "Analitika rugsat ber",
    decline: "Yüz öwürmek",
  },
  kk: {
    title: "Біз сіздің құпиялылығыңызды құрметтейміз",
    description:
      "Біз сайтқа келушілердің оны қалай пайдаланатынын түсіну және жақсарту үшін cookie және аналитиканы қолданамыз. Аналитика тек келісіміңізден кейін іске қосылады.",
    accept: "Аналитикаға рұқсат ету",
    decline: "Бас тарту",
  },
  ky: {
    title: "Биз сиздин купуялыгыңызды сыйлайбыз",
    description:
      "Биз сайтты колдонуучулар кандай колдонгонун түшүнүү жана жакшыртуу үчүн cookie жана аналитиканы колдонобуз. Аналитика сиздин макулдугуңуздан кийин гана иштейт.",
    accept: "Аналитикага уруксат берүү",
    decline: "Баш тартуу",
  },
  bg: {
    title: "Ценим вашата поверителност",
    description:
      "Използваме бисквитки и аналитика, за да разберем как посетителите използват сайта и да го подобрим. Аналитиката се включва само след вашето съгласие.",
    accept: "Разрешаване на аналитиката",
    decline: "Отказ",
  },
  ur: {
    title: "ہم آپ کی رازداری کا احترام کرتے ہیں",
    description:
      "ہم یہ سمجھنے کے لیے کوکیز اور اینالیٹکس استعمال کرتے ہیں کہ زائرین سائٹ کو کیسے استعمال کرتے ہیں اور اسے بہتر بنانے کے لیے۔ اینالیٹکس صرف آپ کی اجازت کے بعد چلتا ہے۔",
    accept: "تجزیات کی اجازت دیں",
    decline: "مسترد کریں",
  },
  uz: {
    title: "Sizning maxfiyligingizni qadrlaymiz",
    description:
      "Tashrif buyuruvchilar saytdan qanday foydalanishini tushunish va uni yaxshilash uchun cookie va analitikadan foydalanamiz. Analitika faqat roziligingizdan keyin ishga tushadi.",
    accept: "Analitikaga ruxsat berish",
    decline: "Rad etish",
  },
  sw: {
    title: "Tunaheshimu faraghiya yako",
    description:
      "Tunatumia vidakuti na uchambuzi kuelewa jinsi wageni wanavyotumia tovuti na kuiboresha. Uchambuzi huanza tu baada ya kukubali.",
    accept: "Ruhusu uchambuzi",
    decline: "Kataa",
  },
  so: {
    title: "Waxaan qadaraynaa sirkaaga",
    description:
      "Waxaan u isticmaalnaa cookies iyo falanqeyn si aan u fahamno sida booqdayaashu u isticmaalaan bogga oo aan u horumarino. Falanqayntu waxay bilaabataa kaliya ka dib markaad ogolaato.",
    accept: "Ogolow falanqaynta",
    decline: "Diid",
  },
  id: {
    title: "Kami menghargai privasi Anda",
    description:
      "Kami menggunakan cookie dan analitik untuk memahami bagaimana pengunjung menggunakan situs dan meningkatkannya. Analitik hanya berjalan setelah Anda menyetujui.",
    accept: "Izinkan analitik",
    decline: "Tolak",
  },
};

for (const locale of locales) {
  const path = join(dir, `${locale}.json`);
  const data = JSON.parse(readFileSync(path, "utf8"));
  if (!data.Consent) data.Consent = copy[locale];
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log(`Consent added → ${locale}.json`);
}
