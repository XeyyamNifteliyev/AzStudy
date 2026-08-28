import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn(),
  upsertStudentByAuthUid: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      exchangeCodeForSession: mocks.exchangeCodeForSession,
    },
  })),
}));

vi.mock("@/lib/crm", () => ({
  crm: {
    upsertStudentByAuthUid: mocks.upsertStudentByAuthUid,
  },
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

import { GET } from "@/app/auth/callback/route";

function makeRequest(url: string) {
  return {
    url,
    cookies: {
      getAll: () => [],
    },
  } as never;
}

describe("auth callback", () => {
  it("marks successful OAuth redirects so the header refreshes the profile immediately", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
    mocks.exchangeCodeForSession.mockResolvedValueOnce({
      error: null,
      data: {
        user: {
          id: "auth-user-1",
          email: "student@example.com",
          user_metadata: { full_name: "Student One" },
        },
      },
    });
    mocks.upsertStudentByAuthUid.mockResolvedValueOnce({
      id: "profile-1",
      email: "student@example.com",
      fullName: "Student One",
    });

    const res = await GET(
      makeRequest("https://study.test/auth/callback?code=ok&next=/az"),
    );

    expect(res.headers.get("location")).toBe(
      "https://study.test/az?auth=success",
    );
  });
});
