import {
  describeNoteDraft as describe,
  type NoteDraft,
} from "./lib/note-draft";

export type { NoteDraft, NoteDraftStatus } from "./lib/note-draft";

/**
 * What the Lesson page's note box should offer for the text the Student has
 * typed (`draft`) against the note they last saved (`saved`, "" if none):
 * whether there is anything to save, and the character count against the
 * Note limit. Safe to import from the browser.
 */
export function describeNoteDraft(draft: string, saved: string): NoteDraft {
  return describe(draft, saved);
}
