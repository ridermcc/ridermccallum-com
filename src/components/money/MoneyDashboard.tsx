"use client";

import { useEffect, useMemo, useState } from "react";
import {
  applyOverrides,
  availableMonths,
  balanceSeries,
  buildMonthView,
  buildPlan,
  fxIsStale,
  hasOverrides,
  monthKey,
  planProgress,
  projectSeason,
  todayISO,
  toCAD,
  yen,
  type BudgetOverrides,
  type Ledger,
} from "@/lib/money";
import { BalancePlanChart, CategoryBars, DailySpendChart } from "./charts";
import { BudgetPlan } from "./BudgetPlan";
import { SpendProjection } from "./SpendProjection";
import { BudgetAdmin } from "./BudgetAdmin";

const OVERRIDES_KEY = "money:budget-overrides";

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

  // Budget edits live in this browser as a patch over the published ledger, so
  // the numbers can be changed here without a rebuild and without ever losing
  // the figures that shipped.
  // Read on the first render, not in an effect: this component only ever mounts
  // after the passphrase gate has unlocked, so there is no server render to
  // mismatch against.
  const [overrides, setOverrides] = useState<BudgetOverrides>(() => {
    try {
      return JSON.parse(localStorage.getItem(OVERRIDES_KEY) ?? "{}") as BudgetOverrides;
    } catch {
      // A malformed or unreadable store is not worth blocking the page for.
      return {};
    }
  });

  useEffect(() => {
    try {
      if (hasOverrides(overrides)) localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
      else localStorage.removeItem(OVERRIDES_KEY);
    } catch {
      // Private windows and blocked site data: the edits still apply this session.
    }
  }, [overrides]);

  const working = useMemo<Ledger>(
    () => ({ ...ledger, budget: applyOverrides(ledger.budget, overrides) }),
    [ledger, overrides]
  );

  const months = useMemo(() => availableMonths(working, today), [working, today]);
  const [selected, setSelected] = useState(() =>
    availableMonths(ledger, today).includes(monthKey(today)) ? monthKey(today) : availableMonths(ledger, today)[0]
  );

  const view = useMemo(() => buildMonthView(working, selected, today), [working, selected, today]);
  const balance = useMemo(() => balanceSeries(working.budget), [working]);
  const plan = useMemo(() => buildPlan(working.budget), [working]);
  const progress = useMemo(() => planProgress(working, today), [working, today]);
  const projection = useMemo(() => projectSeason(working, today), [working, today]);

  const budget = working.budget;
  const edited = hasOverrides(overrides);
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
      {edited && (
        <p className="mt-2 rounded border px-2 py-1 text-[0.7rem]" style={{ borderColor: "var(--yellow)", color: "var(--yellow)" }}>
          Showing your edited budget, not the published one. Reset it in Budget admin below.
        </p>
      )}

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

      {/* ---- today's number: the adaptive daily budget ---- */}
      {view.isCurrentMonth && view.elapsedDays < view.days && (
        <div className="mt-4 rounded border border-border p-4">
          <div className="text-[0.7rem] tracking-wide text-muted uppercase">To stay on track</div>
          {view.remaining > 0 ? (
            <>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-2xl tabular-nums">{yen(view.safePerDay)}</span>
                <span className="text-sm text-muted">a day for the {view.days - view.elapsedDays} days left</span>
              </div>
              <p className="mt-1 text-[0.72rem] leading-relaxed text-muted">
                Hold that and the month lands on its {yen(view.budget)} budget. A typical day so far runs{" "}
                {yen(projection.basis.typicalDailyRate)}.
              </p>
            </>
          ) : (
            <>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-2xl tabular-nums">{yen(-view.remaining)}</span>
                <span className="text-sm text-muted">past the month&apos;s budget, {view.days - view.elapsedDays} days left</span>
              </div>
              <p className="mt-1 text-[0.72rem] leading-relaxed text-muted">
                The month&apos;s {yen(view.budget)} is spent, so every yen from here comes out of savings. Quiet, typical
                days from now on end the month about{" "}
                {yen(-view.remaining + projection.basis.typicalDailyRate * (view.days - view.elapsedDays))} over; next
                month starts the meter at zero again.
              </p>
            </>
          )}
        </div>
      )}

      {/* ---- stat row ---- */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[
          { label: "Left this month", value: yen(Math.max(0, view.remaining)) },
          { label: "Daily pace", value: yen(view.dailyPaceActual) },
          { label: "Typical day", value: yen(projection.basis.typicalDailyRate) },
        ].map((s) => (
          <div key={s.label} className="rounded border border-border p-2">
            <div className="text-sm">{s.value}</div>
            <div className="mt-0.5 text-[0.65rem] text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <Section
        title="The whole plan"
        note={`${plan.months} salary months, ${budget.period.start} to the last paycheque. Every figure here is editable at the bottom of this page.`}
      >
        <BudgetPlan budget={budget} plan={plan} progress={progress} rate={rate} />
      </Section>

      <Section
        title="Projection"
        note="What a typical day costs, carried over the rest of the plan, with the big days shown as a bracket instead of baked into every future month."
      >
        <SpendProjection projection={projection} rate={rate} />
      </Section>

      <Section
        title="Daily spend"
        note={`Bars turn red on big days, past twice the ${yen(projection.basis.typicalDailyRate)} typical day. The stepped line is the adaptive daily budget: what each day could carry, given the spending before it. Days that blow past the scale are clipped and labeled.`}
      >
        <DailySpendChart
          byDay={view.byDay}
          dailyBudget={view.dailyBudget}
          typicalDailyRate={projection.basis.typicalDailyRate}
          categoryLabels={categoryLabels}
          elapsedDays={view.elapsedDays}
        />
      </Section>

      <Section title="By category" note="Food, phone, transport are the live ones. Other is the sheet's remainder.">
        <CategoryBars groups={view.groups} />
      </Section>

      {view.spent > 0 && view.isCurrentMonth && view.elapsedDays < view.days && (() => {
        // A range, not a verdict: logged spend plus typical days to month end,
        // bracketed by the all-in average that the big days drag upward.
        const remainingDays = view.days - view.elapsedDays;
        const low = view.spent + projection.basis.typicalDailyRate * remainingDays;
        const high = view.spent + projection.basis.dailyRate * remainingDays;
        const lowDelta = low - view.budget;
        return (
          <Section title="Month-end projection" note="Logged spend plus typical days ahead; the second figure adds big days at their current pace.">
            <div className="rounded border border-border p-3 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="tabular-nums">
                  {yen(low)}
                  {high > low + 1 && <span className="text-muted"> to {yen(high)}</span>}
                </span>
                <span style={{ color: lowDelta > 0 ? "var(--red)" : "var(--green)" }}>
                  {lowDelta > 0 ? `${yen(lowDelta)} over budget` : `${yen(Math.abs(lowDelta))} under budget`}
                  {high > low + 1 && " on typical days"}
                </span>
              </div>
              <p className="mt-1 text-[0.7rem] text-muted">{toCAD(low, rate)} at {rate} JPY per CAD</p>
            </div>
          </Section>
        );
      })()}

      <Section title="Planned balance" note="Derived from the inputs above. Not yet anchored to a real bank balance.">
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

      <Section title="Budget admin" note="Change any number and the whole page recalculates.">
        <details className="rounded border border-border p-3" open={edited}>
          <summary className="cursor-pointer text-xs">
            {edited ? "Edited on this device" : "Edit the budget"}
          </summary>
          <div className="mt-4">
            <BudgetAdmin published={ledger.budget} working={budget} overrides={overrides} setOverrides={setOverrides} />
          </div>
        </details>
      </Section>

      <p className="mt-10 text-center text-[0.65rem] text-muted">
        Built {new Date(ledger.builtAt).toLocaleString("en-US")} · budget updated {budget.updated}
      </p>
    </div>
  );
}
