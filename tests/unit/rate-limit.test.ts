import { describe, it, expect, afterEach } from "vitest";
import { rateLimit, getIpFromHeaders } from "../../src/lib/rate-limit";

describe("rate limiter (in-memory fallback)", () => {
  it("allows requests under the limit and rejects over it", async () => {
    const limiter = rateLimit({ windowMs: 60_000, max: 3 });
    expect(await limiter.check("a")).toBe(true);
    expect(await limiter.check("a")).toBe(true);
    expect(await limiter.check("a")).toBe(true);
    expect(await limiter.check("a")).toBe(false);
  });

  it("tracks keys independently", async () => {
    const limiter = rateLimit({ windowMs: 60_000, max: 1 });
    expect(await limiter.check("x")).toBe(true);
    expect(await limiter.check("y")).toBe(true);
    expect(await limiter.check("x")).toBe(false);
  });

  it("resets after the window elapses", async () => {
    const limiter = rateLimit({ windowMs: 50, max: 1 });
    expect(await limiter.check("k")).toBe(true);
    expect(await limiter.check("k")).toBe(false);
    await new Promise((r) => setTimeout(r, 60));
    expect(await limiter.check("k")).toBe(true);
  });
});

describe("getIpFromHeaders", () => {
  const original = process.env.TRUST_PROXY;

  afterEach(() => {
    if (original === undefined) delete process.env.TRUST_PROXY;
    else process.env.TRUST_PROXY = original;
  });

  it("ignores x-forwarded-for when TRUST_PROXY is unset", () => {
    delete process.env.TRUST_PROXY;
    expect(
      getIpFromHeaders((n) => (n === "x-forwarded-for" ? "1.2.3.4" : null)),
    ).toBe("unknown");
  });

  it("ignores x-real-ip when TRUST_PROXY is unset", () => {
    delete process.env.TRUST_PROXY;
    expect(
      getIpFromHeaders((n) => (n === "x-real-ip" ? "1.2.3.4" : null)),
    ).toBe("unknown");
  });

  it("trusts x-forwarded-for when TRUST_PROXY=1", () => {
    process.env.TRUST_PROXY = "1";
    expect(
      getIpFromHeaders((n) =>
        n === "x-forwarded-for" ? "1.2.3.4, 10.0.0.1" : null,
      ),
    ).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip when TRUST_PROXY=1 and no x-forwarded-for", () => {
    process.env.TRUST_PROXY = "1";
    expect(
      getIpFromHeaders((n) => (n === "x-real-ip" ? "5.6.7.8" : null)),
    ).toBe("5.6.7.8");
  });
});
