"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Gives each link its own pencil underline: a tile variant, a horizontal
// offset and a slight height change. Seeded from the link's href and text, so
// a link looks the same on every visit.
const VARIANTS = 6;

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function PencilVariety() {
  const pathname = usePathname();

  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>("a:not(.no-underline), .site-nav a");
    links.forEach((a) => {
      const h = hash(`${a.getAttribute("href")}|${a.textContent}`);
      a.dataset.pencil = String(h % VARIANTS);
      a.style.setProperty("--pencil-x", `${-((h >>> 3) % 300)}px`);
      a.style.setProperty("--pencil-h", `${(50 + ((h >>> 11) % 11)) / 100}em`);
    });
  }, [pathname]);

  return null;
}
