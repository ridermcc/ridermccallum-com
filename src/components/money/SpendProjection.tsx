"use client";

import { toCAD, yen, type SeasonProjection } from "@/lib/money";
import { MonthlyProjectionChart } from "./charts";

const CONFIDENCE: Record<SeasonProjection["basis"]["confidence"], { label: string; note: string; color: string }> = {
  none: { label: "no data", note: "Nothing is logged yet, so there is nothing to project from.", color: "var(--muted)" },
  thin: {
    label: "thin sample",
    note: "Read this as a direction, not a forecast. A quiet week or one big night out moves it a long way.",
    color: "var(--yellow)",
  },
  early: {
    label: "early",
    note: "Enough days to show a trend, not enough to cover a full month's rhythm of rent-week, road trips and days off.",
    color: "var(--yellow)",
  },
  reasonable: {
    label: "reasonable",
    note: "Enough logged days that the daily rate is starting to mean something.",
    color: "var(--green)",
  },
};

// yen() writes a negative as ¥-1,234; balances that can dip below zero want the sign out front.
const signedYen = (n: number) => (n < 0 ? `−${yen(-n)}` : yen(n));

function Stat({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded border border-border p-3">
      <div className="text-sm tabular-nums" style={color ? { color } : undefined}>
        {value}
      </div>
      <div className="mt-0.5 text-[0.65rem] text-muted">{label}</div>
      {sub && <div className="mt-0.5 text-[0.65rem] text-muted opacity-70">{sub}</div>}
    </div>
  );
}

