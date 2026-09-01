"use client";

import { useState } from "react";
import { yen, type Budget, type BudgetOverrides } from "@/lib/money";

/**
 * Every figure in the plan is editable here. Edits are a patch held in this
 * browser, layered over the published budget. Nothing is sent anywhere, and
 * "Reset all" always returns to the numbers that shipped in the ledger.
 */

type Field = {
  key: string;
  label: string;
  note?: string;
  published: number;
  value: number;
  set: (n: number) => void;
  step?: number;
  suffix?: string;
  decimals?: number;
};

function NumberField({ f }: { f: Field }) {
  const [draft, setDraft] = useState<string | null>(null);
  const overridden = f.value !== f.published;
  const shown = draft ?? (f.decimals ? f.value.toFixed(f.decimals) : String(f.value));

  return (
    <label className="flex items-baseline justify-between gap-3 py-1.5">
      <span className="text-xs text-muted">
        {f.label}
        {f.note && <span className="block text-[0.65rem] text-muted opacity-70">{f.note}</span>}
        {overridden && (
          <button
            type="button"
            onClick={() => {
              setDraft(null);
              f.set(f.published);
            }}
            className="block text-[0.65rem] underline decoration-[var(--ice-rest)]"
            style={{ color: "var(--yellow)" }}
          >
            changed from {f.decimals ? f.published.toFixed(f.decimals) : f.published.toLocaleString("en-US")} · reset
          </button>
        )}
      </span>
      <span className="flex shrink-0 items-baseline gap-1">
        <input
          type="number"
          inputMode="decimal"
          step={f.step ?? 500}
          min={0}
          value={shown}
          onChange={(e) => {
            setDraft(e.target.value);
            const n = Number(e.target.value);
            if (e.target.value !== "" && Number.isFinite(n) && n >= 0) f.set(n);
          }}
          onBlur={() => setDraft(null)}
          className="w-28 rounded border border-border bg-transparent px-2 py-1 text-right text-xs tabular-nums outline-none focus:border-[var(--ice-hover)]"
          style={overridden ? { borderColor: "var(--yellow)" } : undefined}
        />
        {f.suffix && <span className="w-3 text-[0.65rem] text-muted">{f.suffix}</span>}
      </span>
    </label>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border border-border px-3 py-1">
      <div className="border-b border-border py-2 text-[0.65rem] tracking-wide text-muted uppercase">{title}</div>
      <div className="divide-y divide-[var(--border)]">{children}</div>
    </div>
  );
}

