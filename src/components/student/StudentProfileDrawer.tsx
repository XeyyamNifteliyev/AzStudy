"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type LucideIcon } from "lucide-react";
import {
  Bell,
  ChevronRight,
  ExternalLink,
  FileText,
  GraduationCap,
  LogOut,
  MessageSquare,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signOutStudent } from "@/app/actions/student-auth";
import { signOutAdmin } from "@/app/actions/admin-auth";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/crm";

export interface StudentProfileDrawerProps {
  session: { userId: string; profile: Profile };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentProfileDrawer({
  session,
  open,
  onOpenChange,
}: StudentProfileDrawerProps) {
  const t = useTranslations("Student");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const [showProfile, setShowProfile] = useState(false);
  const [pending, startTransition] = useTransition();

  const dash = `/${locale}/dashboard`;
  const isAdmin = session.profile.role === "admin";
  const initial = (
    session.profile.fullName.trim().charAt(0) || "?"
  ).toUpperCase();

  // Sign out via the server action, then do a hard reload so the header's
  // session state (held client-side) resets immediately — a soft redirect
  // alone leaves the header showing the old logged-in state until refresh.
  function onSignOut() {
    const action = isAdmin ? signOutAdmin() : signOutStudent(locale);
    startTransition(async () => {
      try {
        await action;
      } finally {
        window.location.href = `/${locale}`;
      }
    });
  }

  const menuItems: { icon: LucideIcon; label: string; href: string }[] = [
    {
      icon: GraduationCap,
      label: t("nav.applications"),
      href: `${dash}/applications`,
    },
    { icon: FileText, label: t("nav.documents"), href: `${dash}/documents` },
    { icon: MessageSquare, label: t("nav.messages"), href: `${dash}/messages` },
    {
      icon: Bell,
      label: t("nav.notifications"),
      href: `${dash}/notifications`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed end-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-s border-border bg-card shadow-overlay",
            "duration-300 data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right",
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            {t("overview.title")}
          </DialogPrimitive.Title>

          {/* Header — profil məlumatı */}
          <div className="flex items-start justify-between gap-4 border-b border-border p-5">
            <button
              type="button"
              onClick={() => setShowProfile(!showProfile)}
              className="flex min-w-0 items-center gap-3 text-left"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-base font-semibold text-foreground">
                  {session.profile.fullName}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {session.profile.email}
                </p>
              </div>
            </button>
            <DialogPrimitive.Close
              aria-label={tCommon("close")}
              className="rounded p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          {/* Profil detalını aç/bağla */}
          {showProfile && (
            <div className="border-b border-border bg-bg-subtle p-5">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">
                    {t("overview.title")}
                  </dt>
                  <dd className="truncate font-medium text-foreground">
                    {session.profile.fullName}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="truncate font-medium text-foreground">
                    {session.profile.email}
                  </dd>
                </div>
                {session.profile.phone && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd className="truncate font-medium text-foreground">
                      {session.profile.phone}
                    </dd>
                  </div>
                )}
              </dl>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-4 w-full"
              >
                <Link href={dash}>
                  {tCommon("viewDetails")}
                  <ExternalLink className="ms-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          )}

          {/* Menyu — alt-alta */}
          <nav className="flex-1 overflow-y-auto p-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className="group flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium text-foreground transition hover:bg-accent"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-subtle text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              );
            })}
          </nav>

          {/* Çıxış — aşağıda sabit */}
          <div className="border-t border-border p-3">
            <button
              type="button"
              onClick={onSignOut}
              disabled={pending}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-60"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                <LogOut className="h-4 w-4" />
              </span>
              <span className="flex-1 text-left">
                {pending ? "…" : t("nav.logout")}
              </span>
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
