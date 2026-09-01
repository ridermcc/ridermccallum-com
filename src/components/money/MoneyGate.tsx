"use client";

import { useEffect, useState } from "react";
import { decryptLedger, WrongPassphrase, type Envelope } from "@/lib/money-crypto";
import type { Ledger } from "@/lib/money";
import { MoneyDashboard } from "./MoneyDashboard";

const SESSION_KEY = "money:pp";

export function MoneyGate() {
  const [ledger, setLedger] = useState<Ledger | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");
  const [message, setMessage] = useState("");

  async function unlock(pp: string, { quiet = false } = {}) {
    if (!pp) return;
    setStatus("working");
    setMessage("");
    try {
      const res = await fetch("/money/ledger.enc.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`ledger unavailable (${res.status})`);
      const envelope: Envelope = await res.json();
      const data = await decryptLedger<Ledger>(envelope, pp);
      sessionStorage.setItem(SESSION_KEY, pp);
      setLedger(data);
      setStatus("idle");
    } catch (err) {
      sessionStorage.removeItem(SESSION_KEY);
      setStatus(quiet ? "idle" : "error");
      if (!quiet) {
        setMessage(err instanceof WrongPassphrase ? "That passphrase does not match." : String((err as Error).message));
      }
    }
  }

  // Survive a refresh without re-typing, but only for this browser session.
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) unlock(saved, { quiet: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function lock() {
    sessionStorage.removeItem(SESSION_KEY);
    setPassphrase("");
    setLedger(null);
  }

  if (ledger) return <MoneyDashboard ledger={ledger} onLock={lock} />;

  return (
    <div className="flex min-h-[60vh] flex-col justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          unlock(passphrase);
        }}
        className="mx-auto w-full max-w-sm"
      >
        <label htmlFor="pp" className="block text-xs tracking-wide text-muted uppercase">
          Passphrase
        </label>
        <input
          id="pp"
          type="password"
          autoFocus
          autoComplete="current-password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          disabled={status === "working"}
          className="mt-2 w-full rounded border border-border bg-transparent px-3 py-2 outline-none focus:border-[var(--ice-hover)]"
        />
        <button
          type="submit"
          disabled={status === "working" || !passphrase}
          className="mt-3 w-full rounded border border-border px-3 py-2 text-sm hover:border-[var(--ice-hover)] disabled:opacity-40"
        >
          {status === "working" ? "Unlocking…" : "Unlock"}
        </button>
        {status === "error" && (
          <p className="mt-3 text-center text-xs" style={{ color: "var(--red)" }}>
            {message}
          </p>
        )}
        <p className="mt-6 text-center text-[0.7rem] leading-relaxed text-muted">
          The data on this page is encrypted at rest. The passphrase is the decryption key, so there is nothing to read
          without it.
        </p>
      </form>
    </div>
  );
}
