"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "home" },
  { href: "/posts", label: "posts" },
  { href: "/hky-bio", label: "hky.bio" },
];

function HeaderLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const className = isActive
    ? "px-3 font-bold underline decoration-[0.24ex] underline-offset-[0.26ex]"
    : "px-3 no-underline hover:underline";
  // External links use a plain anchor; internal routes use Next's Link.
  if (href.startsWith("http")) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function SiteNav() {
  return (
    <>
      <header className="flex flex-col items-center py-6 text-center">
        <Link href="/" className="no-underline">
          <h1 className="text-3xl">{site.title}</h1>
        </Link>
        <h2 className="mt-2 max-w-prose">{site.subtitle}</h2>
      </header>
      <nav className="site-nav sticky top-0 z-50 py-4 text-center">
        {links.map((l) => (
          <HeaderLink key={l.href} href={l.href} label={l.label} />
        ))}
      </nav>
    </>
  );
}
