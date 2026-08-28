import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — Study in Azerbaijan`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fallback OG image for non-locale routes (admin, api 404s etc.). Localized
// pages use src/app/[locale]/opengraph-image.tsx so shares show the right
// language. Lives in the (root) group so it has a root layout.
export default function OpengraphImage() {
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
          Study in Azerbaijan — Your guided path
        </div>
        <div
          style={{
            fontSize: "30px",
            color: "rgba(255,255,255,0.85)",
            maxWidth: "820px",
            lineHeight: 1.3,
          }}
        >
          Compare accredited universities, programs, tuition &amp; scholarships.
          Apply with expert guidance.
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
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
        <div style={{ display: "flex" }}>{siteConfig.contact.address.en}</div>
      </div>
    </div>,
    { ...size },
  );
}
