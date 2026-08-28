"use client";

import { siteConfig } from "@/config/site";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function FloatingChatButtons() {
  const pathname = usePathname();
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const onChatOpenChange = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      setChatOpen(Boolean(detail?.open));
    };
    window.addEventListener("studyhub:chat-open-change", onChatOpenChange);
    return () => {
      window.removeEventListener("studyhub:chat-open-change", onChatOpenChange);
    };
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const { number, message } = siteConfig.contact.whatsapp;
  const whatsappHref = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  const telegramHref = siteConfig.contact.telegram.url;

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-3 transition-all duration-200",
        // Keep the stack on the left, above the chat button, so it never
        // collides with the Apply button on the right — on any screen size.
        // When the chat panel opens, slide the stack out of view.
        chatOpen
          ? "pointer-events-none -translate-x-24 opacity-0"
          : "bottom-28 start-6",
      )}
    >
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-whatsapp text-white shadow-flat-hover transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.523 5.255l-.999 3.648 3.965-1.039zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
        </svg>
      </a>
      <a
        href={telegramHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-telegram text-white shadow-flat-hover transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
        </svg>
      </a>
    </div>
  );
}

export { FloatingChatButtons as WhatsAppFloat };
