import Link from "next/link";

// Global 404 for non-locale routes (e.g. /api/*, unknown paths). Localized
// 404s live in src/app/[locale]/not-found.tsx. Lives in the (root) route group
// so it has a root layout (see (root)/layout.tsx) — a layout-less root
// not-found.tsx makes every 404 return HTTP 500 in Next.js 15. That layout
// does not import globals.css, so inline styles are required here; colors
// mirror the design tokens (primary #003d9b, CTA #c95c00).
export default function GlobalNotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        background: "#f5f7fb",
        color: "#151c27",
      }}
    >
      <p
        style={{
          fontSize: "4rem",
          fontWeight: 700,
          color: "#003d9b",
          margin: 0,
        }}
      >
        404
      </p>
      <h1 style={{ fontSize: "1.75rem", marginTop: "1rem" }}>Page not found</h1>
      <p style={{ color: "#4b5563", marginTop: "0.75rem", maxWidth: 420 }}>
        The page you are looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/en" style={{ marginTop: "1.5rem", textDecoration: "none" }}>
        <button
          style={{
            background: "#c95c00",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.75rem 1.5rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Go home
        </button>
      </Link>
    </div>
  );
}
