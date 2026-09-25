"use client";

import { useEffect, useRef, useState } from "react";
import type { DayActual, GroupActual, MonthProjection, SpendEntry, WeekView } from "@/lib/money";
import { yen } from "@/lib/money";

// Shared chart geometry. One accent hue carries every measure; budget lines are
// recessive reference marks, and status colors appear only with a text label.
const ACCENT = "var(--accent)";
const OVER = "var(--red)";
const UNDER = "var(--green)";

/**
 * Charts render at the container's real pixel width instead of scaling a fixed
 * viewBox, so a 10px label is 10px on a phone rather than 5px. Until the first
 * measurement lands the chart reserves its height and draws nothing.
 */
function useMeasuredWidth() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setWidth((prev) => (Math.abs(prev - w) < 1 ? prev : w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

/**
 * Tap or drag across a chart to pick a mark. `toIndex` maps an x offset inside
 * the svg to a mark index. Vertical swipes still scroll the page (pan-y); a
 * horizontal drag scrubs.
 */
function scrubProps(toIndex: (px: number) => number, count: number, onPick: (i: number) => void) {
  const pick = (e: React.PointerEvent<SVGSVGElement>) => {
    const px = e.clientX - e.currentTarget.getBoundingClientRect().left;
    onPick(Math.max(0, Math.min(count - 1, toIndex(px))));
  };
  return {
    style: { touchAction: "pan-y" as const, cursor: "crosshair", userSelect: "none" as const, WebkitUserSelect: "none" as const },
    onPointerDown: pick,
    onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => {
      if (e.pointerType === "mouse" || e.buttons > 0) pick(e);
    },
  };
}

/**
 * The readout sits under the chart instead of floating over it: a finger never
 * covers it and it never runs off the edge of a phone screen. It always shows
 * something, so the chart is never a mystery before the first tap.
 */
function Readout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 min-h-[3.25rem] rounded border border-border px-3 py-2 text-xs leading-relaxed" aria-live="polite">
      {children}
    </div>
  );
}

/** A round step for one or two gridlines: 1, 2 or 5 times a power of ten. */
function niceStep(max: number, lines = 2) {
  const raw = max / lines;
  if (raw <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(raw));
  const n = raw / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

/** Recessive gridlines with their value sitting just above the line, left-aligned. */
function Grid({ max, y, x0, x1 }: { max: number; y: (v: number) => number; x0: number; x1: number }) {
  const step = niceStep(max);
  const ticks: number[] = [];
  for (let v = step; v < max; v += step) ticks.push(v);
  return (
    <>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={x0} x2={x1} y1={y(v)} y2={y(v)} stroke="var(--border)" strokeWidth={1} opacity={0.7} />
          {/* a surface halo keeps the value legible where a bar crosses it */}
          <text x={x0} y={y(v) - 4} fontSize={10} fill="var(--muted)" stroke="var(--background)" strokeWidth={3} paintOrder="stroke">
            {yen(v)}
          </text>
        </g>
      ))}
    </>
  );
}

