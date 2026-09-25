"use client";

import { useEffect, useMemo, useState } from "react";
import {
  applyOverrides,
  availableMonths,
  balanceSeries,
  buildInsights,
  buildMonthView,
  buildPlan,
  buildWeeks,
  defaultCaps,
  DISPLAY_CURRENCIES,
  fetchDisplayRates,
  hasOverrides,
  monthKey,
  planProgress,
  projectSeason,
  setDisplayCurrency,
  todayISO,
  type BudgetOverrides,
  type Cap,
  type Category,
  type DisplayCurrency,
  type Ledger,
  type SpendEntry,
} from "@/lib/money";
import { BudgetPlan } from "./BudgetPlan";
import { SpendProjection } from "./SpendProjection";
import { BudgetAdmin } from "./BudgetAdmin";
import { Entries } from "./Entries";
import { NowTab } from "./NowTab";
import { QuickAdd } from "./QuickAdd";
import { TrendsTab, type Period } from "./TrendsTab";

const OVERRIDES_KEY = "money:budget-overrides";

// Section notes explain how to read a chart. They open on tap so the page
// leads with numbers.
function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  const [showNote, setShowNote] = useState(false);
  return (
    <section className="mt-8">
      <div className="flex items-center gap-2">
        <h2 className="text-xs tracking-wide uppercase">{title}</h2>
        {note && (
          <button
            onClick={() => setShowNote((v) => !v)}
            aria-expanded={showNote}
            aria-label={`About ${title}`}
            className="-my-2 flex h-8 w-8 items-center justify-center"
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border text-[0.6rem] ${
                showNote ? "border-foreground text-foreground" : "border-border text-muted"
              }`}
            >
              ?
            </span>
          </button>
        )}
      </div>
      {note && showNote && <p className="mt-1 text-[0.72rem] leading-relaxed text-muted">{note}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

const TABS = [
  { id: "now", label: "Now" },
  { id: "trends", label: "Trends" },
  { id: "ledger", label: "Ledger" },
] as const;
// Settings is reached from the gear, not the tab bar: it is set-and-forget.
type Tab = (typeof TABS)[number]["id"] | "settings";
const TAB_IDS: Tab[] = ["now", "trends", "ledger", "settings"];

const PENDING_KEY = "money:pending";
const CAPS_KEY = "money:caps";

/** Read a JSON value from this device's storage, falling back when it is missing or unreadable. */
function stored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function persist(key: string, value: unknown) {
  try {
    if (value === null || (Array.isArray(value) && value.length === 0)) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private windows and blocked site data: changes still apply this session.
  }
}

export function MoneyDashboard({ ledger, onLock }: { ledger: Ledger; onLock: () => void }) {
  const today = todayISO();

  // Budget edits live in this browser as a patch over the published ledger, so
  // the numbers can be changed here without a rebuild and without ever losing
  // the figures that shipped.
  // Read on the first render, not in an effect: this component only ever mounts
  // after the passphrase gate has unlocked, so there is no server render to
  // mismatch against.
  const [overrides, setOverrides] = useState<BudgetOverrides>(() => stored<BudgetOverrides>(OVERRIDES_KEY, {}));
  useEffect(() => persist(OVERRIDES_KEY, hasOverrides(overrides) ? overrides : null), [overrides]);

  // Entries added on this phone. They count everywhere at once and drop off by
  // id once the published ledger carries them.
  const [pendingAll, setPending] = useState<SpendEntry[]>(() => stored<SpendEntry[]>(PENDING_KEY, []));
  const pending = useMemo(() => {
    const published = new Set(ledger.spend.map((e) => e.id));
    return pendingAll.filter((e) => !published.has(e.id));
  }, [pendingAll, ledger]);
  useEffect(() => persist(PENDING_KEY, pending), [pending]);

  const working = useMemo<Ledger>(
    () => ({
      ...ledger,
      budget: applyOverrides(ledger.budget, overrides),
      spend: [...ledger.spend, ...pending].sort((a, b) => (a.date === b.date ? a.id.localeCompare(b.id) : a.date.localeCompare(b.date))),
    }),
    [ledger, overrides, pending]
  );

  // Caps are this device's choice. Null means "use the defaults", which follow
  // the last four weeks until the first edit pins them.
  const [capsSaved, setCaps] = useState<Cap[] | null>(() => stored<Cap[] | null>(CAPS_KEY, null));
  useEffect(() => persist(CAPS_KEY, capsSaved), [capsSaved]);
  const caps = useMemo(() => capsSaved ?? defaultCaps(working, today), [capsSaved, working, today]);

  const months = useMemo(() => availableMonths(working, today), [working, today]);
  const [selected, setSelected] = useState(() =>
    availableMonths(ledger, today).includes(monthKey(today)) ? monthKey(today) : availableMonths(ledger, today)[0]
  );

  const view = useMemo(() => buildMonthView(working, selected, today), [working, selected, today]);
  const balance = useMemo(() => balanceSeries(working.budget), [working]);
  const plan = useMemo(() => buildPlan(working.budget), [working]);
  const progress = useMemo(() => planProgress(working, today), [working, today]);
  const projection = useMemo(() => projectSeason(working, today), [working, today]);

  // The tab rides in the URL hash so a refresh lands back on it.
  const [tab, setTabState] = useState<Tab>(() => {
    const h = window.location.hash.slice(1) as Tab;
    return TAB_IDS.includes(h) ? h : "now";
  });
  const setTab = (t: Tab) => {
    setTabState(t);
    history.replaceState(null, "", `#${t}`);
    window.scrollTo({ top: 0 });
  };
  const [period, setPeriod] = useState<Period>("week");

  // The site nav is sticky too, so the tab bar pins just beneath it.
  const [navOffset, setNavOffset] = useState(0);
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".site-nav");
    if (!nav) return;
    const ro = new ResizeObserver(() => setNavOffset(nav.offsetHeight));
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  // View-only currency. Rates load once on unlock; until they arrive (or if the
  // fetch fails) the page stays in yen.
  const [currency, setCurrency] = useState<DisplayCurrency>("JPY");
  const [fx, setFx] = useState<{ date: string; rates: Record<string, number> } | null>(null);
  const [fxError, setFxError] = useState(false);
  useEffect(() => {
    fetchDisplayRates().then(setFx, () => setFxError(true));
  }, []);
  // Set during render so every child formats with the current choice.
  setDisplayCurrency(fx && currency !== "JPY" ? currency : "JPY", fx && currency !== "JPY" ? fx.rates[currency] : 1);
  const converted = fx !== null && currency !== "JPY";

  const weeks = useMemo(() => buildWeeks(working, today, projection.basis.typicalDailyRate), [working, today, projection]);
  // Insight copy is formatted text, so it rebuilds when the display currency changes.
  const insights = useMemo(
    () => buildInsights(working, weeks, projection.basis.typicalDailyRate, today),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [working, weeks, projection, today, currency, fx],
  );

  const budget = working.budget;
  const edited = hasOverrides(overrides);
  const rate = budget.meta.fx.CAD_JPY;
  const categoryLabels = Object.fromEntries(budget.categories.map((c) => [c.id, c.label]));
  const idx = months.indexOf(selected);

  return (
    <div className="pb-16">
      {/* ---- header ---- */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg">Money</h1>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex gap-1" role="group" aria-label="Display currency">
            {DISPLAY_CURRENCIES.map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                disabled={c !== "JPY" && !fx}
                aria-pressed={currency === c}
                className={`rounded border px-1.5 py-1 disabled:opacity-30 ${currency === c ? "border-foreground" : "border-border text-muted"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            onClick={() => setTab(tab === "settings" ? "now" : "settings")}
            aria-label="Settings"
            aria-pressed={tab === "settings"}
            className={`flex h-8 w-8 items-center justify-center rounded border text-base ${tab === "settings" ? "border-foreground" : "border-border text-muted"}`}
          >
            ⚙
          </button>
          <button onClick={onLock} className="text-xs text-muted underline decoration-[var(--ice-rest)] hover:decoration-[var(--ice-hover)]">
            lock
          </button>
        </div>
      </div>
      {converted && (
        <p className="mt-1 text-[0.7rem] text-muted">
          In {currency} at 1 {currency} = ¥{(1 / fx.rates[currency]).toFixed(2)} (ECB, {fx.date}). Ledger stays in yen.
        </p>
      )}
      {fxError && <p className="mt-1 text-[0.7rem] text-muted">Live rates unavailable. Showing yen.</p>}
      {edited && (
        <p className="mt-2 rounded border px-2 py-1 text-[0.7rem]" style={{ borderColor: "var(--yellow)", color: "var(--yellow)" }}>
          Showing your edited budget, not the published one. Reset it under the gear.
        </p>
      )}

      {/* ---- tabs ---- */}
      <nav
        className="sticky z-40 -mx-4 mt-3 flex border-b border-border bg-background px-4 text-sm"
        style={{ top: navOffset }}
        aria-label="Money sections"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
            className={`-mb-px flex-1 border-b-2 py-3 ${tab === t.id ? "border-foreground text-foreground" : "border-transparent text-muted"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "now" && (
        <NowTab
          weeks={weeks}
          insights={insights}
          caps={caps}
          spend={working.spend}
          today={today}
          typicalDailyRate={projection.basis.typicalDailyRate}
          onEditCaps={() => setTab("settings")}
          onSeeWeeks={() => {
            setPeriod("week");
            setTab("trends");
          }}
        />
      )}

      {tab === "trends" && (
        <TrendsTab
          period={period}
          setPeriod={setPeriod}
          weeks={weeks}
          view={view}
          monthNav={{
            prev: idx < months.length - 1 ? () => setSelected(months[idx + 1]) : undefined,
            next: idx > 0 ? () => setSelected(months[idx - 1]) : undefined,
          }}
          projection={projection}
          plan={plan}
          balance={balance}
          categoryLabels={categoryLabels}
        />
      )}

      {tab === "ledger" && (
        <>
          <QuickAdd
            spend={working.spend}
            pending={pending}
            categories={budget.categories}
            today={today}
            onAdd={(e) => setPending((p) => [...p, e])}
            onRemove={(id) => setPending((p) => p.filter((e) => e.id !== id))}
            onClear={() => setPending([])}
          />
          <div className="mt-6">
            <Entries entries={working.spend} categoryLabels={categoryLabels} />
          </div>
        </>
      )}

      {tab === "settings" && (
        <>
          <Section title="Weekly caps" note="Limits you set for this device. Spend against them shows on Now; one-offs never count.">
            <CapsEditor caps={caps} custom={capsSaved !== null} categories={budget.categories} onChange={setCaps} />
          </Section>

          <Section
            title="The whole plan"
            note={`${plan.months} salary months, ${budget.period.start} to the last paycheque. Every figure is editable in Budget admin below.`}
          >
            <BudgetPlan budget={budget} plan={plan} progress={progress} rate={rate} />
          </Section>

          <Section title="Season projection" note="A typical day carried over the rest of the plan, with big days shown as a bracket.">
            <SpendProjection projection={projection} rate={rate} />
          </Section>

          {budget.reconcile.length > 0 && (
            <Section title="Needs your call" note="Contradictions carried over from the spreadsheet. Nothing here was guessed at.">
              <div className="flex flex-col gap-3">
                {budget.reconcile.map((r) => (
                  <details key={r.id} className="rounded border border-border p-3">
                    <summary className="cursor-pointer text-xs">
                      <span
                        className="mr-2 font-bold"
                        style={{ color: r.severity === "high" ? "var(--red)" : r.severity === "medium" ? "var(--yellow)" : "var(--muted)" }}
                      >
                        {r.severity}
                      </span>
                      {r.title}
                    </summary>
                    <p className="mt-2 text-[0.72rem] leading-relaxed text-muted">{r.detail}</p>
                    <p className="mt-2 text-[0.72rem] leading-relaxed">{r.asks}</p>
                  </details>
                ))}
              </div>
            </Section>
          )}

          <Section title="Budget admin" note="Change any number and the whole page recalculates. Edits stay on this device.">
            <BudgetAdmin published={ledger.budget} working={budget} overrides={overrides} setOverrides={setOverrides} />
          </Section>
        </>
      )}

      <p className="mt-10 text-center text-[0.65rem] text-muted">
        Built {new Date(ledger.builtAt).toLocaleString("en-US")} · budget updated {budget.updated}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- caps editor */

function CapsEditor({
  caps,
  custom,
  categories,
  onChange,
}: {
  caps: Cap[];
  custom: boolean;
  categories: Category[];
  onChange: (caps: Cap[] | null) => void;
}) {
  const unused = categories.filter((c) => !caps.some((cap) => cap.category === c.id));
  const set = (id: string, weekly: number) => onChange(caps.map((c) => (c.id === id ? { ...c, weekly } : c)));

  return (
    <div className="flex flex-col gap-2 text-xs">
      {caps.map((c) => (
        <div key={c.id} className="flex items-center gap-2">
          <span className="flex-1">{c.label}</span>
          <span className="text-muted">¥</span>
          <input
            inputMode="numeric"
            value={c.weekly}
            onChange={(e) => set(c.id, Number(e.target.value.replace(/[^\d]/g, "")) || 0)}
            className="w-24 rounded border border-border bg-transparent px-2 py-1.5 text-right tabular-nums outline-none focus:border-[var(--ice-hover)]"
            aria-label={`${c.label} weekly cap in yen`}
          />
          <span className="text-muted">/wk</span>
          <button onClick={() => onChange(caps.filter((x) => x.id !== c.id))} className="px-2 py-1 text-muted" aria-label={`Remove ${c.label} cap`}>
            ✕
          </button>
        </div>
      ))}
      {unused.length > 0 && (
        <select
          value=""
          onChange={(e) => {
            const cat = categories.find((c) => c.id === e.target.value);
            if (cat) onChange([...caps, { id: cat.id, label: cat.label, category: cat.id, weekly: 5000 }]);
          }}
          className="mt-1 rounded border border-border bg-transparent px-2 py-2 text-muted"
          aria-label="Add a cap"
        >
          <option value="">+ Add a cap for a category</option>
          {unused.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      )}
      <p className="text-[0.7rem] text-muted">
        {custom ? (
          <button onClick={() => onChange(null)} className="underline decoration-[var(--ice-rest)]">
            Reset to suggested caps
          </button>
        ) : (
          "Suggested: your last four weeks, cut by a quarter. Edit any number to set your own."
        )}
      </p>
    </div>
  );
}