export function BudgetAdmin({
  published,
  working,
  overrides,
  setOverrides,
}: {
  /** The budget exactly as it shipped in the encrypted ledger. */
  published: Budget;
  /** The budget with the current overrides applied. */
  working: Budget;
  overrides: BudgetOverrides;
  setOverrides: (o: BudgetOverrides) => void;
}) {
  const [copied, setCopied] = useState(false);

  const setCategory = (id: string, n: number) =>
    setOverrides({ ...overrides, categories: { ...overrides.categories, [id]: n } });
  const setIncome = (k: keyof NonNullable<BudgetOverrides["income"]>, n: number) =>
    setOverrides({ ...overrides, income: { ...overrides.income, [k]: n } });
  const setObligation = (k: keyof NonNullable<BudgetOverrides["obligations"]>, n: number) =>
    setOverrides({ ...overrides, obligations: { ...overrides.obligations, [k]: n } });

  const pubCat = Object.fromEntries(published.categories.map((c) => [c.id, c.monthly]));

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[0.7rem] leading-relaxed text-muted">
        Changes apply everywhere on this page immediately and stay on this device. They do not touch the published
        ledger. Copy them out below and I will fold them into <code>budget.json</code> so they survive a rebuild and
        follow you to another device.
      </p>

      <Block title={`Monthly living · ${yen(working.monthlyLivingBudget)}`}>
        {working.categories.map((c) => (
          <NumberField
            key={c.id}
            f={{
              key: c.id,
              label: c.label,
              published: pubCat[c.id] ?? 0,
              value: c.monthly,
              set: (n) => setCategory(c.id, n),
              step: 500,
            }}
          />
        ))}
      </Block>

      <Block title="Income">
        <NumberField
          f={{
            key: "first",
            label: "First month salary",
            note: published.income.firstSalaryDate,
            published: published.income.firstMonthSalaryJPY,
            value: working.income.firstMonthSalaryJPY,
            set: (n) => setIncome("firstMonthSalaryJPY", n),
            step: 10000,
          }}
        />
        <NumberField
          f={{
            key: "monthly",
            label: "Monthly salary after that",
            published: published.income.monthlySalaryJPY,
            value: working.income.monthlySalaryJPY,
            set: (n) => setIncome("monthlySalaryJPY", n),
            step: 10000,
          }}
        />
        <NumberField
          f={{
            key: "additional",
            label: "Additional income, month 1",
            note: "bonus, signing, relocation",
            published: published.income.additionalIncomeJPY,
            value: working.income.additionalIncomeJPY,
            set: (n) => setIncome("additionalIncomeJPY", n),
            step: 10000,
          }}
        />
        <NumberField
          f={{
            key: "tax",
            label: "Tax rate",
            published: published.income.taxRate * 100,
            value: working.income.taxRate * 100,
            set: (n) => setIncome("taxRate", n / 100),
            step: 0.01,
            decimals: 2,
            suffix: "%",
          }}
        />
        <NumberField
          f={{
            key: "months",
            label: "Salary months",
            published: published.income.salaryMonths,
            value: working.income.salaryMonths,
            set: (n) => setIncome("salaryMonths", Math.max(1, Math.round(n))),
            step: 1,
          }}
        />
      </Block>

      <Block title="Balance and obligations">
        <NumberField
          f={{
            key: "opening",
            label: "Opening balance",
            published: published.openingBalance.planStartJPY,
            value: working.openingBalance.planStartJPY,
            set: (n) => setOverrides({ ...overrides, openingBalanceJPY: n }),
            step: 10000,
          }}
        />
        <NumberField
          f={{
            key: "loan",
            label: "Student loan per month",
            published: published.obligations.studentLoanMonthlyJPY,
            value: working.obligations.studentLoanMonthlyJPY,
            set: (n) => setObligation("studentLoanMonthlyJPY", n),
            step: 1000,
          }}
        />
        <NumberField
          f={{
            key: "loanMonths",
            label: "Loan payments",
            published: published.obligations.studentLoanMonths,
            value: working.obligations.studentLoanMonths,
            set: (n) => setObligation("studentLoanMonths", Math.max(0, Math.round(n))),
            step: 1,
          }}
        />
        <NumberField
          f={{
            key: "loanStart",
            label: "First loan payment",
            note: `salary month ${working.obligations.studentLoanFirstSalaryMonthIndex} of ${working.income.salaryMonths}`,
            published: published.obligations.studentLoanFirstSalaryMonthIndex,
            value: working.obligations.studentLoanFirstSalaryMonthIndex,
            set: (n) => setObligation("studentLoanFirstSalaryMonthIndex", Math.max(1, Math.round(n))),
            step: 1,
          }}
        />
        <NumberField
          f={{
            key: "agent",
            label: "Agent fee, cash",
            note: published.obligations.agentFeeNote,
            published: published.obligations.agentFeeCashJPY,
            value: working.obligations.agentFeeCashJPY,
            set: (n) => setObligation("agentFeeCashJPY", n),
            step: 10000,
          }}
        />
        <NumberField
          f={{
            key: "lawyer",
            label: "Lawyer fee",
            note: published.obligations.lawyerFeeNote,
            published: published.obligations.lawyerFeeJPY,
            value: working.obligations.lawyerFeeJPY,
            set: (n) => setObligation("lawyerFeeJPY", n),
            step: 10000,
          }}
        />
      </Block>

      <Block title="Exchange rate">
        <NumberField
          f={{
            key: "fx",
            label: "JPY per CAD",
            note: `published ${published.meta.fxAsOf}`,
            published: published.meta.fx.CAD_JPY,
            value: working.meta.fx.CAD_JPY,
            set: (n) => setOverrides({ ...overrides, fxCadJpy: n }),
            step: 0.1,
            decimals: 2,
          }}
        />
      </Block>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(overrides, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="rounded border border-border px-3 py-1.5 text-xs hover:border-[var(--ice-hover)]"
        >
          {copied ? "Copied" : "Copy changes as JSON"}
        </button>
        <button
          onClick={() => setOverrides({})}
          className="rounded border border-border px-3 py-1.5 text-xs hover:border-[var(--ice-hover)]"
        >
          Reset all to published
        </button>
      </div>
    </div>
  );
}
