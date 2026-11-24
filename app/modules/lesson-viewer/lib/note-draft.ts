import { MAX_NOTE_LENGTH } from "~/lib/notes";

export type NoteDraftStatus = "empty" | "unsaved" | "saved";

export type NoteDraft = {
  status: NoteDraftStatus;
  tooLong: boolean;
  canSave: boolean;
  counter: string;
};

// The server trims a note before it checks the length and stores it (so
// `saved` is already trimmed); the draft is judged the same way.
export function describeNoteDraft(draft: string, saved: string): NoteDraft {
  const body = draft.trim();
  const tooLong = body.length > MAX_NOTE_LENGTH;
  const status: NoteDraftStatus =
    body.length === 0 ? "empty" : body === saved ? "saved" : "unsaved";

  return {
    status,
    tooLong,
    canSave: status === "unsaved" && !tooLong,
    counter: `${body.length} / ${MAX_NOTE_LENGTH}`,
  };
}
