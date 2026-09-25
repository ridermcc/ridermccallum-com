"use client";

import { useMemo, useState } from "react";
import { yen, type SpendEntry } from "@/lib/money";

// Grouped by day, newest first. The latest few days start open; older days fold
// to a one-line total so the list reads as a diary, not a wall of rows.
const OPEN_BY_DEFAULT = 3;

export function Entries({ entries, categoryLabels }: { entries: SpendEntry[]; categoryLabels: Record<string, string> }) {
  const [filter, setFilter] = useState<string | null>(null);
  const [toggled, setToggled] = useState<Set<string>>(new Set());
  const [openEntry, setOpenEntry] = useState<string | null>(null);

  const chips = useMemo(() => {
    const totals = entries.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    }, {});
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const days = useMemo(() => {
    const shown = filter ? entries.filter((e) => e.category === filter) : entries;
    const byDate = new Map<string, SpendEntry[]>();
    for (const e of shown) byDate.set(e.date, [...(byDate.get(e.date) ?? []), e]);
    return [...byDate.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, list]) => ({ date, list, total: list.reduce((s, e) => s + e.amount, 0) }));
  }, [entries, filter]);

  const shownTotal = days.reduce((s, d) => s + d.total, 0);
  // A filter narrows the list enough that every day can start open.
  const isOpen = (date: string, i: number) => (filter !== null || i < OPEN_BY_DEFAULT) !== toggled.has(date);
  const toggle = (date: string) =>
    setToggled((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });

  return (
    <div>
      {/* category filter: scrolls sideways on a phone */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 text-xs">
        <Chip active={filter === null} onClick={() => setFilter(null)}>
          All
        </Chip>
        {chips.map(([id]) => (
          <Chip key={id} active={filter === id} onClick={() => setFilter(filter === id ? null : id)}>
            {categoryLabels[id] ?? id}
          </Chip>
        ))}
      </div>

      <div className="mt-2 flex items-baseline justify-between text-xs text-muted">
        <span>
          {days.reduce((n, d) => n + d.list.length, 0)} entries · {days.length} days
        </span>
        <span className="tabular-nums text-foreground">{yen(shownTotal)}</span>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {days.map((d, i) => {
          const open = isOpen(d.date, i);
          return (
            <div key={d.date} className="rounded border border-border">
              <button
                onClick={() => toggle(d.date)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left text-sm"
              >
                <span>
                  {dayLabel(d.date)}
                  <span className="ml-2 text-[0.7rem] text-muted">{d.list.length}</span>
                </span>
                <span className="flex items-center gap-2 tabular-nums">
                  {yen(d.total)}
                  <span className={`text-muted transition-transform ${open ? "rotate-90" : ""}`} aria-hidden>
                    ›
                  </span>
                </span>
              </button>
              {open && (
                <div className="divide-y divide-[var(--border)] border-t border-border text-xs">
                  {d.list.map((e) => {
                    const expanded = openEntry === e.id;
                    return (
                      <button
                        key={e.id}
                        onClick={() => setOpenEntry(expanded ? null : e.id)}
                        aria-expanded={expanded}
                        className="block w-full px-3 py-2.5 text-left"
                      >
                        <span className="flex items-baseline justify-between gap-3">
                          <span className={expanded ? "" : "truncate"}>{e.vendor ?? categoryLabels[e.category]}</span>
                          <span className="tabular-nums">{yen(e.amount)}</span>
                        </span>
                        {expanded ? (
                          <span className="mt-1 block text-[0.7rem] text-muted">
                            {categoryLabels[e.category] ?? e.category}
                            {e.note && <span className="block text-foreground/80">{e.note}</span>}
                          </span>
                        ) : (
                          e.note && <span className="block truncate text-[0.7rem] text-muted">{e.note}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3 py-1.5 whitespace-nowrap ${
        active ? "border-foreground text-foreground" : "border-border text-muted"
      }`}
    >
      {children}
    </button>
  );
}

function dayLabel(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
