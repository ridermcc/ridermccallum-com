// ===========================================================
//  INSIGHTS VIEW
// ===========================================================
function renderInsights() {
  const el = document.getElementById('insights-content');
  const all = workouts();
  if (!all.length) {
    el.innerHTML = `<div class="empty"><div class="big">No data yet</div>Insights light up after the first few workouts are logged.</div>`;
    return;
  }
  // last 4 weeks
  const cutoff = addDays(new Date(), -28);
  const recent = all.filter(w => parseDate(w.date) >= cutoff);
  const totalMin = recent.reduce((a,b) => a + effectiveDuration(b), 0);
  const sessions = recent.length;
  const avgRpe = (() => {
    const rs = recent.filter(w => w.rpe);
    return rs.length ? (rs.reduce((a,b) => a + Number(b.rpe), 0) / rs.length).toFixed(1) : '—';
  })();
  // by type
  const byType = {};
  TYPE_ORDER.forEach(t => byType[t] = 0);
  recent.forEach(w => byType[w.type] = (byType[w.type]||0) + effectiveDuration(w));
  const maxMin = Math.max(1, ...Object.values(byType));

  // season to date (all logged workouts, no window)
  const seasonMin = all.reduce((a,b) => a + effectiveDuration(b), 0);
  const seasonSessions = all.length;
  const seasonByType = {};
  TYPE_ORDER.forEach(t => seasonByType[t] = 0);
  all.forEach(w => seasonByType[w.type] = (seasonByType[w.type]||0) + effectiveDuration(w));
  const seasonMaxMin = Math.max(1, ...Object.values(seasonByType));

  el.innerHTML = `
    <div class="stat-row">
      <div class="stat-card"><div class="label">Sessions</div><div class="value">${sessions}</div><div class="sub">last 28 days</div></div>
      <div class="stat-card"><div class="label">Total time</div><div class="value">${(totalMin/60).toFixed(1)}h</div><div class="sub">${totalMin} min</div></div>
      <div class="stat-card"><div class="label">Avg RPE</div><div class="value">${avgRpe}</div><div class="sub">across logged</div></div>
      <div class="stat-card"><div class="label">Per week</div><div class="value">${(sessions/4).toFixed(1)}</div><div class="sub">sessions/wk</div></div>
    </div>
    <div class="stat-card">
      <div class="label" style="margin-bottom:14px;">Volume by type · last 28 days</div>
      <div class="vol-bar-wrap">
        ${TYPE_ORDER.filter(t => byType[t]).map(t => `
          <div class="vol-row">
            <div class="label">${TYPE_LABELS[t]}</div>
            <div class="bar-track"><div class="bar-fill" style="width:${(byType[t]/maxMin)*100}%"></div></div>
            <div class="v">${byType[t]} min</div>
          </div>
        `).join('') || '<div class="empty">No data.</div>'}
      </div>
    </div>
    <div class="stat-row">
      <div class="stat-card"><div class="label">Sessions</div><div class="value">${seasonSessions}</div><div class="sub">season to date</div></div>
      <div class="stat-card"><div class="label">Total time</div><div class="value">${(seasonMin/60).toFixed(1)}h</div><div class="sub">${seasonMin} min · season to date</div></div>
    </div>
    <div class="stat-card">
      <div class="label" style="margin-bottom:14px;">Volume by type · season to date</div>
      <div class="vol-bar-wrap">
        ${TYPE_ORDER.filter(t => seasonByType[t]).map(t => `
          <div class="vol-row">
            <div class="label">${TYPE_LABELS[t]}</div>
            <div class="bar-track"><div class="bar-fill" style="width:${(seasonByType[t]/seasonMaxMin)*100}%"></div></div>
            <div class="v">${seasonByType[t]} min</div>
          </div>
        `).join('') || '<div class="empty">No data.</div>'}
      </div>
    </div>
  `;
}
