import Link from "next/link";

export function Tags({
  tags,
  heading,
  active,
  className = "mt-10",
}: {
  tags: string[];
  /** Optional centered title above the tag row. */
  heading?: string;
  /** The current tag, shown bold/active (e.g. on a tag page). */
  active?: string;
  /** Wrapper spacing override (defaults to a top margin). */
  className?: string;
}) {
  if (!tags.length) return null;
  return (
    <div className={`text-center ${className}`}>
      {heading ? (
        <h3 className="mb-2 text-xl font-medium" style={{ color: "var(--foreground)" }}>
          {heading}
        </h3>
      ) : null}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/tag/${tag}`}
            className={tag === active ? "tag tag-active" : "tag"}
            aria-current={tag === active ? "page" : undefined}
          >
            #{tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
