import Image from "next/image";
import Link from "next/link";
import { getNotes, getTools } from "@/lib/content";

function LogoHero({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="30 75 155 140"
      className={className ?? "h-12 w-auto sm:h-14"}
      aria-hidden="true"
    >
      <path
        className="fill-foreground"
        d="m 120.72711,199.61888 -28.910002,-0.0665 0.08185,-64.31262 28.978722,-26.18818 z"
      />
      <path
        className="fill-foreground"
        d="M 178.16974,207.67981 H 149.57026 V 109.62496 H 120.86751 L 92.674627,79.942255 h 45.854423 l 29.47545,0.0626 10.16537,27.207095 z"
      />
      <path
        fill="#a900a9"
        d="M 34.755226,206.88622 H 64.902464 V 108.83135 H 91.88892 v 6.51657 20.05077 L 120.87739,109.63128 92.717324,79.849644 H 76.015582 L 57.545493,104.48412 V 79.912292 H 34.755226 Z"
      />
    </svg>
  );
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

export default async function Home() {
  const [tools, notes] = await Promise.all([getTools(), getNotes()]);
  const pinnedTool = tools.find((t) => t.pinned) ?? tools[0];
  const otherTools = tools.filter((t) => t.slug !== pinnedTool?.slug);
  const recentNotes = notes.slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-10">
      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-12 md:auto-rows-[148px] md:grid-flow-row-dense">
        {/* HERO */}
        <Link
          href="/notes/welcome"
          className="tile tile-hover group bg-dotgrid p-6 sm:p-8 md:col-span-7 md:row-span-2"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none opacity-[0.09] dark:opacity-[0.14] sm:-right-6"
          >
            <LogoHero className="h-72 w-auto sm:h-[22rem]" />
          </div>
          <div className="relative flex h-full flex-col justify-between gap-6">
            <div className="flex items-center gap-2 font-mono text-xs text-muted">
              <span className="status-dot" aria-hidden />
              <span>online · v0.2</span>
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-bold tracking-tight font-heading sm:text-5xl">
                <span className="text-accent">Rider</span> McCallum
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                Things I learn and build.
              </p>
              <span className="w-fit font-mono text-xs text-accent sm:text-muted transition-colors sm:group-hover:text-accent">
                <span className="inline-flex items-center gap-0">
                  <span>$ cat about.md</span>
                  <span className="inline-block w-[3.5ch] sm:w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out sm:group-hover:w-[3.5ch]">&nbsp;&rarr;</span>
                  <span className="hidden sm:inline-block h-[1.1em] w-[0.5em] translate-y-[1px] bg-current sm:opacity-0 sm:animate-none transition-opacity duration-200 sm:group-hover:animate-pulse sm:group-hover:opacity-70" aria-hidden />
                </span>
              </span>
            </div>
          </div>
        </Link>

        {/* TERMINAL / NOW */}
        <section
          className="tile overflow-hidden p-5 md:col-span-5"
          style={{ background: "#09090b", borderColor: "#27272a" }}
        >
          <div className="flex h-full flex-col gap-3 font-mono text-[13px] leading-6">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-accent/70" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#3f3f46" }} aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#3f3f46" }} aria-hidden />
              <span className="ml-2 text-xs" style={{ color: "#71717a" }}>~/rider</span>
            </div>
            <div style={{ color: "#f4f4f5" }}>
              <span className="text-accent">$</span> whoami
            </div>
            <div style={{ color: "#a1a1aa" }}>
              hockey player<br />
              exploring technology.<span className="caret" aria-hidden />
            </div>
          </div>
        </section>

        {/* HOCKEY PHOTO */}
        <section className="tile group relative aspect-[4/3] md:aspect-auto md:col-span-8 md:row-span-2">
          <div className="absolute inset-0 grid grid-cols-2 gap-[2px]">
            {[
              "/homepage-onice/onice-1.jpg",
              "/homepage-onice/onice-3.jpg",
            ].map((src, i) => (
              <div key={src} className="relative overflow-hidden">
                <Image
                  src={src}
                  alt="On the ice"
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className={`object-cover transition-transform duration-500 group-hover:scale-[1.03]${i === 1 ? " object-top" : ""}`}
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-3 right-4 font-mono text-xs text-white">
            <span className="opacity-80">2026</span>
          </div>
        </section>

        {/* FEATURED TOOL */}
        {pinnedTool ? (
          <Link
            href={`/tools/${pinnedTool.slug}`}
            className="tile tile-hover group relative flex flex-col justify-between gap-3 p-5 md:col-span-5 bg-accent/[0.04]"
          >
            <div className="absolute inset-0 bg-linegrid opacity-[0.25] [mask-image:radial-gradient(70%_70%_at_85%_15%,black,transparent)]" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  featured
                </span>
                <h2 className="text-2xl font-bold tracking-tight font-heading">
                  {pinnedTool.title}
                </h2>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                <span className="status-dot" aria-hidden />
                {pinnedTool.status ?? "Live"}
              </span>
            </div>
            <div className="relative flex items-center justify-between font-mono text-xs">
              <span className="truncate text-muted">
                /tools/{pinnedTool.slug}
              </span>
              <span className="shrink-0 text-accent transition-transform group-hover:translate-x-1">
                open &rarr;
              </span>
            </div>
          </Link>
        ) : null}

        {/* TOOLS LIST */}
        <section className="tile flex flex-col gap-3 p-5 md:col-span-4 md:row-span-2">
          <div className="flex items-center justify-between border-b border-border pb-2.5 font-mono text-xs text-foreground">
            <span className="font-semibold">tools</span>
            <Link
              href="/tools"
              className="text-muted transition-colors hover:text-accent"
            >
              all &rarr;
            </Link>
          </div>
          <ul className="flex flex-1 flex-col divide-y divide-border">
            {tools.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="group flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold tracking-tight font-heading transition-colors group-hover:text-accent">
                      {t.title}
                    </span>
                    <span className="truncate text-xs text-muted">
                      {t.summary}
                    </span>
                  </div>
                  {t.status ? (
                    <span className="shrink-0 rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                      {t.status}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
            {otherTools.length === 0 && tools.length === 0 ? (
              <li className="py-3 text-sm text-muted">No tools yet.</li>
            ) : null}
          </ul>
        </section>

        {/* RECENT NOTES (changelog) */}
        <section className="tile flex flex-col gap-3 p-5 sm:p-6 md:col-span-8">
          <div className="flex items-center justify-between border-b border-border pb-2.5 font-mono text-xs text-foreground">
            <span className="font-semibold">recent notes</span>
            <Link
              href="/notes"
              className="text-muted transition-colors hover:text-accent"
            >
              all &rarr;
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-border">
            {recentNotes.map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/notes/${n.slug}`}
                  className="group flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="shrink-0 whitespace-nowrap font-mono text-xs text-muted">
                      {formatShortDate(n.date)}
                    </span>
                    <span className="truncate text-sm transition-colors group-hover:text-accent">
                      {n.title}
                    </span>
                  </div>
                  <span className="hidden truncate text-xs text-muted sm:block sm:max-w-[40%]">
                    {n.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* LINKS */}
        <section className="tile flex flex-col gap-4 p-5 md:col-span-4">
          <div className="border-b border-border pb-2.5 font-mono text-xs font-semibold text-foreground">
            elsewhere
          </div>
          <ul className="flex flex-col gap-1 font-mono text-sm">
            <li>
              <a
                href="https://github.com/ridermcc"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-2 rounded-md px-2 py-1.5 -mx-2 transition-colors hover:bg-accent/10"
              >
                <span>github</span>
                <span className="text-muted transition-colors group-hover:text-accent">
                  @ridermcc &rarr;
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://hky.bio/rider"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-2 rounded-md px-2 py-1.5 -mx-2 transition-colors hover:bg-accent/10"
              >
                <span>hky.bio</span>
                <span className="text-muted transition-colors group-hover:text-accent">
                  /rider &rarr;
                </span>
              </a>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
