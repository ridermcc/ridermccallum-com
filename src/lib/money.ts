// Types + derived math for the Tokyo money dashboard.
// Pure functions only: the component layer renders, this layer decides.

export type Category = {
  id: string;
  label: string;
  group: string;
  monthly: number;
};

export type Group = { id: string; label: string; monthly: number };

export type ScheduleRow = {
  date: string;
  salaryMonth: number;
  salary: number;
  additional: number;
  tax: number;
  living: number;
  agentFee: number;
  studentLoan: number;
  lawyer: number;
  net: number;
  planBalance: number;
};

export type ReconcileItem = {
  id: string;
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
  asks: string;
};

export type Income = {
  contractValueJPY: number;
  monthlySalaryJPY: number;
  /** Month 1 was a partial month, so it is held separately from the standing salary. */
  firstMonthSalaryJPY: number;
  additionalIncomeJPY: number;
  taxRate: number;
  salaryDayOfMonth: number;
  salaryMonths: number;
  firstSalaryDate: string;
};

export type Obligations = {
  studentLoanMonthlyJPY: number;
  studentLoanMonths: number;
  studentLoanFirstSalaryMonthIndex: number;
  studentLoanFirstDate: string;
  /** Face value of the agent fee. */
  agentFeeJPY: number;
  /** What actually leaves the bank. Zero when the fee was settled in kind. */
  agentFeeCashJPY: number;
  agentFeeSettlement: "cash" | "in-kind";
  agentFeeNote?: string;
  lawyerFeeJPY: number;
  lawyerFeeNote?: string;
};

export type Budget = {
  version: number;
  updated: string;
  meta: {
    primaryCurrency: string;
    secondaryCurrency: string;
    fx: { CAD_JPY: number; USD_JPY: number; USD_CAD: number };
    fxAsOf: string;
    fxStaleAfterDays: number;
  };
  period: { start: string; end: string; label: string };
  categories: Category[];
  groups: Group[];
  monthlyLivingBudget: number;
  income: Income;
  obligations: Obligations;
  openingBalance: { planStartJPY: number; confirmedOn?: string; note: string };
  balanceAnchor: { date: string; amountJPY: number } | null;
  reconcile: ReconcileItem[];
};

export type SpendEntry = {
  id: string;
  date: string;
  amount: number;
  currency: string;
  category: string;
  vendor?: string;
  note?: string;
  /** A setup or one-time cost (bedding, a hotel night, a SIM card). Real spend, but left out of the typical-day rate. */
  oneOff?: boolean;
  /** Added on this device and not yet folded into the published ledger. Never in the build. */
  pending?: boolean;
};

export type Ledger = { v: number; builtAt: string; budget: Budget; spend: SpendEntry[] };

// ---------- date helpers (all local time; Rider reads this in JST) ----------

export const monthKey = (iso: string) => iso.slice(0, 7);

