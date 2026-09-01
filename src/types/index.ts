import type { AppLocale } from "@/i18n/routing";

export type LocalizedString = Partial<Record<AppLocale, string>>;

export type DegreeLevel = "bachelor" | "master" | "phd" | "associate";

export type ProgramCategorySlug =
  | "medicine"
  | "engineering"
  | "computer-science"
  | "business"
  | "law"
  | "architecture"
  | "dentistry"
  | "arts"
  | "social-sciences"
  | "health-sciences"
  | "natural-sciences"
  | "humanities"
  | "communication"
  | "tourism"
  | "agriculture";

export interface ProgramCategory {
  slug: ProgramCategorySlug;
  name: LocalizedString;
  icon?: string;
}

export interface Country {
  code: string;
  slug: string;
  name: LocalizedString;
  flag: string;
}

export interface City {
  id: string;
  slug: string;
  name: LocalizedString;
  countryId: string;
  monthlyLivingCostUSD?: number;
}

export interface University {
  id: string;
  name: string;
  nameI18n?: LocalizedString;
  slug: string;
  cityId: string;
  foundedYear: number;
  studentCount: number;
  ranking: number;
  accreditation: string;
  isState: boolean;
  logoText: string;
  logoImage?: string;
  heroImage: string;
  gallery: string[];
  tagline: LocalizedString;
  description: LocalizedString;
  languages: string[];
  featured?: boolean;
  /** ISO timestamp of last content change (sitemap lastmod). */
  updatedAt?: string;
}

export interface Program {
  id: string;
  slug: string;
  name: LocalizedString;
  degreeLevel: DegreeLevel;
  categorySlug: ProgramCategorySlug;
  durationYears: number;
}

// Instruction languages taught at Turkish universities. The StudyLeo catalog
// contains Arabic- and Russian-taught programs, so the union covers all four.
export type InstructionLanguage = "tr" | "en" | "ar" | "ru" | "az";

export interface UniversityProgram {
  id: string;
  universityId: string;
  programId: string;
  language: InstructionLanguage;
  tuitionFee: number; // discounted (scholarship) price
  originalFee?: number; // list price; undefined when no discount
  currency: "USD" | "AZN";
  scholarshipAvailable: boolean;
}

export interface Scholarship {
  id: string;
  universityId: string;
  name: LocalizedString;
  percentage: number;
  requirements: LocalizedString;
}

export interface Dormitory {
  id: string;
  universityId: string;
  capacity: number;
  pricePerMonth: number;
  currency: "USD" | "AZN";
  photos: string[];
}

export interface Review {
  id: string;
  universityId: string;
  authorName: string;
  authorCountry: string;
  authorInitials: string;
  rating: number;
  text: LocalizedString;
  verified: boolean;
  programStudied: LocalizedString;
  year: number;
}

export type FaqEntityType = "university" | "general";

export interface Faq {
  id: string;
  entityType: FaqEntityType;
  entityId: string;
  question: LocalizedString;
  answer: LocalizedString;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content: LocalizedString;
  author: string;
  publishedAt: string;
  coverImage: string;
  category: LocalizedString;
  readingMinutes: number;
  /** ISO timestamp of last content change (Article dateModified, sitemap). */
  updatedAt?: string;
  /** SEO-optimized meta title (≤60 chars). Falls back to title if absent. */
  metaTitle?: LocalizedString;
  /** SEO-optimized meta description (≤155 chars). Falls back to excerpt if absent. */
  metaDescription?: LocalizedString;
  /** FAQ pairs for FAQPage JSON-LD + on-page FAQ section. */
  faqs?: Array<{
    q: string;
    a: string;
    /** Locale overrides — when present, rendered instead of q/a. */
    qI18n?: LocalizedString;
    aI18n?: LocalizedString;
  }>;
}

export interface UniversityFilters {
  citySlug?: string;
  degreeLevel?: DegreeLevel;
  language?: InstructionLanguage;
  isState?: boolean;
  search?: string;
  maxTuitionUSD?: number;
}

export interface UniversityDetail extends University {
  city?: City;
  programs: Array<UniversityProgram & { program: Program }>;
  scholarships: Scholarship[];
  dormitories: Dormitory[];
}

export interface ProgramCombination {
  categorySlug: ProgramCategorySlug;
  citySlug: string;
  programIds: string[];
  universityCount: number;
  minTuitionUSD: number;
}
