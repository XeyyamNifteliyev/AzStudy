import { describe, it, expect } from "vitest";
import { sniffMime } from "@/lib/security/mime-sniff";

describe("sniffMime (SEC-3 magic-byte verification)", () => {
  it("detects JPEG by its FF D8 FF signature regardless of file.type", () => {
    expect(sniffMime(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00]))).toBe(
      "image/jpeg",
    );
  });

  it("detects PNG by its 89 50 4E 47 signature", () => {
    expect(sniffMime(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]))).toBe(
      "image/png",
    );
  });

  it("detects PDF by its %PDF signature", () => {
    expect(sniffMime(Buffer.from("%PDF-1.4"))).toBe("application/pdf");
  });

  it("rejects a buffer with a spoofed extension but wrong bytes (e.g. exe named .jpg)", () => {
    // MZ = Windows PE executable header
    expect(sniffMime(Buffer.from([0x4d, 0x5a, 0x90, 0x00]))).toBeNull();
  });

  it("rejects scripts / HTML uploaded as an image", () => {
    expect(sniffMime(Buffer.from("<script>alert(1)</script>"))).toBeNull();
  });

  it("rejects buffers shorter than 4 bytes", () => {
    expect(sniffMime(Buffer.from([0xff, 0xd8]))).toBeNull();
  });
});