export function todayISO(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

export function daysInMonth(key: string): number {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

export function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// ---------- money formatting ----------

// Display currency is a view setting only: the ledger stays in JPY. It is module
// state because every figure on the page goes through `yen`, and the dashboard
// re-renders its whole tree when the setting changes.
export type DisplayCurrency = "JPY" | "SEK" | "USD" | "CAD";
export const DISPLAY_CURRENCIES: DisplayCurrency[] = ["JPY", "SEK", "USD", "CAD"];

let display: { code: DisplayCurrency; perJPY: number } = { code: "JPY", perJPY: 1 };

export function setDisplayCurrency(code: DisplayCurrency, perJPY: number) {
  display = { code, perJPY };
}

export const yen = (n: number) => {
  if (display.code === "JPY") return `¥${Math.round(n).toLocaleString("en-US")}`;
  const v = n * display.perJPY;
  return v.toLocaleString("en-US", {
    style: "currency",
    currency: display.code,
    maximumFractionDigits: Math.abs(v) < 100 ? 2 : 0,
  });
};

// Live rates, JPY base. Frankfurter serves ECB reference rates (updated each
// working day) with open CORS and no key.
export async function fetchDisplayRates(): Promise<{ date: string; rates: Record<Exclude<DisplayCurrency, "JPY">, number> }> {
  const res = await fetch("https://api.frankfurter.dev/v1/latest?base=JPY&symbols=SEK,USD,CAD");
  if (!res.ok) throw new Error(`rates ${res.status}`);
  return res.json();
}

export const toCAD = (jpy: number, rate: number) =>
  `$${(jpy / rate).toLocaleString("en-US", { maximumFractionDigits: 0 })} CAD`;

export function fxIsStale(budget: Budget, today = todayISO()): boolean {
  const age = (Date.parse(today) - Date.parse(budget.meta.fxAsOf)) / 86_400_000;
  return age > budget.meta.fxStaleAfterDays;
}

// ---------- the month view ----------

export type GroupActual = {
  id: string;
  label: string;
  budget: number;
  actual: number;
  pctOfBudget: number;
  over: boolean;
};

export type DayActual = {
  day: number;
  date: string;
  total: number;
  byCategory: Record<string, number>;
  /**
   * What this day was allowed to spend and still land the month on budget,
   * given everything spent before it. Starts at budget/days and adapts: a heavy
   * day pulls every later day's allowance down, a quiet one pushes it back up.
   */
  allowance: number;
};

export type MonthView = {
  key: string;
  label: string;
  days: number;
  elapsedDays: number;
  isCurrentMonth: boolean;
  monthProgress: number;
  budget: number;
  spent: number;
  remaining: number;
  pctOfBudget: number;
  dailyBudget: number;
  dailyPaceActual: number;
  /** What each remaining day can carry to still land the month on budget. */
  safePerDay: number;
  projectedMonthEnd: number;
  projectedOverUnder: number;
  onPace: boolean;
  loggedDays: number;
  isPartial: boolean;
  groups: GroupActual[];
  byDay: DayActual[];
  entries: SpendEntry[];
};

export function buildMonthView(ledger: Ledger, key: string, today = todayISO()): MonthView {
  const { budget, spend } = ledger;
  const entries = spend.filter((e) => monthKey(e.date) === key);
  const days = daysInMonth(key);
  const isCurrentMonth = monthKey(today) === key;
  // Days elapsed drives daily pace and the month-end projection. Take the
  // calendar position, but never less than the latest day actually logged: a
  // receipt dated ahead of the local clock (JST skew, a late-night entry)
  // would otherwise divide a week of spend by one day and project a wild
  // month-end number.
  const calendarElapsed = isCurrentMonth
    ? Math.min(days, Number(today.slice(8, 10)))
    : today > key
      ? days
      : 0;
  const lastLoggedDay = entries.reduce((max, e) => Math.max(max, Number(e.date.slice(8, 10))), 0);
  const elapsedDays = Math.min(days, Math.max(calendarElapsed, lastLoggedDay));

  const catToGroup = new Map(budget.categories.map((c) => [c.id, c.group]));

  const groupTotals = new Map<string, number>();
  for (const e of entries) {
    const g = catToGroup.get(e.category) ?? "other";
    groupTotals.set(g, (groupTotals.get(g) ?? 0) + e.amount);
  }

  const groups: GroupActual[] = budget.groups.map((g) => {
    const actual = groupTotals.get(g.id) ?? 0;
    return {
      id: g.id,
      label: g.label,
      budget: g.monthly,
      actual,
      pctOfBudget: g.monthly > 0 ? actual / g.monthly : actual > 0 ? Infinity : 0,
      over: actual > g.monthly,
    };
  });

  const monthBudget = budget.monthlyLivingBudget;

  let spentBefore = 0;
  const byDay: DayActual[] = Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    const date = `${key}-${String(day).padStart(2, "0")}`;
    const dayEntries = entries.filter((e) => e.date === date);
    const byCategory: Record<string, number> = {};
    for (const e of dayEntries) byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
    const total = dayEntries.reduce((s, e) => s + e.amount, 0);
    const allowance = Math.max(0, (monthBudget - spentBefore) / (days - day + 1));
    spentBefore += total;
    return { day, date, total, byCategory, allowance };
  });

  const spent = entries.reduce((s, e) => s + e.amount, 0);
  const dailyPaceActual = elapsedDays > 0 ? spent / elapsedDays : 0;
  const projectedMonthEnd = elapsedDays > 0 ? dailyPaceActual * days : 0;

  return {
    key,
    label: monthLabel(key),
    days,
    elapsedDays,
    isCurrentMonth,
    monthProgress: elapsedDays / days,
    budget: monthBudget,
    spent,
    remaining: monthBudget - spent,
    pctOfBudget: spent / monthBudget,
    dailyBudget: monthBudget / days,
    dailyPaceActual,
    safePerDay: elapsedDays < days ? Math.max(0, monthBudget - spent) / (days - elapsedDays) : 0,
    projectedMonthEnd,
    projectedOverUnder: projectedMonthEnd - monthBudget,
    // On pace when you have spent no more of the budget than of the month.
    onPace: spent / monthBudget <= elapsedDays / days,
    // Days that actually carry an entry. When this trails the days elapsed,
    // the month is only partly logged and every roll-up below understates the
    // real spend — say so rather than letting it read as an under-budget month.
    loggedDays: new Set(entries.map((e) => e.date)).size,
    isPartial: new Set(entries.map((e) => e.date)).size < elapsedDays,
    groups,
    byDay,
    entries: [...entries].sort((a, b) => b.date.localeCompare(a.date)),
  };
}

