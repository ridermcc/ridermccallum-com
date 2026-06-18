// ===========================================================
//  MODAL — workout details
// ===========================================================
function openWorkout(id) {
  const w = workouts().find(x => x.id === id);
  if (!w) return;
  const m = document.getElementById('modal-body');
  const d = w.details || {};

  const infoCells = [];
  infoCells.push({ l: 'Date', v: fmtFullDate(w.date) });
  if (w.time) infoCells.push({ l: 'Time', v: w.time });
  if (w.duration) infoCells.push({ l: 'Duration', v: `${w.duration} min` });
  if (w.rpe) infoCells.push({ l: 'RPE', v: `${w.rpe}/10` });
  if (w.location) infoCells.push({ l: 'Location', v: w.location });
  if (d.distance) infoCells.push({ l: 'Distance', v: `${d.distance} ${d.unit||''}`.trim() });
  if (d.pace) infoCells.push({ l: 'Pace', v: d.pace });
  if (d.hr_avg) infoCells.push({ l: 'HR avg', v: d.hr_avg });
  if (d.hr_max) infoCells.push({ l: 'HR max', v: d.hr_max });

  m.innerHTML = `
    <div class="head">
      <div>
        <div class="type-tag">${escapeHtml(TYPE_LABELS[w.type] || w.type || '')}</div>
        <h3>${escapeHtml(w.title || 'Untitled')}</h3>
      </div>
      <button class="close" onclick="closeModal()" aria-label="Close">×</button>
    </div>
    <div class="info-grid">
      ${infoCells.map(c => `<div class="info-cell"><div class="label">${c.l}</div><div class="value">${escapeHtml(c.v)}</div></div>`).join('')}
    </div>
    ${(w.exercises && w.exercises.length) ? `
      <div class="ex-block">
        <h4>Exercises</h4>
        <div class="ex-list">
          ${w.exercises.map(ex => `
            <div class="ex-item">
              <div class="ex-name">${escapeHtml(ex.name)}</div>
              <div class="ex-sets">
                ${(ex.sets||[]).map(s => `<span class="ex-set"><strong>${s.reps||'?'}</strong>${s.weight!=null?` × ${s.weight}${s.unit||'lb'}`:''}${s.rpe?` @${s.rpe}`:''}${s.notes?` · ${escapeHtml(s.notes)}`:''}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
    ${(d.focus && d.focus.length) ? `
      <div class="ex-block">
        <h4>Focus</h4>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${d.focus.map(f => `<span class="ex-set" style="font-size:12px;padding:5px 10px;">${escapeHtml(f)}</span>`).join('')}
        </div>
      </div>
    ` : ''}
    ${w.notes ? `
      <div class="notes-block">
        <span class="label">Notes</span>
        ${escapeHtml(w.notes)}
      </div>
    ` : ''}
  `;
  document.getElementById('modal-back').classList.add('show');
}
window.openWorkout = openWorkout;
function closeModal() { document.getElementById('modal-back').classList.remove('show'); }
window.closeModal = closeModal;

// ===========================================================
//  MODAL — schedule plan-item breakdown
// ===========================================================
function openPlanItem(id) {
  const m = document.getElementById('modal-body');
  let html = '';

  if (/^lift-d[123]$/.test(id)) {
    const dayNum = id.slice(-1);
    const tpl = (DATA.liftTemplates || []).find(t => t.id === `mhockey-os-d${dayNum}`);
    if (!tpl) {
      html = headHtml('Lift', `D${dayNum} not found`) + `<p style="color:var(--text-2);">Template missing.</p>`;
    } else {
      html = `
        <div class="head">
          <div>
            <div class="type-tag">Lift · D${dayNum}</div>
            <h3>${escapeHtml(tpl.focus)}</h3>
          </div>
          <button class="close" onclick="closeModal()" aria-label="Close">×</button>
        </div>
        <div style="font-size:12px;color:var(--text-3);margin-bottom:14px;">${escapeHtml(tpl.program)} · ${escapeHtml(tpl.cycle)}</div>
        ${(tpl.sections || []).map(s => `
          <div class="ex-block">
            <h4>${escapeHtml(s.name)}</h4>
            <div class="ex-list">
              ${(s.items || []).map(it => `
                <div class="ex-item" style="cursor:pointer" onclick="openExerciseDetail('${escapeJs(it.name)}', '${escapeJs(it.prescription || '')}')" title="Click for exercise breakdown">
                  <div class="ex-name">${escapeHtml(it.name)}</div>
                  <div class="ex-sets"><span class="ex-set">${escapeHtml(it.prescription || '')}</span></div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
        ${tpl.notes ? `<div class="notes-block"><span class="label">Notes</span>${escapeHtml(tpl.notes)}</div>` : ''}
      `;
    }
  } else if (/^plyo-base-[AB]$/.test(id)) {
    const sess = DATA.schedule?.plyoSessions?.[id];
    if (!sess) {
      html = headHtml('Plyo', id) + `<p style="color:var(--text-2);">Session not found.</p>`;
    } else {
      html = `
        <div class="head">
          <div>
            <div class="type-tag">Plyo</div>
            <h3>${escapeHtml(sess.name)}</h3>
          </div>
          <button class="close" onclick="closeModal()" aria-label="Close">×</button>
        </div>
        <div style="font-size:12px;color:var(--text-3);margin-bottom:14px;">Duration: ${escapeHtml(sess.duration || '')}</div>
        ${(sess.blocks || []).map(b => `
          <div class="ex-block">
            <h4>${escapeHtml(b.name)}</h4>
            <div class="ex-list">
              ${(b.drills || []).map(d => `
                <div class="ex-item" style="cursor:pointer" onclick="openExerciseDetail('${escapeJs(d)}', '')" title="Click for exercise breakdown">
                  <div class="ex-name">${escapeHtml(d)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
        ${sess.notes ? `<div class="notes-block"><span class="label">Notes</span>${escapeHtml(sess.notes)}</div>` : ''}
      `;
    }
  } else if (id === 'mobility') {
    const lib = DATA.mobilityLibrary || {};
    html = `
      <div class="head">
        <div><div class="type-tag">Mobility</div><h3>Mobility Library</h3></div>
        <button class="close" onclick="closeModal()" aria-label="Close">×</button>
      </div>
      <div style="font-size:12px;color:var(--text-3);margin-bottom:14px;">${escapeHtml(lib.source || '')}</div>
      ${['lower','upper'].map(group => `
        <div class="ex-block">
          <h4>${group}</h4>
          <div class="ex-list">
            ${(lib[group] || []).map(l => `
              <div class="ex-item">
                <div class="ex-name"><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener" style="color:var(--text);text-decoration:none;border-bottom:1px solid var(--border);">${escapeHtml(l.name)} →</a></div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    `;
  } else if (id === 'conditioning') {
    const cp = DATA.conditioningProgram || {};
    const prog = (typeof offseasonProgress === 'function') ? offseasonProgress() : null;
    const thisWeek = prog ? (cp.weeks || []).find(w => w.week === prog.weekN) : null;
    html = `
      <div class="head">
        <div><div class="type-tag">Conditioning</div><h3>${escapeHtml(cp.name || 'Conditioning')}</h3></div>
        <button class="close" onclick="closeModal()" aria-label="Close">×</button>
      </div>
      <div style="font-size:12px;color:var(--text-3);margin-bottom:14px;">${escapeHtml(cp.source || '')}</div>
      ${thisWeek ? `
        <div class="ex-block">
          <h4>This week (W${thisWeek.week} · ${escapeHtml(thisWeek.dates)})</h4>
          <div class="ex-list">
            ${(thisWeek.sessions || []).map(s => `<div class="ex-item"><div class="ex-name">${escapeHtml(s)}</div></div>`).join('')}
          </div>
        </div>
      ` : ''}
      <div class="ex-block">
        <h4>Drill specs</h4>
        <div class="ex-list">
          ${(cp.drillSpecs || []).map(d => `
            <div class="ex-item" style="cursor:pointer" onclick="openExerciseDetail('${escapeJs(d.name)}', '${escapeJs('target ' + (d.target||'') + ' · ' + (d.intensity||'') + ' — ' + (d.description||''))}')">
              <div class="ex-name">${escapeHtml(d.name)}</div>
              <div class="ex-sets"><span class="ex-set">target ${escapeHtml(d.target || '')} · ${escapeHtml(d.intensity || '')}</span></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (id === 'skating') {
    html = headHtml('Skating', 'On-ice session') + `<p style="color:var(--text-2);line-height:1.6;">No ice booked yet. Plan to ramp up mid-summer. When you have ice time, tell Claude and it'll add specific sessions to the schedule.</p>`;
  } else if (id === 'recovery') {
    html = headHtml('Recovery', 'Active recovery') + `<p style="color:var(--text-2);line-height:1.6;">Light movement to flush soreness without adding stress: 20–40 min walk, easy bike, foam roll, sauna, light stretch. Keep HR low. Goal is recovery, not training.</p>`;
  } else if (id === 'rest') {
    html = headHtml('Rest', 'Full rest') + `<p style="color:var(--text-2);line-height:1.6;">Full off-day. No training. Sleep, eat, hydrate. Nervous system recharge.</p>`;
  } else {
    html = headHtml(id, id) + `<p style="color:var(--text-2);">No detailed breakdown yet for "${escapeHtml(id)}". Ask Claude to fill it in.</p>`;
  }

  m.innerHTML = html;
  document.getElementById('modal-back').classList.add('show');
}
window.openPlanItem = openPlanItem;

function openExerciseDetail(name, prescription) {
  if (window.event) window.event.stopPropagation();
  const m = document.getElementById('modal-body');

  // Look up cue from plyo program (drills carry coaching cues)
  let cue = '';
  for (const ph of (DATA.plyoProgram?.phases || [])) {
    const hit = (ph.drills || []).find(d => d.name === name);
    if (hit) { cue = hit.cue || ''; break; }
  }

  // Look up conditioning drill description
  let condDesc = '';
  const cd = (DATA.conditioningProgram?.drillSpecs || []).find(d => d.name === name);
  if (cd) condDesc = cd.description || '';

  m.innerHTML = `
    <div class="head">
      <div><div class="type-tag">Exercise</div><h3>${escapeHtml(name)}</h3></div>
      <button class="close" onclick="closeModal()" aria-label="Close">×</button>
    </div>
    ${prescription ? `<div class="notes-block"><span class="label">Prescription</span>${escapeHtml(prescription)}</div>` : ''}
    ${cue ? `<div class="notes-block"><span class="label">Coaching cue</span>${escapeHtml(cue)}</div>` : ''}
    ${condDesc ? `<div class="notes-block"><span class="label">How it's done</span>${escapeHtml(condDesc)}</div>` : ''}
    ${!cue && !condDesc ? `<p style="font-size:12px;color:var(--text-3);margin-top:14px;line-height:1.6;">No coaching notes stored for this lift yet. For form check, search "${escapeHtml(name)}" on YouTube — or ask Claude for a breakdown and it'll add it here.</p>` : ''}
  `;
  document.getElementById('modal-back').classList.add('show');
}
window.openExerciseDetail = openExerciseDetail;

function headHtml(tag, title) {
  return `<div class="head">
    <div><div class="type-tag">${escapeHtml(tag)}</div><h3>${escapeHtml(title)}</h3></div>
    <button class="close" onclick="closeModal()" aria-label="Close">×</button>
  </div>`;
}

function escapeJs(s) { return String(s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, ''); }
document.getElementById('modal-back').addEventListener('click', (e) => { if (e.target.id === 'modal-back') closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ===========================================================
//  RAW DATA VIEWER
// ===========================================================
document.getElementById('btn-show-data').addEventListener('click', () => {
  const m = document.getElementById('modal-body');
  m.innerHTML = `
    <div class="head">
      <div><div class="type-tag">data</div><h3>Raw JSON</h3></div>
      <button class="close" onclick="closeModal()">×</button>
    </div>
    <p style="font-size:12px;color:var(--text-2);margin-bottom:12px;">This is what Claude sees. Copy and paste back to them if you need to sync.</p>
    <pre style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:14px;font-size:11px;color:var(--text-2);overflow:auto;max-height:60vh;font-family:ui-monospace,SF Mono,monospace;line-height:1.5;">${escapeHtml(JSON.stringify(DATA, null, 2))}</pre>
    <div style="margin-top:12px;display:flex;gap:8px;">
      <button class="btn primary" onclick="navigator.clipboard.writeText(JSON.stringify(window.DATA,null,2)).then(()=>this.textContent='Copied')">Copy JSON</button>
    </div>
  `;
  document.getElementById('modal-back').classList.add('show');
});