function dayLabel(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

/* ---------------------------------------------------------------- daily bars */

export function DailySpendChart({
  byDay,
  dailyBudget,
  typicalDailyRate,
  categoryLabels,
  elapsedDays,
}: {
  byDay: DayActual[];
  dailyBudget: number;
  typicalDailyRate: number;
  categoryLabels: Record<string, string>;
  elapsedDays: number;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const { ref, width } = useMeasuredWidth();

  const W = width || 0;
  const narrow = W > 0 && W < 460;
  const H = narrow ? 210 : 220;
  const padL = 6;
  const padR = 6;
  const padT = 18;
  const padB = 22;

  // The scale lives where the ordinary days live. Letting one blowout day set
  // it would flatten every other bar and hide the allowance line, so days past
  // the ceiling clip and carry their own value label instead.
  const yMax = Math.max(dailyBudget * 1.5, typicalDailyRate * 3, 1);
  const bigDayCut = typicalDailyRate > 0 ? typicalDailyRate * 2 : dailyBudget;

  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const slot = plotW / byDay.length;
  const barW = Math.max(3, slot - 2); // 2px surface gap between adjacent bars
  const y = (v: number) => padT + plotH - (Math.min(v, yMax) / yMax) * plotH;

  // Until a tap, the readout shows the last day with spend on it.
  const lastSpend = byDay.map((d) => d.total > 0).lastIndexOf(true);
  const sel = picked !== null && picked < byDay.length ? picked : lastSpend >= 0 ? lastSpend : null;
  const selected = sel === null ? null : byDay[sel];
  const anySpend = lastSpend >= 0;
  const labelEvery = narrow ? 7 : 5;

  // The adaptive allowance: a step through the days already lived (what each
  // day could have carried, given the spend before it), then a dashed line at
  // today's go-forward rate for the rest of the month.
  const monthDone = elapsedDays >= byDay.length;
  const safeNow = monthDone ? 0 : byDay[elapsedDays].allowance;
  const stepDays = byDay.slice(0, elapsedDays);
  const stepPath = stepDays
    .map((d, i) => {
      const x0 = padL + i * slot;
      const yy = y(d.allowance);
      return `${i === 0 ? `M${x0},${yy}` : `L${x0},${yy}`} L${x0 + slot},${yy}`;
    })
    .join(" ");
  const safeX0 = padL + elapsedDays * slot;
  const safeY = y(safeNow);

  return (
    <div ref={ref}>
      {W === 0 ? (
        <div style={{ height: H }} />
      ) : (
        <svg
          width={W}
          height={H}
          role="img"
          aria-label="Daily spend for the month against the adaptive daily budget"
          {...scrubProps((px) => Math.floor((px - padL) / slot), byDay.length, setPicked)}
        >
          <line x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} stroke="var(--border)" strokeWidth={1} />

          {byDay.map((d, i) => {
            const x = padL + i * slot;
            const over = d.total > bigDayCut;
            const clipped = d.total > yMax;
            const h = d.total > 0 ? Math.max(2, padT + plotH - y(d.total)) : 0;
            const barX = x + (slot - barW) / 2;
            return (
              <g key={d.date}>
                {sel === i && <rect x={x} y={padT} width={slot} height={plotH} fill="var(--moretransblack)" />}
                {h > 0 && (
                  <rect
                    x={barX}
                    y={padT + plotH - h}
                    width={barW}
                    height={h}
                    rx={Math.min(4, barW / 2)}
                    fill={over ? OVER : ACCENT}
                  />
                )}
                {/* a clipped bar breaks the frame; the readout carries its real value */}
                {clipped && (
                  <>
                    <rect x={barX - 1} y={padT + 14} width={barW + 2} height={2.5} fill="var(--background)" />
                    <rect x={barX - 1} y={padT + 19} width={barW + 2} height={2.5} fill="var(--background)" />
                  </>
                )}
                {(d.day === 1 || d.day === byDay.length || d.day % labelEvery === 0) && (
                  <text x={x + slot / 2} y={H - 7} textAnchor="middle" fontSize={10} fill="var(--muted)">
                    {d.day}
                  </text>
                )}
              </g>
            );
          })}

          <Grid max={yMax} y={y} x0={padL} x1={W - padR} />

          {/* the allowance: stepped through lived days, dashed at today's rate ahead */}
          {stepDays.length > 0 && (
            <path d={stepPath} fill="none" stroke="var(--foreground)" strokeWidth={1.5} opacity={0.55} />
          )}
          {!monthDone && safeNow > 0 && (
            <>
              <line
                x1={safeX0}
                x2={W - padR}
                y1={safeY}
                y2={safeY}
                stroke="var(--foreground)"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                opacity={0.55}
              />
              <text x={W - padR} y={safeY - 5} textAnchor="end" fontSize={10} fill="var(--muted)">
                {yen(safeNow)}/day
              </text>
            </>
          )}
        </svg>
      )}

      {anySpend ? (
        <Readout>
          {selected && (
            <>
              <div className="flex items-baseline justify-between gap-2">
                <span>{dayLabel(selected.date)}</span>
                <span className="text-sm tabular-nums" style={{ color: selected.total > bigDayCut ? OVER : undefined }}>
                  {yen(selected.total)}
                  {selected.total > bigDayCut && <span className="ml-1 text-[0.7rem]">big day</span>}
                </span>
              </div>
              {selected.total > 0 ? (
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[0.7rem] text-muted">
                  {Object.entries(selected.byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, amt]) => (
                      <span key={cat}>
                        {categoryLabels[cat] ?? cat} <span className="tabular-nums">{yen(amt)}</span>
                      </span>
                    ))}
                </div>
              ) : (
                <div className="mt-1 text-[0.7rem] text-muted">nothing logged</div>
              )}
              {selected.day <= elapsedDays && (
                <div className="mt-0.5 text-[0.7rem] text-muted">allowance that day {yen(selected.allowance)}</div>
              )}
            </>
          )}
        </Readout>
      ) : (
        <p className="mt-1 text-center text-xs text-muted">
          No spend logged yet this month. Send a screenshot and it lands here.
        </p>
      )}
      {anySpend && <p className="mt-1 text-[0.65rem] text-muted">Tap or drag across the bars.</p>}
    </div>
  );
}

/* ------------------------------------------------------- week over week */

/**
 * Every week side by side against the weekly budget. Routine spend is the solid
 * bar; one-offs stack on top, faded, so a setup week reads as what it was.
 * Selection is controlled so the week switcher and the chart stay in step.
 */
