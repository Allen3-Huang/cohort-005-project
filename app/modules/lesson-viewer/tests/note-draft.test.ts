import { describe, it, expect } from "vitest";
import { describeNoteDraft } from "../note-draft";
import { MAX_NOTE_LENGTH } from "~/lib/notes";

describe("describeNoteDraft", () => {
  it("has nothing to save before the Student writes anything", () => {
    const draft = describeNoteDraft("", "");
    expect(draft.status).toBe("empty");
    expect(draft.canSave).toBe(false);
  });

  it("treats whitespace as nothing written", () => {
    expect(describeNoteDraft("   \n ", "").status).toBe("empty");
  });

  it("can save a new note", () => {
    const draft = describeNoteDraft("Result types beat exceptions", "");
    expect(draft.status).toBe("unsaved");
    expect(draft.canSave).toBe(true);
  });

  it("is saved when the draft matches the saved note", () => {
    const draft = describeNoteDraft("Same words", "Same words");
    expect(draft.status).toBe("saved");
    expect(draft.canSave).toBe(false);
  });

  it("is unsaved once the Student edits a saved note", () => {
    const draft = describeNoteDraft("Same words, more", "Same words");
    expect(draft.status).toBe("unsaved");
    expect(draft.canSave).toBe(true);
  });

  it("counts characters against the note limit", () => {
    const draft = describeNoteDraft("abc", "");
    expect(draft.counter).toBe(`3 / ${MAX_NOTE_LENGTH}`);
    expect(draft.tooLong).toBe(false);
  });

  it("can save a note exactly at the limit", () => {
    const draft = describeNoteDraft("a".repeat(MAX_NOTE_LENGTH), "");
    expect(draft.tooLong).toBe(false);
    expect(draft.canSave).toBe(true);
  });

  it("will not save a note over the limit", () => {
    const draft = describeNoteDraft("a".repeat(MAX_NOTE_LENGTH + 1), "");
    expect(draft.tooLong).toBe(true);
    expect(draft.canSave).toBe(false);
  });

  it("is saved when the draft differs from the saved note only by surrounding whitespace", () => {
    expect(describeNoteDraft("Same words \n", "Same words").status).toBe(
      "saved"
    );
  });

  it("does not count surrounding whitespace against the limit", () => {
    const draft = describeNoteDraft(` ${"a".repeat(MAX_NOTE_LENGTH)} `, "");
    expect(draft.tooLong).toBe(false);
    expect(draft.counter).toBe(`${MAX_NOTE_LENGTH} / ${MAX_NOTE_LENGTH}`);
  });
});
