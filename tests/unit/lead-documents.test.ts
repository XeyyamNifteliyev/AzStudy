import { describe, expect, it } from "vitest";
import { parseLeadNotes, extractLeadDocuments } from "@/lib/crm/lead-documents";

describe("parseLeadNotes", () => {
  it("parses the apply-form JSON blob", () => {
    const notes = parseLeadNotes(
      JSON.stringify({
        message: "Hi",
        degreeLevel: "bachelor",
        passportUrl: "apply/passport-1.pdf",
      }),
    );
    expect(notes).toMatchObject({ message: "Hi", degreeLevel: "bachelor" });
  });

  it("returns null for empty / whitespace / legacy free text", () => {
    expect(parseLeadNotes(null)).toBeNull();
    expect(parseLeadNotes("")).toBeNull();
    expect(parseLeadNotes("   ")).toBeNull();
    expect(parseLeadNotes("just a plain message")).toBeNull();
  });

  it("returns null for non-object JSON", () => {
    expect(parseLeadNotes('"string"')).toBeNull();
    expect(parseLeadNotes("42")).toBeNull();
  });
});

describe("extractLeadDocuments", () => {
  it("extracts present documents in stable order with labels", () => {
    const notes = parseLeadNotes(
      JSON.stringify({
        passportUrl: "apply/passport-x.pdf",
        motivationLetterUrl: "apply/motivationLetter-y.pdf",
      }),
    );
    expect(extractLeadDocuments(notes)).toEqual([
      { path: "apply/passport-x.pdf", label: "Passport", isPlaceholder: false },
      {
        path: "apply/motivationLetter-y.pdf",
        label: "Motivation letter",
        isPlaceholder: false,
      },
    ]);
  });

  it("marks dev placeholder paths", () => {
    const notes = parseLeadNotes(
      JSON.stringify({ photoUrl: "/uploads/placeholder-photo-1.jpg" }),
    );
    expect(extractLeadDocuments(notes)[0].isPlaceholder).toBe(true);
  });

  it("returns [] when no documents and tolerates null notes", () => {
    expect(
      extractLeadDocuments(
        parseLeadNotes(JSON.stringify({ message: "only text" })),
      ),
    ).toEqual([]);
    expect(extractLeadDocuments(null)).toEqual([]);
  });

  it("ignores non-string document fields", () => {
    const notes = parseLeadNotes(
      JSON.stringify({ passportUrl: 123, diplomaUrl: null }),
    );
    expect(extractLeadDocuments(notes)).toEqual([]);
  });
});
