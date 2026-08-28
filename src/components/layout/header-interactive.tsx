"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { type AppLocale } from "@/i18n/routing";
// PERF(P0): code-split GoogleSignInButton (and its @supabase/supabase-js
// dependency, ~40KB gz) out of the global header chunk. It only loads lazily
// after hydration, and only renders for anonymous visitors once /api/me
// resolves to no session.
import dynamic from "next/dynamic";
const GoogleSignInButton = dynamic(
  () =>
    import("@/components/auth/GoogleSignInButton").then(
      (m) => m.GoogleSignInButton,
    ),
  {
    ssr: false,
    loading: () => (
      <span className="inline-block h-9 w-full max-w-[140px] animate-pulse rounded bg-muted" />
    ),
  },
);
const StudentProfileDrawer = dynamic(
  () => import("@/components/student/StudentProfileDrawer").then((m) => m.StudentProfileDrawer),
  { ssr: false },
);
import type { Profile } from "@/types/crm";

interface HeaderSession {
  userId: string;
  profile: Profile;
}

// F2: Only the interactive parts of the header are client-side:
// mobile menu toggle, auth control (session fetch), profile drawer.
// The static shell (logo, desktop nav, apply button) is server-rendered.
export function HeaderInteractive() {
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [session, setSession] = useState<HeaderSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const redirectTo = `/${locale}`;
  const initial = (
    session?.profile.fullName.trim().charAt(0) || "?"
  ).toUpperCase();

  // Resolves the current session. Returns true when a profile was found, false
  // otherwise — the caller decides how to handle a still-absent session. This
  // is important for the first Google sign-in, where /api/me can race the
  // server-side Supabase session settling and briefly return null.
  const loadSession = useCallback(async (): Promise<boolean> => {
    try {
      const r = await fetch("/api/me", { cache: "no-store" });
      const data = await r.json();
      if (data && data.profile) {
        setSession({ userId: data.userId, profile: data.profile });
        setLoading(false);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Initial load on mount (non-OAuth). A single attempt is enough for returning
  // visitors whose session is already established; on a miss we stop loading so
  // the login button shows. The ?auth=success path is handled by the next
  // effect to avoid the two racing each other.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("auth") === "success")
      return;
    let active = true;
    loadSession().then((found) => {
      if (!active) return;
      if (!found) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [loadSession]);

  // After Google OAuth the app redirects back with ?auth=success. The first
  // /api/me on that load can race the Supabase session settling server-side and
  // return null, so poll with increasing backoff until the session is picked up
  // (up to ~7.2s across 6 attempts). The header keeps its loading indicator the
  // whole time and only falls back to the login button if every attempt misses.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("auth") !== "success")
      return;
    let active = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const delays = [0, 300, 700, 1200, 2000, 3000];
    let attempt = 0;

    const poll = async () => {
      if (!active) return;
      const found = await loadSession();
      if (!active) return;
      if (found) return;
      attempt += 1;
      if (attempt >= delays.length) {
        setLoading(false);
        return;
      }
      timer = setTimeout(poll, delays[attempt]);
    };

    poll();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [loadSession]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || !session) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") !== "success") return;
    setDrawerOpen(true);
    params.delete("auth");
    const clean = params.toString();
    const path = window.location.pathname;
    window.history.replaceState({}, "", clean ? `${path}?${clean}` : path);
  }, [session]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape key closes the mobile menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Dialog-style focus management: move focus into the drawer when it opens
  // and back to the toggle button when it closes (keyboard/AT users). Skip
  // the initial mount so the page load doesn't steal focus.
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      drawerRef.current?.focus();
    } else if (wasOpen.current) {
      menuToggleRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  function AuthControl() {
    if (loading) {
      return (
        <span
          className="inline-block h-8 w-8 rounded-full bg-muted"
          aria-hidden
        />
      );
    }
    if (session) {
      return (
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 rounded-full p-1 pe-3 text-sm font-medium text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-sm font-bold">
            {initial}
          </span>
          <span className="hidden sm:inline">
            {session.profile.fullName.split(" ")[0]}
          </span>
        </button>
      );
    }
    return <GoogleSignInButton next={redirectTo} />;
  }

  return (
    <>
      {/* Desktop auth control */}
      <div className="hidden shrink-0 sm:block">{AuthControl()}</div>

      {/* Mobile menu toggle */}
      <button
        type="button"
        ref={menuToggleRef}
        className="inline-flex h-10 w-10 items-center justify-center rounded text-foreground hover:bg-accent md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label={tCommon("menu")}
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile menu — right-side drawer with dark overlay (StudyLeo-style).
          Rendered via portal so it sits above every other element (the sticky
          header otherwise traps it in a stacking context behind the hero). */}
      {open &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] h-dvh md:hidden">
            {/* Overlay — click to close */}
            <button
              type="button"
              aria-label={tCommon("close")}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <aside
              id="mobile-menu"
              ref={drawerRef}
              tabIndex={-1}
              className="absolute inset-y-0 end-0 flex w-[70%] min-w-[260px] max-w-[380px] flex-col bg-card shadow-2xl focus:outline-none"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
                <span className="font-display text-xl font-semibold text-foreground">
                  {tCommon("menu")}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={tCommon("close")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded text-foreground hover:bg-accent"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav
                className="flex flex-1 flex-col overflow-y-auto px-3 py-4"
                aria-label={tCommon("menu")}
              >
                <ul className="flex-1 space-y-1">
                  <li>
                    <Link
                      href="/"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      {t("home")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/universities"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      {t("universities")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/programs"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      {t("programs")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/compare"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      {t("compare")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      {t("about")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      {t("blog")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      {t("contact")}
                    </Link>
                  </li>
                </ul>

                <div className="mt-6 space-y-3 border-t border-border pt-5">
                  {/* Locale switcher intentionally NOT here — it lives in the
                      header bar next to the hamburger. */}
                  <div>{AuthControl()}</div>
                </div>
              </nav>
            </aside>
          </div>,
          document.body,
        )}

      {/* Profile drawer */}
      {session && (
        <StudentProfileDrawer
          session={session}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        />
      )}
    </>
  );
}
