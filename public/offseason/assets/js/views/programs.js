// ===========================================================
//  PROGRAMS VIEW
// ===========================================================
let programSub = 'lifts';
document.querySelectorAll('#program-sub-tabs .sub-tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('#program-sub-tabs .sub-tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    programSub = t.dataset.prog;
    renderPrograms();
  });
});

function renderPrograms() {
  const el = document.getElementById('programs-content');
  if (programSub === 'lifts') el.innerHTML = renderLiftsHTML();
  else if (programSub === 'plyo') el.innerHTML = renderPlyoHTML();
  else if (programSub === 'conditioning') el.innerHTML = renderConditioningHTML();
}

function renderLiftsHTML() {
  const tpls = DATA.liftTemplates || [];
  if (!tpls.length) return `<div class="empty"><div class="big">No lift templates yet</div>Tell Claude what your lift days look like and they'll be added here.</div>`;
  // group by program + cycle
  const groups = {};
  tpls.forEach(t => {
    const k = `${t.program} · ${t.cycle}`;
    if (!groups[k]) groups[k] = [];
    groups[k].push(t);
  });
  return Object.entries(groups).map(([heading, items]) => `
    <div class="program-section">
      <div class="program-header">
        <span class="name">${escapeHtml(heading)}</span>
        <span class="meta">${items.length} day${items.length===1?'':'s'}</span>
      </div>
      <div class="lift-template-list">
        ${items.map(t => `
          <div class="lift-template">
            <div class="head">
              <div><span class="day-tag">${escapeHtml(t.day)}</span><span class="focus">${escapeHtml(t.focus || '')}</span></div>
              <span class="cycle">${escapeHtml(t.id)}</span>
            </div>
            ${(t.sections || []).length === 0
              ? `<div class="body">Awaiting transcription. Talk to Claude after a ${escapeHtml(t.day)} session and the prescribed exercises will be filled in.</div>`
              : t.sections.map(s => `
                  <div class="sec">
                    <div class="sec-name">${escapeHtml(s.name)}</div>
                    ${(s.items||[]).map(it => `
                      <div class="ex-line">
                        <span>${escapeHtml(it.name)}</span>
                        <span class="prescription">${escapeHtml(it.prescription || (it.sets ? `${it.sets} × ${it.reps||'?'}` : ''))}</span>
                      </div>
                    `).join('')}
                  </div>
                `).join('')
            }
            ${t.notes ? `<div class="body" style="margin-top:10px;font-size:11px;color:var(--text-3);">${escapeHtml(t.notes)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderPlyoHTML() {
  const p = DATA.plyoProgram;
  if (!p) return `<div class="empty">No plyo program loaded.</div>`;
  const currentPhaseIdx = computeCurrentPhaseIdx();
  return `
    <div class="program-section">
      <div class="program-header">
        <span class="name">${escapeHtml(p.name)}</span>
        <span class="meta">${escapeHtml(p.source || '')}</span>
      </div>
      ${p.notes ? `<div class="program-note">${escapeHtml(p.notes)}</div>` : ''}
      ${(p.phases || []).map((ph, i) => `
        <div class="phase-card ${i === currentPhaseIdx ? 'current' : ''}">
          <div class="head">
            <div class="name">${escapeHtml(ph.name)}${i === currentPhaseIdx ? '<span class="badge">now</span>' : ''}</div>
            <span class="weeks">Weeks ${escapeHtml(ph.weeks)}</span>
          </div>
          <div class="goal">${escapeHtml(ph.goal)}</div>
          <div class="drill-list">
            ${(ph.drills || []).map(d => `
              <div class="drill">
                <span class="n">${escapeHtml(d.name)}</span>
                <span class="p">${escapeHtml(d.prescription || '')}</span>
                <span class="c">${escapeHtml(d.cue || '')}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
      ${!DATA.meta?.plyoStartDate ? `<div class="program-note" style="margin-top:14px;">No start date set. Tell Claude when you start week 1 and the current phase will be highlighted.</div>` : ''}
    </div>
  `;
}

function computeCurrentPhaseIdx() {
  const start = DATA.meta?.plyoStartDate;
  if (!start) return -1;
  const startD = parseDate(start);
  const now = new Date();
  const week = Math.floor((now - startD) / (7 * 864e5)) + 1;
  if (week < 1) return -1;
  if (week <= 3) return 0;
  if (week <= 6) return 1;
  if (week <= 9) return 2;
  return -1;
}

function computeCurrentConditioningWeek() {
  const start = DATA.meta?.conditioningStartDate;
  if (!start) return -1;
  const startD = parseDate(start);
  const now = new Date();
  const week = Math.floor((now - startD) / (7 * 864e5)) + 1;
  return (week >= 1 && week <= 15) ? week : -1;
}

const ZONE_COLORS = ['#3f8f63', '#5aa873', '#c9a227', '#d97a3a', '#d65a4e'];

// Heart-rate zone block. Bands are %HRmax (absolute bpm from the handoff).
// If a verified morning RHR is in data, also show Karvonen (HR-reserve) bands.
function renderHRZonesHTML(hrz) {
  if (!hrz) return '';
  const rhr = hrz.restingHR;
  const karv = (pctLow, pctHigh) => {
    if (rhr == null) return '';
    const lo = Math.round((hrz.hrMax - rhr) * pctLow + rhr);
    const hi = Math.round((hrz.hrMax - rhr) * pctHigh + rhr);
    return `<div class="kv">Karvonen ${lo}–${hi}</div>`;
  };
  // Map each zone to its %HRmax fraction pair for Karvonen (50/60/70/80/90/100)
  const pcts = [[0.50,0.60],[0.60,0.70],[0.70,0.80],[0.80,0.90],[0.90,1.00]];
  return `
    <div class="program-section">
      <div class="program-header">
        <span class="name">Heart Rate Zones</span>
        <span class="meta">aerobic governance layer</span>
      </div>
      <div class="hrz-head">
        <div class="big">${hrz.hrMax}<small> HRmax</small></div>
        <div class="kv">Chronological age <b>${hrz.chronologicalAge}</b></div>
        <div class="kv">Resting HR <b>${rhr != null ? rhr + ' bpm' : '— not logged'}</b></div>
      </div>
      <div class="hrz-warn"><b>Use age 24, not Renpho "body age 20."</b> ${escapeHtml(hrz.bodyAgeWarning)}</div>
      <div class="zone-table">
        ${(hrz.zones || []).map((z, i) => `
          <div class="zone-row">
            <div class="bar" style="background:${ZONE_COLORS[i] || '#666'}"></div>
            <div class="zn">Z${z.z}<small>${escapeHtml(z.pct)}</small></div>
            <div class="zname">${escapeHtml(z.name)}<small>${escapeHtml(z.use)}</small></div>
            <div class="zbpm"><span class="b">${z.low}–${z.high}</span> <span class="pct">bpm</span>${karv(pcts[i][0], pcts[i][1])}</div>
          </div>
        `).join('')}
      </div>
      <div class="program-note" style="margin-top:12px;">${escapeHtml(hrz.karvonenNote)}${rhr == null ? ' <b style="color:var(--text-2)">Tell Claude your verified morning resting HR to add personalized Karvonen bands here.</b>' : ''}</div>
    </div>
  `;
}

function renderConditioningHTML() {
  const p = DATA.conditioningProgram;
  if (!p) return `<div class="empty">No conditioning program loaded.</div>`;
  const currentWeek = computeCurrentConditioningWeek();

  // Determine current blended phase by today's date vs phase end dates
  const today = todayStr();
  const phaseEnds = ["2026-06-21", "2026-07-12", "2026-08-01"];
  let curPhase = (p.phases || []).findIndex((_, i) => today <= phaseEnds[i]);

  const zonesHTML = renderHRZonesHTML(DATA.heartRateZones);

  const phasesHTML = (p.phases && p.phases.length) ? `
    <div class="program-section">
      <div class="program-header">
        <span class="name">Periodized blend → Aug 1</span>
        <span class="meta">aerobic base + Oil Barons speed</span>
      </div>
      ${p.blend ? `<div class="program-note">${escapeHtml(p.blend)}</div>` : ''}
      ${p.phases.map((ph, i) => `
        <div class="phase-card ${i === curPhase ? 'current' : ''}">
          <div class="head">
            <div class="name">${escapeHtml(ph.name)}${i === curPhase ? '<span class="badge">now</span>' : ''}</div>
            <span class="weeks">${escapeHtml(ph.weeks || '')}</span>
          </div>
          <div class="meta-line">${escapeHtml(ph.dates || '')}</div>
          <div class="goal">${escapeHtml(ph.objective || '')}</div>
          <div class="px">
            <div class="lab">Aerobic</div><div class="val">${escapeHtml(ph.aerobic || '—')}</div>
            <div class="lab">Anaerobic</div><div class="val">${escapeHtml(ph.anaerobic || '—')}</div>
          </div>
          ${ph.zoneFocus ? `<span class="pz">${escapeHtml(ph.zoneFocus)}</span>` : ''}
        </div>
      `).join('')}
    </div>
  ` : '';

  const integ = p.weeklyIntegration;
  const dayOrder = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const hardDays = ['tuesday','thursday'];
  const integHTML = integ ? `
    <div class="sub-head">Weekly integration — Phase 1 blueprint</div>
    <div class="wk-integ">
      ${dayOrder.filter(d => integ[d]).map(d => `
        <div class="row ${hardDays.includes(d) ? 'hard' : ''}">
          <div class="d">${d.slice(0,3)}</div>
          <div class="p">${escapeHtml(integ[d])}</div>
        </div>
      `).join('')}
    </div>
  ` : '';

  const arHTML = (p.autoRegulation && p.autoRegulation.length) ? `
    <div class="sub-head">Auto-regulation flags</div>
    <div class="autoreg">
      ${p.autoRegulation.map(a => `
        <div class="ar">
          <div class="flag">⚑ ${escapeHtml(a.flag)}</div>
          <div class="sig">${escapeHtml(a.signal)}</div>
          <div class="act"><b>→</b> ${escapeHtml(a.action)}</div>
        </div>
      `).join('')}
    </div>
  ` : '';

  return zonesHTML + phasesHTML + integHTML + arHTML + `
    <div class="program-section">
      <div class="program-header">
        <span class="name">${escapeHtml(p.name)}</span>
        <span class="meta">${p.durationWeeks} weeks · ${escapeHtml(p.source || '')}</span>
      </div>
      <div class="sub-head" style="margin-top:0;">Oil Barons anaerobic ladder (the hard interval content)</div>
      <div class="week-table">
        ${(p.weeks || []).map(w => `
          <div class="week-row ${w.week === currentWeek ? 'current' : ''}">
            <div class="wnum"><strong>W${w.week}</strong></div>
            <div class="wdates">${escapeHtml(w.dates)}</div>
            <div class="wsessions">
              ${(w.sessions || []).map(s => `<div class="s">${escapeHtml(s)}</div>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      ${!DATA.meta?.conditioningStartDate ? `<div class="program-note" style="margin-top:14px;">No start date set. Tell Claude when you start week 1 and the current week will be highlighted.</div>` : ''}

      <div class="program-header" style="margin-top:30px;">
        <span class="name">Drill specs</span>
        <span class="meta">target times</span>
      </div>
      <div class="specs-grid">
        ${(p.drillSpecs || []).map(d => `
          <div class="spec">
            <div class="n">${escapeHtml(d.name)}</div>
            <div class="meta">${escapeHtml(d.target)}<span class="pct">${escapeHtml(d.intensity)}</span></div>
            <div class="desc">${escapeHtml(d.description)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
