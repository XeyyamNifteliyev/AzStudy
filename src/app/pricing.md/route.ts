import { siteConfig } from "@/config/site";
import { data } from "@/lib/data";
import { seedUniversityPrograms } from "@/lib/seed";

// /pricing.md — Machine-readable pricing data for AI agents and crawlers.
// AI agents evaluating study-abroad options on behalf of users need structured,
// parseable pricing information. This route provides a markdown summary of
// tuition ranges, living costs, and scholarship availability.

export const dynamic = "force-static";

export async function GET() {
  const universities = await data.universities.list();

  // Calculate tuition ranges from seed data
  const tuitionRanges = {
    state: { min: Infinity, max: 0 },
    private: { min: Infinity, max: 0 },
  };

  for (const uni of universities) {
    const isState = uni.isState;
    const range = isState ? tuitionRanges.state : tuitionRanges.private;

    // Get programs for this university from seed data
    const uniPrograms = seedUniversityPrograms.filter(
      (up) => up.universityId === uni.id && up.currency === "USD"
    );

    for (const prog of uniPrograms) {
      if (prog.tuitionFee > 0) {
        range.min = Math.min(range.min, prog.tuitionFee);
        range.max = Math.max(range.max, prog.tuitionFee);
      }
    }
  }

  // Fix Infinity values
  if (tuitionRanges.state.min === Infinity) tuitionRanges.state.min = 600;
  if (tuitionRanges.state.max === 0) tuitionRanges.state.max = 3000;
  if (tuitionRanges.private.min === Infinity) tuitionRanges.private.min = 3000;
  if (tuitionRanges.private.max === 0) tuitionRanges.private.max = 15000;

  // Living cost estimates (monthly, USD)
  const livingCosts = {
    accommodation: { min: 100, max: 300 },
    food: { min: 150, max: 250 },
    transportation: { min: 20, max: 50 },
    entertainment: { min: 50, max: 100 },
    total: { min: 320, max: 700 },
  };

  // Scholarship information
  const scholarshipInfo = {
    government: "100% coverage available",
    university: "25-100% merit-based discounts",
    availability: "Limited spots, competitive",
  };

  const body = `# Pricing — ${siteConfig.name}

## Overview

Study in Azerbaijan offers affordable education with tuition significantly lower than Western countries. Prices are in USD per year for international students.

## Tuition Fees

### State Universities
- **Annual Tuition:** $${tuitionRanges.state.min}–${tuitionRanges.state.max}/year
- **Popular Programs:** Medicine, Engineering, Computer Science, Business
- **Languages:** Azerbaijani, English, Russian

### Private Universities
- **Annual Tuition:** $${tuitionRanges.private.min}–${tuitionRanges.private.max}/year
- **English Programs:** Available at most private institutions
- **Popular Fields:** Business, International Relations, Engineering

## Living Costs (Monthly, USD)

| Category | Range |
|----------|-------|
| Accommodation | $${livingCosts.accommodation.min}–${livingCosts.accommodation.max} |
| Food | $${livingCosts.food.min}–${livingCosts.food.max} |
| Transportation | $${livingCosts.transportation.min}–${livingCosts.transportation.max} |
| Entertainment | $${livingCosts.entertainment.min}–${livingCosts.entertainment.max} |
| **Total** | **$${livingCosts.total.min}–${livingCosts.total.max}** |

## Scholarships

### Government Scholarships
- **Coverage:** ${scholarshipInfo.government}
- **Availability:** ${scholarshipInfo.availability}

### University Scholarships
- **Coverage:** ${scholarshipInfo.university}
- **Types:** Merit-based, need-based, athletic

## Payment Information

- **Currency:** USD (most programs), AZN (some local programs)
- **Payment Schedule:** Annual or semester-based
- **Additional Fees:** Registration ($50-100), Health Insurance ($100-200/year)

## Contact

For detailed pricing and application:
- **Website:** ${siteConfig.url}
- **Email:** ${siteConfig.contact.email}
- **Phone:** ${siteConfig.contact.phone}

---

*Last updated: ${new Date().toISOString().split("T")[0]}*
*Data source: AzStudy partner-university data. Ranges are indicative — confirm current fees with each university.*
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
