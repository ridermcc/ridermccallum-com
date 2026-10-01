"use client";

import { useState } from "react";
import { yen, type PayMonth } from "@/lib/money";
import { Explain } from "./ui";

const TAX = "var(--muted)";
const LOAN = "var(--yellow)";
const SPEND = "var(--accent)";
const LEFT = "var(--green)";
const OVER = "var(--red)";

const LEGEND = [
  { label: "Tax", color: TAX, opacity: 0.6 },
  { label: "Loan", color: LOAN, opacity: 1 },
  { label: "Spent", color: SPEND, opacity: 1 },
  { label: "On pace", color: SPEND, opacity: 0.35 },
  { label: "Left over", color: LEFT, opacity: 1 },
];

const STATUS_NOTE: Record<PayMonth["status"], string> = {
  untracked: "before logging",
  partial: "partly logged",
  tracked: "",
  current: "so far + on pace",
  future: "on pace",
};

/**
 * One bar per paycheque. The full bar is what came in; tax, the loan and
 * spending eat into it from the left, and the green end is what stayed. Spend
 * past the pay runs red beyond the pay mark.
 */
export function PayMonths({ months }: { months: PayMonth[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (months.length === 0) return null;

  // Everything shares one scale so a short month looks short.
  const scale = Math.max(...months.map((m) => Math.max(m.salary + m.extra, m.tax + m.obligations + m.spend))) || 1;
  const pct = (v: number) => `${(Math.max(0, v) / scale) * 100}%`;

  const done = months.filter((m) => m.status === "tracked");
  const kept = done.reduce((s, m) => s + m.left, 0);
  const season = months.reduce((s, m) => s + m.left, 0);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 text-center">
        {[
          { label: done.length ? `Kept, ${done.length} finished ${done.length === 1 ? "month" : "months"}` : "Kept so far", value: done.length ? kept : null },
          { label: "Season left over, on pace", value: season },
        ].map((s) => (
          <div key={s.label} className="rounded border border-border p-2">
            <div className="text-sm tabular-nums" style={{ color: s.value !== null && s.value < 0 ? OVER : undefined }}>
              {s.value === null ? "·" : yen(s.value)}
            </div>
            <div className="mt-0.5 text-[0.65rem] text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[0.65rem] text-muted">
        {LEGEND.map((l) => (
          <span key={l.label} className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm" style={{ background: l.color, opacity: l.opacity }} />
            {l.label}
          </span>
        ))}
      </div>

      <ul className="mt-3 flex flex-col gap-1">
        {months.map((m) => {
          const pay = m.salary + m.extra;
          const net = pay - m.tax - m.obligations;
          const within = Math.min(m.spend, Math.max(0, net));
          const spentWithin = Math.min(m.spent, within);
          const overrun = Math.max(0, m.spend - Math.max(0, net));
          const overrunSpent = Math.max(0, m.spent - Math.max(0, net));
          const estimated = m.status === "current" || m.status === "future";
          const isOpen = open === m.key;

          return (
            <li key={m.key}>
              <button
                onClick={() => setOpen(isOpen ? null : m.key)}
                aria-expanded={isOpen}
                className={`w-full rounded px-2 py-2 text-left ${isOpen ? "bg-[var(--moretransblack)]" : ""}`}
              >
                <div className="flex items-baseline justify-between gap-2 text-xs">
                  <span>
                    {m.label}
                    {STATUS_NOTE[m.status] && <span className="ml-2 text-[0.65rem] text-muted">{STATUS_NOTE[m.status]}</span>}
                  </span>
                  <span className="tabular-nums" style={{ color: m.left < 0 ? OVER : LEFT }}>
                    {m.left < 0 ? `${yen(-m.left)} short` : `${yen(m.left)} left`}
                  </span>
                </div>
                <div className="relative mt-1.5 flex h-3.5 w-full overflow-hidden rounded-sm" style={{ background: "var(--moretransblack)" }}>
                  <span style={{ width: pct(m.tax), background: TAX, opacity: 0.6 }} />
                  <span style={{ width: pct(m.obligations), background: LOAN }} />
                  <span style={{ width: pct(spentWithin), background: SPEND }} />
                  <span style={{ width: pct(within - spentWithin), background: SPEND, opacity: 0.35 }} />
                  <span style={{ width: pct(net - within), background: LEFT, opacity: estimated ? 0.55 : 1 }} />
                  <span style={{ width: pct(overrunSpent), background: OVER }} />
                  <span style={{ width: pct(overrun - overrunSpent), background: OVER, opacity: 0.4 }} />
                  {overrun > 0 && (
                    <span className="absolute top-0 bottom-0 w-px" style={{ left: pct(pay), background: "var(--foreground)" }} aria-hidden />
                  )}
                </div>
              </button>

              {isOpen && (
                <table className="mx-2 mt-1 mb-2 w-[calc(100%-1rem)] text-[0.72rem] tabular-nums">
                  <tbody className="divide-y divide-[var(--border)]">
                    <Row label="Salary" value={m.salary} />
                    {m.extraEntries.map((e) => (
                      <Row key={e.id} label={`${e.source}${e.note ? `, ${e.note}` : ""}`} sub={e.date.slice(5)} value={e.amount} />
                    ))}
                    {m.extra > m.extraEntries.reduce((s, e) => s + e.amount, 0) && (
                      <Row label="Other income in the plan" value={m.extra - m.extraEntries.reduce((s, e) => s + e.amount, 0)} />
                    )}
                    <Row label="Tax" value={-m.tax} />
                    {m.obligations > 0 && <Row label="Student loan and fees" value={-m.obligations} />}
                    <Row label={estimated ? "Spent so far" : "Spent"} value={-m.spent} />
                    {m.spend > m.spent && <Row label="Rest of month, on pace" value={-(m.spend - m.spent)} muted />}
                    <Row label={estimated ? "Left over, on pace" : "Left over"} value={m.left} strong />
                  </tbody>
                </table>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-1">
        <Explain>
          <p>
            Each bar is one month&apos;s pay, salary plus any extra income logged that month. Tax, the student loan and
            spending fill it from the left. The green end is what stayed. Tap a month for the numbers.
          </p>
          <p>
            Spending is by calendar month. The current month adds typical days to month end; later months are typical
            days throughout. Faded parts are estimates. Red past the line is spending beyond that month&apos;s pay.
          </p>
        </Explain>
      </div>
    </div>
  );
}

function Row({ label, sub, value, muted, strong }: { label: string; sub?: string; value: number; muted?: boolean; strong?: boolean }) {
  return (
    <tr className={muted ? "text-muted" : undefined}>
      <td className="py-1.5 pr-3">
        {label}
        {sub && <span className="ml-2 text-muted">{sub}</span>}
      </td>
      <td
        className={`py-1.5 pl-3 text-right whitespace-nowrap ${strong ? "font-medium" : ""}`}
        style={{ color: strong ? (value < 0 ? OVER : LEFT) : undefined }}
      >
        {value < 0 ? `−${yen(-value)}` : yen(value)}
      </td>
    </tr>
  );
}