/** Months that have either budget coverage or real spend, newest first. */
export function availableMonths(ledger: Ledger, today = todayISO()): string[] {
  const keys = new Set<string>(ledger.spend.map((e) => monthKey(e.date)));
  const [sy, sm] = ledger.budget.period.start.slice(0, 7).split("-").map(Number);
  const endKey = monthKey(today) < ledger.budget.period.end ? monthKey(today) : monthKey(ledger.budget.period.end);
  for (let y = sy, m = sm; `${y}-${String(m).padStart(2, "0")}` <= endKey; ) {
    keys.add(`${y}-${String(m).padStart(2, "0")}`);
    m += 1;
    if (m > 12) { m = 1; y += 1; }
  }
  return [...keys].sort().reverse();
}

/** Plan balance line, derived from the budget inputs. */
export function balanceSeries(budget: Budget) {
  return computeSchedule(budget).map((row) => ({
    date: row.date,
    label: new Date(row.date).toLocaleDateString("en-US", { month: "short" }),
    plan: row.planBalance,
    net: row.net,
  }));
}

// ---------- the plan: income, tax, obligations, what is left to save ----------

/**
 * The salary schedule is derived, not stored. Every number on the plan comes
 * from the inputs in `budget.json`, so changing a figure in the admin moves the
 * whole projection instead of leaving a stale table behind.
 */
export function computeSchedule(budget: Budget): ScheduleRow[] {
  const { income, obligations, openingBalance, monthlyLivingBudget } = budget;
  const [y0, m0, d0] = income.firstSalaryDate.split("-").map(Number);

  let balance = openingBalance.planStartJPY;
  let loanPaymentsMade = 0;

  return Array.from({ length: income.salaryMonths }, (_, i) => {
    const d = new Date(y0, m0 - 1 + i, d0);
    const p = (n: number) => String(n).padStart(2, "0");
    const date = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;

    const salaryMonth = i + 1;
    const salary = i === 0 ? income.firstMonthSalaryJPY : income.monthlySalaryJPY;
    const additional = i === 0 ? income.additionalIncomeJPY : 0;
    const tax = Math.round(salary * income.taxRate);

    const loanDue =
      salaryMonth >= obligations.studentLoanFirstSalaryMonthIndex &&
      loanPaymentsMade < obligations.studentLoanMonths;
    if (loanDue) loanPaymentsMade += 1;
    const studentLoan = loanDue ? obligations.studentLoanMonthlyJPY : 0;

    // Both one-off fees land on the first paycheque. The agent fee is the cash
    // figure, which is zero when the fee was settled in kind.
    const agentFee = i === 0 ? obligations.agentFeeCashJPY : 0;
    const lawyer = i === 0 ? obligations.lawyerFeeJPY : 0;

    const net = salary + additional - tax - monthlyLivingBudget - agentFee - studentLoan - lawyer;
    balance += net;

    return {
      date,
      salaryMonth,
      salary,
      additional,
      tax,
      living: monthlyLivingBudget,
      agentFee,
      studentLoan,
      lawyer,
      net,
      planBalance: balance,
    };
  });
}

export type Plan = {
  schedule: ScheduleRow[];
  months: number;
  grossSalary: number;
  additional: number;
  grossIncome: number;
  tax: number;
  effectiveTaxRate: number;
  netIncome: number;
  living: number;
  studentLoan: number;
  agentFeeCash: number;
  agentFeeInKind: number;
  lawyer: number;
  totalObligations: number;
  totalOut: number;
  toSaveAndInvest: number;
  perMonthSave: number;
  savingsRate: number;
  openingBalance: number;
  endingBalance: number;
  contractValueJPY: number;
  contractGap: number;
};

/** The whole-season waterfall: money in, tax, spend, obligations, what is left. */
export function buildPlan(budget: Budget): Plan {
  const schedule = computeSchedule(budget);
  const sum = (f: (r: ScheduleRow) => number) => schedule.reduce((s, r) => s + f(r), 0);

  const grossSalary = sum((r) => r.salary);
  const additional = sum((r) => r.additional);
  const grossIncome = grossSalary + additional;
  const tax = sum((r) => r.tax);
  const netIncome = grossIncome - tax;

  const living = sum((r) => r.living);
  const studentLoan = sum((r) => r.studentLoan);
  const agentFeeCash = sum((r) => r.agentFee);
  const lawyer = sum((r) => r.lawyer);
  const totalObligations = studentLoan + agentFeeCash + lawyer;
  const totalOut = living + totalObligations;

  const toSaveAndInvest = netIncome - totalOut;
  const openingBalance = budget.openingBalance.planStartJPY;

  return {
    schedule,
    months: schedule.length,
    grossSalary,
    additional,
    grossIncome,
    tax,
    effectiveTaxRate: grossIncome > 0 ? tax / grossIncome : 0,
    netIncome,
    living,
    studentLoan,
    agentFeeCash,
    // Real cost, no cash movement. Shown so the trade is visible rather than absent.
    agentFeeInKind: budget.obligations.agentFeeSettlement === "in-kind" ? budget.obligations.agentFeeJPY : 0,
    lawyer,
    totalObligations,
    totalOut,
    toSaveAndInvest,
    perMonthSave: schedule.length > 0 ? toSaveAndInvest / schedule.length : 0,
    savingsRate: netIncome > 0 ? toSaveAndInvest / netIncome : 0,
    openingBalance,
    endingBalance: openingBalance + toSaveAndInvest,
    contractValueJPY: budget.income.contractValueJPY,
    contractGap: budget.income.contractValueJPY - grossSalary,
  };
}

