import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostSlugs, getTags } from "@/lib/content";
import { Tags } from "@/components/Tags";
import { Lightbox } from "@/components/Lightbox";
import type { PostMeta } from "@/lib/content";

async function loadPost(slug: string) {
  try {
    const mod = await import(`@/content/posts/${slug}.mdx`);
    return { Component: mod.default, meta: mod.metadata as PostMeta };
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return {};
  return { title: post.meta.title, description: post.meta.summary };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();

  const { Component, meta } = post;
  const allTags = await getTags();

  return (
    <article>
      <h1 className="article-title text-3xl">{meta.title}</h1>
      <div className="mt-1">
        {meta.updated ? (
          <span>
            <time dateTime={meta.date}>{formatDate(meta.date)}</time>, last
            updated on <time dateTime={meta.updated}>{formatDate(meta.updated)}</time>
          </span>
        ) : (
          <time dateTime={meta.date}>{formatDate(meta.date)}</time>
        )}
      </div>
      {meta.tags?.length ? (
        <div className="mt-1 flex flex-wrap gap-x-4">
          {meta.tags.map((tag) => (
            <Link key={tag} href={`/tag/${tag}`} className="tag">
              #{tag}
            </Link>
          ))}
        </div>
      ) : null}

      <hr />

      <div className="blog-post">
        <Component />
      </div>
      <Lightbox />

      <p className="mt-10">
        <Link href="/posts">← all posts</Link>
      </p>

      <Tags tags={allTags} heading="View posts by tag" />
    </article>
  );
}
