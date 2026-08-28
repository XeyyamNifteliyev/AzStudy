"use client";

import { useState } from "react";
import {
  addAllowlistEmailAction,
  removeAllowlistEmailAction,
} from "@/app/actions/staff-management";
import type { AdminLocale } from "@/lib/admin-i18n";

/**
 * Admin allowlist manager. An email must be on this list before its OAuth
 * login can resolve a staff/admin session. Only admins may edit it (the
 * server actions re-check the session role).
 */
export function AdminAllowlistManager({
  emails,
  locale,
}: {
  emails: string[];
  locale: AdminLocale;
}) {
  const az = locale === "az";
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await addAllowlistEmailAction({ email });
    setPending(false);
    if (!res.ok) setError(res.error);
    else setEmail("");
  }

  async function remove(target: string) {
    setError(null);
    await removeAllowlistEmailAction({ email: target });
  }

  return (
    <div className="space-y-3">
      <form onSubmit={add} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {pending ? "..." : az ? "Əlavə et" : "Add"}
        </button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <ul className="space-y-2">
        {emails.length === 0 ? (
          <li className="text-sm text-muted-foreground">
            {az ? "Heç bir email icazələnməyib." : "No emails allowlisted."}
          </li>
        ) : (
          emails.map((em) => (
            <li
              key={em}
              className="flex items-center justify-between rounded border border-border px-3 py-2 text-sm"
            >
              <span className="font-mono text-foreground">{em}</span>
              <button
                type="button"
                onClick={() => remove(em)}
                className="text-xs text-destructive hover:underline"
              >
                {az ? "Sil" : "Remove"}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
