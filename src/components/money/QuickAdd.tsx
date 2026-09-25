"use client";

import { useMemo, useState } from "react";
import { addDays, yen, type Category, type SpendEntry } from "@/lib/money";

/**
 * Log a purchase from the phone. The published ledger is a static encrypted
 * file, so new entries live on this device as pending until they are folded
 * into spend.jsonl and rebuilt. "Copy for Claude" hands them over in the
 * ledger's own line format; once published, they drop off here by id.
 */
export function QuickAdd({
  spend,
  pending,
  categories,
  today,
  onAdd,
  onRemove,
  onClear,
}: {
  spend: SpendEntry[];
  pending: SpendEntry[];
  categories: Category[];
  today: string;
  onAdd: (e: SpendEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState(categories.find((c) => c.id === "dining")?.id ?? categories[0]?.id ?? "");
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");
  const [oneOff, setOneOff] = useState(false);
  const [copied, setCopied] = useState(false);

  // One-tap presets: the most frequent vendors of the last four weeks, each
  // with the category it is usually logged under.
  const presets = useMemo(() => {
    const from = addDays(today, -27);
    const seen = new Map<string, { n: number; cats: Record<string, number> }>();
    for (const e of spend) {
      if (!e.vendor || e.date < from) continue;
      const v = seen.get(e.vendor) ?? { n: 0, cats: {} };
      v.n += 1;
      v.cats[e.category] = (v.cats[e.category] ?? 0) + 1;
      seen.set(e.vendor, v);
    }
    return [...seen.entries()]
      .sort((a, b) => b[1].n - a[1].n)
      .slice(0, 8)
      .map(([name, v]) => ({ name, category: Object.entries(v.cats).sort((a, b) => b[1] - a[1])[0][0] }));
  }, [spend, today]);

  const value = Number(amount);
  const valid = Number.isFinite(value) && value > 0 && /^\d{4}-\d{2}-\d{2}$/.test(date);

  const save = () => {
    if (!valid) return;
    onAdd({
      id: `sp_${date.replace(/-/g, "")}_q${Date.now().toString(36)}`,
      date,
      amount: Math.round(value),
      currency: "JPY",
      category,
      ...(vendor.trim() && { vendor: vendor.trim() }),
      ...(note.trim() && { note: note.trim() }),
      ...(oneOff && { oneOff: true }),
      pending: true,
    });
    setAmount("");
    setVendor("");
    setNote("");
    setOneOff(false);
    setOpen(false);
  };

  const copy = async () => {
    // The ledger's own line shape: no currency (the build adds it), no pending flag.
    const lines = pending
      .map((e) => {
        const line: Partial<SpendEntry> = { ...e };
        delete line.pending;
        delete line.currency;
        return JSON.stringify(line);
      })
      .join("\n");
    try {
      await navigator.clipboard.writeText(lines);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the entries still show in the list below.
    }
  };

  const field = "w-full rounded border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--ice-hover)]";

  return (
    <div className="mt-4">
      {!open ? (
        <button onClick={() => setOpen(true)} className="w-full rounded border border-foreground py-3 text-sm">
          + Add a purchase
        </button>
      ) : (
        <div className="rounded border border-border p-3">
          <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-2 text-xs">
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  setVendor(p.name);
                  setCategory(p.category);
                }}
                className={`shrink-0 rounded-full border px-3 py-1.5 whitespace-nowrap ${vendor === p.name ? "border-foreground" : "border-border text-muted"}`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <label className="col-span-2 text-[0.7rem] text-muted">
              Amount (¥)
              <input
                autoFocus
                inputMode="numeric"
                pattern="[0-9]*"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
                className={`${field} mt-1 text-2xl tabular-nums`}
                placeholder="0"
              />
            </label>
            <label className="text-[0.7rem] text-muted">
              Where
              <input value={vendor} onChange={(e) => setVendor(e.target.value)} className={`${field} mt-1`} placeholder="Matsuya" />
            </label>
            <label className="text-[0.7rem] text-muted">
              Category
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${field} mt-1`}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[0.7rem] text-muted">
              Date
              <input type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} className={`${field} mt-1`} />
            </label>
            <label className="text-[0.7rem] text-muted">
              Note
              <input value={note} onChange={(e) => setNote(e.target.value)} className={`${field} mt-1`} placeholder="optional" />
            </label>
            <label className="col-span-2 flex items-center gap-2 py-1 text-xs">
              <input type="checkbox" checked={oneOff} onChange={(e) => setOneOff(e.target.checked)} className="h-4 w-4" />
              One-off (setup or one-time cost)
            </label>
          </div>
          <div className="mt-2 flex gap-2">
            <button onClick={() => setOpen(false)} className="flex-1 rounded border border-border py-2.5 text-sm text-muted">
              Cancel
            </button>
            <button onClick={save} disabled={!valid} className="flex-1 rounded border border-foreground py-2.5 text-sm disabled:opacity-30">
              Save
            </button>
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div className="mt-3 rounded border px-3 py-2.5 text-xs" style={{ borderColor: "var(--yellow)" }}>
          <div className="flex items-baseline justify-between gap-2">
            <span>
              {pending.length} pending on this device · {yen(pending.reduce((s, e) => s + e.amount, 0))}
            </span>
            <button onClick={copy} className="py-1 underline decoration-[var(--ice-rest)]">
              {copied ? "copied" : "Copy for Claude"}
            </button>
          </div>
          <p className="mt-1 text-[0.7rem] text-muted">
            Counted in every number here already. Paste them to Claude to publish; they clear once the ledger has them.
          </p>
          <div className="mt-2 flex flex-col divide-y divide-[var(--border)]">
            {pending.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-2 py-1.5">
                <span className="truncate">
                  <span className="text-muted">{e.date.slice(5)}</span> {e.vendor ?? e.category}
                </span>
                <span className="flex items-center gap-2">
                  <span className="tabular-nums">{yen(e.amount)}</span>
                  <button onClick={() => onRemove(e.id)} aria-label={`Remove ${e.vendor ?? e.category}`} className="px-2 py-1 text-muted">
                    ✕
                  </button>
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              if (confirm("Remove every pending entry from this device?")) onClear();
            }}
            className="mt-1 py-1 text-[0.7rem] text-muted underline decoration-[var(--ice-rest)]"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
