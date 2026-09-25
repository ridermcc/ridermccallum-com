"use client";

import { useState } from "react";
import { yen, type Insight, type WeekView } from "@/lib/money";
import { WeeklyChart } from "./charts";
import { Explain } from "./ui";

const TONE: Record<Insight["tone"], string> = {
  good: "var(--green)",
  warn: "var(--yellow)",
  bad: "var(--red)",
  info: "var(--muted)",
};

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// How many insight cards show before "more". The first is always the allowance.
const INSIGHTS_SHOWN = 3;

/**
 * The week is the unit to steer by: short enough to correct inside, long enough
 * to smooth out one night. This tab reads one week at a time against the weekly
 * budget and the week before it.
 */
export function WeekTab({
  weeks,
  insights,
  categoryLabels,
  typicalDailyRate,
}: {
  weeks: WeekView[];
  insights: Insight[];
  categoryLabels: Record<string, string>;
  typicalDailyRate: number;
}) {
  const [selected, setSelected] = useState(weeks.length - 1);
  const [allInsights, setAllInsights] = useState(false);

  if (weeks.length === 0) return <p className="mt-6 text-xs text-muted">Nothing logged yet.</p>;

  const w = weeks[selected];
  const prev = weeks[selected - 1];
  const left = w.budget - w.spent;
  const progress = w.elapsedDays / 7;
  const pct = w.spent / w.budget;

  // Finished weeks score against the budget; the streak counts back from the latest one.
  const finished = weeks.filter((x) => !x.isCurrent && !x.partial);
  const under = finished.filter((x) => x.spent <= x.budget).length;
  let streak = 0;
  for (let i = finished.length - 1; i >= 0 && finished[i].spent <= finished[i].budget; i--) streak++;
  const best = finished.reduce<WeekView | null>((b, x) => (!b || x.routine < b.routine ? x : b), null);

  const changes = Object.keys({ ...w.byCategory, ...(prev?.byCategory ?? {}) })
    .map((id) => ({
      id,
      now: w.byCategory[id] ?? 0,
      before: prev?.byCategory[id] ?? 0,
    }))
    .map((c) => ({ ...c, delta: c.now - c.before }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  const dayMax = Math.max(...w.byDay.map((d) => d.total), 1);
  const shownInsights = allInsights ? insights : insights.slice(0, INSIGHTS_SHOWN);

  return (
    <div>
      {/* ---- week switcher ---- */}
      <div className="mt-3 flex items-center justify-between text-sm">
        <button
          onClick={() => setSelected(selected - 1)}
          disabled={selected <= 0}
          className="flex h-10 w-10 items-center justify-center rounded border border-border disabled:opacity-30"
          aria-label="Previous week"
        >
          ←
        </button>
        <span className="text-center">
          {w.label}
          <span className="block text-[0.7rem] text-muted">
            {w.isCurrent
              ? `this week · day ${w.elapsedDays} of 7`
              : w.partial
                ? `partial · ${w.loggedDays} of 7 days logged`
                : `${weeks.length - 1 - selected} ${weeks.length - 1 - selected === 1 ? "week" : "weeks"} ago`}
          </span>
        </span>
        <button
          onClick={() => setSelected(selected + 1)}
          disabled={selected >= weeks.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded border border-border disabled:opacity-30"
          aria-label="Next week"
        >
          →
        </button>
      </div>

      {/* ---- hero ---- */}
      <div className="mt-6 rounded border border-border p-4">
        <div className="text-[0.7rem] tracking-wide text-muted uppercase">{w.isCurrent ? "Spent this week" : "Spent that week"}</div>
        <div className="mt-1 flex items-baseline gap-3">
          <span className="text-4xl tabular-nums">{yen(w.spent)}</span>
          <span className="text-sm text-muted">of {yen(w.budget)}</span>
        </div>
        <div className="relative mt-4 h-3 w-full rounded-sm" style={{ background: "var(--moretransblack)" }}>
          <div
            className="absolute inset-y-0 left-0 rounded-sm"
            style={{ width: `${Math.min(100, pct * 100)}%`, background: pct > progress ? "var(--red)" : "var(--accent)" }}
          />
          {w.isCurrent && (
            <div className="absolute inset-y-[-3px] w-px" style={{ left: `${progress * 100}%`, background: "var(--foreground)" }} aria-hidden />
          )}
        </div>
        <div className="mt-2 flex flex-wrap justify-between gap-x-3 text-xs">
          <span style={{ color: left >= 0 ? "var(--green)" : "var(--red)" }}>
            {left >= 0 ? `${yen(left)} ${w.isCurrent ? "left" : "under"}` : `${yen(-left)} over`}
          </span>
          {prev && (
            <span className="text-muted">
              last week {yen(prev.spent)}
              {!w.isCurrent && (
                <span style={{ color: w.spent <= prev.spent ? "var(--green)" : "var(--red)" }}>
                  {" "}
                  ({w.spent <= prev.spent ? "down" : "up"} {Math.abs(Math.round(((w.spent - prev.spent) / Math.max(1, prev.spent)) * 100))}%)
                </span>
              )}
            </span>
          )}
        </div>
        {w.oneOff > 0 && <p className="mt-1 text-[0.7rem] text-muted">Includes {yen(w.oneOff)} of one-offs.</p>}
      </div>

      {/* ---- what to change: only for the week still in play ---- */}
      {w.isCurrent && insights.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xs tracking-wide uppercase">What to change</h2>
          <div className="mt-3 flex flex-col gap-2">
            {shownInsights.map((ins) => (
              <div key={ins.id} className="rounded border border-border border-l-4 px-3 py-2.5" style={{ borderLeftColor: TONE[ins.tone] }}>
                <div className="text-sm">{ins.title}</div>
                <p className="mt-0.5 text-[0.72rem] leading-relaxed text-muted">{ins.body}</p>
              </div>
            ))}
          </div>
          {insights.length > INSIGHTS_SHOWN && (
            <button onClick={() => setAllInsights((v) => !v)} className="mt-1 py-2 text-[0.7rem] text-muted underline decoration-[var(--ice-rest)]">
              {allInsights ? "Show fewer" : `${insights.length - INSIGHTS_SHOWN} more`}
            </button>
          )}
        </section>
      )}

      {/* ---- week over week ---- */}
      <section className="mt-8">
        <h2 className="text-xs tracking-wide uppercase">Week over week</h2>
        <div className="mt-3">
          <WeeklyChart weeks={weeks} selected={selected} onSelect={setSelected} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Weeks under budget", value: `${under} of ${finished.length}` },
            { label: "Current streak", value: `${streak} ${streak === 1 ? "week" : "weeks"}` },
            { label: best ? `Best week, ${best.label}` : "Best week", value: best ? yen(best.routine) : "·" },
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
              red past the budget. Faded tops are one-offs. The current week is lighter because it is still running.
            </p>
            <p>Best week counts routine spend only. Grey weeks had gaps in logging and stay out of the streak.</p>
          </Explain>
        </div>
      </section>

      {/* ---- category changes vs the week before ---- */}
      {prev && changes.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xs tracking-wide uppercase">Change vs the week before</h2>
          <table className="mt-3 w-full text-[0.72rem] tabular-nums">
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
                  <td className="py-2 pl-3 text-right whitespace-nowrap" style={{ color: c.delta > 0 ? "var(--red)" : c.delta < 0 ? "var(--green)" : undefined }}>
                    {c.delta === 0 ? "·" : `${c.delta > 0 ? "+" : "−"}${yen(Math.abs(c.delta))}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* ---- the week by day ---- */}
      <section className="mt-8">
        <h2 className="text-xs tracking-wide uppercase">Day by day</h2>
        <div className="mt-3 flex flex-col gap-2">
          {w.byDay.map((d, i) => {
            const future = w.isCurrent && i >= w.elapsedDays;
            const big = typicalDailyRate > 0 && d.total > typicalDailyRate * 2;
            return (
              <div key={d.date} className={`flex items-center gap-3 text-xs ${future ? "opacity-40" : ""}`}>
                <span className="w-8 text-muted">{DAY_NAMES[i]}</span>
                <div className="h-2.5 flex-1 rounded-sm" style={{ background: "var(--moretransblack)" }}>
                  <div
                    className="h-full rounded-sm"
                    style={{ width: `${(d.total / dayMax) * 100}%`, background: big ? "var(--red)" : "var(--accent)" }}
                  />
                </div>
                <span className="w-16 text-right tabular-nums">{future ? "" : d.total ? yen(d.total) : "·"}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[0.65rem] text-muted">Red marks a big day, past twice the {yen(typicalDailyRate)} typical day.</p>
      </section>
    </div>
  );
}
