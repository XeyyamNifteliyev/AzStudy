"use client";

import dynamic from "next/dynamic";

// Client-only mount for the AI chat widget.
//
// Two birds with one stone:
//  - Code-splitting: the heavy ChatWidget chunk (OpenAI fetch, message state)
//    only downloads after the page hydrates.
//  - SEO: `ssr: false` renders nothing on the server, so the marketing layout
//    no longer needs a <Suspense> boundary. Suspense anywhere in the tree
//    forces Next.js into streaming mode, which makes notFound() return HTTP
//    200 with the 404 page body (a soft-404). Without streaming, university /
//    blog / country pages return a real 404 status.
const ChatWidget = dynamic(
  () => import("./chat-widget").then((m) => m.ChatWidget),
  { ssr: false },
);

export function ChatWidgetMount() {
  return <ChatWidget />;
}
