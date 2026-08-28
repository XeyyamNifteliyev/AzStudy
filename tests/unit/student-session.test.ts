import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSessionUser: vi.fn(),
  getProfileByAuthUid: vi.fn(),
  getProfile: vi.fn(),
  upsertStudentByAuthUid: vi.fn(),
}));

vi.mock("@/lib/supabase/server-session", () => ({
  getSessionUser: mocks.getSessionUser,
}));

vi.mock("@/lib/crm", () => ({
  crm: {
    getProfileByAuthUid: mocks.getProfileByAuthUid,
    getProfile: mocks.getProfile,
    upsertStudentByAuthUid: mocks.upsertStudentByAuthUid,
  },
}));

import {
  getStudentSession,
  getStudentSessionReadOnly,
} from "@/lib/crm/student-session";

describe("getStudentSessionReadOnly", () => {
  it("resolves profiles created by the Supabase auth trigger before auth_uid is linked", async () => {
    const profile = {
      id: "11111111-1111-1111-1111-111111111111",
      email: "student@example.com",
      fullName: "Student One",
      role: "student",
      phone: null,
      whatsapp: null,
      countryCode: null,
      avatarUrl: null,
      authUid: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };
    mocks.getSessionUser.mockResolvedValueOnce({
      id: profile.id,
      email: profile.email,
      user_metadata: { full_name: profile.fullName },
    });
    mocks.getProfileByAuthUid.mockResolvedValueOnce(null);
    mocks.getProfile.mockResolvedValueOnce(profile);

    const session = await getStudentSessionReadOnly();

    expect(session).toEqual({ userId: profile.id, profile });
    expect(mocks.upsertStudentByAuthUid).not.toHaveBeenCalled();
  });
});

describe("getStudentSession", () => {
  it("resolves Supabase-trigger profiles by id before creating a new student profile", async () => {
    const profile = {
      id: "22222222-2222-2222-2222-222222222222",
      email: "student2@example.com",
      fullName: "Student Two",
      role: "student",
      phone: null,
      whatsapp: null,
      countryCode: null,
      avatarUrl: null,
      authUid: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };
    mocks.getSessionUser.mockResolvedValueOnce({
      id: profile.id,
      email: profile.email,
      user_metadata: { full_name: profile.fullName },
    });
    mocks.getProfileByAuthUid.mockResolvedValueOnce(null);
    mocks.getProfile.mockResolvedValueOnce(profile);

    const session = await getStudentSession();

    expect(session).toEqual({ userId: profile.id, profile });
    expect(mocks.upsertStudentByAuthUid).not.toHaveBeenCalled();
  });
});
