import { describe, it, expect, afterEach, vi } from "vitest";
import { isDevAuthEnabled } from "@/lib/crm/student-session";

const originalEnv = process.env;

afterEach(() => {
  process.env = { ...originalEnv };
  vi.unstubAllEnvs();
});

describe("isDevAuthEnabled", () => {
  it("enables dev auth when the flag is set locally (dev or prod build)", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("DEV_AUTH_ENABLED", "1");
    vi.stubEnv("VERCEL", undefined);
    expect(isDevAuthEnabled()).toBe(true);
  });

  it("stays disabled on Vercel even if the flag leaks", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("DEV_AUTH_ENABLED", "1");
    vi.stubEnv("VERCEL", "1");
    expect(isDevAuthEnabled()).toBe(false);
  });

  it("stays disabled when the flag is unset", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("DEV_AUTH_ENABLED", "0");
    vi.stubEnv("VERCEL", undefined);
    expect(isDevAuthEnabled()).toBe(false);
  });
});
