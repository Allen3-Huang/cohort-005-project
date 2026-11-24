import { useState } from "react";
import { useFetcher } from "react-router";
import { Lock, NotebookPen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { cn, formatRelativeTime } from "~/lib/utils";
import {
  describeNoteDraft,
  type NoteDraft,
} from "~/modules/lesson-viewer/note-draft";
import type { LessonLoaderData } from "./types";

type SavedNote = Extract<LessonLoaderData, { view: "full" }>["note"];

// Laid out like the Questions & Discussion card further down the page, so the
// two read as parts of the same lesson rather than unrelated widgets.
export function LessonNote({ note }: { note: SavedNote }) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const [body, setBody] = useState(note?.body ?? "");
  const isSaving = fetcher.state !== "idle";
  const draft = describeNoteDraft(body, note?.body ?? "");

  return (
    <Card className="mb-8 py-0">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <NotebookPen className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">Your notes</h2>
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="size-3" />
            Only you can see these
          </span>
        </div>

        <fetcher.Form method="post" className="space-y-2">
          <input type="hidden" name="intent" value="save-note" />
          <Textarea
            name="body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={4}
            placeholder="Jot down what you want to remember from this lesson..."
            aria-label="Your notes"
            className="min-h-24 resize-y"
          />
          <NoteFooter
            draft={draft}
            isSaving={isSaving}
            error={fetcher.data?.error}
            updatedAt={note?.updatedAt}
          />
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}

function NoteFooter({
  draft,
  isSaving,
  error,
  updatedAt,
}: {
  draft: NoteDraft;
  isSaving: boolean;
  error: string | undefined;
  updatedAt: string | undefined;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button type="submit" size="sm" disabled={isSaving || !draft.canSave}>
        {isSaving ? "Saving..." : "Save note"}
      </Button>
      {error ? (
        <span className="text-sm text-destructive">{error}</span>
      ) : (
        <NoteStatus status={draft.status} updatedAt={updatedAt} />
      )}
      <span
        className={cn(
          "ml-auto text-xs",
          draft.tooLong ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {draft.counter}
      </span>
    </div>
  );
}

function NoteStatus({
  status,
  updatedAt,
}: {
  status: NoteDraft["status"];
  updatedAt: string | undefined;
}) {
  if (status === "unsaved") {
    return (
      <span className="text-xs text-muted-foreground">Unsaved changes</span>
    );
  }
  if (status === "empty" || !updatedAt) return null;
  return (
    <span suppressHydrationWarning className="text-xs text-muted-foreground">
      Saved {formatRelativeTime(updatedAt)}
    </span>
  );
}