export function SpendProjection({ projection, rate }: { projection: SeasonProjection; rate: number }) {
  const p = projection;
  const conf = CONFIDENCE[p.basis.confidence];
  const over = p.overUnder > 0;
  const overHigh = p.overUnderHigh > 0;

  if (p.basis.daysObserved === 0) {
    return <p className="text-xs text-muted">{conf.note}</p>;
  }

  if (p.countedMonths === 0) {
    return (
      <p className="text-xs leading-relaxed text-muted">
        Every month in the plan has been paid. There is nothing left to project against, so read the months on their
        actuals instead.
      </p>
    );
  }

  const big = p.basis.bigDays;
  const splitMatters = big.count > 0 && p.overUnderHigh - p.overUnder > 1000;

  return (
    <div className="flex flex-col gap-5">
      {/* headline: the typical-day scenario leads, the big-day scenario brackets it */}
      <div className="rounded border border-border p-4">
        <div className="text-[0.7rem] tracking-wide text-muted uppercase">
          Projected over the {p.countedMonths} months still to pay for
        </div>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-4xl tabular-nums">
            {over ? "+" : "−"}
            {yen(Math.abs(p.overUnder))}
          </span>
          <span className="text-sm" style={{ color: over ? "var(--red)" : "var(--green)" }}>
            {over ? "over" : "under"} budget on typical days
          </span>
        </div>
        <div className="mt-1 text-xs text-muted">
          {yen(p.projectedLiving)} projected against {yen(p.budgetedLiving)} budgeted · {toCAD(Math.abs(p.overUnder), rate)}
        </div>

        {splitMatters && (
          <p className="mt-3 text-[0.72rem] leading-relaxed">
            If the big days keep their current pace it lands{" "}
            <span style={{ color: overHigh ? "var(--red)" : "var(--green)" }}>
              {overHigh ? "+" : "−"}
              {yen(Math.abs(p.overUnderHigh))} {overHigh ? "over" : "under"}
            </span>
            . {big.count} {big.count === 1 ? "day carries" : "days carry"} {yen(big.total)},{" "}
            {Math.round(big.share * 100)}% of everything logged, so the month is decided by the big days, not the
            routine ones.
          </p>
        )}

        <p className="mt-2 text-[0.72rem] leading-relaxed text-muted">
          A typical logged day runs {yen(p.basis.typicalDailyRate)} ({yen(p.typicalMonthlyRunRate)} a month). The
          all-in average is {yen(p.basis.dailyRate)} a day because of the big ones; the projection carries both rates
          forward.
        </p>

        <p className="mt-2 rounded border px-2 py-1 text-[0.7rem] leading-relaxed" style={{ borderColor: conf.color, color: conf.color }}>
          Based on {p.basis.daysObserved} logged {p.basis.daysObserved === 1 ? "day" : "days"} ({conf.label}). {conf.note}
        </p>
      </div>

      {/* what it does to the money that matters */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Planned savings" value={yen(p.plannedSavings)} />
        <Stat
          label="Projected savings, typical days"
          value={signedYen(p.projectedSavings)}
          sub={splitMatters ? `${signedYen(p.projectedSavingsLow)} if big days continue` : toCAD(p.projectedSavings, rate)}
          color={over ? "var(--red)" : "var(--green)"}
        />
        <Stat
          label="Projected ending balance"
          value={signedYen(p.projectedEndingBalance)}
          sub={splitMatters ? `${signedYen(p.projectedEndingBalanceLow)} if big days continue` : toCAD(p.projectedEndingBalance, rate)}
        />
        <Stat
          label="To land on budget"
          value={`${yen(p.safeDailyRate)}/day`}
          sub={`${p.daysRemaining} days left, typical day now ${yen(p.basis.typicalDailyRate)}`}
          color={p.safeDailyRate < p.basis.typicalDailyRate ? "var(--yellow)" : undefined}
        />
      </div>

      <div>
        <p className="mb-2 text-[0.7rem] text-muted">
          Solid is logged, translucent carries typical days to month end, the whisker marks where the month lands if
          the big days keep their pace. Bars turn red above the budget line.
        </p>
        <MonthlyProjectionChart months={p.months} budget={p.budgetedLiving / Math.max(1, p.countedMonths)} />
      </div>

      {p.uncountedMonths.length > 0 && (
        <p className="text-[0.7rem] leading-relaxed text-muted">
          {p.uncountedMonths.map((m) => m.label).join(", ")}{" "}
          {p.uncountedMonths.length === 1 ? "is" : "are"} left out of every number above. Logging covered only{" "}
          {p.uncountedMonths.map((m) => `${m.loggedDays} of ${m.elapsedDays}`).join(", ")} days, so the logged total is
          real spend but not a month. Counting it would understate the plan more than the projection corrects it.
        </p>
      )}

      {/* where the overage lives */}
      <div>
        <h3 className="text-[0.7rem] tracking-wide text-muted uppercase">
          By category, per {p.representativeDays}-day month
        </h3>
        <div className="mt-2">
          {/* the budget column steps back on phones so projected and over/under stay on screen */}
          <table className="w-full text-[0.72rem] tabular-nums">
            <thead>
              <tr className="text-muted">
                <th className="py-1 pr-3 text-left font-normal">Category</th>
                <th className="hidden py-1 pl-3 text-right font-normal sm:table-cell">Budget</th>
                <th className="py-1 pl-3 text-right font-normal">Projected</th>
                <th className="py-1 pl-3 text-right font-normal">Over / under</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {p.categories
                .filter((c) => c.observed > 0 || c.budget > 0)
                .map((c) => (
                  <tr key={c.id}>
                    <td className="py-1.5 pr-3">
                      {c.label}
                      {c.unbudgeted && (
                        <span className="ml-1.5 text-[0.6rem]" style={{ color: "var(--yellow)" }}>
                          not budgeted
                        </span>
                      )}
                    </td>
                    <td className="hidden py-1.5 pl-3 text-right text-muted sm:table-cell">{c.budget === 0 ? "·" : yen(c.budget)}</td>
                    <td className="py-1.5 pl-3 text-right">{c.projected === 0 ? <span className="text-muted">·</span> : yen(c.projected)}</td>
                    <td
                      className="py-1.5 pl-3 text-right"
                      style={{ color: c.overUnder > 0 ? "var(--red)" : c.overUnder < 0 ? "var(--green)" : undefined }}
                    >
                      {c.overUnder === 0 ? <span className="text-muted">·</span> : `${c.overUnder > 0 ? "+" : "−"}${yen(Math.abs(c.overUnder))}`}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[0.7rem] leading-relaxed text-muted">
          The category split still uses the all-in average, every yen of the big days included, so it shows where the
          money actually went. Categories marked not budgeted carry real spend against a zero line: the budget is what
          is wrong there, not the spending. Fix them in Budget admin and this projection moves with it.
        </p>
      </div>
    </div>
  );
}
