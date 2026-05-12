import fs from "node:fs";
import path from "node:path";

export type ToolMeta = {
  slug: string;
  title: string;
  summary: string;
  audience?: ("player" | "coach" | "agent")[];
  repo?: string;
  demo?: string;
  status?: "Live" | "Beta" | "Draft";
  pinned?: boolean;
};

export type NoteMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags?: string[];
};

function readSlugs(name: "tools" | "notes"): string[] {
  const dir = path.join(process.cwd(), "src", "content", name);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getToolSlugs() {
  return readSlugs("tools");
}

export function getNoteSlugs() {
  return readSlugs("notes");
}

export async function getTools(): Promise<ToolMeta[]> {
  const slugs = readSlugs("tools");
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await import(`@/content/tools/${slug}.mdx`);
      return { slug, ...mod.metadata } as ToolMeta;
    }),
  );
  return items.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.title.localeCompare(b.title);
  });
}

export async function getNotes(): Promise<NoteMeta[]> {
  const slugs = readSlugs("notes");
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await import(`@/content/notes/${slug}.mdx`);
      return { slug, ...mod.metadata } as NoteMeta;
    }),
  );
  return items.sort((a, b) => b.date.localeCompare(a.date));
}
