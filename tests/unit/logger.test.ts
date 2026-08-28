import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger } from "@/lib/logger";

describe("logger (QA-1)", () => {
  beforeEach(() => {
    // Direct assignment (not vi.spyOn): Vitest 4 routes its own test-runner
    // output through the spied console methods, which pollutes call counts.
    // Replacing the methods outright isolates the logger's writes.
    console.error = vi.fn();
    console.warn = vi.fn();
    console.log = vi.fn();
  });

  it("emits a single JSON line with level + message", () => {
    logger.info("hello", { requestId: "r1" });
    expect(console.log).toHaveBeenCalledOnce();
    const line = (console.log as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    const parsed = JSON.parse(line);
    expect(parsed.level).toBe("info");
    expect(parsed.message).toBe("hello");
    expect(parsed.requestId).toBe("r1");
    expect(parsed.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("routes error/warn/info to the right console method", () => {
    logger.error("e");
    logger.warn("w");
    logger.info("i");
    expect(console.error).toHaveBeenCalledOnce();
    expect(console.warn).toHaveBeenCalledOnce();
    expect(console.log).toHaveBeenCalledOnce();
  });

  it("serializes Error objects to name + message (no raw object dump)", () => {
    logger.error("boom", undefined, new Error("db down"));
    const line = (console.error as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    const parsed = JSON.parse(line);
    expect(parsed.error).toMatchObject({ name: "Error", message: "db down" });
  });

  it("serializes non-Error throws to a string", () => {
    logger.error("boom", undefined, "string error");
    const parsed = JSON.parse(
      (console.error as ReturnType<typeof vi.fn>).mock.calls[0][0] as string,
    );
    expect(parsed.error).toBe("string error");
  });
});
