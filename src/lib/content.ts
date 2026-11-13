import fs from "node:fs";
import path from "node:path";

export type PostMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  /** Optional updated date; shown as "last updated on" when present. */
  updated?: string;
  tags?: string[];
  /** Drafts are hidden in production. Set from the editor at /keystatic. */
  draft?: boolean;
};

/** Drafts show in `next dev` (with a label) and are hidden from production builds. */
export const SHOW_DRAFTS = process.env.NODE_ENV !== "production";

function readSlugs(): string[] {
  const dir = path.join(process.cwd(), "src", "content", "posts");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

async function readAll(): Promise<PostMeta[]> {
  return Promise.all(
    readSlugs().map(async (slug) => {
      const mod = await import(`@/content/posts/${slug}.mdx`);
      return { slug, ...mod.metadata } as PostMeta;
    }),
  );
}

/** Slugs of posts visible in this build (drafts excluded in production). */
export async function getPostSlugs(): Promise<string[]> {
  return (await getPosts()).map((p) => p.slug);
}

export async function getPosts(): Promise<PostMeta[]> {
  const items = (await readAll()).filter((p) => SHOW_DRAFTS || !p.draft);
  // Newest first, by updated date if set, else added date.
  return items.sort((a, b) =>
    (b.updated ?? b.date).localeCompare(a.updated ?? a.date),
  );
}

/** Unique tags across all posts, sorted alphabetically. */
export async function getTags(): Promise<string[]> {
  const posts = await getPosts();
  const set = new Set<string>();
  for (const p of posts) for (const t of p.tags ?? []) set.add(t);
  return [...set].sort((a, b) => a.localeCompare(b));
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await getPosts();
  return posts.filter((p) => p.tags?.includes(tag));
}
