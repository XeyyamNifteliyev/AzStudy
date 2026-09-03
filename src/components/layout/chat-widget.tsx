"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/**
 * AI chatbot floating widget.
 *
 * Renders a floating chat button + expandable panel. Only shown in the 4 GEO
 * locales (en/tr/az/ru) — the caller gates this with `isGeoLocale`. Messages
 * are sent to `/api/chat` (Edge runtime, OpenAI-backed).
 */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  /** Internal: this assistant bubble is still receiving streamed text. */
  streaming?: boolean;
}

export function ChatWidget() {
  const t = useTranslations("Chatbot");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: t("greeting") },
  ]);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Close on Escape while the panel is open (dialog semantics).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // FE-7: focus trap — move focus into the panel on open, keep Tab inside,
  // restore focus to the toggle button on close.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    inputRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, input, [href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Restore focus to the toggle when the panel closes.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => toggleRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  // UI-1: let the WhatsApp/Telegram stack move out of the chat panel's way.
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("azstudy:chat-open-change", { detail: { open } }),
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent("azstudy:chat-open-change", {
          detail: { open: false },
        }),
      );
    };
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(false);
    // Accumulator for streamed text, visible to the catch below so a
    // mid-stream abort keeps the partial reply instead of wiping it.
    let partial = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: document.documentElement.lang,
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      // Backwards-compatible fallback: a non-SSE response (e.g. a proxy or an
      // older deploy) still carries the full reply as JSON.
      const isStream =
        (res.headers.get("content-type") ?? "").includes("text/event-stream") &&
        res.body;
      if (!res.ok) throw new Error("api");
      if (!isStream) {
        const data = await res.json();
        if (data.error) throw new Error("api");
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply ?? "" },
        ]);
        return;
      }

      // SSE: read `data: {"content":"…"}` deltas and grow the assistant
      // bubble in place — the reply appears as it is generated (TTFT ~0).
      const reader = (res.body as ReadableStream<Uint8Array>).getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const appendDelta = (chunk: string) => {
        partial += chunk;
        setMessages((prev) => {
          const hasStreaming = prev.some((m) => m.streaming);
          return hasStreaming
            ? prev.map((m) =>
                m.streaming
                  ? {
                      role: "assistant" as const,
                      content: partial,
                      streaming: true,
                    }
                  : m,
              )
            : [
                ...prev,
                {
                  role: "assistant" as const,
                  content: partial,
                  streaming: true,
                },
              ];
        });
      };

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const json = JSON.parse(data) as {
              content?: string;
              error?: boolean;
            };
            if (json.error) throw new Error("stream-error");
            if (json.content) appendDelta(json.content);
          } catch (e) {
            if (e instanceof Error && e.message === "stream-error") throw e;
            // Ignore malformed keep-alive frames.
          }
        }
      }

      // Finalize: strip the transient flag so the bubble renders as a normal
      // assistant message. A stream that never delivered text falls through to
      // the error bubble below.
      if (!partial) throw new Error("empty-stream");
      setMessages((prev) =>
        prev.map((m) =>
          m.streaming ? { role: "assistant" as const, content: partial } : m,
        ),
      );
    } catch {
      if (partial) {
        // Stream aborted mid-way (timeout / upstream error): keep the text
        // the user already saw.
        setMessages((prev) =>
          prev.map((m) =>
            m.streaming ? { role: "assistant" as const, content: partial } : m,
          ),
        );
      } else {
        setError(true);
        setMessages((prev) => [
          ...prev.filter((m) => !m.streaming),
          { role: "assistant", content: t("error") },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        ref={toggleRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("closed") : t("title")}
        aria-expanded={open}
        aria-controls="chat-widget-panel"
        className="fixed bottom-5 start-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-flat-hover transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          id="chat-widget-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-widget-title"
          className="fixed bottom-24 start-5 z-50 flex h-[420px] w-[340px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-flat-plus"
        >
          {/* Header */}
          <div className="border-b border-border bg-surface-low p-4">
            <p
              id="chat-widget-title"
              className="font-display font-semibold text-foreground"
            >
              {t("title")}
            </p>
            <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : error && i === messages.length - 1
                        ? "bg-destructive/10 text-foreground"
                        : "bg-surface-low text-foreground",
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg bg-surface-low px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={t("placeholder")}
                disabled={loading}
                className="flex-1 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                aria-label={t("send")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