export type PlanProgress = {
  paychequesReceived: number;
  salaryReceived: number;
  plannedLivingToDate: number;
  actualSpendToDate: number;
  spendVsPlan: number;
  plannedBalanceNow: number;
};

/** Where the plan says you should be right now, against what has actually been logged. */
export function planProgress(ledger: Ledger, today = todayISO()): PlanProgress {
  const plan = buildPlan(ledger.budget);
  const paid = plan.schedule.filter((r) => r.date <= today);
  const salaryReceived = paid.reduce((s, r) => s + r.salary + r.additional, 0);
  const plannedLivingToDate = paid.length * ledger.budget.monthlyLivingBudget;
  const actualSpendToDate = ledger.spend.reduce((s, e) => s + e.amount, 0);

  return {
    paychequesReceived: paid.length,
    salaryReceived,
    plannedLivingToDate,
    actualSpendToDate,
    spendVsPlan: actualSpendToDate - plannedLivingToDate,
    plannedBalanceNow: paid.length > 0 ? paid[paid.length - 1].planBalance : plan.openingBalance,
  };
}

// ---------- editable inputs ----------

/**
 * The admin never rewrites the ledger. It stores a thin patch over the budget
 * that ships in the encrypted blob, so the published figures stay the source of
 * truth and an override can always be cleared back to them.
 */
export type BudgetOverrides = {
  categories?: Record<string, number>;
  income?: Partial<Pick<Income, "monthlySalaryJPY" | "firstMonthSalaryJPY" | "additionalIncomeJPY" | "taxRate" | "salaryMonths">>;
  obligations?: Partial<
    Pick<
      Obligations,
      "studentLoanMonthlyJPY" | "studentLoanMonths" | "studentLoanFirstSalaryMonthIndex" | "agentFeeCashJPY" | "lawyerFeeJPY"
    >
  >;
  openingBalanceJPY?: number;
  fxCadJpy?: number;
};

export const hasOverrides = (o: BudgetOverrides | null | undefined): boolean =>
  !!o &&
  (Object.keys(o.categories ?? {}).length > 0 ||
    Object.keys(o.income ?? {}).length > 0 ||
    Object.keys(o.obligations ?? {}).length > 0 ||
    o.openingBalanceJPY !== undefined ||
    o.fxCadJpy !== undefined);

/**
 * Groups and the monthly living budget are always recomputed from the
 * categories, so raising Dining Out moves the Food group, the living budget,
 * the daily line, the schedule and the savings figure in one step.
 */
export function applyOverrides(budget: Budget, o: BudgetOverrides | null | undefined): Budget {
  const categories = budget.categories.map((c) =>
    o?.categories?.[c.id] !== undefined ? { ...c, monthly: o.categories[c.id] } : c
  );

  const groupTotal = (id: string) => categories.filter((c) => c.group === id).reduce((s, c) => s + c.monthly, 0);
  const groups = budget.groups.map((g) => ({ ...g, monthly: groupTotal(g.id) }));
  const monthlyLivingBudget = categories.reduce((s, c) => s + c.monthly, 0);

  return {
    ...budget,
    meta: o?.fxCadJpy ? { ...budget.meta, fx: { ...budget.meta.fx, CAD_JPY: o.fxCadJpy } } : budget.meta,
    categories,
    groups,
    monthlyLivingBudget,
    income: { ...budget.income, ...(o?.income ?? {}) },
    obligations: { ...budget.obligations, ...(o?.obligations ?? {}) },
    openingBalance:
      o?.openingBalanceJPY !== undefined
        ? { ...budget.openingBalance, planStartJPY: o.openingBalanceJPY }
        : budget.openingBalance,
  };
}

// ---------- projecting the plan off what has actually been spent ----------

/**
 * The rate everything below is built on. It is spend per *logged* day, not per
 * elapsed day: dividing by elapsed days would quietly count every untracked day
 * as a zero and halve the projection. That makes the number honest but makes
 * the sample size matter, so it is carried alongside and surfaced in the UI.
 */
