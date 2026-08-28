import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, existsSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local / .env into process.env (vitest does not auto-load them).
for (const file of [".env.local", ".env"]) {
  const envPath = path.resolve(__dirname, file);
  if (!existsSync(envPath)) continue;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, value] = match;
    if (process.env[key] === undefined) {
      process.env[key] = value.replace(/^["']|["']$/g, "");
    }
  }
}

// Unit tests that touch the DB must run against the local Docker Postgres
// (docker-compose.yml), never against the production Supabase URL that
// .env.local may point at. This keeps test writes off the live database.
if (!process.env.CI && process.env.DATABASE_URL?.includes("supabase.co")) {
  process.env.DATABASE_URL =
    "postgresql://study:study@localhost:5433/study_crm";
}

export default defineConfig({
  // Vitest 4 defaults to the oxc transform, which follows tsconfig's
  // `jsx: "preserve"` and leaves JSX untransformed (parse failure in .tsx
  // tests). Disable it and use the esbuild transform, which we configure to
  // compile JSX automatically.
  oxc: false,
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    setupFiles: ["tests/unit/setup.ts"],
    // jsdom for component tests is set per-file with `@vitest-environment jsdom`
    // (Vitest 4 removed `environmentMatchGlobs`).
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/lib/seed/**", "src/types/**", "src/messages/**"],
      thresholds: { lines: 60, functions: 60, branches: 50, statements: 60 },
    },
  },
});