export function WeeklyChart({
  weeks,
  selected,
  onSelect,
}: {
  weeks: WeekView[];
  selected: number;
  onSelect: (i: number) => void;
}) {
  const { ref, width } = useMeasuredWidth();
  const W = width || 0;
  const H = 190;
  const padL = 6;
  const padR = 6;
  const padT = 18;
  const padB = 22;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const budget = weeks[0]?.budget ?? 0;
  const yMax = Math.max(budget, ...weeks.map((w) => w.spent), 1) * 1.1;
  const slot = plotW / Math.max(1, weeks.length);
  const barW = Math.min(40, Math.max(8, slot - 8));
  const y = (v: number) => padT + plotH - (v / yMax) * plotH;
  const base = padT + plotH;

  const sel = weeks[selected];
  const prev = weeks[selected - 1];
  const delta = sel && prev ? sel.spent - prev.spent : null;

  return (
    <div ref={ref}>
      {W === 0 ? (
        <div style={{ height: H }} />
      ) : (
        <svg
          width={W}
          height={H}
          role="img"
          aria-label="Spend by week against the weekly budget"
          {...scrubProps((px) => Math.floor((px - padL) / slot), weeks.length, onSelect)}
        >
          <line x1={padL} x2={W - padR} y1={base} y2={base} stroke="var(--border)" strokeWidth={1} />
          {weeks.map((w, i) => {
            const cx = padL + i * slot + slot / 2;
            const over = w.routine > w.budget;
            const routineTop = y(w.routine);
            const totalTop = y(w.spent);
            return (
              <g key={w.start}>
                {i === selected && <rect x={padL + i * slot} y={padT} width={slot} height={plotH} fill="var(--moretransblack)" />}
                {w.oneOff > 0 && (
                  <rect x={cx - barW / 2} y={totalTop} width={barW} height={Math.max(0, routineTop - totalTop)} rx={3} fill="var(--muted)" opacity={0.45} />
                )}
                {w.routine > 0 && (
                  <rect
                    x={cx - barW / 2}
                    y={routineTop}
                    width={barW}
                    height={Math.max(2, base - routineTop)}
                    rx={4}
                    fill={w.partial ? "var(--muted)" : over ? OVER : ACCENT}
                    opacity={w.isCurrent ? 0.6 : 1}
                  />
                )}
                <text x={cx} y={H - 7} textAnchor="middle" fontSize={10} fill={i === selected ? "var(--foreground)" : "var(--muted)"}>
                  {Number(w.start.slice(5, 7))}/{Number(w.start.slice(8))}
                </text>
              </g>
            );
          })}
          <line x1={padL} x2={W - padR} y1={y(budget)} y2={y(budget)} stroke="var(--foreground)" strokeWidth={1} strokeDasharray="4 3" opacity={0.6} />
          <text x={W - padR} y={y(budget) - 5} textAnchor="end" fontSize={10} fill="var(--muted)" stroke="var(--background)" strokeWidth={3} paintOrder="stroke">
            {yen(budget)}/week
          </text>
        </svg>
      )}

      {sel && (
        <Readout>
          <div className="flex items-baseline justify-between gap-2">
            <span>
              {sel.label}
              {sel.isCurrent && <span className="ml-1.5 text-[0.7rem] text-muted">so far</span>}
              {sel.partial && <span className="ml-1.5 text-[0.7rem] text-muted">partial, {sel.loggedDays} of 7 days logged</span>}
            </span>
            <span className="text-sm tabular-nums" style={{ color: sel.spent > sel.budget ? OVER : undefined }}>
              {yen(sel.spent)}
            </span>
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-3 text-[0.7rem] text-muted">
            <span style={{ color: sel.spent > sel.budget ? OVER : UNDER }}>
              {sel.spent > sel.budget ? `${yen(sel.spent - sel.budget)} over budget` : `${yen(sel.budget - sel.spent)} under budget`}
            </span>
            {delta !== null && (
              <span>
                {delta > 0 ? "+" : "−"}
                {yen(Math.abs(delta))} vs week before
              </span>
            )}
            {sel.oneOff > 0 && <span>one-offs {yen(sel.oneOff)}</span>}
            {sel.bigDays > 0 && <span>{sel.bigDays} big {sel.bigDays === 1 ? "day" : "days"}</span>}
          </div>
        </Readout>
      )}
    </div>
  );
}

/* ------------------------------------------------- running total vs budget */

/**
 * The month as a race against its budget: spend accumulates day by day against
 * a straight line from zero to the monthly budget. Above the line is ahead of
 * budget, below is behind it. A dashed tail carries typical days to month end.
 */
