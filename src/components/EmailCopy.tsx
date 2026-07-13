"use client";

import { useEffect, useRef, useState } from "react";

// Click-to-copy email, styled like a .tag chip. On copy it swaps its label to a
// short confirmation for a beat, then reverts.
export function EmailCopy({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Fallback for browsers without the async clipboard API.
      const el = document.createElement("textarea");
      el.value = email;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="tag"
      aria-label={`Copy ${email} to clipboard`}
      style={{
        background: "none",
        border: 0,
        padding: 0,
        cursor: "pointer",
        color: copied ? "var(--ice-hover)" : "var(--foreground)",
      }}
    >
      {copied ? "copied to clipboard" : email}
    </button>
  );
}
