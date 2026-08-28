import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Study in Azerbaijan`,
    short_name: siteConfig.shortName,
    description: siteConfig.description.en,
    start_url: "/",
    display: "standalone",
    background_color: "#f9f9ff",
    theme_color: "#003d9b",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      // SE-8: maskable-safe PNGs for install prompts (safe zone 80%).
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
