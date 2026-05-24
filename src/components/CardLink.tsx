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
    "group relative flex flex-col gap-2 rounded-2xl border border-border bg-surface p-6 transition-all duration-200" +
    (disabled
      ? " opacity-60"
      : " hover:border-accent/40 hover:shadow-[0_0_24px_var(--color-accent-glow)]");

  const inner = (
    <>
      {/* Accent left bar */}
      <span className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight font-heading">{title}</h2>
        {meta ? (
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-accent">
            {meta}
          </span>
        ) : null}
      </div>
      <p className="text-muted">{blurb}</p>
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
