import Link from "next/link";
import { Container, PageHeader } from "@/components/Container";
import { getNotes } from "@/lib/content";

export const metadata = {
  title: "Notes",
  description: "Reflections, research, lessons, and a log of what I'm building on/off the ice and in code.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function NotesIndex() {
  const notes = await getNotes();

  return (
    <Container>
      <PageHeader
        eyebrow="Notes"
        title="What I'm building, and learning."
        lede="Reflections, research, lessons, and a log of what I'm building on/off the ice and in code."
      />

      {notes.length === 0 ? (
        <p className="text-muted">
          Nothing here yet. Check back soon.
        </p>
      ) : (
        <section className="flex flex-col divide-y divide-border">
          {notes.map((n) => (
            <Link
              key={n.slug}
              href={`/notes/${n.slug}`}
              className="group flex flex-col gap-1 py-5 transition-colors first:pt-0 last:pb-0"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-semibold tracking-tight font-heading transition-colors group-hover:text-accent">
                  {n.title}
                </h2>
                <time className="shrink-0 rounded-full bg-accent/8 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-muted">
                  {formatDate(n.date)}
                </time>
              </div>
              <p className="text-muted">{n.summary}</p>
            </Link>
          ))}
        </section>
      )}
    </Container>
  );
}
