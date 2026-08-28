/**
 * Magic-byte (file signature) sniff — the client-sent `file.type` is trivially
 * spoofable, so verify the actual bytes instead. Returns the real MIME type
 * for the formats we accept, or null if the buffer doesn't match a known sig.
 *
 * Exported separately (not from the 'use server' action file) so it can be
 * unit-tested directly.
 */
export function sniffMime(buf: Buffer): string | null {
  if (buf.length < 4) return null;
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)
    return "image/jpeg";
  // PNG: 89 50 4E 47 (%PNG)
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47)
    return "image/png";
  // PDF: 25 50 44 46 (%PDF)
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46)
    return "application/pdf";
  return null;
}
