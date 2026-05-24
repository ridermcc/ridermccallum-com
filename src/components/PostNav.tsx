import Link from "next/link";

type Props = {
  indexHref: string;
  indexLabel: string;
  nextHref?: string;
  nextTitle?: string;
  nextLabel?: string;
};

export function PostNav({
  indexHref,
  indexLabel,
  nextHref,
  nextTitle,
  nextLabel,
}: Props) {
  return (
    <nav className="mt-8 flex flex-col gap-3 border-t border-border pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
      <Link
        href={indexHref}
        className="text-muted transition-colors hover:text-accent"
      >
        ← {indexLabel}
      </Link>
      {nextHref && nextTitle ? (
        <Link
          href={nextHref}
          className="group flex flex-col text-muted transition-colors hover:text-accent sm:items-end"
        >
          {nextLabel ? (
            <span className="text-xs uppercase tracking-wider text-muted/70">
              {nextLabel}
            </span>
          ) : null}
          <span className="font-medium font-heading">{nextTitle} →</span>
        </Link>
      ) : null}
    </nav>
  );
}
