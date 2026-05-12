import { Container, PageHeader } from "@/components/Container";
import { PostNav } from "@/components/PostNav";
import { getNoteSlugs, getNotes } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type NoteFrontmatter = {
  title: string;
  summary: string;
  date: string;
  tags?: string[];
};

async function loadNote(slug: string) {
  try {
    const mod = await import(`@/content/notes/${slug}.mdx`);
    return {
      Component: mod.default,
      meta: mod.metadata as NoteFrontmatter,
    };
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return getNoteSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = await loadNote(slug);
  if (!note) return {};
  return {
    title: note.meta.title,
    description: note.meta.summary,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await loadNote(slug);
  if (!note) notFound();

  const { Component, meta } = note;

  const notes = await getNotes();
  const currentIndex = notes.findIndex((n) => n.slug === slug);
  const nextNote = currentIndex >= 0 ? notes[currentIndex + 1] : undefined;

  return (
    <Container>
      <PageHeader eyebrow={formatDate(meta.date)} title={meta.title} lede={meta.summary} />
      <article className="prose prose-zinc max-w-none dark:prose-invert">
        <Component />
      </article>
      <PostNav
        indexHref="/notes"
        indexLabel="All notes"
        nextHref={nextNote ? `/notes/${nextNote.slug}` : undefined}
        nextTitle={nextNote?.title}
      />
    </Container>
  );
}
