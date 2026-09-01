"use client";

import { useState } from "react";
import { toCAD, yen, type Budget, type Plan, type PlanProgress, type ScheduleRow } from "@/lib/money";

// Where every yen of gross income goes. One hue per destination, ordered the
// way the money actually leaves: tax first, then living, then obligations,
// then whatever survives.
const SLICES = [
  { id: "tax", label: "Tax", color: "var(--red)" },
  { id: "living", label: "Living", color: "var(--yellow)" },
  { id: "obligations", label: "Obligations", color: "var(--pink)" },
  { id: "save", label: "Save & invest", color: "var(--green)" },
] as const;

function Row({
  label,
  amount,
  note,
  strong,
  sign,
}: {
  label: string;
  amount: number;
  note?: string;
  strong?: boolean;
  sign?: "in" | "out";
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className={strong ? "text-xs" : "text-xs text-muted"}>
        {label}
        {note && <span className="block text-[0.65rem] text-muted">{note}</span>}
      </span>
      <span className={`shrink-0 tabular-nums ${strong ? "text-xs" : "text-xs text-muted"}`}>
        {sign === "out" ? "−" : sign === "in" ? "+" : ""}
        {yen(Math.abs(amount))}
      </span>
    </div>
  );
}

export function BudgetPlan({
  budget,
  plan,
  progress,
  rate,
}: {
  budget: Budget;
  plan: Plan;
  progress: PlanProgress;
  rate: number;
}) {
  const [showMonths, setShowMonths] = useState(false);

  const parts = {
    tax: plan.tax,
    living: plan.living,
    obligations: plan.totalObligations,
    save: Math.max(0, plan.toSaveAndInvest),
  };
  const denom = plan.grossIncome || 1;
  const overspent = plan.toSaveAndInvest < 0;

  return (
    <div className="flex flex-col gap-5">
      {/* headline: the number the whole plan exists to produce */}
      <div className="rounded border border-border p-4">
        <div className="text-[0.7rem] tracking-wide text-muted uppercase">
          Left to save and invest, {plan.months} salary months
        </div>
        <div className="mt-1 flex items-baseline gap-3">
          <span className="text-4xl" style={{ color: overspent ? "var(--red)" : undefined }}>
            {yen(plan.toSaveAndInvest)}
          </span>
          <span className="text-sm text-muted">{toCAD(plan.toSaveAndInvest, rate)}</span>
        </div>
        <div className="mt-1 text-xs text-muted">
          {yen(plan.perMonthSave)} a month · {Math.round(plan.savingsRate * 100)}% of income after tax
        </div>

        {/* where gross income goes */}
        <div className="mt-4 flex h-3 w-full overflow-hidden rounded-sm" style={{ background: "var(--moretransblack)" }}>
          {SLICES.map((s) => {
            const pct = (parts[s.id] / denom) * 100;
            return pct <= 0 ? null : (
              <div key={s.id} style={{ width: `${pct}%`, background: s.color }} title={`${s.label} ${yen(parts[s.id])}`} />
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.65rem] text-muted">
          {SLICES.map((s) => (
            <span key={s.id} className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-[1px]" style={{ background: s.color }} aria-hidden />
              {s.label} {Math.round((parts[s.id] / denom) * 100)}%
            </span>
          ))}
        </div>
      </div>

      {/* the waterfall in numbers */}
      <div className="rounded border border-border px-4 py-2 divide-y divide-[var(--border)]">
        <div>
          <Row label="Opening balance" amount={plan.openingBalance} note={budget.openingBalance.confirmedOn ? `confirmed ${budget.openingBalance.confirmedOn}` : undefined} />
        </div>
        <div>
          <Row
            label="Salary"
            amount={plan.grossSalary}
            note={`${yen(budget.income.firstMonthSalaryJPY)} first month, then ${yen(budget.income.monthlySalaryJPY)} × ${plan.months - 1}`}
            sign="in"
          />
          {plan.additional > 0 && <Row label="Additional income" amount={plan.additional} sign="in" />}
          <Row label="Gross income" amount={plan.grossIncome} strong />
        </div>
        <div>
          <Row label="Income tax" amount={plan.tax} note={`${(budget.income.taxRate * 100).toFixed(2)}% of salary`} sign="out" />
          <Row label="After tax" amount={plan.netIncome} strong />
        </div>
        <div>
          <Row
            label="Living costs"
            amount={plan.living}
            note={`${yen(budget.monthlyLivingBudget)} × ${plan.months} months`}
            sign="out"
          />
          <Row
            label="Student loan"
            amount={plan.studentLoan}
            note={`${yen(budget.obligations.studentLoanMonthlyJPY)} × ${budget.obligations.studentLoanMonths}, from ${budget.obligations.studentLoanFirstDate}`}
            sign="out"
          />
          <Row
            label="Agent fee"
            amount={plan.agentFeeCash}
            note={
              plan.agentFeeInKind > 0
                ? `${yen(plan.agentFeeInKind)} settled in kind, no cash out`
                : undefined
            }
            sign="out"
          />
          <Row label="Lawyer" amount={plan.lawyer} note={budget.obligations.lawyerFeeNote} sign="out" />
        </div>
        <div>
          <Row label="Left to save and invest" amount={plan.toSaveAndInvest} strong />
          <Row label="Balance on the last paycheque" amount={plan.endingBalance} note={toCAD(plan.endingBalance, rate)} strong />
        </div>
      </div>

      {/* actual vs plan, today */}
      <div className="rounded border border-border p-3">
        <div className="text-[0.7rem] tracking-wide text-muted uppercase">Against the plan today</div>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Paycheques in", value: `${progress.paychequesReceived} of ${plan.months}` },
            { label: "Salary received", value: yen(progress.salaryReceived) },
            { label: "Spend logged", value: yen(progress.actualSpendToDate) },
            { label: "Plan says balance", value: yen(progress.plannedBalanceNow) },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-sm tabular-nums">{s.value}</div>
              <div className="mt-0.5 text-[0.65rem] text-muted">{s.label}</div>
            </div>
          ))}
        </div>
        {progress.paychequesReceived > 0 && (
          <p className="mt-3 text-[0.7rem] leading-relaxed text-muted">
            Budgeted {yen(progress.plannedLivingToDate)} of living so far.{" "}
            <span style={{ color: progress.spendVsPlan > 0 ? "var(--red)" : "var(--green)" }}>
              {progress.spendVsPlan > 0
                ? `${yen(progress.spendVsPlan)} over`
                : `${yen(Math.abs(progress.spendVsPlan))} under`}
            </span>
            , on entries logged to date. Days with no entry pull this number down, so read it with the month view.
          </p>
        )}
      </div>

      <div>
        <button
          onClick={() => setShowMonths((v) => !v)}
          className="text-xs text-muted underline decoration-[var(--ice-rest)] hover:decoration-[var(--ice-hover)]"
        >
          {showMonths ? "Hide" : "Show"} month by month
        </button>
        {showMonths && <ScheduleTable rows={plan.schedule} />}
      </div>
    </div>
  );
}

function ScheduleTable({ rows }: { rows: ScheduleRow[] }) {
  const cols: { key: keyof ScheduleRow; label: string }[] = [
    { key: "salary", label: "In" },
    { key: "tax", label: "Tax" },
    { key: "living", label: "Living" },
    { key: "studentLoan", label: "Loan" },
    { key: "net", label: "Saved" },
    { key: "planBalance", label: "Balance" },
  ];

  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[34rem] text-[0.7rem] tabular-nums">
        <thead>
          <tr className="text-muted">
            <th className="py-1 pr-3 text-left font-normal">Paid</th>
            {cols.map((c) => (
              <th key={c.key} className="py-1 pl-3 text-right font-normal">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {rows.map((r) => (
            <tr key={r.date}>
              <td className="py-1.5 pr-3 text-muted">{r.date}</td>
              {cols.map((c) => {
                const v = r[c.key] as number;
                return (
                  <td key={c.key} className="py-1.5 pl-3 text-right">
                    {v === 0 ? <span className="text-muted">·</span> : yen(v + (c.key === "salary" ? r.additional : 0))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
