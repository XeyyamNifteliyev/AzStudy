/**
 * next/image can't optimize SVG files (they're vector). When a logo URL ends
 * in .svg, mark the Image as unoptimized so Next serves the file directly
 * instead of 400-ing on /_next/image.
 */
export function isSvgUrl(src: string): boolean {
  return src.toLowerCase().endsWith(".svg");
}
