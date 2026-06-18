// ===========================================================
//  PLAN VIEW (macrocycle roadmap + lift mesocycle)
// ===========================================================
let selectedPlanWeek = null;

// Which schedule week contains today (exact date match), else null.
function currentScheduleWeek() {
  const today = todayStr();
  const weeks = DATA.schedule?.weeks || [];
  for (const w of weeks) { if (w.days && Object.prototype.hasOwnProperty.call(w.days, today)) return w.week; }
  return null;
}

// The lift-plan week (lift-program.js uses its own Wk8–16 numbering) for today, via the
// schedule week's liftPlanWeek link. null before the mesocycle starts. Used by the Plan tab
// so "now" tracks by date, not by raw week number (schedule weeks ≠ lift-plan weeks).
function currentLiftPlanWeek() {
  const today = todayStr();
  const weeks = DATA.schedule?.weeks || [];
  for (const w of weeks) { if (w.days && Object.prototype.hasOwnProperty.call(w.days, today)) return w.liftPlanWeek ?? null; }
  return null;
}

function macroTag(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('overreach') || n.includes('accumulation')) return 'accumulate';
  if (n.includes('deload') || n.includes('reset')) return 'deload';
  if (n.includes('transmutation') || n.includes('power')) return 'transmute';
  if (n.includes('taper') || n.includes('camp')) return 'taper';
  if (n.includes('maintenance') || n.includes('in-season')) return 'maintain';
  return '';
}

function renderPlan() {
  const el = document.getElementById('plan-content');
  const lp = DATA.liftProgram;
  if (!lp || !(lp.weeks || []).length) {
    el.innerHTML = `<div class="empty"><div class="big">No lift plan loaded</div>Ask Claude to build the mesocycle.</div>`;
    return;
  }
  const today = todayStr();
  const curWk = currentLiftPlanWeek();   // lift-plan week number for today (8–16), or null pre-mesocycle

  // default selected week: current if it's in the lift plan, else next upcoming, else first
  if (selectedPlanWeek == null) {
    const nums = lp.weeks.map(w => w.week);
    if (curWk && nums.includes(curWk)) selectedPlanWeek = curWk;
    else selectedPlanWeek = nums.find(n => curWk == null || n >= curWk) || nums[0];
  }

  document.getElementById('plan-meta').innerHTML =
    `<span style="font-size:12px;color:var(--text-2);">${escapeHtml(lp.name)}</span>`;

  // ---- macrocycle roadmap (from schedule phases) ----
  const phases = DATA.schedule?.phases || [];
  const macroHTML = phases.map(p => {
    const state = (p.start && today < p.start) ? 'upcoming' : (p.end && today > p.end) ? 'done' : 'now';
    const tag = macroTag(p.name);
    return `<div class="macro-seg ${state} ${tag ? 'tag-' + tag : ''}">
      <div class="ph">${escapeHtml(p.name)}</div>
      <div class="wk">${escapeHtml(p.dates || ('Weeks ' + (p.weeks || '')))}</div>
      ${state === 'now' ? '<span class="nowtag">you are here</span>' : ''}
    </div>`;
  }).join('');

  // ---- fitness-fatigue explainer ----
  const ff = lp.fitnessFatigue;
  const ffHTML = ff ? `
    <div class="ff-card">
      <div class="ff-head">${escapeHtml(ff.headline || 'Fitness − Fatigue')}</div>
      <ul>${(ff.points || []).map(pt => `<li>${escapeHtml(pt)}</li>`).join('')}</ul>
    </div>` : '';

  // ---- week selector pills ----
  const pillsHTML = lp.weeks.map(w => {
    const isActive = w.week === selectedPlanWeek;
    const isNow = w.week === curWk;
    return `<button class="week-pill ${isActive ? 'active' : ''} ${isNow ? 'now-week' : ''}" data-plan-week="${w.week}">
      <span class="wp-wk">W${w.week}${isNow ? ' • now' : ''}</span>
      <span class="wp-dt">${escapeHtml(w.dates || '')}</span>
    </button>`;
  }).join('');

  // ---- selected week detail ----
  const wk = lp.weeks.find(w => w.week === selectedPlanWeek) || lp.weeks[0];
  const dayOrder = ['D1', 'D2', 'D3'];
  const daysHTML = dayOrder.filter(d => wk.days && wk.days[d]).map(dKey => {
    const d = wk.days[dKey];
    const rows = (d.exercises || []).map(ex => `
      <div class="lift-row">
        <div class="lr-main">
          <span class="lr-name">${escapeHtml(ex.name)}</span>
          <span class="lr-scheme">${escapeHtml(ex.scheme || '')}</span>
        </div>
        ${(ex.load || ex.rest) ? `<div class="lr-spec">${escapeHtml(ex.load || '')}${ex.load && ex.rest ? '  ·  rest ' : (ex.rest ? 'rest ' : '')}${escapeHtml(ex.rest || '')}</div>` : ''}
        ${ex.cue ? `<div class="lr-cue">${escapeHtml(ex.cue)}</div>` : ''}
      </div>`).join('');
    return `
      <div class="lift-day-card">
        <div class="ld-head"><span class="ld-tag">${escapeHtml(dKey)}</span><span class="ld-focus">${escapeHtml(d.focus || '')}</span></div>
        ${d.intent ? `<div class="ld-intent">${escapeHtml(d.intent)}</div>` : ''}
        ${d.note ? `<div class="ld-note">${escapeHtml(d.note)}</div>` : ''}
        ${rows || '<div class="ld-empty">Programmed rest — no lifting this day.</div>'}
      </div>`;
  }).join('');

  const guidelinesHTML = (wk.guidelines || []).length ? `
    <div class="block-guidelines">
      <div class="bg-label">Guidelines this week</div>
      <ul>${wk.guidelines.map(g => `<li>${escapeHtml(g)}</li>`).join('')}</ul>
    </div>` : '';

  // ---- in-season monitoring (reference) ----
  const monHTML = (lp.monitoring || []).length ? `
    <div class="plan-section-label">In-season self-monitoring &amp; auto-regulation</div>
    <div class="block-guidelines">
      <ul>${lp.monitoring.map(m => `<li>${escapeHtml(m)}</li>`).join('')}</ul>
    </div>` : '';

  el.innerHTML = `
    ${lp.model ? `<div class="plan-intro">${escapeHtml(lp.model)}</div>` : ''}

    <div class="plan-section-label">Where you are &amp; where you're going</div>
    <div class="macro-track">${macroHTML}</div>

    <div class="plan-section-label">The model</div>
    ${ffHTML}

    <div class="plan-section-label">Lift mesocycle — pick a week</div>
    <div class="week-pills">${pillsHTML}</div>

    <div class="block-head">
      <span class="bh-name">Week ${wk.week} · ${escapeHtml(wk.block || '')}</span>
      <span class="bh-dates">${escapeHtml(wk.dates || '')}</span>
    </div>
    ${wk.milestone ? `<div class="block-milestone">★ ${escapeHtml(wk.milestone)}</div>` : ''}
    ${wk.goal ? `<div class="block-goal">${escapeHtml(wk.goal)}</div>` : ''}
    ${guidelinesHTML}
    ${daysHTML}
    ${monHTML}
  `;

  // wire week pills
  el.querySelectorAll('.week-pill').forEach(b => {
    b.addEventListener('click', () => { selectedPlanWeek = Number(b.dataset.planWeek); renderPlan(); });
  });
}
window.renderPlan = renderPlan;
