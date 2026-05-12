import { Container, PageHeader } from "@/components/Container";
import { PostNav } from "@/components/PostNav";
import { getToolSlugs, getTools } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type ToolFrontmatter = {
  title: string;
  summary: string;
  audience?: string[];
  repo?: string;
  demo?: string;
  status?: string;
  pinned?: boolean;
};

async function loadTool(slug: string) {
  try {
    const mod = await import(`@/content/tools/${slug}.mdx`);
    return {
      Component: mod.default,
      meta: mod.metadata as ToolFrontmatter,
    };
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return getToolSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await loadTool(slug);
  if (!tool) return {};
  return {
    title: tool.meta.title,
    description: tool.meta.summary,
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = await loadTool(slug);
  if (!tool) notFound();

  const { Component, meta } = tool;

  const tools = await getTools();
  const currentIndex = tools.findIndex((t) => t.slug === slug);
  const nextTool = currentIndex >= 0 ? tools[currentIndex + 1] : undefined;

  return (
    <Container>
      <PageHeader
        eyebrow={meta.status ?? "Tool"}
        title={meta.title}
        lede={meta.summary}
      />

      {(meta.repo || meta.demo) && (
        <div className="flex flex-wrap gap-2">
          {meta.repo ? (
            <a
              href={meta.repo}
              className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-500 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub →
            </a>
          ) : null}
          {meta.demo ? (
            <a
              href={meta.demo}
              className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-500 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live demo →
            </a>
          ) : null}
        </div>
      )}

      <article className="prose prose-zinc max-w-none dark:prose-invert">
        <Component />
      </article>

      <PostNav
        indexHref="/tools"
        indexLabel="All tools"
        nextHref={nextTool ? `/tools/${nextTool.slug}` : undefined}
        nextTitle={nextTool?.title}
        nextLabel="Next tool"
      />
    </Container>
  );
}
