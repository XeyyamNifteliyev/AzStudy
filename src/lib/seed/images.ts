/**
 * Reusable imagery — all LOCAL (public/images/**).
 * Centralised so a single edit updates imagery across the site.
 *
 * Each university has a unique hero image in public/images/universities/{slug}/hero.webp
 */

const local = (path: string) => `/images/${path}`;

export const seedImages = {
  // Campus / university imagery (using available Azerbaijan blog images)
  campusLibrary: local("blog/baku-universities.webp"),
  campusBuilding: local("hero-graduation.webp"),
  campusAerial: local("blog/baku-universities.webp"),
  students: local("blog/apply-azerbaijan.webp"),
  // City imagery
  baku: local("blog/baku-universities.webp"),
  ganja: local("blog/why-azerbaijan.webp"),
  sumqayit: local("blog/baku-universities.webp"),
  // Subject area imagery
  medicine: local("blog/scholarships.webp"),
  engineering: local("blog/azerbaijani-language.webp"),
  computer: local("blog/cost-of-living.webp"),
  business: local("blog/baku-universities.webp"),
  law: local("blog/apply-azerbaijan.webp"),
  architecture: local("blog/why-azerbaijan.webp"),
  dentistry: local("blog/scholarships.webp"),
  arts: local("blog/azerbaijani-language.webp"),
  // Dorm / life imagery
  dorm: local("blog/cost-of-living.webp"),
  dorm2: local("blog/apply-azerbaijan.webp"),
  graduation: local("blog/scholarships.webp"),
  cityNight: local("hero-graduation.webp"),
};

export const heroByCategory: Record<string, string> = {
  medicine: seedImages.medicine,
  engineering: seedImages.engineering,
  "computer-science": seedImages.computer,
  business: seedImages.business,
  law: seedImages.law,
  architecture: seedImages.architecture,
  dentistry: seedImages.dentistry,
  arts: seedImages.arts,
};

export const cityImage: Record<string, string> = {
  baku: seedImages.baku,
  gence: seedImages.ganja,
  sumqayit: seedImages.sumqayit,
  naxcivan: seedImages.ganja,
  lankaran: seedImages.ganja,
  mingachevir: seedImages.ganja,
};

/**
 * Unique hero image for each university (WebP on disk — see
 * scripts/optimize-images.mjs).
 */
export function universityHero(slug: string): string {
  return `/images/universities/${slug}/hero.webp`;
}
