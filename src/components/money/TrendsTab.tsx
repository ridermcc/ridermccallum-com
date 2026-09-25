"use client";

import { useState } from "react";
import {
  endingBalanceAt,
  yen,
  type MonthView,
  type Plan,
  type SeasonProjection,
  type WeekView,
} from "@/lib/money";
import {
  BalancePlanChart,
  CategoryBars,
  CumulativeSpendChart,
  DailySpendChart,
  MonthlyProjectionChart,
  TopSpots,
  WeekdayChart,
  WeeklyChart,
} from "./charts";
import { Explain } from "./ui";

export type Period = "week" | "month" | "season";
const PERIODS: { id: Period; label: string }[] = [
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "season", label: "Season" },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xs tracking-wide uppercase">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function TrendsTab({
  period,
  setPeriod,
  weeks,
  view,
  monthNav,
  projection,
  plan,
  balance,
  categoryLabels,
}: {
  period: Period;
  setPeriod: (p: Period) => void;
  weeks: WeekView[];
  view: MonthView;
  monthNav: { prev?: () => void; next?: () => void };
  projection: SeasonProjection;
  plan: Plan;
  balance: { date: string; label: string; plan: number }[];
  categoryLabels: Record<string, string>;
}) {
  const typical = projection.basis.typicalDailyRate;

  return (
    <div>
      {/* ---- period switch ---- */}
      <div className="mt-4 flex rounded border border-border p-0.5 text-xs" role="group" aria-label="Period">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            aria-pressed={period === p.id}
            className={`flex-1 rounded-sm py-2 ${period === p.id ? "bg-[var(--moretransblack)] text-foreground" : "text-muted"}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {period === "week" && <WeekTrends weeks={weeks} categoryLabels={categoryLabels} />}

      {period === "month" && (
        <>
          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              onClick={monthNav.prev}
              disabled={!monthNav.prev}
              className="flex h-10 w-10 items-center justify-center rounded border border-border disabled:opacity-30"
              aria-label="Previous month"
            >
              ←
            </button>
            <span className="text-center">
              {view.label}
              <span className="block text-[0.7rem] text-muted">
                {yen(view.spent)} of {yen(view.budget)}
                {view.isCurrentMonth && ` · day ${view.elapsedDays} of ${view.days}`}
              </span>
            </span>
            <button
              onClick={monthNav.next}
              disabled={!monthNav.next}
              className="flex h-10 w-10 items-center justify-center rounded border border-border disabled:opacity-30"
              aria-label="Next month"
            >
              →
            </button>
          </div>
          {view.isPartial && view.spent > 0 && (
            <p className="mt-2 text-[0.7rem]" style={{ color: "var(--yellow)" }}>
              Only {view.loggedDays} of {view.elapsedDays} days logged. Totals understate this month.
            </p>
          )}

          {view.spent > 0 && (
            <Block title="Running total">
              <CumulativeSpendChart byDay={view.byDay} budget={view.budget} elapsedDays={view.elapsedDays} typicalDailyRate={typical} />
            </Block>
          )}
          <Block title="Daily spend">
            <DailySpendChart
              byDay={view.byDay}
              dailyBudget={view.dailyBudget}
              typicalDailyRate={typical}
              categoryLabels={categoryLabels}
              elapsedDays={view.elapsedDays}
            />
          </Block>
          <Block title="By category">
            <CategoryBars groups={view.groups} />
          </Block>
          {view.spent > 0 && (
            <>
              <Block title="By weekday">
                <WeekdayChart byDay={view.byDay} elapsedDays={view.elapsedDays} />
              </Block>
              <Block title="Top spots">
                <TopSpots entries={view.entries} />
              </Block>
            </>
          )}
        </>
      )}

      {period === "season" && (
        <>
          <WhatIf projection={projection} plan={plan} weeklyBudget={weeks[0]?.budget ?? 0} />
          {projection.countedMonths > 0 && (
            <Block title="Month by month">
              <MonthlyProjectionChart months={projection.months} budget={projection.budgetedLiving / Math.max(1, projection.countedMonths)} />
            </Block>
          )}
          <Block title="Planned balance">
            <BalancePlanChart series={balance} />
          </Block>
          <p className="mt-2 text-[0.65rem] text-muted">Full plan and projection detail sit under the gear.</p>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- week trends */

function WeekTrends({ weeks, categoryLabels }: { weeks: WeekView[]; categoryLabels: Record<string, string> }) {
  const [selected, setSelected] = useState(weeks.length - 1);
  if (weeks.length === 0) return <p className="mt-6 text-xs text-muted">Nothing logged yet.</p>;
  const w = weeks[selected];
  const prev = weeks[selected - 1];

  const finished = weeks.filter((x) => !x.isCurrent && !x.partial);
  const under = finished.filter((x) => x.spent <= x.budget).length;
  let streak = 0;
  for (let i = finished.length - 1; i >= 0 && finished[i].spent <= finished[i].budget; i--) streak++;
  const avg = finished.length ? finished.reduce((s, x) => s + x.routine, 0) / finished.length : 0;

  const changes = Object.keys({ ...w.byCategory, ...(prev?.byCategory ?? {}) })
    .map((id) => ({ id, now: w.byCategory[id] ?? 0, before: prev?.byCategory[id] ?? 0 }))
    .map((c) => ({ ...c, delta: c.now - c.before }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  return (
    <>
      <Block title="Week over week">
        <WeeklyChart weeks={weeks} selected={selected} onSelect={setSelected} />
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Weeks under budget", value: `${under} of ${finished.length}` },
            { label: "Current streak", value: `${streak} ${streak === 1 ? "week" : "weeks"}` },
            { label: "Average week", value: finished.length ? yen(avg) : "·" },
          ].map((s) => (
            <div key={s.label} className="rounded border border-border p-2">
              <div className="text-sm tabular-nums">{s.value}</div>
              <div className="mt-0.5 text-[0.65rem] text-muted">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-1">
          <Explain>
            <p>
              The weekly budget is the monthly living budget spread over 52 weeks. Solid bars are routine spend and turn
              red past the budget. Faded tops are one-offs. Grey weeks had gaps in logging and stay out of the stats.
            </p>
          </Explain>
        </div>
      </Block>

      {prev && changes.length > 0 && (
        <Block title={`${w.label} vs the week before`}>
          <table className="w-full text-[0.72rem] tabular-nums">
            <thead>
              <tr className="text-muted">
                <th className="py-1 pr-3 text-left font-normal">Category</th>
                <th className="py-1 pl-3 text-right font-normal">{w.isCurrent ? "So far" : "This"}</th>
                <th className="py-1 pl-3 text-right font-normal">Before</th>
                <th className="py-1 pl-3 text-right font-normal">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {changes.map((c) => (
                <tr key={c.id}>
                  <td className="py-2 pr-3">{categoryLabels[c.id] ?? c.id}</td>
                  <td className="py-2 pl-3 text-right whitespace-nowrap">{c.now ? yen(c.now) : <span className="text-muted">·</span>}</td>
                  <td className="py-2 pl-3 text-right whitespace-nowrap text-muted">{c.before ? yen(c.before) : "·"}</td>
                  <td
                    className="py-2 pl-3 text-right whitespace-nowrap"
                    style={{ color: c.delta > 0 ? "var(--red)" : c.delta < 0 ? "var(--green)" : undefined }}
                  >
                    {c.delta === 0 ? "·" : `${c.delta > 0 ? "+" : "−"}${yen(Math.abs(c.delta))}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Block>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ what-if */

/**
 * Drag a weekly spend and see where the season ends. Presets pin the three
 * numbers worth comparing: the budget, the typical week, the all-in week.
 */
function WhatIf({ projection, plan, weeklyBudget }: { projection: SeasonProjection; plan: Plan; weeklyBudget: number }) {
  const typicalWeek = Math.round(projection.basis.typicalDailyRate * 7);
  const allInWeek = Math.round(projection.basis.dailyRate * 7);
  const [weekly, setWeekly] = useState(typicalWeek || weeklyBudget);

  if (projection.daysRemaining === 0) return null;

  const min = 10_000;
  const max = Math.max(80_000, Math.ceil((allInWeek * 1.2) / 5000) * 5000);
  const end = endingBalanceAt(projection, weekly);
  const vsPlan = end - plan.endingBalance;
  const presets = [
    { label: "Budget", value: weeklyBudget },
    { label: "Typical", value: typicalWeek },
    { label: "All-in", value: allInWeek },
  ].filter((p) => p.value > 0);

  return (
    <section className="mt-6 rounded border border-border p-4">
      <div className="text-[0.7rem] tracking-wide text-muted uppercase">If you spend a week</div>
      <div className="mt-1 text-3xl tabular-nums">{yen(weekly)}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={500}
        value={weekly}
        onChange={(e) => setWeekly(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--accent)]"
        aria-label="Weekly spend"
      />
      <div className="mt-2 flex gap-2 text-[0.7rem]">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => setWeekly(p.value)}
            className={`flex-1 rounded border px-2 py-1.5 ${weekly === p.value ? "border-foreground" : "border-border text-muted"}`}
          >
            {p.label}
            <span className="block tabular-nums">{yen(p.value)}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 border-t border-border pt-3">
        <div className="text-[0.7rem] text-muted">You finish the season with</div>
        <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3">
          <span className="text-2xl tabular-nums" style={{ color: end < 0 ? "var(--red)" : undefined }}>
            {yen(end)}
          </span>
          <span className="text-xs" style={{ color: vsPlan >= 0 ? "var(--green)" : "var(--red)" }}>
            {vsPlan >= 0 ? `${yen(vsPlan)} above plan` : `${yen(-vsPlan)} below plan`}
          </span>
        </div>
        <div className="mt-1 text-[0.7rem] text-muted">
          Plan says {yen(plan.endingBalance)}. {projection.daysRemaining} days left to pay for.
        </div>
      </div>
    </section>
  );
}
