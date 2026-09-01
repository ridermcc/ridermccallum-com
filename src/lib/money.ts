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
  income: {
    monthlySalaryJPY: number;
    taxRate: number;
    salaryDayOfMonth: number;
    schedule: ScheduleRow[];
  };
  obligations: Record<string, number>;
  openingBalance: { planStartJPY: number; inputsStartingBalanceCAD: number; note: string };
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

export const yen = (n: number) => `¥${Math.round(n).toLocaleString("en-US")}`;

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

export type DayActual = { day: number; date: string; total: number; byCategory: Record<string, number> };

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

  const byDay: DayActual[] = Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    const date = `${key}-${String(day).padStart(2, "0")}`;
    const dayEntries = entries.filter((e) => e.date === date);
    const byCategory: Record<string, number> = {};
    for (const e of dayEntries) byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
    return { day, date, total: dayEntries.reduce((s, e) => s + e.amount, 0), byCategory };
  });

  const spent = entries.reduce((s, e) => s + e.amount, 0);
  const monthBudget = budget.monthlyLivingBudget;
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

/** Plan balance line from the sheet, with actual overlaid once a balance anchor exists. */
export function balanceSeries(ledger: Ledger) {
  const { budget } = ledger;
  return budget.income.schedule.map((row) => ({
    date: row.date,
    label: new Date(row.date).toLocaleDateString("en-US", { month: "short" }),
    plan: row.planBalance,
    net: row.net,
  }));
}
