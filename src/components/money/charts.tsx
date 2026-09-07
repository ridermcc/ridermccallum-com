"use client";

import { useEffect, useRef, useState } from "react";
import type { DayActual, GroupActual, MonthProjection } from "@/lib/money";
import { yen } from "@/lib/money";

// Shared chart geometry. One accent hue carries every measure; budget lines are
// recessive reference marks, and status colors appear only with a text label.
const ACCENT = "var(--accent)";
const OVER = "var(--red)";

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

function Tooltip({ x, children }: { x: number; children: React.ReactNode }) {
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 rounded border border-border bg-background px-2 py-1 text-[0.7rem] leading-snug whitespace-nowrap shadow-sm"
      style={{ left: `${Math.min(88, Math.max(12, x))}%`, bottom: "100%" }}
    >
      {children}
    </div>
  );
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
  const [hover, setHover] = useState<number | null>(null);
  const { ref, width } = useMeasuredWidth();

  const W = width || 0;
  const narrow = W > 0 && W < 460;
  const H = narrow ? 180 : 200;
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

  const hovered = hover === null ? null : byDay[hover];
  const anySpend = byDay.some((d) => d.total > 0);
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
    <div className="relative" ref={ref}>
      {W === 0 ? (
        <div style={{ height: H }} />
      ) : (
        <svg width={W} height={H} role="img" aria-label="Daily spend for the month against the adaptive daily budget">
          <line x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} stroke="var(--border)" strokeWidth={1} />

          {byDay.map((d, i) => {
            const x = padL + i * slot;
            const over = d.total > bigDayCut;
            const clipped = d.total > yMax;
            const h = d.total > 0 ? Math.max(2, padT + plotH - y(d.total)) : 0;
            const barX = x + (slot - barW) / 2;
            return (
              <g key={d.date}>
                {h > 0 && (
                  <rect
                    x={barX}
                    y={padT + plotH - h}
                    width={barW}
                    height={h}
                    rx={Math.min(4, barW / 2)}
                    fill={over ? OVER : ACCENT}
                    opacity={hover === null || hover === i ? 1 : 0.45}
                  />
                )}
                {/* a clipped bar breaks the frame: gap marks the break, label carries the real value */}
                {clipped && (
                  <>
                    <rect x={barX - 1} y={padT + 14} width={barW + 2} height={2.5} fill="var(--background)" />
                    <rect x={barX - 1} y={padT + 19} width={barW + 2} height={2.5} fill="var(--background)" />
                    <text
                      x={barX + barW / 2 + 3.5}
                      y={padT + 28}
                      fontSize={10}
                      fill="var(--background)"
                      textAnchor="end"
                      transform={`rotate(-90 ${barX + barW / 2 + 3.5} ${padT + 28})`}
                    >
                      {yen(d.total)}
                    </text>
                  </>
                )}
                {/* hit target spans the full plot height, bigger than the mark */}
                <rect
                  x={x}
                  y={padT}
                  width={slot}
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setHover(hover === i ? null : i)}
                />
                {/* selective direct labels: first, last, and a sparse cadence */}
                {(d.day === 1 || d.day === byDay.length || d.day % labelEvery === 0) && (
                  <text x={x + slot / 2} y={H - 7} textAnchor="middle" fontSize={10} fill="var(--muted)">
                    {d.day}
                  </text>
                )}
              </g>
            );
          })}

          {/* the allowance: stepped through lived days, dashed at today's rate ahead */}
          {stepDays.length > 0 && (
            <path d={stepPath} fill="none" stroke="var(--foreground)" strokeWidth={1.5} opacity={0.55} />
          )}
          {!monthDone && (
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
                {safeNow > 0 ? `${yen(safeNow)}/day stays on budget` : "budget spent"}
              </text>
            </>
          )}
        </svg>
      )}

      {hovered && (
        <Tooltip x={((hover! + 0.5) / byDay.length) * 100}>
          <div className="font-bold">
            {hovered.date} · {yen(hovered.total)}
          </div>
          {Object.entries(hovered.byCategory).map(([cat, amt]) => (
            <div key={cat} className="text-muted">
              {categoryLabels[cat] ?? cat} {yen(amt)}
            </div>
          ))}
          {hovered.total === 0 && <div className="text-muted">nothing logged</div>}
          {hovered.day <= elapsedDays && (
            <div className="text-muted">day&apos;s allowance was {yen(hovered.allowance)}</div>
          )}
        </Tooltip>
      )}

      {!anySpend && (
        <p className="mt-1 text-center text-xs text-muted">
          No spend logged yet this month. Send a screenshot and it lands here.
        </p>
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
      <p className="text-[0.7rem] text-muted">Vertical tick marks the monthly budget for that group.</p>
    </div>
  );
}