export type ProjectionBasis = {
  daysObserved: number;
  firstLoggedDate: string | null;
  lastLoggedDate: string | null;
  totalObserved: number;
  /** Mean spend per logged day. Every yen counts, so one big night moves it a long way. */
  dailyRate: number;
  /** Median of the daily totals. What a normal day costs; a big night barely moves it. */
  typicalDailyRate: number;
  /** Days that ran past twice the typical day, and how much of all spend they carry. */
  bigDays: { count: number; total: number; share: number };
  confidence: "none" | "thin" | "early" | "reasonable";
};

export function projectionBasis(ledger: Ledger): ProjectionBasis {
  const byDate = new Map<string, number>();
  // One-offs are real spend but not a habit, so they stay out of the rates the
  // projection carries forward.
  for (const e of ledger.spend) if (!e.oneOff) byDate.set(e.date, (byDate.get(e.date) ?? 0) + e.amount);
  const dates = [...byDate.keys()].sort();
  const dayTotals = [...byDate.values()].sort((a, b) => a - b);
  const total = dayTotals.reduce((s, v) => s + v, 0);
  const n = dates.length;

  const mid = n >> 1;
  const typical = n === 0 ? 0 : n % 2 === 1 ? dayTotals[mid] : (dayTotals[mid - 1] + dayTotals[mid]) / 2;
  const big = dayTotals.filter((v) => v > typical * 2);
  const bigTotal = big.reduce((s, v) => s + v, 0);

  return {
    daysObserved: n,
    firstLoggedDate: dates[0] ?? null,
    lastLoggedDate: dates[n - 1] ?? null,
    totalObserved: total,
    dailyRate: n > 0 ? total / n : 0,
    typicalDailyRate: typical,
    bigDays: { count: big.length, total: bigTotal, share: total > 0 ? bigTotal / total : 0 },
    confidence: n === 0 ? "none" : n < 7 ? "thin" : n < 21 ? "early" : "reasonable",
  };
}

export type MonthProjection = {
  key: string;
  label: string;
  days: number;
  /** untracked: logging had not started. partial: real gaps. current/future: projected. */
  status: "untracked" | "partial" | "tracked" | "current" | "future";
  budget: number;
  actual: number;
  loggedDays: number;
  elapsedDays: number;
  /** Logged spend plus typical days to month end. The fair reading. */
  projected: number;
  /** Logged spend plus the all-in average to month end: what happens if the big days keep coming. */
  projectedHigh: number;
  overUnder: number;
  overUnderHigh: number;
  /** Whether this month feeds the season total. A month with gaps cannot. */
  counted: boolean;
};

export type CategoryProjection = {
  id: string;
  label: string;
  observed: number;
  dailyRate: number;
  budget: number;
  projected: number;
  overUnder: number;
  /** Real spend against a zero budget. The budget is wrong, not the spending. */
  unbudgeted: boolean;
};

export type SeasonProjection = {
  basis: ProjectionBasis;
  months: MonthProjection[];
  countedMonths: number;
  budgetedLiving: number;
  /** Typical-day scenario. The Low/High pair brackets it with the all-in average. */
  projectedLiving: number;
  projectedLivingHigh: number;
  overUnder: number;
  overUnderHigh: number;
  /** Months shown but left out of the total because logging has gaps. */
  uncountedMonths: MonthProjection[];
  plannedSavings: number;
  projectedSavings: number;
  projectedSavingsLow: number;
  projectedEndingBalance: number;
  projectedEndingBalanceLow: number;
  monthlyRunRate: number;
  typicalMonthlyRunRate: number;
  safeDailyRate: number;
  daysRemaining: number;
  categories: CategoryProjection[];
  representativeDays: number;
};

/**
 * Carries the observed daily rate across every month the plan still has to pay
 * for, and reports what that does to the savings figure.
 *
 * Months that ran before logging started are shown but never counted: their
 * logged total is real spend, but it is a fraction of a month, and treating it
 * as the month's actual would understate the plan by more than the projection
 * corrects it.
 */