export function CumulativeSpendChart({
  byDay,
  budget,
  elapsedDays,
  typicalDailyRate,
}: {
  byDay: DayActual[];
  budget: number;
  elapsedDays: number;
  typicalDailyRate: number;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const { ref, width } = useMeasuredWidth();

  const days = byDay.length;
  const lived = Math.min(elapsedDays, days);
  const cum: number[] = [];
  byDay.slice(0, lived).forEach((d, i) => cum.push((cum[i - 1] ?? 0) + d.total));
  const spent = cum[lived - 1] ?? 0;
  const projectedEnd = spent + typicalDailyRate * (days - lived);

  const W = width || 0;
  const H = 200;
  const padL = 6;
  const padR = 8;
  const padT = 18;
  const padB = 22;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const yMax = Math.max(budget, spent, projectedEnd, 1) * 1.08;
  // x runs on day ends: day 1's total plots at the end of day 1.
  const x = (dayEnd: number) => padL + (dayEnd / days) * plotW;
  const y = (v: number) => padT + plotH - (v / yMax) * plotH;

  const line = [`M${x(0)},${y(0)}`, ...cum.map((v, i) => `L${x(i + 1)},${y(v)}`)].join(" ");
  const sel = picked !== null && picked < lived ? picked : lived - 1;
  const pace = (i: number) => (budget * (i + 1)) / days;
  const gap = sel >= 0 ? cum[sel] - pace(sel) : 0;

  if (lived === 0) return null;

  return (
    <div ref={ref}>
      {W === 0 ? (
        <div style={{ height: H }} />
      ) : (
        <svg
          width={W}
          height={H}
          role="img"
          aria-label="Running total of spend this month against a straight budget pace"
          {...scrubProps((px) => Math.round(((px - padL) / plotW) * days) - 1, lived, setPicked)}
        >
          <Grid max={yMax} y={y} x0={padL} x1={W - padR} />
          <line x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} stroke="var(--border)" strokeWidth={1} />

          {/* budget pace: zero on day one to the full budget on the last day */}
          <line x1={x(0)} y1={y(0)} x2={x(days)} y2={y(budget)} stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={x(days)} y={y(budget) - 8} textAnchor="end" fontSize={10} fill="var(--muted)" stroke="var(--background)" strokeWidth={3} paintOrder="stroke">
            budget {yen(budget)}
          </text>

          {/* typical days carried to month end */}
          {lived < days && (
            <line
              x1={x(lived)}
              y1={y(spent)}
              x2={x(days)}
              y2={y(projectedEnd)}
              stroke={ACCENT}
              strokeWidth={2}
              strokeDasharray="2 4"
              strokeLinecap="round"
              opacity={0.7}
            />
          )}

          <path d={line} fill="none" stroke={ACCENT} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {sel >= 0 && (
            <>
              <line x1={x(sel + 1)} x2={x(sel + 1)} y1={padT} y2={padT + plotH} stroke="var(--muted)" strokeWidth={1} opacity={0.5} />
              <circle cx={x(sel + 1)} cy={y(pace(sel))} r={3.5} fill="var(--background)" stroke="var(--muted)" strokeWidth={1.5} />
              <circle cx={x(sel + 1)} cy={y(cum[sel])} r={5} fill={ACCENT} stroke="var(--background)" strokeWidth={2} />
            </>
          )}

          {[1, 8, 15, 22, days].map((d) => (
            <text key={d} x={x(d - 0.5)} y={H - 7} textAnchor="middle" fontSize={10} fill="var(--muted)">
              {d}
            </text>
          ))}
        </svg>
      )}

      <Readout>
        <div className="flex items-baseline justify-between gap-2">
          <span>Through {dayLabel(byDay[sel].date)}</span>
          <span className="text-sm tabular-nums">{yen(cum[sel])}</span>
        </div>
        <div className="mt-0.5 flex items-baseline justify-between gap-2 text-[0.7rem]">
          <span className="text-muted">budget pace {yen(pace(sel))}</span>
          <span style={{ color: gap > 0 ? OVER : UNDER }}>
            {gap > 0 ? `${yen(gap)} ahead of budget` : `${yen(-gap)} under budget`}
          </span>
        </div>
        {lived < days && (
          <div className="mt-0.5 text-[0.7rem] text-muted">Typical days from here end the month near {yen(projectedEnd)}.</div>
        )}
      </Readout>
    </div>
  );
}

