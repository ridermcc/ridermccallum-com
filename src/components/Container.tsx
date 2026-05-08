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
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {lede ? (
        <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {lede}
        </p>
      ) : null}
    </header>
  );
}
