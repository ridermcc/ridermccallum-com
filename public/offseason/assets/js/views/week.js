// ===========================================================
//  WEEK VIEW
// ===========================================================
let weekAnchor = startOfWeek(new Date());
document.getElementById('week-prev').addEventListener('click', () => { weekAnchor = addDays(weekAnchor, -7); renderWeek(); });
document.getElementById('week-next').addEventListener('click', () => { weekAnchor = addDays(weekAnchor, 7); renderWeek(); });
document.getElementById('week-today').addEventListener('click', () => { weekAnchor = startOfWeek(new Date()); renderWeek(); });

function renderWeek() {
  const days = Array.from({length:7}, (_, i) => addDays(weekAnchor, i));
  const today = todayStr();

  document.getElementById('week-label').textContent =
    `${days[0].toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${days[6].toLocaleDateString('en-US',{month:'short',day:'numeric'})}`;

  const grid = document.getElementById('week-grid');
  grid.innerHTML = days.map(d => {
    const k = dateKey(d);
    const ws = workoutsForDate(k);
    const isToday = k === today;
    const isPast = k < today;
    const cls = ['day-col'];
    if (isToday) cls.push('today');
    else if (isPast) cls.push('past');
    return `<div class="${cls.join(' ')}">
      <div class="day-head">
        <span class="name">${fmtDayLabel(d)}</span>
        <span class="date">${d.getDate()}</span>
      </div>
      ${ws.length ? ws.map(w => workoutCardHTML(w)).join('') : '<div class="day-empty">—</div>'}
    </div>`;
  }).join('');

  // week summary
  const weekWorkouts = days.flatMap(d => workoutsForDate(dateKey(d)));
  const totalMin = weekWorkouts.reduce((a,b) => a + (Number(b.duration)||0), 0);
  document.getElementById('week-summary').innerHTML = weekWorkouts.length
    ? `<span style="font-size:12px;color:var(--text-2);"><strong style="color:var(--text);">${weekWorkouts.length}</strong> sessions · <strong style="color:var(--text);">${totalMin}</strong> min</span>`
    : '';
}

function workoutCardHTML(w) {
  return `<div class="workout-card" onclick="openWorkout('${w.id}')">
    <span class="type">${escapeHtml(TYPE_LABELS[w.type] || w.type || 'session')}</span>
    <span class="title">${escapeHtml(w.title || 'Untitled')}</span>
    <span class="meta">${w.duration ? w.duration + ' min' : ''}${w.duration && w.rpe ? ' · ' : ''}${w.rpe ? 'RPE ' + w.rpe : ''}</span>
  </div>`;
}
