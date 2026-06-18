// ===========================================================
//  ALL VIEW
// ===========================================================
let activeFilter = 'all';
let searchTerm = '';
function renderAll() {
  // chips
  const chipsEl = document.getElementById('filter-chips');
  const counts = workouts().reduce((acc,w) => { acc[w.type] = (acc[w.type]||0) + 1; return acc; }, {});
  const chips = [{ key: 'all', label: `all (${workouts().length})` }]
    .concat(TYPE_ORDER.filter(t => counts[t]).map(t => ({ key: t, label: `${TYPE_LABELS[t]} (${counts[t]})` })));
  chipsEl.innerHTML = chips.map(c =>
    `<span class="chip ${c.key===activeFilter?'active':''}" onclick="setFilter('${c.key}')">${c.label}</span>`
  ).join('');

  const list = document.getElementById('all-list');
  let items = workouts().sort((a,b) => b.date.localeCompare(a.date));
  if (activeFilter !== 'all') items = items.filter(w => w.type === activeFilter);
  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    items = items.filter(w => (w.title||'').toLowerCase().includes(q) || (w.notes||'').toLowerCase().includes(q));
  }

  if (!items.length) {
    list.innerHTML = `<div class="empty"><div class="big">No workouts yet</div>Tell Claude what you did today and they'll log it here.<div class="hint">e.g. "Did 75 min lower body — 4x5 squats at 245, 3x8 RDLs at 185, RPE 8."</div></div>`;
    return;
  }

  // group by month
  const groups = {};
  items.forEach(w => {
    const d = parseDate(w.date);
    const key = `${d.getFullYear()}-${pad(d.getMonth()+1)}`;
    if (!groups[key]) groups[key] = { date: d, items: [] };
    groups[key].items.push(w);
  });

  list.innerHTML = Object.entries(groups).map(([_, g]) => `
    <div class="month-section">
      <div class="month-header">${fmtMonthYear(g.date)}</div>
      ${g.items.map(w => `
        <div class="list-row" onclick="openWorkout('${w.id}')">
          <div class="date">${fmtMonthDay(w.date)}</div>
          <div class="type-cell">${TYPE_LABELS[w.type] || w.type}</div>
          <div class="title-cell">${escapeHtml(w.title || 'Untitled')}${w.notes ? `<div class="sub">${escapeHtml(w.notes.slice(0,80))}${w.notes.length>80?'…':''}</div>` : ''}</div>
          <div class="duration-cell">${w.duration||'—'} ${w.duration?'min':''}${w.rpe?` · RPE ${w.rpe}`:''}</div>
        </div>
      `).join('')}
    </div>`).join('');
}
window.setFilter = function(k) { activeFilter = k; renderAll(); };
document.getElementById('search-all').addEventListener('input', (e) => { searchTerm = e.target.value; renderAll(); });
