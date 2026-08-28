import { getPool } from "@/lib/db";
import { createSeedDataLayer } from "./seed-repository";
import { createPgDataLayer } from "./pg-data-repository";
import type { DataLayer } from "./repositories";

/**
 * Single data-access entry point.
 *
 * When `DATABASE_URL` is set (local Docker Postgres or Supabase), the marketing/
 * public read layer uses a Postgres-backed repository seeded from `src/lib/seed`.
 * Otherwise it falls back to the in-memory seed layer (useful for quick tests).
 */
// BE-1: one shared pool for the whole app (see src/lib/db.ts).
export const getSharedPool = getPool;

function createDataLayer(): DataLayer {
  // During the Next.js production build, prerendering 800+ marketing pages
  // against the live Postgres exhausts the shared connection pool
  // (EMAXCONNSESSION, pool_size 15). The seed layer is the source of truth for
  // all marketing content and is fully API-parity with the PG layer, so
  // prerender from in-memory seed data and hit Postgres only at runtime.
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return createSeedDataLayer();
  }
  if (process.env.DATABASE_URL) return createPgDataLayer(getSharedPool);
  return createSeedDataLayer();
}

export const data: DataLayer = createDataLayer();

export type { DataLayer } from "./repositories";
export type {
  UniversityRepository,
  CityRepository,
  CountryRepository,
  ProgramRepository,
  ReviewRepository,
  FaqRepository,
  ScholarshipRepository,
  BlogRepository,
} from "./repositories";
