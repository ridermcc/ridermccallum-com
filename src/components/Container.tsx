type Props = { children: React.ReactNode };

export function Container({ children }: Props) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-6 py-16 sm:px-10 sm:py-20">
      {children}
    </main>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="flex flex-col gap-3">
      {eyebrow ? (
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
        {title}
      </h1>
      {lede ? (
        <p className="max-w-xl text-lg leading-8 text-muted">
          {lede}
        </p>
      ) : null}
    </header>
  );
}
