import Link from "next/link";

type Props = {
  href: string;
  title: string;
  blurb: string;
  meta?: string;
  external?: boolean;
  disabled?: boolean;
};

export function CardLink({ href, title, blurb, meta, external, disabled }: Props) {
  const classes =
    "group flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-6 transition-colors dark:border-zinc-800 dark:bg-zinc-950" +
    (disabled
      ? " opacity-60"
      : " hover:border-zinc-400 dark:hover:border-zinc-600");

  const inner = (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-medium tracking-tight">{title}</h2>
        {meta ? (
          <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {meta}
          </span>
        ) : null}
      </div>
      <p className="text-zinc-600 dark:text-zinc-400">{blurb}</p>
    </>
  );

  if (disabled) {
    return (
      <div className={classes} aria-disabled>
        {inner}
      </div>
    );
  }

  if (external) {
    return (
      <a className={classes} href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {inner}
    </Link>
  );
}