/* ---------------------------------------------------------- by day of week */

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Average spend per weekday over the days lived this month, Monday first. */
export function WeekdayChart({ byDay, elapsedDays }: { byDay: DayActual[]; elapsedDays: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  const { ref, width } = useMeasuredWidth();

  const stats = WEEKDAYS.map(() => ({ total: 0, days: 0 }));
  for (const d of byDay.slice(0, elapsedDays)) {
    const [yy, mm, dd] = d.date.split("-").map(Number);
    const wd = (new Date(yy, mm - 1, dd).getDay() + 6) % 7;
    stats[wd].total += d.total;
    stats[wd].days += 1;
  }
  const avg = stats.map((s) => (s.days ? s.total / s.days : 0));
  const overall = avg.some((a) => a > 0) ? stats.reduce((s, x) => s + x.total, 0) / Math.max(1, elapsedDays) : 0;
  const top = avg.indexOf(Math.max(...avg));

  const W = width || 0;
  const H = 170;
  const padL = 6;
  const padR = 6;
  const padT = 20;
  const padB = 22;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const yMax = Math.max(...avg, 1) * 1.12;
  const slot = plotW / 7;
  const barW = Math.min(36, slot - 8);
  const y = (v: number) => padT + plotH - (v / yMax) * plotH;
  const sel = picked ?? top;

  if (overall === 0) return null;

  return (
    <div ref={ref}>
      {W === 0 ? (
        <div style={{ height: H }} />
      ) : (
        <svg
          width={W}
          height={H}
          role="img"
          aria-label="Average spend by day of the week"
          {...scrubProps((px) => Math.floor((px - padL) / slot), 7, setPicked)}
        >
          <line x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} stroke="var(--border)" strokeWidth={1} />
          {avg.map((a, i) => {
            const cx = padL + i * slot + slot / 2;
            const h = a > 0 ? Math.max(2, padT + plotH - y(a)) : 0;
            return (
              <g key={WEEKDAYS[i]}>
                {h > 0 && (
                  <rect
                    x={cx - barW / 2}
                    y={padT + plotH - h}
                    width={barW}
                    height={h}
                    rx={4}
                    fill={ACCENT}
                    opacity={sel === i ? 1 : 0.7}
                  />
                )}
                {i === top && (
                  <text x={cx} y={y(a) - 5} textAnchor="middle" fontSize={10} fill="var(--foreground)">
                    {yen(a)}
                  </text>
                )}
                <text
                  x={cx}
                  y={H - 7}
                  textAnchor="middle"
                  fontSize={10}
                  fill={sel === i ? "var(--foreground)" : "var(--muted)"}
                >
                  {WEEKDAYS[i]}
                </text>
              </g>
            );
          })}
          <line x1={padL} x2={W - padR} y1={y(overall)} y2={y(overall)} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 3" />
          <text x={W - padR} y={y(overall) - 4} textAnchor="end" fontSize={10} fill="var(--muted)">
            avg {yen(overall)}
          </text>
        </svg>
      )}
      <Readout>
        <div className="flex items-baseline justify-between gap-2">
          <span>{WEEKDAYS[sel]}days</span>
          <span className="text-sm tabular-nums">{yen(avg[sel])} avg</span>
        </div>
        <div className="mt-0.5 text-[0.7rem] text-muted">
          {yen(stats[sel].total)} over {stats[sel].days} {stats[sel].days === 1 ? "day" : "days"} ·{" "}
          {avg[sel] >= overall ? `${yen(avg[sel] - overall)} above` : `${yen(overall - avg[sel])} below`} the average day
        </div>
      </Readout>
    </div>
  );
}

/* ----------------------------------------------------------------- top spots */

