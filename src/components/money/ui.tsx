"use client";

import { useState } from "react";

// Explanations sit behind a tap so the numbers carry the page on a phone.
export function Explain({ label = "How to read this", children }: { label?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="-my-1 py-2 text-[0.7rem] text-muted underline decoration-[var(--ice-rest)] hover:decoration-[var(--ice-hover)]"
      >
        {open ? "Hide" : label}
      </button>
      {open && <div className="mt-1 flex flex-col gap-2 text-[0.72rem] leading-relaxed text-muted">{children}</div>}
    </div>
  );
}
