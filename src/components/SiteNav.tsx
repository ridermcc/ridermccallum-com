import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/notes", label: "Notes" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  return (
    <nav className="border-b border-zinc-200 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-black/70">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="text-sm font-medium tracking-tight text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-400"
        >
          Rider McCallum
        </Link>
        <ul className="flex items-center gap-5 text-sm text-zinc-600 dark:text-zinc-400">
          {links.slice(1).map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
