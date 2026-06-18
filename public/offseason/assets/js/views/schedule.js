// ===========================================================
//  SCHEDULE VIEW
// ===========================================================
function renderSchedule() {
  const el = document.getElementById('schedule-content');
  const sched = DATA.schedule || {};
  const phases = sched.phases || [];
  const weeks = sched.weeks || [];
  const today = todayStr();
  const prog = offseasonProgress();

  document.getElementById('sched-meta').innerHTML = prog
    ? `<span style="font-size:12px;color:var(--text-2);">Week <strong style="color:var(--text);">${prog.weekN}</strong> / ${prog.totalWeeks} · ${prog.pct}% complete</span>`
    : '';

  // Phases overview
  const phasesHTML = phases.map(p => {
    const isActive = prog && p.weeks && (() => {
      const parts = p.weeks.split('–').map(s => parseInt(s));
      return prog.weekN >= parts[0] && prog.weekN <= (parts[1] || parts[0]);
    })();
    return `
      <div class="sched-phase ${isActive ? 'active-phase' : ''}">
        <div class="phase-name">${escapeHtml(p.name)} <span style="font-size:11px;color:var(--text-3);font-weight:400;">Weeks ${escapeHtml(p.weeks)} · ${escapeHtml(p.dates || '')}</span>${isActive ? ' <span style="font-size:9px;background:var(--text);color:#000;padding:2px 6px;border-radius:3px;letter-spacing:1px;text-transform:uppercase;font-weight:700;margin-left:6px;">NOW</span>' : ''}</div>
        <div class="phase-focus">${escapeHtml(p.focus)}</div>
      </div>`;
  }).join('');

  // Weekly detail
  const weeksHTML = weeks.map(w => {
    const isCurrent = prog && prog.weekN === w.week;
    const days = w.days || {};
    const dayRows = Object.entries(days).sort(([a],[b]) => a.localeCompare(b)).map(([date, d]) => {
      const dayOfWeek = parseDate(date);
      const dayLabel = dayOfWeek ? fmtDayLabel(dayOfWeek) : '';
      const dayNum = dayOfWeek ? dayOfWeek.getDate() : '';
      const isToday = date === today;
      const isPast = date < today;
      const dayData = DATA.daily?.[date];
      const done = dayData?.workouts?.length > 0;

      let statusHTML = '';
      if (isToday) statusHTML = '<span class="status-pending">today</span>';
      else if (isPast && done) statusHTML = '<span class="status-done">✓</span>';
      else if (isPast && !done) statusHTML = '<span class="status-missed">—</span>';

      const tags = (d.planned || []).map(p => {
        const tag = p.replace(/^lift-.*/, 'lift').replace(/^plyo-.*/, 'plyo').replace(/-(upper|lower)$/, '');
        return `<span class="sched-tag ${tag}" onclick="openPlanItem('${escapeHtml(p)}')" title="Click for breakdown">${escapeHtml(p)}</span>`;
      }).join(' ');

      return `<div class="sched-day-row" style="${isToday ? 'background:var(--bg-2);' : ''}">
        <div class="day-label"><strong>${dayLabel}</strong> ${dayNum}</div>
        <div class="day-plan">${tags}${d.notes ? `<span style="font-size:11px;color:var(--text-3);margin-left:4px;">${escapeHtml(d.notes)}</span>` : ''}</div>
        <div class="day-status">${statusHTML}</div>
      </div>`;
    }).join('');

    return `
      <div class="program-section">
        <div class="program-header">
          <span class="name">Week ${w.week}${isCurrent ? ' <span style="font-size:9px;background:var(--text);color:#000;padding:2px 6px;border-radius:3px;letter-spacing:1px;text-transform:uppercase;font-weight:700;margin-left:6px;">CURRENT</span>' : ''}</span>
          <span class="meta">${escapeHtml(w.dates || '')} · ${escapeHtml(w.phase || '')}</span>
        </div>
        ${w.focus ? `<div class="program-note">${escapeHtml(w.focus)}</div>` : ''}
        ${dayRows}
      </div>`;
  }).join('');

  el.innerHTML = `
    <div style="margin-bottom:28px;">${phasesHTML}</div>
    ${weeksHTML || '<div class="empty"><div class="big">Schedule builds as you go</div>Claude adds each week\'s plan as the off-season progresses. Week 1 is ready.</div>'}
  `;
}
