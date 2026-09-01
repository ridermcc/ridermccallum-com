"use client";

import { useMemo, useState } from "react";
import {
  availableMonths,
  balanceSeries,
  buildMonthView,
  fxIsStale,
  monthKey,
  todayISO,
  toCAD,
  yen,
  type Ledger,
} from "@/lib/money";
import { BalancePlanChart, CategoryBars, DailySpendChart } from "./charts";

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xs tracking-wide uppercase">{title}</h2>
      {note && <p className="mt-0.5 text-[0.7rem] text-muted">{note}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function MoneyDashboard({ ledger, onLock }: { ledger: Ledger; onLock: () => void }) {
  const today = todayISO();
  const months = useMemo(() => availableMonths(ledger, today), [ledger, today]);
  const [selected, setSelected] = useState(() => (months.includes(monthKey(today)) ? monthKey(today) : months[0]));

  const view = useMemo(() => buildMonthView(ledger, selected, today), [ledger, selected, today]);
  const balance = useMemo(() => balanceSeries(ledger), [ledger]);

  const { budget } = ledger;
  const rate = budget.meta.fx.CAD_JPY;
  const stale = fxIsStale(budget, today);
  const categoryLabels = Object.fromEntries(budget.categories.map((c) => [c.id, c.label]));

  const idx = months.indexOf(selected);
  const paceDelta = view.spent - view.budget * view.monthProgress;

  return (
    <div className="pb-16">
      {/* ---- header ---- */}
      <div className="flex items-baseline justify-between">
        <h1 className="text-lg">Money</h1>
        <button onClick={onLock} className="text-xs text-muted underline decoration-[var(--ice-rest)] hover:decoration-[var(--ice-hover)]">
          lock
        </button>
      </div>
      <p className="mt-1 text-xs text-muted">{budget.period.label}</p>

      {/* ---- month switcher ---- */}
      <div className="mt-4 flex items-center gap-3 text-sm">
        <button
          onClick={() => setSelected(months[idx + 1])}
          disabled={idx >= months.length - 1}
          className="disabled:opacity-30"
          aria-label="Previous month"
        >
          ←
        </button>
        <span className="min-w-[9ch] text-center">{view.label}</span>
        <button onClick={() => setSelected(months[idx - 1])} disabled={idx <= 0} className="disabled:opacity-30" aria-label="Next month">
          →
        </button>
        {view.isCurrentMonth && <span className="text-[0.7rem] text-muted">day {view.elapsedDays} of {view.days}</span>}
      </div>

      {/* ---- hero ---- */}
      <div className="mt-6 rounded border border-border p-4">
        <div className="text-[0.7rem] tracking-wide text-muted uppercase">Spent this month</div>
        <div className="mt-1 flex items-baseline gap-3">
          <span className="text-4xl">{yen(view.spent)}</span>
          <span className="text-sm text-muted">of {yen(view.budget)}</span>
        </div>
        <div className="mt-1 text-xs text-muted">
          {toCAD(view.spent, rate)}
          {stale && <span className="ml-2" style={{ color: "var(--yellow)" }}>FX rate is stale</span>}
        </div>

        {/* budget meter: month progress sits behind spend so pace is readable at a glance */}
        <div className="relative mt-4 h-3 w-full rounded-sm" style={{ background: "var(--moretransblack)" }}>
          <div
            className="absolute inset-y-0 left-0 rounded-sm"
            style={{
              width: `${Math.min(100, view.pctOfBudget * 100)}%`,
              background: view.onPace ? "var(--accent)" : "var(--red)",
            }}
          />
          <div
            className="absolute inset-y-[-3px] w-px"
            style={{ left: `${Math.min(100, view.monthProgress * 100)}%`, background: "var(--foreground)" }}
            aria-hidden
          />
        </div>
        <div className="mt-2 flex justify-between text-[0.7rem] text-muted">
          <span>
            {Math.round(view.pctOfBudget * 100)}% of budget · {Math.round(view.monthProgress * 100)}% of month
          </span>
          <span style={{ color: view.onPace ? "var(--green)" : "var(--red)" }}>
            {view.spent === 0
              ? "nothing logged"
              : view.onPace
                ? `on pace, ${yen(Math.abs(paceDelta))} under`
                : `over pace by ${yen(paceDelta)}`}
          </span>
        </div>
      </div>

      {view.isPartial && view.spent > 0 && (
        <p className="mt-2 text-[0.7rem] leading-relaxed" style={{ color: "var(--yellow)" }}>
          Only {view.loggedDays} of {view.elapsedDays} elapsed days have entries. Totals, pace and projection all
          understate the real spend for this month.
        </p>
      )}

      {/* ---- stat row ---- */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[
          { label: "Left this month", value: yen(Math.max(0, view.remaining)) },
          { label: "Daily pace", value: yen(view.dailyPaceActual) },
          { label: "Safe per day", value: yen(view.elapsedDays < view.days ? Math.max(0, view.remaining) / (view.days - view.elapsedDays) : 0) },
        ].map((s) => (
          <div key={s.label} className="rounded border border-border p-2">
            <div className="text-sm">{s.value}</div>
            <div className="mt-0.5 text-[0.65rem] text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <Section title="Daily spend" note={`Bars turn red above the ${yen(view.dailyBudget)} daily line.`}>
        <DailySpendChart
          byDay={view.byDay}
          dailyBudget={view.dailyBudget}
          categoryLabels={categoryLabels}
          elapsedDays={view.elapsedDays}
        />
      </Section>

      <Section title="By category" note="Food, phone, transport are the live ones. Other is the sheet's remainder.">
        <CategoryBars groups={view.groups} />
      </Section>

      {view.spent > 0 && (
        <Section title="Month-end projection" note="Current daily pace carried to the end of the month.">
          <div className="rounded border border-border p-3 text-sm">
            <div className="flex items-baseline justify-between">
              <span>{yen(view.projectedMonthEnd)}</span>
              <span style={{ color: view.projectedOverUnder > 0 ? "var(--red)" : "var(--green)" }}>
                {view.projectedOverUnder > 0
                  ? `${yen(view.projectedOverUnder)} over budget`
                  : `${yen(Math.abs(view.projectedOverUnder))} under budget`}
              </span>
            </div>
            <p className="mt-1 text-[0.7rem] text-muted">{toCAD(view.projectedMonthEnd, rate)} at {rate} JPY per CAD</p>
          </div>
        </Section>
      )}

      <Section title="Planned balance" note="Straight from the sheet's projection. Not yet anchored to a real bank balance.">
        <BalancePlanChart series={balance} />
      </Section>

      {view.entries.length > 0 && (
        <Section title="Entries" note={`${view.entries.length} logged in ${view.label}.`}>
          <div className="flex flex-col divide-y divide-[var(--border)] text-xs">
            {view.entries.map((e) => (
              <div key={e.id} className="flex items-baseline justify-between gap-2 py-1.5">
                <span className="text-muted tabular-nums">{e.date.slice(5)}</span>
                <span className="flex-1 truncate">
                  {e.vendor ?? categoryLabels[e.category]}
                  {e.note && <span className="text-muted"> · {e.note}</span>}
                </span>
                <span className="tabular-nums">{yen(e.amount)}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {budget.reconcile.length > 0 && (
        <Section title="Needs your call" note="Contradictions carried over from the spreadsheet. Nothing here was guessed at.">
          <div className="flex flex-col gap-3">
            {budget.reconcile.map((r) => (
              <details key={r.id} className="rounded border border-border p-3">
                <summary className="cursor-pointer text-xs">
                  <span
                    className="mr-2 font-bold"
                    style={{ color: r.severity === "high" ? "var(--red)" : r.severity === "medium" ? "var(--yellow)" : "var(--muted)" }}
                  >
                    {r.severity}
                  </span>
                  {r.title}
                </summary>
                <p className="mt-2 text-[0.72rem] leading-relaxed text-muted">{r.detail}</p>
                <p className="mt-2 text-[0.72rem] leading-relaxed">{r.asks}</p>
              </details>
            ))}
          </div>
        </Section>
      )}

      <p className="mt-10 text-center text-[0.65rem] text-muted">
        Built {new Date(ledger.builtAt).toLocaleString("en-US")} · budget updated {budget.updated}
      </p>
    </div>
  );
}
