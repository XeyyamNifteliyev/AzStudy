// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToReadableStream } from "react-dom/server";

// Mock the i18n Link so next-intl's createNavigation (which pulls
// next/navigation) never loads in the jsdom test environment.
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: Record<string, unknown>) =>
    React.createElement("a", { href, ...rest }, children as React.ReactNode),
}));

const { UniversityCard } =
  await import("../../../src/components/sections/university-card");
import type { University } from "../../../src/types";

const uni: University = {
  id: "u-test",
  slug: "test-university",
  cityId: "c-istanbul",
  name: "Test University",
  foundedYear: 2000,
  studentCount: 5000,
  ranking: 42,
  accreditation: "YÖK Accredited",
  isState: false,
  logoText: "TU",
  heroImage: "/images/universities/test/hero.webp",
  gallery: [],
  tagline: { en: "tagline" },
  description: { en: "desc" },
  languages: ["en"],
};

const labels = {
  verified: "Ministry",
  state: "State",
  private: "Private",
  azerbaijan: "Azerbaijan",
  from: "from",
  tuition: "Tuition",
  rank: "Rank",
  founded: "Founded",
};

describe("UniversityCard pricing", () => {
  async function renderCard(
    originalFee?: number,
    metadataOriginalFee?: number,
  ) {
    const stream = await renderToReadableStream(
      <UniversityCard
        university={uni}
        locale="en"
        minTuition={3500}
        originalFee={originalFee}
        listingMetadata={{
          city: null,
          minTuitionUSD: 3500,
          originalFeeUSD: metadataOriginalFee,
          rating: 4.5,
          count: 10,
          degreeLevels: ["bachelor"],
        }}
        labels={labels}
      />,
    );
    const reader = stream.getReader();
    let html = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      html += new TextDecoder().decode(value);
    }
    return html;
  }

  it("renders discounted price with strikethrough original when originalFee > tuition", async () => {
    const html = await renderCard(5000);
    expect(html).toContain("$3,500");
    expect(html).toContain("line-through");
    expect(html).toContain("$5,000");
  });

  it("does not show strikethrough when there is no original fee", async () => {
    const html = await renderCard();
    expect(html).toContain("$3,500");
    expect(html).not.toContain("line-through");
  });

  it("uses listing metadata original fee when explicit prop is absent", async () => {
    const html = await renderCard(undefined, 3850);
    expect(html).toContain("$3,500");
    expect(html).toContain("line-through");
    expect(html).toContain("$3,850");
  });
});
