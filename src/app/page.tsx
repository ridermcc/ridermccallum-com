import Link from "next/link";

type Section = {
  title: string;
  blurb: string;
  href: string;
  status: "Live" | "Soon";
  external?: boolean;
};

const sections: Section[] = [
  {
    title: "Europe on Ice",
    blurb: "An atlas of thirteen European hockey towns — chosen not for their rinks, but for what surrounds them.",
    href: "/europe",
    status: "Live",
  },
  {
    title: "Tools for players",
    blurb: "Dashboards, skills, and Claude Code projects you can clone and use. Built with other players in mind.",
    href: "/tools",
    status: "Soon",
  },
  {
    title: "Notes",
    blurb: "Things I'm learning — on the ice, off the ice, and in the code.",
    href: "/notes",
    status: "Soon",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-16 px-6 py-20 sm:px-10 sm:py-28">
        <header className="flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Rider McCallum
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Pro hockey player.
            <br />
            <span className="text-zinc-500 dark:text-zinc-400">
              Notes, tools, and projects from a career on ice.
            </span>
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Public home for things worth sharing — what I&apos;m building, what I&apos;m learning,
            and resources for other players figuring it out alongside me.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          {sections.map((s) => {
            const isLive = s.status === "Live";
            const cardClasses =
              "group flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-6 transition-colors dark:border-zinc-800 dark:bg-zinc-950" +
              (isLive ? " hover:border-zinc-400 dark:hover:border-zinc-600" : " opacity-60");

            const inner = (
              <>
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-xl font-medium tracking-tight">{s.title}</h2>
                  <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {s.status}
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400">{s.blurb}</p>
              </>
            );

            return isLive ? (
              <Link key={s.title} href={s.href} className={cardClasses}>
                {inner}
              </Link>
            ) : (
              <div key={s.title} className={cardClasses} aria-disabled>
                {inner}
              </div>
            );
          })}
        </section>

        <footer className="mt-auto flex flex-col gap-2 border-t border-zinc-200 pt-8 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <p>
            Built with{" "}
            <a
              className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100"
              href="https://claude.com/claude-code"
            >
              Claude Code
            </a>
            . Source on{" "}
            <a
              className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100"
              href="https://github.com/ridermcc/ridermccallum-com"
            >
              GitHub
            </a>
            .
          </p>
        </footer>
      </main>
    </div>
  );
}
