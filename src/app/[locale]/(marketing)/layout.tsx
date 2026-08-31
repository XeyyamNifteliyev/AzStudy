import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingChatButtons } from "@/components/layout/whatsapp-float";
import { FloatingApplyButton } from "@/components/layout/FloatingApplyButton";
import { BackToTop } from "@/components/layout/back-to-top";
// ChatWidgetMount lazy-loads the chat widget on the client (code-splitting).
// A server-side <Suspense> is deliberately avoided: Suspense in the tree
// forces streaming, which makes notFound() return HTTP 200 (soft-404) instead
// of a real 404 on university/blog/country pages.
import { ChatWidgetMount } from "@/components/layout/chat-widget-mount";
import { isGeoLocale } from "@/lib/seo/geo";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const showChat = isGeoLocale(locale);

  return (
    <>
      {/* Film-grain overlay — fixed, pointer-events-none (skill §6) */}
      <div className="noise-overlay" aria-hidden />
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <FloatingApplyButton />
      <BackToTop />
      <FloatingChatButtons />
      {/* AI chatbot — only in 4 GEO locales (en/tr/az/ru), mounted client-side */}
      {showChat && <ChatWidgetMount />}
    </>
  );
}
