"use client";

import { useState } from "react";
import { capSpend, yen, type Cap, type Insight, type SpendEntry, type WeekView } from "@/lib/money";

const TONE: Record<Insight["tone"], string> = {
  good: "var(--green)",
  warn: "var(--yellow)",
  bad: "var(--red)",
  info: "var(--muted)",
};

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const INSIGHTS_SHOWN = 3;

/**
 * One screen that answers "what can I spend, and what should I change". The
 * headline is today's number; everything under it explains or adjusts it.
 */
export function NowTab({
  weeks,
  insights,
  caps,
  spend,
  today,
  typicalDailyRate,
  onEditCaps,
  onSeeWeeks,
}: {
  weeks: WeekView[];
  insights: Insight[];
  caps: Cap[];
  spend: SpendEntry[];
  today: string;
  typicalDailyRate: number;
  onEditCaps: () => void;
  onSeeWeeks: () => void;
}) {
  const [allInsights, setAllInsights] = useState(false);
  const w = weeks[weeks.length - 1];
  if (!w || !w.isCurrent) return <p className="mt-6 text-xs text-muted">Nothing logged this week yet.</p>;
  const prev = weeks[weeks.length - 2];

  // Today's number: what the rest of the week can carry per day, before today,
  // less whatever today has already spent.
  const todayIdx = w.elapsedDays - 1;
  const spentToday = w.byDay[todayIdx]?.total ?? 0;
  const daysLeft = 7 - todayIdx;
  const beforeToday = w.spent - spentToday;
  const perDay = (w.budget - beforeToday) / daysLeft;
  const safeToday = perDay - spentToday;
  const weekLeft = w.budget - w.spent;

  // Week over week at the same point: last week through the same weekday.
  const prevSoFar = prev ? prev.byDay.slice(0, w.elapsedDays).reduce((s, d) => s + d.total, 0) : null;
  const vsLast = prevSoFar !== null ? w.spent - prevSoFar : null;

  const dayMax = Math.max(...w.byDay.map((d) => d.total), ...(prev?.byDay.map((d) => d.total) ?? []), 1);
  const cards = insights.filter((i) => i.id !== "allowance");
  const shown = allInsights ? cards : cards.slice(0, INSIGHTS_SHOWN);

  return (
    <div>
      {/* ---- today's number ---- */}
      <div className="mt-6 rounded border border-border p-4">
        <div className="text-[0.7rem] tracking-wide text-muted uppercase">{safeToday >= 0 ? "Safe to spend today" : "Over today's share"}</div>
        <div className="mt-1 text-5xl tabular-nums" style={{ color: safeToday < 0 ? "var(--red)" : undefined }}>
          {yen(Math.abs(safeToday))}
        </div>
        <div className="mt-2 text-xs text-muted">
          {weekLeft >= 0 ? (
            <>
              {yen(weekLeft)} left this week · {daysLeft} {daysLeft === 1 ? "day" : "days"} to go
            </>
          ) : (
            <span style={{ color: "var(--red)" }}>{yen(-weekLeft)} over this week. Monday resets it.</span>
          )}
          {spentToday > 0 && <> · {yen(spentToday)} spent today</>}
        </div>

        <div className="relative mt-4 h-3 w-full rounded-sm" style={{ background: "var(--moretransblack)" }}>
          <div
            className="absolute inset-y-0 left-0 rounded-sm"
            style={{
              width: `${Math.min(100, (w.spent / w.budget) * 100)}%`,
              background: w.spent / w.budget > w.elapsedDays / 7 ? "var(--red)" : "var(--accent)",
            }}
          />
          <div className="absolute inset-y-[-3px] w-px" style={{ left: `${(w.elapsedDays / 7) * 100}%`, background: "var(--foreground)" }} aria-hidden />
        </div>
        <div className="mt-2 flex flex-wrap justify-between gap-x-3 text-[0.7rem] text-muted">
          <span>
            {yen(w.spent)} of {yen(w.budget)} this week
          </span>
          {vsLast !== null && (
            <span style={{ color: vsLast <= 0 ? "var(--green)" : "var(--red)" }}>
              {vsLast <= 0 ? `${yen(-vsLast)} less` : `${yen(vsLast)} more`} than last week by {DAY_NAMES[todayIdx]}
            </span>
          )}
        </div>
      </div>

      {/* ---- caps ---- */}
      {caps.length > 0 && (
        <section className="mt-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs tracking-wide uppercase">Weekly caps</h2>
            <button onClick={onEditCaps} className="py-1 text-[0.7rem] text-muted underline decoration-[var(--ice-rest)]">
              edit
            </button>
          </div>
          <div className="mt-3 flex flex-col gap-3">
            {caps.map((c) => {
              const used = capSpend(c, spend, w.start, today);
              const over = used > c.weekly;
              return (
                <div key={c.id}>
                  <div className="flex items-baseline justify-between text-xs">
                    <span>{c.label}</span>
                    <span className="tabular-nums">
                      <span style={{ color: over ? "var(--red)" : undefined }}>{yen(used)}</span>
                      <span className="text-muted"> / {yen(c.weekly)}</span>
                    </span>
                  </div>
                  <div className="mt-1 h-2.5 w-full rounded-sm" style={{ background: "var(--moretransblack)" }}>
                    <div
                      className="h-full rounded-sm"
                      style={{ width: `${Math.min(100, (used / Math.max(1, c.weekly)) * 100)}%`, background: over ? "var(--red)" : "var(--accent)" }}
                    />
                  </div>
                  <div className="mt-0.5 text-[0.65rem] text-muted">
                    {over ? <span style={{ color: "var(--red)" }}>{yen(used - c.weekly)} over</span> : `${yen(c.weekly - used)} left`}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ---- what to change ---- */}
      {cards.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xs tracking-wide uppercase">What to change</h2>
          <div className="mt-3 flex flex-col gap-2">
            {shown.map((ins) => (
              <div key={ins.id} className="rounded border border-border border-l-4 px-3 py-2.5" style={{ borderLeftColor: TONE[ins.tone] }}>
                <div className="text-sm">{ins.title}</div>
                <p className="mt-0.5 text-[0.72rem] leading-relaxed text-muted">{ins.body}</p>
              </div>
            ))}
          </div>
          {cards.length > INSIGHTS_SHOWN && (
            <button onClick={() => setAllInsights((v) => !v)} className="mt-1 py-2 text-[0.7rem] text-muted underline decoration-[var(--ice-rest)]">
              {allInsights ? "Show fewer" : `${cards.length - INSIGHTS_SHOWN} more`}
            </button>
          )}
        </section>
      )}

      {/* ---- this week against last, day by day ---- */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs tracking-wide uppercase">This week vs last</h2>
          <button onClick={onSeeWeeks} className="py-1 text-[0.7rem] text-muted underline decoration-[var(--ice-rest)]">
            all weeks
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {w.byDay.map((d, i) => {
            const future = i > todayIdx;
            const last = prev?.byDay[i]?.total ?? 0;
            const big = typicalDailyRate > 0 && d.total > typicalDailyRate * 2;
            return (
              <div key={d.date} className="flex items-center gap-3 text-xs">
                <span className={`w-8 ${i === todayIdx ? "text-foreground" : "text-muted"}`}>{DAY_NAMES[i]}</span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <div className="h-2.5 rounded-sm" style={{ background: "var(--moretransblack)" }}>
                    {!future && (
                      <div className="h-full rounded-sm" style={{ width: `${(d.total / dayMax) * 100}%`, background: big ? "var(--red)" : "var(--accent)" }} />
                    )}
                  </div>
                  {prev && (
                    <div className="h-1 rounded-sm">
                      <div className="h-full rounded-sm" style={{ width: `${(last / dayMax) * 100}%`, background: "var(--muted)", opacity: 0.5 }} />
                    </div>
                  )}
                </div>
                <span className="w-16 text-right tabular-nums">{future ? <span className="text-muted">{last ? yen(last) : ""}</span> : d.total ? yen(d.total) : "·"}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[0.65rem] text-muted">Thick bar this week, thin grey bar last week. Red marks a big day.</p>
      </section>
    </div>
  );
}