/* ----------------------------------------------------------- balance vs plan */

export function BalancePlanChart({
  series,
}: {
  series: { date: string; label: string; plan: number }[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const { ref, width } = useMeasuredWidth();

  const W = width || 0;
  const narrow = W > 0 && W < 460;
  const H = narrow ? 170 : 190;
  const padL = 8;
  const padR = 8;
  const padT = 16;
  const padB = 24;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const yMax = Math.max(...series.map((s) => s.plan)) * 1.1;
  const x = (i: number) => padL + (i / (series.length - 1)) * plotW;
  const y = (v: number) => padT + plotH - (v / yMax) * plotH;

  const path = series.map((s, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(s.plan)}`).join(" ");
  const hovered = hover === null ? null : series[hover];
  const labelStride = narrow && series.length > 6 ? 2 : 1;

  return (
    <div className="relative" ref={ref}>
      {W === 0 ? (
        <div style={{ height: H }} />
      ) : (
        <svg width={W} height={H} role="img" aria-label="Planned balance by salary month">
          <line x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} stroke="var(--border)" strokeWidth={1} />
          <path d={path} fill="none" stroke={ACCENT} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {series.map((s, i) => (
            <g key={s.date}>
              {hover === i && (
                <line x1={x(i)} x2={x(i)} y1={padT} y2={padT + plotH} stroke="var(--muted)" strokeWidth={1} opacity={0.5} />
              )}
              <circle
                cx={x(i)}
                cy={y(s.plan)}
                r={hover === i ? 5 : 3.5}
                fill={ACCENT}
                stroke="var(--background)"
                strokeWidth={2}
              />
              <rect
                x={x(i) - plotW / (series.length * 2)}
                y={padT}
                width={plotW / series.length}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setHover(hover === i ? null : i)}
              />
              {i % labelStride === 0 && (
                <text x={x(i)} y={H - 7} textAnchor="middle" fontSize={10} fill="var(--muted)">
                  {s.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      )}

      {hovered && (
        <Tooltip x={((hover! + 0.5) / series.length) * 100}>
          <div className="font-bold">{yen(hovered.plan)}</div>
          <div className="text-muted">planned, after {hovered.date}</div>
        </Tooltip>
      )}
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
  const [hover, setHover] = useState<number | null>(null);
  const { ref, width } = useMeasuredWidth();

  const W = width || 0;
  const narrow = W > 0 && W < 460;
  const H = narrow ? 190 : 210;
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
  const hovered = hover === null ? null : months[hover];

  return (
    <div className="relative" ref={ref}>
      {W === 0 ? (
        <div style={{ height: H }} />
      ) : (
        <svg width={W} height={H} role="img" aria-label="Projected living cost by month against budget">
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
            const dim = hover !== null && hover !== i ? 0.4 : 1;
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
                <rect
                  x={padL + i * slot}
                  y={padT}
                  width={slot}
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setHover(hover === i ? null : i)}
                />
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
        <Tooltip x={((hover! + 0.5) / months.length) * 100}>
          <div className="font-bold">{hovered.label}</div>
          {hovered.counted ? (
            <>
              {hovered.actual > 0 && <div className="text-muted">logged so far {yen(hovered.actual)}</div>}
              <div className="text-muted">typical days {yen(hovered.projected)}</div>
              {hovered.projectedHigh > hovered.projected + 1 && (
                <div className="text-muted">with big days {yen(hovered.projectedHigh)}</div>
              )}
              <div style={{ color: hovered.overUnder > 0 ? OVER : "var(--green)" }}>
                {hovered.overUnder > 0 ? `${yen(hovered.overUnder)} over` : `${yen(-hovered.overUnder)} under`}
              </div>
            </>
          ) : (
            <div className="text-muted">
              {yen(hovered.actual)} logged on {hovered.loggedDays} of {hovered.elapsedDays} days, not projected
            </div>
          )}
        </Tooltip>
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

  const S = 148;
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
        onMouseLeave={() => setHover(null)}
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
              onMouseEnter={() => setHover(i)}
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
          <div
            key={s.id}
            className="flex items-baseline gap-2 py-0.5 text-xs"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={{ background: sliceFill(i, shares.length, s.other) }}
              aria-hidden
            />
            <span className="flex-1 truncate">{s.label}</span>
            <span className="tabular-nums">{yen(s.amount)}</span>
            <span className="w-9 text-right text-muted tabular-nums">{Math.round(s.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
