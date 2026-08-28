// Root layout for the app-level special files that have no URL segment:
// the global not-found page and the non-locale OpenGraph image.
//
// Next.js 15 requires every route (including /_not-found and metadata image
// routes) to have a root layout. The localized routes own theirs in
// src/app/[locale]/layout.tsx and the admin panel in src/app/admin/layout.tsx;
// this group gives the root-level files their own <html>/<body> so 404s and
// /opengraph-image stop 500-ing with "not-found.tsx doesn't have a root layout".
export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
