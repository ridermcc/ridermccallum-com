"use client";

import { useState } from "react";
import type { DayActual, GroupActual, MonthProjection } from "@/lib/money";
import { yen } from "@/lib/money";

// Shared chart geometry. One accent hue carries every measure; budget lines are
// recessive reference marks, and status colors appear only with a text label.
const ACCENT = "var(--accent)";
const OVER = "var(--red)";

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
  categoryLabels,
  elapsedDays,
}: {
  byDay: DayActual[];
  dailyBudget: number;
  categoryLabels: Record<string, string>;
  elapsedDays: number;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const W = 700;
  const H = 200;
  const padL = 8;
  const padR = 8;
  const padT = 14;
  const padB = 22;

  const peak = Math.max(dailyBudget * 1.35, ...byDay.map((d) => d.total));
  const yMax = peak === 0 ? 1 : peak;

  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const slot = plotW / byDay.length;
  const barW = Math.max(3, slot - 2); // 2px surface gap between adjacent bars
  const y = (v: number) => padT + plotH - (v / yMax) * plotH;

  const budgetY = y(dailyBudget);
  const hovered = hover === null ? null : byDay[hover];
  const anySpend = byDay.some((d) => d.total > 0);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Daily spend for the month">
        {/* budget reference: recessive, dashed, labelled once */}
        <line
          x1={padL}
          x2={W - padR}
          y1={budgetY}
          y2={budgetY}
          stroke="var(--muted)"
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.7}
        />
        <text x={W - padR} y={budgetY - 5} textAnchor="end" fontSize={10} fill="var(--muted)">
          daily budget {yen(dailyBudget)}
        </text>

        <line x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} stroke="var(--border)" strokeWidth={1} />

        {byDay.map((d, i) => {
          const x = padL + i * slot;
          const over = d.total > dailyBudget;
          const isFuture = d.day > elapsedDays;
          const h = d.total > 0 ? Math.max(2, padT + plotH - y(d.total)) : 0;
          return (
            <g key={d.date}>
              {h > 0 && (
                <rect
                  x={x + (slot - barW) / 2}
                  y={padT + plotH - h}
                  width={barW}
                  height={h}
                  rx={Math.min(4, barW / 2)}
                  fill={over ? OVER : ACCENT}
                  opacity={hover === null || hover === i ? 1 : 0.45}
                />
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
                style={{ cursor: isFuture ? "default" : "pointer" }}
              />
              {/* selective direct labels: first, last, and every 5th day */}
              {(d.day === 1 || d.day === byDay.length || d.day % 5 === 0) && (
                <text x={x + slot / 2} y={H - 7} textAnchor="middle" fontSize={9} fill="var(--muted)">
                  {d.day}
                </text>
              )}
            </g>
          );
        })}
      </svg>

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

  const W = 700;
  const H = 190;
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

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Planned balance by salary month">
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
              style={{ cursor: "pointer" }}
            />
            <text x={x(i)} y={H - 7} textAnchor="middle" fontSize={9} fill="var(--muted)">
              {s.label}
            </text>
          </g>
        ))}
      </svg>

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

  const W = 700;
  const H = 210;
  const padL = 8;
  const padR = 8;
  const padT = 16;
  const padB = 30;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const yMax = Math.max(budget * 1.3, ...months.map((m) => m.projected)) || 1;
  const slot = plotW / months.length;
  const barW = Math.min(46, slot - 10);
  const y = (v: number) => padT + plotH - (v / yMax) * plotH;
  const budgetY = y(budget);
  const hovered = hover === null ? null : months[hover];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Projected living cost by month against budget">
        {months.map((m, i) => {
          const x = padL + i * slot + (slot - barW) / 2;
          const over = m.counted && m.projected > budget;
          // Solid to what is already logged, translucent for the projected
          // remainder, so a month never looks more certain than it is.
          const actualTop = y(Math.min(m.actual, m.projected));
          const projTop = y(m.projected);
          const base = padT + plotH;
          const fill = !m.counted ? "var(--muted)" : over ? OVER : ACCENT;
          const dim = hover !== null && hover !== i ? 0.4 : 1;

          return (
            <g key={m.key} opacity={dim}>
              <rect x={x} y={projTop} width={barW} height={Math.max(0, base - projTop)} rx={3} fill={fill} opacity={m.counted ? 0.32 : 0.18} />
              {m.actual > 0 && (
                <rect x={x} y={actualTop} width={barW} height={Math.max(1, base - actualTop)} rx={3} fill={fill} />
              )}
              <rect
                x={padL + i * slot}
                y={padT}
                width={slot}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              />
              <text x={x + barW / 2} y={H - 17} textAnchor="middle" fontSize={9} fill="var(--muted)">
                {m.label.slice(0, 3)}
              </text>
              {!m.counted && (
                <text x={x + barW / 2} y={H - 6} textAnchor="middle" fontSize={8} fill="var(--muted)">
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

      {hovered && (
        <Tooltip x={((hover! + 0.5) / months.length) * 100}>
          <div className="font-bold">{hovered.label}</div>
          {hovered.counted ? (
            <>
              <div className="text-muted">projected {yen(hovered.projected)}</div>
              {hovered.actual > 0 && <div className="text-muted">logged so far {yen(hovered.actual)}</div>}
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