export function projectSeason(ledger: Ledger, today = todayISO()): SeasonProjection {
  const plan = buildPlan(ledger.budget);
  const basis = projectionBasis(ledger);
  const monthBudget = ledger.budget.monthlyLivingBudget;
  const nowKey = monthKey(today);

  // One living charge per salary month, on the calendar month it falls in.
  const planMonthKeys = plan.schedule.map((r) => monthKey(r.date));

  const months: MonthProjection[] = planMonthKeys.map((key) => {
    const v = buildMonthView(ledger, key, today);
    const isPast = key < nowKey;
    const isFuture = key > nowKey;

    // A past month counts only if it was logged end to end. "Untracked" means
    // logging had not begun yet; "partial" means it had, and days are missing.
    const wholeMonthLogged = v.loggedDays >= v.elapsedDays;
    const startedLogging = basis.firstLoggedDate !== null && key >= monthKey(basis.firstLoggedDate);

    const status: MonthProjection["status"] = isFuture
      ? "future"
      : isPast
        ? wholeMonthLogged
          ? "tracked"
          : startedLogging
            ? "partial"
            : "untracked"
        : "current";

    const remainingDays = isFuture ? v.days : isPast ? 0 : v.days - v.elapsedDays;
    const projected = isPast ? v.spent : v.spent + basis.typicalDailyRate * remainingDays;
    const projectedHigh = isPast ? v.spent : v.spent + basis.dailyRate * remainingDays;
    const counted = status === "future" || status === "current" || status === "tracked";

    return {
      key,
      label: monthLabel(key),
      days: v.days,
      status,
      budget: monthBudget,
      actual: v.spent,
      loggedDays: v.loggedDays,
      elapsedDays: v.elapsedDays,
      projected,
      projectedHigh,
      overUnder: projected - monthBudget,
      overUnderHigh: projectedHigh - monthBudget,
      counted,
    };
  });

  const counted = months.filter((m) => m.counted);
  const budgetedLiving = counted.length * monthBudget;
  const projectedLiving = counted.reduce((s, m) => s + m.projected, 0);
  const projectedLivingHigh = counted.reduce((s, m) => s + m.projectedHigh, 0);
  const overUnder = projectedLiving - budgetedLiving;
  const overUnderHigh = projectedLivingHigh - budgetedLiving;

  // What is still spendable, and over how many days, to land on budget.
  const daysRemaining = counted.reduce(
    (s, m) => s + (m.status === "future" ? m.days : m.status === "current" ? m.days - m.elapsedDays : 0),
    0
  );
  const spentInCounted = counted.reduce((s, m) => s + m.actual, 0);
  const safeDailyRate = daysRemaining > 0 ? Math.max(0, (budgetedLiving - spentInCounted) / daysRemaining) : 0;

  // Categories are compared over one representative month so the figures line
  // up with the monthly budgets they are read against.
  const representativeDays = daysInMonth(nowKey);
  const observedByCategory = new Map<string, number>();
  for (const e of ledger.spend) observedByCategory.set(e.category, (observedByCategory.get(e.category) ?? 0) + e.amount);

  const categories: CategoryProjection[] = ledger.budget.categories
    .map((c) => {
      const observed = observedByCategory.get(c.id) ?? 0;
      const dailyRate = basis.daysObserved > 0 ? observed / basis.daysObserved : 0;
      const projected = dailyRate * representativeDays;
      return {
        id: c.id,
        label: c.label,
        observed,
        dailyRate,
        budget: c.monthly,
        projected,
        overUnder: projected - c.monthly,
        unbudgeted: c.monthly === 0 && observed > 0,
      };
    })
    .sort((a, b) => b.overUnder - a.overUnder);

  return {
    basis,
    months,
    countedMonths: counted.length,
    budgetedLiving,
    projectedLiving,
    projectedLivingHigh,
    overUnder,
    overUnderHigh,
    uncountedMonths: months.filter((m) => !m.counted),
    plannedSavings: plan.toSaveAndInvest,
    // Overspending on living comes straight out of savings, yen for yen.
    projectedSavings: plan.toSaveAndInvest - overUnder,
    projectedSavingsLow: plan.toSaveAndInvest - overUnderHigh,
    projectedEndingBalance: plan.endingBalance - overUnder,
    projectedEndingBalanceLow: plan.endingBalance - overUnderHigh,
    monthlyRunRate: basis.dailyRate * representativeDays,
    typicalMonthlyRunRate: basis.typicalDailyRate * representativeDays,
    safeDailyRate,
    daysRemaining,
    categories,
    representativeDays,
  };
}

// ---------- weeks ----------

/** Shift an ISO date by whole days. UTC arithmetic so no clock change can skew it. */
export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** The Monday that starts the week holding `iso`. */
export function weekStart(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dow = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
  return addDays(iso, -dow);
}

/** The monthly living budget spread evenly over 52 weeks. */
export const weeklyBudget = (budget: Budget) => Math.round((budget.monthlyLivingBudget * 12) / 52);

export type WeekView = {
  start: string;
  end: string;
  label: string;
  isCurrent: boolean;
  /** Days of the week already lived, today included. 7 for a finished week. */
  elapsedDays: number;
  budget: number;
  spent: number;
  oneOff: number;
  routine: number;
  byCategory: Record<string, number>;
  byDay: { date: string; total: number }[];
  /** Days past twice the typical day. */
  bigDays: number;
  loggedDays: number;
  /** More than two lived days with nothing logged: the total is real but not the whole week. */
  partial: boolean;
};

function shortDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Monday-to-Sunday weeks from the first entry through the week holding today, oldest first. */
export function buildWeeks(ledger: Ledger, today = todayISO(), typicalDailyRate = 0): WeekView[] {
  if (ledger.spend.length === 0) return [];
  const first = ledger.spend.reduce((min, e) => (e.date < min ? e.date : min), ledger.spend[0].date);
  const budget = weeklyBudget(ledger.budget);
  const weeks: WeekView[] = [];

  for (let start = weekStart(first); start <= today; start = addDays(start, 7)) {
    const end = addDays(start, 6);
    const entries = ledger.spend.filter((e) => e.date >= start && e.date <= end);
    const byDay = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i);
      return { date, total: entries.filter((e) => e.date === date).reduce((s, e) => s + e.amount, 0) };
    });
    const byCategory: Record<string, number> = {};
    for (const e of entries) byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
    const spent = entries.reduce((s, e) => s + e.amount, 0);
    const oneOff = entries.filter((e) => e.oneOff).reduce((s, e) => s + e.amount, 0);
    const isCurrent = today <= end;
    const elapsedDays = isCurrent ? byDay.filter((d) => d.date <= today).length : 7;
    const loggedDays = byDay.filter((d) => d.date <= today && d.total > 0).length;
    const sameMonth = start.slice(5, 7) === end.slice(5, 7);
    weeks.push({
      start,
      end,
      label: `${shortDate(start)} to ${sameMonth ? Number(end.slice(8)) : shortDate(end)}`,
      isCurrent,
      elapsedDays,
      budget,
      spent,
      oneOff,
      routine: spent - oneOff,
      byCategory,
      byDay,
      bigDays: typicalDailyRate > 0 ? byDay.filter((d) => d.total > typicalDailyRate * 2).length : 0,
      loggedDays,
      // today may simply not be logged yet, so it never counts as a gap
      partial: !isCurrent && elapsedDays - loggedDays > 2,
    });
  }
  return weeks;
}

// ---------- insights ----------

export type Insight = {
  id: string;
  tone: "good" | "warn" | "bad" | "info";
  title: string;
  body: string;
  /** Rough yen a week this lever is worth. Ranks the cards. */
  impact: number;
};

export const KONBINI = /7-eleven|familymart|family mart|lawson|ministop/i;
const WEEKDAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/**
 * Plain rules over the last four weeks of routine spend, each ending in a
 * number that can be acted on. The first card is always this week's allowance;
 * the rest rank by how many yen a week they are worth.
 */
