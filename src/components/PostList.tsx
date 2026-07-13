import Link from "next/link";
import type { PostMeta } from "@/lib/content";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <ul className="list-none p-0">
      {posts.map((p) => (
        <li key={p.slug} className="mb-8">
          <Link href={`/posts/${p.slug}`} className="text-xl font-medium underline">
            {p.title}
          </Link>{" "}
          <time dateTime={p.date}>{formatDate(p.date)}</time>
          {p.summary ? (
            <p style={{ color: "var(--muted)" }} className="mt-1">
              {p.summary}
            </p>
          ) : null}
          {p.tags?.length ? (
            <div className="mt-1 flex flex-wrap gap-x-4">
              {p.tags.map((tag) => (
                <Link key={tag} href={`/tag/${tag}`} className="tag">
                  #{tag}
                </Link>
              ))}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
