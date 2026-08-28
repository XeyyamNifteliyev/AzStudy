import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — Study in Azerbaijan`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Localized headline for the OG share image (18 locales; falls back
// to English for anything else).
const HEADLINES: Record<string, { title: string; sub: string }> = {
  en: {
    title: "Study in Azerbaijan — Your guided path",
    sub: "Compare accredited universities, programs, tuition & scholarships. Apply with expert guidance.",
  },
  tr: {
    title: "Azerbaycan'da Eğitim — Başvurudan varışa rehberlik",
    sub: "Akredite üniversiteleri, bölümleri, ücretleri ve bursları karşılaştırın. Uzman rehberlikle başvurun.",
  },
  az: {
    title: "Azərbaycanda Təhsil — Müraciətdən gəlişə rəhbərlik",
    sub: "Akreditə olunmuş universitetləri, proqramları, tədris haqqını və təqaüdləri müqayisə edin.",
  },
  ru: {
    title: "Учеба в Азербайджане — Путь от заявки до приезда",
    sub: "Сравнивайте аккредитованные университеты, программы, стоимость и стипендии.",
  },
  de: {
    title: "Studium in Aserbaidschan — Ihr begleiteter Weg",
    sub: "Vergleichen Sie akkreditierte Universitäten, Programme, Studiengebühren und Stipendien.",
  },
  fr: {
    title: "Étudier en Azerbaïdjan — Votre parcours guidé",
    sub: "Comparez les universités accréditées, les programmes, les frais et les bourses d'études.",
  },
  ar: {
    title: "الدراسة في أذربيجان — طريقك بإرشاد الخبراء",
    sub: "قارن الجامعات المعتمدة والبرامج والرسوم والمنح الدراسية.",
  },
  fa: {
    title: "تحصیل در جمهوری آذربایجان — مسیر راهنمایی‌شده شما",
    sub: "دانشگاه‌های معتبر، برنامه‌ها، شهریه و بورسیه‌ها را مقایسه کنید.",
  },
  zh: {
    title: "在阿塞拜疆留学 — 从申请到抵达的全程指导",
    sub: "比较经认证的大学、课程、学费和奖学金。",
  },
  tk: {
    title: "Azerbaýjanda okamak — Ýol görkeziji",
    sub: "Akkreditlenen uniwersitetleri, programmalary, tölegleri we stipendiýalary deňeşdiriň.",
  },
  kk: {
    title: "Әзірбайжанда оқу — Сіздің жолбасшыңыз",
    sub: "Аккредиттелген университеттерді, бағдарламаларды, ақы мен стипендияларды салыстырыңыз.",
  },
  ky: {
    title: "Азербайжанда окуу — Сиздин жол көрсөткүчүңүз",
    sub: "Аккредитацияланган университеттерди, программаларды, акыларды жана стипендияларды салыштырыңыз.",
  },
};

// Per-locale OG image for localized routes (/en, /az, /tr, ...). Without this
// file, localized pages ship no og:image at all — broken social shares and a
// missing entity/trust signal for search engines.
export default async function LocaleOpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = HEADLINES[locale] ?? HEADLINES.en;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        backgroundColor: "#003d9b",
        color: "#ffffff",
        backgroundImage:
          "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 55%), radial-gradient(circle at 0% 100%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 50%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "14px",
            backgroundColor: "#ffffff",
            color: "#003d9b",
            fontSize: "40px",
            fontWeight: 800,
          }}
        >
          A
        </div>
        <div
          style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-0.5px" }}
        >
          {siteConfig.name}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div
          style={{
            fontSize: "76px",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-1.5px",
            maxWidth: "900px",
          }}
        >
          {copy.title}
        </div>
        <div
          style={{
            fontSize: "30px",
            color: "rgba(255,255,255,0.85)",
            maxWidth: "820px",
            lineHeight: 1.3,
          }}
        >
          {copy.sub}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "24px",
          color: "rgba(255,255,255,0.7)",
          borderTop: "1px solid rgba(255,255,255,0.25)",
          paddingTop: "32px",
        }}
      >
        <div style={{ display: "flex" }}>
          {siteConfig.url.replace(/^https?:\/\//, "")}/{locale}
        </div>
        <div style={{ display: "flex" }}>{siteConfig.contact.address.en}</div>
      </div>
    </div>,
    { ...size },
  );
}