export function buildInsights(ledger: Ledger, weeks: WeekView[], typicalDailyRate: number, today = todayISO()): Insight[] {
  const out: Insight[] = [];
  const wBudget = weeklyBudget(ledger.budget);
  const dailyBudget = wBudget / 7;
  const current = weeks[weeks.length - 1];
  const previous = weeks[weeks.length - 2];

  // 1. this week's allowance
  if (current) {
    const left = current.budget - current.spent;
    const daysLeft = 7 - current.elapsedDays + 1; // today still counts
    if (left > 0) {
      out.push({
        id: "allowance",
        tone: left / daysLeft >= typicalDailyRate ? "good" : "warn",
        title: `${yen(left)} left this week`,
        body: `${yen(left / daysLeft)} a day through Sunday. A typical day runs ${yen(typicalDailyRate)}.`,
        impact: Infinity,
      });
    } else {
      out.push({
        id: "allowance",
        tone: "bad",
        title: `${yen(-left)} over this week's budget`,
        body: `The week's ${yen(current.budget)} is spent. Monday resets it${
          previous ? `; last week ran ${yen(previous.spent)}` : ""
        }.`,
        impact: Infinity,
      });
    }
  }

  const from = addDays(today, -27);
  const recent = ledger.spend.filter((e) => e.date >= from && e.date <= today && !e.oneOff);
  const byDate = new Map<string, number>();
  for (const e of recent) byDate.set(e.date, (byDate.get(e.date) ?? 0) + e.amount);
  const total = recent.reduce((s, e) => s + e.amount, 0);
  const days = byDate.size;
  if (days < 7) return out;

  // 2. big nights
  const big = [...byDate.values()].filter((v) => v > typicalDailyRate * 2);
  const bigTotal = big.reduce((s, v) => s + v, 0);
  if (big.length > 0 && bigTotal / total > 0.35) {
    const headroom = wBudget - typicalDailyRate * 7;
    const weeklyBig = (bigTotal / days) * 7;
    out.push(
      headroom > 0
        ? {
            id: "big-days",
            tone: "bad",
            title: `Keep nights out under ${yen(headroom)} a week`,
            body: `${big.length} big days in the last 4 weeks cost ${yen(bigTotal)}, ${Math.round(
              (bigTotal / total) * 100,
            )}% of spend. Routine days leave ${yen(headroom)} a week for them; they have been running ${yen(weeklyBig)}.`,
            impact: weeklyBig - headroom,
          }
        : {
            id: "big-days",
            tone: "bad",
            title: "Routine days alone are over budget",
            body: `A typical day runs ${yen(typicalDailyRate)} against ${yen(dailyBudget)} a day, before any nights out. Trim the routine first; the ${big.length} big days are on top.`,
            impact: (typicalDailyRate - dailyBudget) * 7 + weeklyBig,
          },
    );
  }

  // 3. convenience stores
  const konbini = recent.filter((e) => e.vendor && KONBINI.test(e.vendor));
  if (konbini.length >= 10) {
    const kTotal = konbini.reduce((s, e) => s + e.amount, 0);
    const byDay = new Map<string, number[]>();
    for (const e of konbini) byDay.set(e.date, [...(byDay.get(e.date) ?? []), e.amount]);
    // Keep the biggest stop each day; everything past it is the saving.
    const saving = [...byDay.values()].reduce((s, list) => s + list.reduce((a, b) => a + b, 0) - Math.max(...list), 0);
    if (saving > 2000) {
      out.push({
        id: "konbini",
        tone: "warn",
        title: `${konbini.length} convenience store stops, ${yen(kTotal)}`,
        body: `${(konbini.length / days).toFixed(1)} a day at ${yen(kTotal / konbini.length)} each. One stop a day would have saved ${yen(saving)} over 4 weeks.`,
        impact: (saving / days) * 7,
      });
    }
  }

  // 4. weekday pattern
  const wd = WEEKDAY_NAMES.map(() => ({ total: 0, n: 0 }));
  for (const [date, v] of byDate) {
    const [y, m, d] = date.split("-").map(Number);
    const i = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
    wd[i].total += v;
    wd[i].n += 1;
  }
  const avgDay = total / days;
  const peak = wd
    .map((w, i) => ({ i, avg: w.n >= 2 ? w.total / w.n : 0 }))
    .sort((a, b) => b.avg - a.avg)[0];
  if (peak && peak.avg > avgDay * 1.8) {
    out.push({
      id: "weekday",
      tone: "warn",
      title: `${WEEKDAY_NAMES[peak.i]}s average ${yen(peak.avg)}`,
      body: `${(peak.avg / avgDay).toFixed(1)}x an average day. Decide the ${WEEKDAY_NAMES[peak.i]} number before it starts.`,
      impact: peak.avg - avgDay,
    });
  }

  // 5. spend with no budget line
  const unbudgeted = ledger.budget.categories.filter((c) => c.monthly === 0);
  const ub = unbudgeted
    .map((c) => ({ label: c.label, total: recent.filter((e) => e.category === c.id).reduce((s, e) => s + e.amount, 0) }))
    .filter((c) => c.total > 0);
  if (ub.length > 0) {
    const ubTotal = ub.reduce((s, c) => s + c.total, 0);
    out.push({
      id: "unbudgeted",
      tone: "info",
      title: `No budget line for ${ub.map((c) => c.label).join(" and ")}`,
      body: `${yen(ubTotal)} in the last 4 weeks sits against ${yen(0)}. Set a realistic number in Admin so the plan counts it.`,
      impact: (ubTotal / days) * 7,
    });
  }

  const [first, ...rest] = out;
  return [first, ...rest.sort((a, b) => b.impact - a.impact)];
}

// ---------- weekly caps ----------

/**
 * A weekly limit on one slice of spend. A cap matches by category, or by the
 * convenience-store vendors, which cut across dining, snus and household.
 */
export type Cap = { id: string; label: string; weekly: number; category?: string; konbini?: boolean };

export function capMatches(cap: Cap, e: SpendEntry): boolean {
  if (cap.konbini) return !!e.vendor && KONBINI.test(e.vendor);
  return e.category === cap.category;
}

/** Spend against a cap between two ISO dates, inclusive. One-offs are not a habit, so they never count. */
export function capSpend(cap: Cap, spend: SpendEntry[], from: string, to: string): number {
  return spend.filter((e) => e.date >= from && e.date <= to && !e.oneOff && capMatches(cap, e)).reduce((s, e) => s + e.amount, 0);
}

/**
 * Starting caps: the last four weeks' weekly average, cut by a quarter and
 * rounded to ¥500. A starting point to be edited, not a verdict.
 */
export function defaultCaps(ledger: Ledger, today = todayISO()): Cap[] {
  const from = addDays(today, -27);
  const start = (cap: Omit<Cap, "weekly">): Cap => {
    const avg = capSpend({ ...cap, weekly: 0 }, ledger.spend, from, today) / 4;
    return { ...cap, weekly: Math.max(500, Math.round((avg * 0.75) / 500) * 500) };
  };
  return [
    start({ id: "alcohol", label: "Alcohol", category: "alcohol" }),
    start({ id: "konbini", label: "Convenience stores", konbini: true }),
  ];
}

/** Season-end balance if every remaining day ran at `weekly` a week instead of the typical day. */
export function endingBalanceAt(projection: SeasonProjection, weekly: number): number {
  return projection.projectedEndingBalance + (projection.basis.typicalDailyRate - weekly / 7) * projection.daysRemaining;
}
