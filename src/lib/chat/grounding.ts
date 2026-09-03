import { seedUniversities } from "@/lib/seed/universities";
import { seedCities } from "@/lib/seed/cities";

/**
 * Chat grounding — compact, authoritative site facts injected into the
 * chatbot system prompt.
 *
 * The OpenAI model has no built-in knowledge of this site's actual catalogue,
 * so without grounding it invents tuition numbers and university names. This
 * module builds a bounded (~700 token) EN fact sheet from the university seed
 * at module load and instructs the model to prefer it over general knowledge.
 *
 * Why seed data and not the DB: the chat route runs on the Edge runtime and
 * must not open a database connection per request. The seed mirrors the
 * published catalogue (names, cities, founding years, state/private status).
 * Tuition is deliberately NOT enumerated per university — it lives in the
 * per-program data (DB) and changes often; the fact sheet instead gives the
 * honest range and directs the student to the university page for exact fees,
 * which keeps the model from ever inventing a specific number.
 */
export function buildChatGrounding(): string {
  const cityNames = new Map(seedCities.map((c) => [c.id, c.name.en]));

  const lines = seedUniversities.map((u) => {
    const city = cityNames.get(u.cityId) ?? "Azerbaijan";
    const type = u.isState ? "state" : "private";
    return `• ${u.name} — ${city}, ${type}, est. ${u.foundedYear}`;
  });

  const stateCount = seedUniversities.filter((u) => u.isState).length;
  const privateCount = seedUniversities.length - stateCount;

  return [
    "The user is on azstudy — a website for studying in Azerbaijan.",
    `The site lists ${seedUniversities.length} universities (${stateCount} state, ${privateCount} private) with programs, tuition, rankings, reviews and an application service.`,
    "Tuition in Azerbaijan ranges from roughly $500 to $4,000/year at most state universities and up to ~$15,000/year at some private/Baku institutions; living costs in Baku are about $400/month, less in other cities.",
    "VERIFY tuition on the university's own page on the site before quoting a number. NEVER invent an exact fee, scholarship amount or deadline.",
    "Universities on the site:",
    ...lines,
  ].join("\n");
}
