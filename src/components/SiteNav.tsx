"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "~" },
  { href: "/notes", label: "notes" },
  { href: "/tools", label: "tools" },
];

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="30 75 155 140"
      className={className}
      aria-label="Rider McCallum logo"
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

export function SiteNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="fixed top-3 left-1/2 z-50 -translate-x-1/2 sm:top-5">
      <div className="flex items-center gap-1 rounded-full border border-border bg-background/70 px-2 py-1.5 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:gap-1.5 sm:px-3 sm:py-2">
        <Link
          href="/"
          aria-label="Home"
          className={`flex items-center gap-1.5 rounded-full px-1.5 py-1 transition-opacity hover:opacity-80 ${isActive("/") ? "opacity-100" : "opacity-60"}`}
        >
          <LogoMark className="h-5 w-auto" />
        </Link>
        <ul className="flex items-center gap-0.5 font-mono text-xs text-muted sm:text-[13px]">
          {links.slice(1).map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`rounded-full px-2.5 py-1 transition-colors sm:px-3 ${isActive(l.href) ? "bg-accent/10 text-accent" : "hover:bg-accent/10 hover:text-accent"}`}
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
