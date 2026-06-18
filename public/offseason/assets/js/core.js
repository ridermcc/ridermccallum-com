// ===========================================================
//  DATA ACCESS
// ===========================================================
const DATA = window.DATA || { meta:{}, phases:[], workouts:[] };
const TYPE_ORDER = ["off-ice","on-ice","plyos","cardio","stretching","skill","recovery"];
const TYPE_LABELS = {
  "off-ice": "strength training",
  "on-ice": "on-ice",
  "plyos": "plyos",
  "cardio": "conditioning",
  "stretching": "stretching",
  "skill": "skill",
  "recovery": "recovery"
};

// Per-type colors for the session timeline (hues borrowed from the macrocycle tags).
const TYPE_COLORS = {
  "off-ice":    "#d65a4e",  // strength — red
  "on-ice":     "#4a7fb0",  // skate — blue
  "plyos":      "#d97a3a",  // plyos — orange
  "cardio":     "#c9a227",  // conditioning — gold
  "stretching": "#5aa873",  // mobility — green
  "skill":      "#9b6bcc",  // skill — purple
  "recovery":   "#777"      // recovery — grey
};

// Insights volume assumptions when a session has no logged duration:
// lifts → 60 min, mobility/stretching/recovery → 50 min. Anything else counts only if a duration was logged.
function effectiveDuration(w) {
  const d = Number(w.duration);
  if (d > 0) return d;
  const t = w.type;
  const isLift = t === 'off-ice' && (/^lift:/i.test(w.title || '') || /^mhockey-os-d/.test(w.templateId || ''));
  if (isLift) return 60;
  if (t === 'stretching' || t === 'recovery') return 50;
  return 0;
}

const workouts = () => [...(DATA.workouts || [])];

// ===========================================================
//  HELPERS
// ===========================================================
const pad = n => String(n).padStart(2, '0');
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
};
const parseDate = s => { if (!s) return null; const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
const fmtMonthDay = s => { const d = parseDate(s); if (!d) return ''; return d.toLocaleDateString('en-US', { month:'short', day:'numeric' }); };
const fmtFullDate = s => { const d = parseDate(s); if (!d) return ''; return d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' }); };
const fmtMonthYear = d => d.toLocaleDateString('en-US', { month:'long', year:'numeric' });
const fmtDayLabel = d => d.toLocaleDateString('en-US', { weekday:'short' });

function startOfWeek(d) {
  // Monday as start of week
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const diff = (day === 0 ? -6 : 1 - day);
  const x = new Date(d); x.setDate(d.getDate() + diff); x.setHours(0,0,0,0);
  return x;
}
function addDays(d, n) { const x = new Date(d); x.setDate(d.getDate() + n); return x; }
function dateKey(d) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function escapeHtml(s) { return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function workoutsForDate(dateStr) {
  return workouts().filter(w => w.date === dateStr).sort((a,b) => (a.time||'').localeCompare(b.time||''));
}

function currentPhase() {
  const today = todayStr();
  const found = (DATA.phases || []).find(p => (!p.start || p.start <= today) && (!p.end || today <= p.end));
  return found?.name || DATA.meta?.currentPhase || '';
}

function offseasonProgress() {
  const s = DATA.meta?.offseasonStart, e = DATA.meta?.offseasonEnd;
  if (!s || !e) return null;
  const start = parseDate(s), end = parseDate(e), now = new Date();
  const totalDays = Math.ceil((end - start) / 864e5) + 1;
  const totalWeeks = Math.ceil((end - start) / (7 * 864e5));
  if (now < start) return { pct: 0, weekN: 0, dayN: 0, totalWeeks, totalDays };
  if (now > end)   return { pct: 100, weekN: totalWeeks, dayN: totalDays, totalWeeks, totalDays };
  const total = end - start;
  const elapsed = now - start;
  return {
    pct: Math.round((elapsed / total) * 100),
    weekN: Math.floor(elapsed / (7 * 864e5)) + 1,
    dayN: Math.floor(elapsed / 864e5) + 1,
    totalWeeks,
    totalDays
  };
}

// ===========================================================
//  HEADER
// ===========================================================
function renderHeader() {
  document.getElementById('who-name').textContent = DATA.meta?.name ? '· ' + DATA.meta.name : '';
  const meta = document.getElementById('meta-strip');
  const items = [];
  const phase = currentPhase();
  if (phase) items.push({ label: 'Phase', value: phase });
  const prog = offseasonProgress();
  if (prog) items.push({ label: 'Offseason', value: `Week ${prog.weekN} / ${prog.totalWeeks}` });
  items.push({ label: 'Today', value: new Date().toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' }) });
  meta.innerHTML = items.map(i =>
    `<div class="item"><span class="label">${i.label}</span><span class="value">${escapeHtml(i.value)}</span></div>`
  ).join('');
  document.getElementById('updated-hint').textContent = DATA.updated ? `data updated ${DATA.updated} · talk to Claude to log a workout` : 'talk to Claude to log a workout';
}
