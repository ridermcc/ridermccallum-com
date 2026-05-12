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
    <nav className="mt-8 flex flex-col gap-3 border-t border-zinc-200 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
      <Link
        href={indexHref}
        className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← {indexLabel}
      </Link>
      {nextHref && nextTitle ? (
        <Link
          href={nextHref}
          className="group flex flex-col text-zinc-600 transition-colors hover:text-zinc-900 sm:items-end dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {nextLabel ? (
            <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
              {nextLabel}
            </span>
          ) : null}
          <span className="font-medium">{nextTitle} →</span>
        </Link>
      ) : null}
    </nav>
  );
}