/** Where the money goes by vendor: total and visit count, biggest first. */
export function TopSpots({ entries, limit = 6 }: { entries: SpendEntry[]; limit?: number }) {
  const [showAll, setShowAll] = useState(false);
  const byVendor = new Map<string, { total: number; visits: number }>();
  for (const e of entries) {
    if (!e.vendor) continue;
    const v = byVendor.get(e.vendor) ?? { total: 0, visits: 0 };
    v.total += e.amount;
    v.visits += 1;
    byVendor.set(e.vendor, v);
  }
  const ranked = [...byVendor.entries()].sort((a, b) => b[1].total - a[1].total);
  if (ranked.length === 0) return null;
  const shown = showAll ? ranked : ranked.slice(0, limit);
  const max = ranked[0][1].total;

  return (
    <div className="flex flex-col gap-2.5">
      {shown.map(([name, v]) => (
        <div key={name}>
          <div className="flex items-baseline justify-between gap-2 text-xs">
            <span className="truncate">
              {name}
              <span className="ml-1.5 text-[0.7rem] text-muted">
                {v.visits}× · {yen(v.total / v.visits)} each
              </span>
            </span>
            <span className="tabular-nums">{yen(v.total)}</span>
          </div>
          <div className="mt-1 h-2 w-full rounded-sm" style={{ background: "var(--moretransblack)" }}>
            <div className="h-full rounded-sm" style={{ width: `${(v.total / max) * 100}%`, background: ACCENT }} />
          </div>
        </div>
      ))}
      {ranked.length > limit && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="self-start py-1 text-[0.7rem] text-muted underline decoration-[var(--ice-rest)]"
        >
          {showAll ? "Show fewer" : `Show all ${ranked.length}`}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ category bars */

export function CategoryBars({ groups }: { groups: GroupActual[] }) {
  const scaleMax = Math.max(...groups.map((g) => Math.max(g.actual, g.budget)), 1);

  return (
    <div className="flex flex-col gap-3">
      {groups.map((g) => {
        const actualPct = (g.actual / scaleMax) * 100;
        const budgetPct = (g.budget / scaleMax) * 100;
        return (
          <div key={g.id}>
            <div className="flex items-baseline justify-between text-xs">
              <span>{g.label}</span>
              <span className="text-muted">
                <span className={g.over ? "font-bold" : ""} style={g.over ? { color: OVER } : undefined}>
                  {yen(g.actual)}
                </span>
                {" / "}
                {yen(g.budget)}
                {g.over && <span className="ml-1 font-bold" style={{ color: OVER }}>over</span>}
              </span>
            </div>
            <div className="relative mt-1 h-2.5 w-full rounded-sm" style={{ background: "var(--moretransblack)" }}>
              <div
                className="absolute inset-y-0 left-0 rounded-sm"
                style={{ width: `${actualPct}%`, background: g.over ? OVER : ACCENT }}
              />
              {/* budget reference tick */}
              <div
                className="absolute inset-y-[-2px] w-px"
                style={{ left: `${budgetPct}%`, background: "var(--muted)" }}
                aria-hidden
              />
            </div>
          </div>
        );
      })}
      <p className="text-[0.7rem] text-muted">The tick marks each group&apos;s monthly budget.</p>
    </div>
  );
}

/* ----------------------------------------------------------- balance vs plan */

export function BalancePlanChart({
  series,
}: {
  series: { date: string; label: string; plan: number }[];
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const { ref, width } = useMeasuredWidth();

  const W = width || 0;
  const narrow = W > 0 && W < 460;
  const H = narrow ? 180 : 190;
  const padL = 8;
  const padR = 8;
  const padT = 18;
  const padB = 24;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const yMax = Math.max(...series.map((s) => s.plan), 1) * 1.15;
  const x = (i: number) => padL + (i / (series.length - 1)) * plotW;
  const y = (v: number) => padT + plotH - (Math.max(0, v) / yMax) * plotH;

  const path = series.map((s, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(s.plan)}`).join(" ");
  const area = `${path} L${x(series.length - 1)},${padT + plotH} L${x(0)},${padT + plotH} Z`;
  const sel = picked ?? series.length - 1;
  const selected = series[sel];
  const labelStride = narrow && series.length > 6 ? 2 : 1;
  const last = series.length - 1;

  return (
    <div ref={ref}>
      {W === 0 ? (
        <div style={{ height: H }} />
      ) : (
        <svg
          width={W}
          height={H}
          role="img"
          aria-label="Planned balance by salary month"
          {...scrubProps((px) => Math.round(((px - padL) / plotW) * last), series.length, setPicked)}
        >
          <Grid max={yMax} y={y} x0={padL} x1={W - padR} />
          <line x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} stroke="var(--border)" strokeWidth={1} />
          <path d={area} fill={ACCENT} opacity={0.1} />
          <path d={path} fill="none" stroke={ACCENT} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {sel !== last && (
            <line x1={x(sel)} x2={x(sel)} y1={padT} y2={padT + plotH} stroke="var(--muted)" strokeWidth={1} opacity={0.5} />
          )}

          {series.map((s, i) => (
            <g key={s.date}>
              <circle cx={x(i)} cy={y(s.plan)} r={sel === i ? 5 : 3.5} fill={ACCENT} stroke="var(--background)" strokeWidth={2} />
              {i % labelStride === 0 && (
                <text x={x(i)} y={H - 7} textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"} fontSize={10} fill="var(--muted)">
                  {s.label}
                </text>
              )}
            </g>
          ))}
          <text x={x(last)} y={y(series[last].plan) - 10} textAnchor="end" fontSize={10} fill="var(--foreground)">
            {yen(series[last].plan)}
          </text>
        </svg>
      )}

      <Readout>
        <div className="flex items-baseline justify-between gap-2">
          <span>After the {selected.date} paycheque</span>
          <span className="text-sm tabular-nums">{yen(selected.plan)}</span>
        </div>
        {sel > 0 && (
          <div className="mt-0.5 text-[0.7rem] text-muted">
            {selected.plan >= series[sel - 1].plan ? "+" : "−"}
            {yen(Math.abs(selected.plan - series[sel - 1].plan))} on the month before
          </div>
        )}
      </Readout>
    </div>
  );
}

/* ------------------------------------------------- monthly projection bars */

export function MonthlyProjectionChart({
  months,
  budget,
}: {
  months: MonthProjection[];
  budget: number;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const { ref, width } = useMeasuredWidth();

  const W = width || 0;
  const narrow = W > 0 && W < 460;
  const H = narrow ? 200 : 210;
  const padL = 6;
  const padR = 6;
  const padT = 16;
  const padB = 30;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // Scale to the typical-day bars; the big-day whisker may clip rather than
  // crush every bar flat to make room for the worst case.
  const yMax = Math.max(budget * 1.35, ...months.map((m) => m.projected * 1.1)) || 1;
  const slot = plotW / months.length;
  const barW = Math.min(46, Math.max(10, slot - 10));
  const y = (v: number) => padT + plotH - (Math.min(v, yMax) / yMax) * plotH;
  const budgetY = y(budget);
  // Until a tap, the readout shows the first month still being projected.
  const firstCounted = months.findIndex((m) => m.counted);
  const hover = picked ?? (firstCounted >= 0 ? firstCounted : 0);
  const hovered = months[hover];

  return (
    <div ref={ref}>
      {W === 0 ? (
        <div style={{ height: H }} />
      ) : (
        <svg
          width={W}
          height={H}
          role="img"
          aria-label="Projected living cost by month against budget"
          {...scrubProps((px) => Math.floor((px - padL) / slot), months.length, setPicked)}
        >
          {months.map((m, i) => {
            const cx = padL + i * slot + slot / 2;
            const x = cx - barW / 2;
            const over = m.counted && m.projected > budget;
            // Solid to what is already logged, translucent for the typical-day
            // remainder, so a month never looks more certain than it is.
            const actualTop = y(Math.min(m.actual, m.projected));
            const projTop = y(m.projected);
            const base = padT + plotH;
            const fill = !m.counted ? "var(--muted)" : over ? OVER : ACCENT;
            const dim = hover !== i ? 0.55 : 1;
            const whisker = m.counted && m.projectedHigh > m.projected + 1;

            return (
              <g key={m.key} opacity={dim}>
                <rect x={x} y={projTop} width={barW} height={Math.max(0, base - projTop)} rx={3} fill={fill} opacity={m.counted ? 0.32 : 0.18} />
                {m.actual > 0 && (
                  <rect x={x} y={actualTop} width={barW} height={Math.max(1, base - actualTop)} rx={3} fill={fill} />
                )}
                {/* whisker: where the month lands if the big days keep their pace.
                    When that runs past the scale the line goes dashed and loses
                    its cap: it keeps going, the tooltip has the number. */}
                {whisker && (() => {
                  const clipped = m.projectedHigh > yMax;
                  return (
                    <>
                      <line
                        x1={cx}
                        x2={cx}
                        y1={y(m.projectedHigh)}
                        y2={projTop}
                        stroke="var(--muted)"
                        strokeWidth={1.5}
                        strokeDasharray={clipped ? "3 3" : undefined}
                      />
                      {!clipped && (
                        <line x1={cx - 4} x2={cx + 4} y1={y(m.projectedHigh)} y2={y(m.projectedHigh)} stroke="var(--muted)" strokeWidth={1.5} />
                      )}
                    </>
                  );
                })()}
                <text x={cx} y={H - 17} textAnchor="middle" fontSize={10} fill="var(--muted)">
                  {m.label.slice(0, 3)}
                </text>
                {!m.counted && (
                  <text x={cx} y={H - 6} textAnchor="middle" fontSize={9} fill="var(--muted)">
                    n/a
                  </text>
                )}
              </g>
            );
          })}

          <line x1={padL} x2={W - padR} y1={budgetY} y2={budgetY} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 3" opacity={0.8} />
          <text x={W - padR} y={budgetY - 5} textAnchor="end" fontSize={10} fill="var(--muted)">
            budget {yen(budget)}
          </text>
          <line x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} stroke="var(--border)" strokeWidth={1} />
        </svg>
      )}

      {hovered && (
        <Readout>
          <div className="flex items-baseline justify-between gap-2">
            <span>{hovered.label}</span>
            {hovered.counted && (
              <span className="text-sm tabular-nums" style={{ color: hovered.overUnder > 0 ? OVER : UNDER }}>
                {hovered.overUnder > 0 ? `${yen(hovered.overUnder)} over` : `${yen(-hovered.overUnder)} under`}
              </span>
            )}
          </div>
          {hovered.counted ? (
            <div className="mt-0.5 flex flex-wrap gap-x-3 text-[0.7rem] text-muted">
              {hovered.actual > 0 && <span>logged {yen(hovered.actual)}</span>}
              <span>typical days {yen(hovered.projected)}</span>
              {hovered.projectedHigh > hovered.projected + 1 && <span>with big days {yen(hovered.projectedHigh)}</span>}
            </div>
          ) : (
            <div className="mt-0.5 text-[0.7rem] text-muted">
              {yen(hovered.actual)} logged on {hovered.loggedDays} of {hovered.elapsedDays} days, not projected
            </div>
          )}
        </Readout>
      )}
    </div>
  );
}

/* --------------------------------------------------------- category donuts */

/** A slice of a share chart: one category, or the folded tail. */
type Share = { id: string; label: string; amount: number; pct: number; other: boolean };

// Six named slices is the ceiling. Past that the arcs get too thin to hit or
// read, and the ramp runs out of separable steps, so the tail folds into one
// "Other" wedge rather than being split into slivers.
const MAX_NAMED = 6;

/**
 * Categories to slices, biggest first, tail folded. Anything under 2% is folded
 * even when there is room, because a sub-2% arc is under two degrees wide.
 */
export function toShares(byCategory: Record<string, number>, labels: Record<string, string>): Share[] {
  const total = Object.values(byCategory).reduce((s, v) => s + v, 0);
  if (total <= 0) return [];

  const ranked = Object.entries(byCategory)
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]);

  const named = ranked.filter(([, amount], i) => i < MAX_NAMED && amount / total >= 0.02);
  const tail = ranked.slice(named.length).reduce((s, [, amount]) => s + amount, 0);

  const shares: Share[] = named.map(([id, amount]) => ({
    id,
    label: labels[id] ?? id,
    amount,
    pct: amount / total,
    other: false,
  }));
  // A one-category tail keeps its own name: folding it would hide a real label
  // behind "Other" and buy nothing.
  if (tail > 0) {
    const rest = ranked.slice(named.length);
    if (rest.length === 1) {
      const [id, amount] = rest[0];
      shares.push({ id, label: labels[id] ?? id, amount, pct: amount / total, other: false });
    } else {
      shares.push({ id: "__other", label: `Other (${rest.length})`, amount: tail, pct: tail / total, other: true });
    }
  }
  return shares;
}

/** Ramp step for slice `i` of `n`, darkest first. "Other" sits outside the ramp. */
function sliceFill(i: number, n: number, other: boolean) {
  if (other) return "var(--muted)";
  const t = n <= 1 ? 0 : i / (n - 1);
  return `color-mix(in srgb, var(--ramp-dark) ${Math.round((1 - t) * 100)}%, var(--ramp-light))`;
}

function arcPath(cx: number, cy: number, rOuter: number, rInner: number, a0: number, a1: number) {
  const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = p(rOuter, a0);
  const [x1, y1] = p(rOuter, a1);
  const [x2, y2] = p(rInner, a1);
  const [x3, y3] = p(rInner, a0);
  return `M${x0},${y0} A${rOuter},${rOuter} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${rInner},${rInner} 0 ${large} 0 ${x3},${y3} Z`;
}

/**
 * Share of spend by category, as a donut plus an always-visible table of the
 * same numbers. The table is not decoration: the ramp's lighter steps sit under
 * 3:1 against the light surface, so the figures have to be readable without
 * relying on the fills, and a share chart is read for its numbers anyway.
 */
export function CategoryDonut({
  byCategory,
  categoryLabels,
  total,
  caption,
}: {
  byCategory: Record<string, number>;
  categoryLabels: Record<string, string>;
  total: number;
  caption: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const shares = toShares(byCategory, categoryLabels);

  if (shares.length === 0) {
    return <p className="text-[0.72rem] text-muted">Nothing logged {caption.toLowerCase()}.</p>;
  }

  const S = 160;
  const c = S / 2;
  const rOuter = c - 2;
  const rInner = rOuter * 0.6;
  // A 2px surface gap between neighbouring arcs, expressed as the angle that
  // subtends 2px at the outer radius, and never more than a third of a slice.
  const gap = 2 / rOuter;

  // Slice i starts where every slice before it ended, measured from 12 o'clock.
  const arcs = shares.map((s, i) => {
    const sweep = s.pct * Math.PI * 2;
    const before = shares.slice(0, i).reduce((sum, p) => sum + p.pct, 0);
    const a0 = -Math.PI / 2 + before * Math.PI * 2;
    const inset = Math.min(gap / 2, sweep / 3);
    return { share: s, a0: a0 + inset, a1: a0 + sweep - inset, full: sweep >= Math.PI * 2 - 1e-6 };
  });

  const shown = hover === null ? null : shares[hover];

  return (
    <div className="donut-ramp flex flex-wrap items-center gap-x-6 gap-y-4">
      <svg
        width={S}
        height={S}
        role="img"
        aria-label={`${caption}: ${shares.map((s) => `${s.label} ${Math.round(s.pct * 100)}%`).join(", ")}`}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHover(null)}
      >
        {arcs.map((a, i) =>
          // A lone category fills the ring, where the arc command degenerates.
          a.full ? (
            <circle
              key={a.share.id}
              cx={c}
              cy={c}
              r={(rOuter + rInner) / 2}
              fill="none"
              strokeWidth={rOuter - rInner}
              stroke={sliceFill(i, shares.length, a.share.other)}
            />
          ) : (
            <path
              key={a.share.id}
              d={arcPath(c, c, rOuter, rInner, a.a0, a.a1)}
              fill={sliceFill(i, shares.length, a.share.other)}
              opacity={hover === null || hover === i ? 1 : 0.45}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
              onClick={() => setHover(hover === i ? null : i)}
            />
          ),
        )}
        {/* The centre is the readout: the total at rest, the hovered slice on hover. */}
        <text x={c} y={c - 3} textAnchor="middle" className="fill-[var(--foreground)] text-[0.8rem] tabular-nums">
          {yen(shown ? shown.amount : total)}
        </text>
        <text x={c} y={c + 11} textAnchor="middle" className="fill-[var(--muted)] text-[0.6rem]">
          {shown ? `${shown.label} · ${Math.round(shown.pct * 100)}%` : caption}
        </text>
      </svg>

      {/* The table needs ~15rem before category names start truncating, so it
          drops below the donut on a phone rather than squeezing in beside it. */}
      <div className="min-w-[15rem] flex-1">
        {shares.map((s, i) => (
          <button
            key={s.id}
            className={`flex w-full items-baseline gap-2 rounded-sm px-1 py-1.5 text-left text-xs ${hover === i ? "bg-[var(--moretransblack)]" : ""}`}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setHover(null)}
            onClick={() => setHover(hover === i ? null : i)}
            aria-pressed={hover === i}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={{ background: sliceFill(i, shares.length, s.other) }}
              aria-hidden
            />
            <span className="flex-1 truncate">{s.label}</span>
            <span className="tabular-nums">{yen(s.amount)}</span>
            <span className="w-9 text-right text-muted tabular-nums">{Math.round(s.pct * 100)}%</span>
          </button>
        ))}
      </div>
    </div>
  );
}
