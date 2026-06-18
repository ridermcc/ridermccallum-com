// ===========================================================
//  TODAY VIEW
// ===========================================================
// Instant styled tooltip for the season-timeline blocks (replaces native `title` delay).
// One delegated listener set + one reused popup node, so it survives dashboard re-renders.
let _seasonTip = null;
function positionSeasonTip(e) {
  if (!_seasonTip) return;
  const gap = 14;
  const r = _seasonTip.getBoundingClientRect();
  let x = e.clientX + gap, y = e.clientY + gap;
  if (x + r.width + 8 > window.innerWidth)  x = e.clientX - r.width - gap;
  if (y + r.height + 8 > window.innerHeight) y = e.clientY - r.height - gap;
  _seasonTip.style.left = Math.max(8, x) + 'px';
  _seasonTip.style.top  = Math.max(8, y) + 'px';
}
function initSeasonTooltip() {
  if (window._seasonTipReady) return;
  window._seasonTipReady = true;
  _seasonTip = document.createElement('div');
  _seasonTip.className = 'seasontl-tip';
  document.body.appendChild(_seasonTip);
  document.addEventListener('mouseover', e => {
    const seg = e.target.closest ? e.target.closest('[data-tip]') : null;
    if (!seg) return;
    const d = seg.dataset;
    _seasonTip.innerHTML =
      `<div class="t-date">${escapeHtml(d.date || '')}</div>`
      + `<div class="t-title"><span class="t-dot" style="background:${escapeHtml(d.color || '#555')}"></span>${escapeHtml(d.title || '')}</div>`
      + (d.meta ? `<div class="t-meta">${escapeHtml(d.meta)}</div>` : '');
    positionSeasonTip(e);
    _seasonTip.classList.add('show');
  });
  document.addEventListener('mousemove', e => {
    if (_seasonTip && _seasonTip.classList.contains('show')) positionSeasonTip(e);
  });
  document.addEventListener('mouseout', e => {
    const seg = e.target.closest ? e.target.closest('[data-tip]') : null;
    if (seg && _seasonTip) _seasonTip.classList.remove('show');
  });
}

// Enhanced "Sessions by day" — bigger, summary-led version for the home dashboard.
// Distinct from the compact Insights timeline (renderInsights); shares the type colors.
function renderSeasonTimelineCard() {
  initSeasonTooltip();
  const meta = DATA.meta || {};
  const tlStart = parseDate(meta.offseasonStart);
  const tlEnd = parseDate(meta.offseasonEnd);
  if (!tlStart || !tlEnd || tlEnd < tlStart) return '';

  const DAY_MS = 86400000;
  const all = workouts();
  const todayKey = todayStr();
  const todayD = parseDate(todayKey);
  const totalDays = Math.round((tlEnd - tlStart) / DAY_MS) + 1;
  const span = Math.max(1, totalDays - 1);

  // Bucket workouts by day; tally per-type counts + days-trained across the offseason window.
  const byDay = {};
  const typeCount = {};
  TYPE_ORDER.forEach(t => typeCount[t] = 0);
  let totalSessions = 0;
  const daysTrained = new Set();
  all.forEach(w => {
    (byDay[w.date] = byDay[w.date] || []).push(w);
    const d = parseDate(w.date);
    if (d >= tlStart && d <= tlEnd) {
      typeCount[w.type] = (typeCount[w.type] || 0) + 1;
      totalSessions++;
      daysTrained.add(w.date);
    }
  });

  // Columns: one per day. Trained days stack colored segments; past rest days + future days
  // get faint baseline ticks so the full span (and what's left) stays legible.
  const cols = [];
  const ticks = [];
  for (let i = 0; i < totalDays; i++) {
    const d = addDays(tlStart, i);
    const key = dateKey(d);
    const dow = d.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const isToday = key === todayKey;
    const isMonthStart = i > 0 && d.getDate() === 1;
    const isFuture = parseDate(key) > todayD;

    if (i === 0 || isMonthStart) {
      const lbl = d.toLocaleDateString('en-US', { month: 'short' }) + (i === 0 ? ' ' + d.getDate() : '');
      ticks.push({ left: (i / span) * 100, label: lbl });
    }

    const ws = (byDay[key] || []).slice().sort((a,b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type));
    let inner;
    if (ws.length) {
      inner = ws.map(w => {
        const dur = effectiveDuration(w);
        const color = TYPE_COLORS[w.type] || '#777';
        const meta = [TYPE_LABELS[w.type] || w.type, dur ? dur + ' min' : ''].filter(Boolean).join(' · ');
        return `<div class="seasontl-seg" style="background:${color}" data-tip="1"`
          + ` data-date="${escapeHtml(fmtMonthDay(key))}" data-color="${color}"`
          + ` data-title="${escapeHtml(w.title || (TYPE_LABELS[w.type] || w.type))}"`
          + ` data-meta="${escapeHtml(meta)}"></div>`;
      }).join('');
    } else {
      inner = `<div class="seasontl-tick ${isFuture ? 'future' : 'rest'}" data-tip="1"`
        + ` data-date="${escapeHtml(fmtMonthDay(key))}" data-color="#555"`
        + ` data-title="${isFuture ? 'Upcoming' : 'Rest day'}" data-meta="${isFuture ? 'no session yet' : 'no training logged'}"></div>`;
    }
    const cls = ['seasontl-col'];
    if (isWeekend) cls.push('weekend');
    if (isMonthStart) cls.push('month-start');
    if (isToday) cls.push('today');
    cols.push(`<div class="${cls.join(' ')}">${inner}</div>`);
  }

  const tIdx = Math.round((todayD - tlStart) / DAY_MS);
  if (tIdx >= 0 && tIdx < totalDays) ticks.push({ left: (tIdx / span) * 100, label: 'today', now: true });
  const ticksHTML = ticks.map(t => {
    const pos = t.left >= 92 ? 'right:0;' : `left:${t.left}%;`;
    return `<span class="tick${t.now ? ' now' : ''}" style="${pos}">${t.label}</span>`;
  }).join('');

  const legendHTML = TYPE_ORDER.filter(t => typeCount[t]).map(t =>
    `<div class="lg"><span class="sw" style="background:${TYPE_COLORS[t]}"></span>${TYPE_LABELS[t]} <span class="ct">${typeCount[t]}</span></div>`
  ).join('');

  const daysElapsed = Math.min(totalDays, Math.max(0, Math.round((todayD - tlStart) / DAY_MS) + 1));
  const daysLeft = Math.max(0, Math.round((tlEnd - todayD) / DAY_MS));
  const weeksElapsed = Math.max(daysElapsed / 7, 1/7);
  const perWeek = (totalSessions / weeksElapsed).toFixed(1);

  return `
    <div class="card seasontl">
      <div class="card-head">
        <h3>Sessions by day · full offseason</h3>
        <span class="link" onclick="switchView('insights')">Insights →</span>
      </div>
      <div class="seasontl-summary">
        <div class="s"><div class="n">${totalSessions}</div><div class="l">sessions logged</div></div>
        <div class="s"><div class="n">${daysTrained.size}<small> / ${daysElapsed}</small></div><div class="l">days trained</div></div>
        <div class="s"><div class="n">${perWeek}</div><div class="l">per week</div></div>
        <div class="s"><div class="n">${daysLeft}</div><div class="l">days to first game</div></div>
      </div>
      <div class="seasontl-plot">
        <div class="seasontl-bars">${cols.join('')}</div>
        <div class="seasontl-axis">${ticksHTML}</div>
      </div>
      <div class="seasontl-legend">${legendHTML}</div>
    </div>`;
}

function renderToday() {
  const today = todayStr();
  const el = document.getElementById('today-content');
  const prog = offseasonProgress();
  const meta = DATA.meta || {};
  const goals = DATA.goals || null;
  const sched = DATA.schedule || {};
  const dayData = DATA.daily?.[today];

  // ===== HERO: where I am, where I'm going =====
  // Countdown targets the FIRST GAME (Aug 1), not the old Sep 1 camp date.
  const phase = currentPhase();
  const todayD = parseDate(today);
  const startD = parseDate(meta.offseasonStart);
  const goalDate = meta.firstGame || meta.offseasonEnd;
  const goalD = goalDate ? parseDate(goalDate) : null;
  const goalLabel = meta.firstGame ? 'days to first game' : 'days to camp';
  const daysToGoal = goalD ? Math.max(0, Math.ceil((goalD - todayD) / 864e5)) : null;
  const goalPct = (startD && goalD && goalD > startD)
    ? Math.min(100, Math.max(0, Math.round((todayD - startD) / (goalD - startD) * 100))) : 0;
  const teamD = meta.teamJoinDate ? parseDate(meta.teamJoinDate) : null;
  const daysToTeam = teamD ? Math.max(0, Math.ceil((teamD - todayD) / 864e5)) : null;
  const subLine = (daysToTeam != null && daysToTeam > 0 && meta.team)
    ? `join ${escapeHtml(meta.team)}${meta.teamLocation ? ' · ' + escapeHtml(meta.teamLocation) : ''} in ${daysToTeam} days`
    : (meta.team ? `with ${escapeHtml(meta.team)}` : '');

  const heroHTML = `
    <div class="hero">
      <div class="hero-tags">
        <span class="phase">${escapeHtml(phase || 'Off-Season')}</span>
        <span>·</span>
        <span>Week ${prog?.weekN || '?'} of ${prog?.totalWeeks || 13}</span>
        <span>·</span>
        <span>Day ${prog?.dayN || '?'} of ${prog?.totalDays || 90}</span>
      </div>
      <h2>${daysToGoal != null ? `${daysToGoal} ${goalLabel}` : 'Off-season'}</h2>
      ${subLine ? `<div class="hero-sub">${subLine}</div>` : ''}
      <div class="progress-bar"><div class="fill" style="width:${goalPct}%"></div></div>
      <div class="progress-meta">
        <span>${meta.offseasonStart || ''}</span>
        <span>${goalPct}% to ${meta.firstGame ? 'game' : 'camp'}</span>
        <span>${goalDate || ''}</span>
      </div>
    </div>
  `;

  // ===== TODAY STATUS (compact) =====
  const todayStatusHTML = renderTodayStatusCard(dayData, today);

  // ===== TOP GOALS (subset, links to full Goals tab) =====
  const topGoalsHTML = renderTopGoalsCard(goals);

  // ===== TOMORROW =====
  const tomorrowHTML = renderTomorrowCard(sched, today);

  // ===== THIS WEEK strip =====
  const weekStripHTML = renderWeekStripCard(sched, today);

  // ===== SEASON TIMELINE — full-offseason sessions by day (enhanced) =====
  const seasonTimelineHTML = renderSeasonTimelineCard();

  // ===== RECENT WORKOUTS (last 3) =====
  const recent = workouts().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
  const recentHTML = recent.length ? `
    <div class="card" style="margin-top:18px;">
      <div class="card-head"><h3>Recent</h3>
        <span class="link" onclick="switchView('all')">All workouts →</span>
      </div>
      ${recent.map(w => `
        <div class="status-line" style="cursor:pointer" onclick="openWorkout('${w.id}')">
          <span class="status-dot done"></span>
          <span class="status-label">${escapeHtml(w.title || 'Untitled')}</span>
          <span class="status-meta">${escapeHtml(fmtFullDate(w.date))}${w.duration ? ' · ' + w.duration + ' min' : ''}</span>
        </div>
      `).join('')}
    </div>
  ` : '';

  // ===== DEEP DETAIL — collapsed by default =====
  const deepDetailHTML = dayData ? renderTodayDeepDetail(dayData) : '';

  el.innerHTML = `
    ${heroHTML}
    ${todayStatusHTML}
    ${tomorrowHTML}
    ${weekStripHTML}
    ${seasonTimelineHTML}
    ${topGoalsHTML}
    ${recentHTML}
    ${deepDetailHTML}
  `;
}

function renderTomorrowCard(sched, today) {
  const d = parseDate(today);
  d.setDate(d.getDate() + 1);
  const pad = n => String(n).padStart(2, '0');
  const tomorrow = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

  // Find tomorrow in schedule
  let planEntry = null;
  let weekDates = '';
  (sched.weeks || []).forEach(w => {
    if (w.days?.[tomorrow]) { planEntry = w.days[tomorrow]; weekDates = w.dates || ''; }
  });

  const planned = planEntry?.planned || [];
  const planNotes = planEntry?.notes || '';

  // Build a one-line description per planned id
  const describe = id => {
    if (/^lift-d[123]$/.test(id)) {
      const dayNum = id.slice(-1);
      const tpl = (DATA.liftTemplates || []).find(t => t.id === `mhockey-os-d${dayNum}`);
      if (!tpl) return { label: `Lift D${dayNum}`, sub: 'template missing', tag: 'lift' };
      const heads = (tpl.sections || []).map(s => (s.items?.[0]?.name || '')).filter(Boolean).slice(0, 4);
      return { label: `Lift D${dayNum} — ${tpl.focus || ''}`, sub: heads.join(' · '), tag: 'lift' };
    }
    if (/^plyo-base-[AB]$/.test(id)) {
      const sess = sched.plyoSessions?.[id];
      if (!sess) return { label: id, sub: '', tag: 'plyo' };
      const blocks = (sess.blocks || []).map(b => b.name.replace(/\s*\(.*\)\s*/, '')).join(' · ');
      return { label: sess.name, sub: `${sess.duration || ''} · ${blocks}`, tag: 'plyo' };
    }
    if (id === 'mobility')     return { label: 'Mobility', sub: 'Full-body roll + hip/back/shoulder mobility', tag: 'mobility' };
    if (id === 'conditioning') return { label: 'Conditioning', sub: 'Oil Barons drills (program starts Wk 5)', tag: 'conditioning' };
    if (id === 'skating')      return { label: 'Skating', sub: 'No ice booked yet — TBD', tag: 'skating' };
    if (id === 'recovery')     return { label: 'Active recovery', sub: 'Walk / easy bike / foam roll', tag: 'mobility' };
    if (id === 'rest')         return { label: 'Full rest', sub: 'No training — sleep, eat, hydrate', tag: 'rest' };
    return { label: id, sub: '', tag: '' };
  };

  const items = planned.map(describe);
  const headerLabel = `Tomorrow · ${fmtFullDate(tomorrow)}`;

  if (!planned.length) {
    return `
      <div class="card minimal" style="margin-top:18px;">
        <div class="card-head"><h3>${escapeHtml(headerLabel)}</h3>
          ${weekDates ? `<span class="status-meta">${escapeHtml(weekDates)}</span>` : ''}
        </div>
        <div style="color:var(--text-3);font-size:13px;padding:8px 0;">No plan set yet — ask Claude to add tomorrow.</div>
      </div>
    `;
  }

  return `
    <div class="card minimal" style="margin-top:18px;">
      <div class="card-head"><h3>${escapeHtml(headerLabel)}</h3>
        <span class="link" onclick="switchView('schedule')">Full schedule →</span>
      </div>
      ${items.map((it, i) => `
        <div class="status-line" style="cursor:pointer;align-items:flex-start;" onclick="openPlanItem('${escapeJs(planned[i])}')" title="Click for breakdown">
          <span class="wd-tag ${it.tag}" style="margin-right:10px;flex-shrink:0;">${escapeHtml(it.tag || 'plan')}</span>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;color:var(--text);">${escapeHtml(it.label)}</div>
            ${it.sub ? `<div style="font-size:11px;color:var(--text-3);margin-top:2px;line-height:1.5;">${escapeHtml(it.sub)}</div>` : ''}
          </div>
        </div>
      `).join('')}
      ${planNotes ? `<div style="margin-top:12px;font-size:12px;color:var(--text-2);line-height:1.5;border-top:1px solid var(--border);padding-top:10px;">${escapeHtml(planNotes)}</div>` : ''}
    </div>
  `;
}

function renderTodayStatusCard(dayData, today) {
  const cl = dayData?.checklist || {};
  const body = dayData?.body || {};
  const ws = dayData?.workouts || [];

  // Find today's plan
  let planned = [];
  (DATA.schedule?.weeks || []).forEach(w => {
    if (w.days?.[today]) planned = w.days[today].planned || [];
  });

  const liftDone = cl.lift, plyoDone = cl.plyo, mobDone = cl.mobility, condDone = cl.conditioning;
  const hasPlan = planned.length > 0;

  const statusLines = [];
  if (planned.includes('lift-d1') || planned.includes('lift-d2') || planned.includes('lift-d3') || liftDone) {
    const liftId = planned.find(p => /^lift-d/.test(p)) || '';
    statusLines.push({
      done: liftDone, label: liftDone ? `Lift done` : `Lift planned${liftId ? ' — ' + liftId : ''}`,
      meta: liftDone && ws[0] ? (ws[0].duration + ' min') : 'click to expand'
    });
  }
  if (planned.includes('plyo-base-A') || planned.includes('plyo-base-B') || plyoDone) {
    statusLines.push({ done: plyoDone, label: plyoDone ? 'Plyo done' : 'Plyo planned', meta: '' });
  }
  if (planned.includes('mobility') || mobDone) {
    statusLines.push({ done: mobDone, label: mobDone ? 'Mobility done' : 'Mobility planned', meta: '' });
  }
  if (planned.includes('conditioning') || condDone) {
    statusLines.push({ done: condDone, label: condDone ? 'Conditioning done' : 'Conditioning planned', meta: '' });
  }

  const sleep = cl.sleepHours;
  const bw = cl.bodyweight;
  const energy = body.energyLevel;

  return `
    <div class="card minimal">
      <div class="card-head">
        <h3>Today · ${escapeHtml(fmtDayLabel(parseDate(today)))} ${parseDate(today).getDate()}</h3>
        <span class="link" onclick="switchView('week')">Week →</span>
      </div>
      ${statusLines.length ? statusLines.map(s => `
        <div class="status-line">
          <span class="status-dot ${s.done ? 'done' : ''}"></span>
          <span class="status-label">${escapeHtml(s.label)}</span>
          <span class="status-meta">${escapeHtml(s.meta)}</span>
        </div>
      `).join('') : '<div style="color:var(--text-3);font-size:13px;padding:8px 0;">Rest day or unplanned</div>'}
      <div class="stat-row" style="margin-top:14px;">
        <div class="stat-cell">
          <div class="stat-label">Sleep</div>
          <div class="stat-value">${sleep != null ? sleep + 'h' : '—'}</div>
          <div class="stat-sub">${cl.sleepQuality || ''}</div>
        </div>
        <div class="stat-cell">
          <div class="stat-label">Bodyweight</div>
          <div class="stat-value">${bw != null ? bw : '—'}<span style="font-size:12px;color:var(--text-3);"> ${bw != null ? 'lb' : ''}</span></div>
          <div class="stat-sub">${bw != null ? 'today' : 'log later'}</div>
        </div>
        <div class="stat-cell">
          <div class="stat-label">Energy</div>
          <div class="stat-value">${energy != null ? energy : '—'}<span style="font-size:12px;color:var(--text-3);">${energy != null ? '/10' : ''}</span></div>
          <div class="stat-sub">${energy != null ? '' : 'tell Claude'}</div>
        </div>
      </div>
    </div>
  `;
}

function renderWeekStripCard(sched, today) {
  // Find current week
  const weeks = sched.weeks || [];
  const currentWeek = weeks.find(w => w.days && w.days[today])
    || weeks.find(w => {
      const dates = Object.keys(w.days || {}).sort();
      return dates.length && today >= dates[0] && today <= dates[dates.length - 1];
    })
    || weeks[0];

  if (!currentWeek) return `<div class="card"><div class="card-head"><h3>This Week</h3></div><div style="color:var(--text-3);font-size:13px;">No schedule yet.</div></div>`;

  const days = Object.entries(currentWeek.days || {}).sort(([a],[b]) => a.localeCompare(b));

  return `
    <div class="card minimal">
      <div class="card-head">
        <h3>This Week · ${escapeHtml(currentWeek.dates || '')}</h3>
        <span class="link" onclick="switchView('schedule')">Full schedule →</span>
      </div>
      <div class="week-strip">
        ${days.map(([date, d]) => {
          const dt = parseDate(date);
          const isToday = date === today;
          const dayData = DATA.daily?.[date];
          const done = dayData?.workouts?.length > 0;
          const primary = (d.planned || [])[0] || 'rest';
          const primaryClean = primary.replace(/^lift-.*/, 'lift').replace(/^plyo-.*/, 'plyo').replace(/-(upper|lower)$/, '');
          const primaryLabel = primary.replace(/^lift-d/, 'D').replace(/^plyo-base-/, 'plyo ');
          return `
            <div class="week-day ${isToday ? 'today' : ''}" onclick="openPlanItem('${escapeJs(primary)}')" title="Click for breakdown">
              <div class="wd-name">${fmtDayLabel(dt).slice(0,3)}</div>
              <div class="wd-date">${dt.getDate()}</div>
              <div class="wd-tag ${primaryClean}">${escapeHtml(primaryLabel)}</div>
              ${done ? '<div class="wd-status done">✓</div>' : (isToday ? '<div class="wd-status">today</div>' : '')}
            </div>
          `;
        }).join('')}
      </div>
      ${currentWeek.focus ? `<div style="margin-top:14px;font-size:12px;color:var(--text-2);line-height:1.5;">${escapeHtml(currentWeek.focus)}</div>` : ''}
    </div>
  `;
}

function renderTopGoalsCard(goals) {
  if (!goals) return '';
  const weightGoal = (goals.bodyComposition || []).find(g => g.id === 'weight');
  if (!weightGoal) return '';

  // Merge weight history from goal.history (backfilled) + daily logs (live)
  const byDate = new Map();
  (weightGoal.history || []).forEach(h => byDate.set(h.date, Number(h.weight)));
  Object.entries(DATA.daily || {}).forEach(([date, d]) => {
    const w = d?.checklist?.bodyweight;
    if (w != null) byDate.set(date, Number(w));
  });
  if (weightGoal.baselineDate && weightGoal.baseline != null && !byDate.has(weightGoal.baselineDate)) {
    byDate.set(weightGoal.baselineDate, Number(weightGoal.baseline));
  }
  const history = [...byDate.entries()].sort(([a],[b]) => a.localeCompare(b)).map(([date, weight]) => ({ date, weight }));

  const pct = goalProgress(weightGoal);
  const latest = history[history.length - 1];
  const delta = latest && weightGoal.baseline != null ? (latest.weight - weightGoal.baseline) : null;

  return `
    <div class="card minimal" style="margin-top:6px;">
      <div class="card-head">
        <h3>Bodyweight</h3>
      </div>
      <div class="bw-row">
        <div class="bw-stats">
          <div class="bw-current">${latest ? latest.weight.toFixed(1) : '—'}<span class="bw-unit">${weightGoal.unit}</span></div>
          <div class="bw-meta">
            <span>baseline ${weightGoal.baseline}</span>
            <span>·</span>
            <span>target ${weightGoal.target}</span>
            ${delta != null ? `<span>·</span><span class="${delta >= 0 ? 'up' : 'down'}">${delta >= 0 ? '+' : ''}${delta.toFixed(1)} lb</span>` : ''}
            ${pct != null ? `<span>·</span><span>${pct}% to target</span>` : ''}
          </div>
        </div>
        <div class="bw-chart-wrap">${renderWeightChartSVG(history, weightGoal)}</div>
      </div>
    </div>
  `;
}

function renderWeightChartSVG(history, goal) {
  const W = 900, H = 360;
  const padL = 44, padR = 16, padT = 18, padB = 32;
  const innerW = W - padL - padR, innerH = H - padT - padB;

  if (!history.length) {
    return `<div class="bw-chart-empty">No weigh-ins logged yet.</div>`;
  }

  // Y range: include baseline, target, all values; pad based on range
  const vals = history.map(h => h.weight).concat([goal.baseline, goal.target]).filter(v => v != null);
  const rawMin = Math.min(...vals), rawMax = Math.max(...vals);
  const yPad = Math.max(2, (rawMax - rawMin) * 0.1);
  const yMin = Math.floor(rawMin - yPad);
  const yMax = Math.ceil(rawMax + yPad);
  const yScale = v => padT + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  // X range: earliest history date → offseason end
  const startDate = parseDate(history[0].date);
  const endDate = parseDate(DATA.meta?.offseasonEnd || history[history.length - 1].date);
  const start = startDate.getTime();
  const rightEdge = endDate.getTime();
  const span = Math.max(rightEdge - start, 1);
  const xScale = dateStr => padL + ((parseDate(dateStr).getTime() - start) / span) * innerW;

  const pts = history.map(h => ({ x: xScale(h.date), y: yScale(h.weight), w: h.weight, date: h.date }));
  const linePath = pts.length > 1 ? `M ${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}` : '';
  const areaPath = pts.length > 1 ? `${linePath} L ${pts[pts.length-1].x.toFixed(1)},${(padT+innerH).toFixed(1)} L ${pts[0].x.toFixed(1)},${(padT+innerH).toFixed(1)} Z` : '';
  const lastPt = pts[pts.length - 1];
  const yBaseline = yScale(goal.baseline);
  const yTarget = yScale(goal.target);

  // Y-axis ticks — pick 4–5 round-number weights between yMin and yMax
  const tickCount = 5;
  const tickStep = Math.max(1, Math.round((yMax - yMin) / tickCount));
  const yTicks = [];
  for (let v = Math.ceil(yMin / tickStep) * tickStep; v <= yMax; v += tickStep) yTicks.push(v);

  // X-axis month labels — every month boundary between start and end
  const xTicks = [];
  let cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  while (cur <= endDate) {
    if (cur >= startDate) {
      const dStr = `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}-01`;
      xTicks.push({ x: xScale(dStr), label: cur.toLocaleDateString('en-US', { month: 'short' }) });
    }
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }

  // Today marker
  const todayStr2 = todayStr();
  const todayInRange = parseDate(todayStr2).getTime() >= start && parseDate(todayStr2).getTime() <= rightEdge;
  const xToday = todayInRange ? xScale(todayStr2) : null;

  return `
    <svg class="bw-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-label="Bodyweight progression">
      <defs>
        <linearGradient id="bw-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="var(--text)" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="var(--text)" stop-opacity="0"/>
        </linearGradient>
      </defs>

      <!-- horizontal gridlines + y-axis labels -->
      ${yTicks.map(v => `
        <line x1="${padL}" x2="${padL + innerW}" y1="${yScale(v)}" y2="${yScale(v)}"
              stroke="var(--border)" stroke-width="1" opacity="0.6"/>
        <text x="${padL - 8}" y="${yScale(v) + 4}" text-anchor="end"
              font-size="11" fill="var(--text-3)" font-family="ui-monospace,monospace">${v}</text>
      `).join('')}

      <!-- vertical month gridlines + x-axis labels -->
      ${xTicks.map(t => `
        <line x1="${t.x.toFixed(1)}" x2="${t.x.toFixed(1)}" y1="${padT}" y2="${padT + innerH}"
              stroke="var(--border)" stroke-width="1" opacity="0.4"/>
        <text x="${t.x.toFixed(1)}" y="${H - 10}" text-anchor="middle"
              font-size="10" fill="var(--text-3)" font-family="ui-monospace,monospace" letter-spacing="0.5">${t.label.toUpperCase()}</text>
      `).join('')}

      <!-- baseline line -->
      <line x1="${padL}" x2="${padL + innerW}" y1="${yBaseline}" y2="${yBaseline}"
            stroke="var(--text-3)" stroke-width="1" stroke-dasharray="2 4" opacity="0.5"/>
      <text x="${padL + 4}" y="${yBaseline - 4}" font-size="10" fill="var(--text-3)" font-family="ui-monospace,monospace">baseline ${goal.baseline}</text>

      <!-- target line -->
      <line x1="${padL}" x2="${padL + innerW}" y1="${yTarget}" y2="${yTarget}"
            stroke="#5cb85c" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.7"/>
      <text x="${padL + innerW - 4}" y="${yTarget - 6}" text-anchor="end"
            font-size="11" fill="#5cb85c" font-family="ui-monospace,monospace" font-weight="600">TARGET ${goal.target}</text>

      <!-- projection from latest → target -->
      <line x1="${lastPt.x.toFixed(1)}" x2="${(padL + innerW).toFixed(1)}"
            y1="${lastPt.y.toFixed(1)}" y2="${yTarget.toFixed(1)}"
            stroke="#5cb85c" stroke-width="1" stroke-dasharray="2 5" opacity="0.5"/>

      <!-- today marker -->
      ${xToday != null ? `
        <line x1="${xToday.toFixed(1)}" x2="${xToday.toFixed(1)}" y1="${padT}" y2="${padT + innerH}"
              stroke="var(--text)" stroke-width="1" opacity="0.25"/>
        <text x="${xToday.toFixed(1)}" y="${padT - 4}" text-anchor="middle"
              font-size="9" fill="var(--text-3)" font-family="ui-monospace,monospace" letter-spacing="0.5">TODAY</text>
      ` : ''}

      <!-- filled area under line -->
      ${areaPath ? `<path d="${areaPath}" fill="url(#bw-area)"/>` : ''}

      <!-- main line -->
      ${linePath ? `<path d="${linePath}" fill="none" stroke="var(--text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` : ''}

      <!-- data points -->
      ${pts.map(p => `
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="var(--bg)" stroke="var(--text)" stroke-width="1.5">
          <title>${p.date}: ${p.w} lb</title>
        </circle>
      `).join('')}

      <!-- emphasized last point with weight label -->
      <circle cx="${lastPt.x.toFixed(1)}" cy="${lastPt.y.toFixed(1)}" r="5.5" fill="var(--text)" stroke="var(--bg-2)" stroke-width="2"/>
      <text x="${lastPt.x.toFixed(1)}" y="${(lastPt.y - 12).toFixed(1)}" text-anchor="middle"
            font-size="12" fill="var(--text)" font-family="ui-monospace,monospace" font-weight="600">${lastPt.w} lb</text>
    </svg>
  `;
}

function goalProgress(g) {
  if (g.current == null || g.baseline == null || g.target == null) return null;
  const direction = g.direction || 'up';
  const span = direction === 'up' ? (g.target - g.baseline) : (g.baseline - g.target);
  const moved = direction === 'up' ? (g.current - g.baseline) : (g.baseline - g.current);
  if (span <= 0) return null;
  return Math.max(0, Math.min(100, Math.round((moved / span) * 100)));
}


function renderTodayDeepDetail(dayData) {
  const cl = dayData?.checklist || {};
  const body = dayData?.body || {};
  const ws = dayData?.workouts || [];
  const meals = dayData?.meals || [];

  function checkVal(v, unit) {
    if (v === true) return '<span class="check-val yes">✓</span>';
    if (v === false || v == null) return '<span class="check-val no">—</span>';
    return `<span class="check-val info">${escapeHtml(String(v))}${unit ? ' ' + unit : ''}</span>`;
  }

  const sorenessHTML = Object.keys(body.soreness || {}).length
    ? Object.entries(body.soreness).map(([area, level]) => `
        <div class="soreness-item">
          <span class="area">${escapeHtml(area.replace(/_/g, ' '))}</span>
          <span class="level ${level}">${escapeHtml(level)}</span>
        </div>`).join('')
    : '<div style="color:var(--text-3);font-size:12px;">No soreness logged</div>';

  return `
    <details class="expand">
      <summary>More detail · checklist · meals · soreness · notes</summary>
      <div class="expand-body">
        <div class="home-grid">
          <div class="card">
            <div class="card-head"><h3>Activity Checklist</h3></div>
            <div class="check-row"><span class="check-label">Lift</span>${checkVal(cl.lift)}</div>
            <div class="check-row"><span class="check-label">Plyo / Speed</span>${checkVal(cl.plyo)}</div>
            <div class="check-row"><span class="check-label">Conditioning</span>${checkVal(cl.conditioning)}</div>
            <div class="check-row"><span class="check-label">Mobility</span>${checkVal(cl.mobility)}</div>
            <div class="check-row"><span class="check-label">Skating</span>${checkVal(cl.skating)}</div>
            <div class="check-row"><span class="check-label">Skill Work</span>${checkVal(cl.skillWork)}</div>
          </div>
          <div class="card">
            <div class="card-head"><h3>Daily Tracking</h3></div>
            <div class="check-row"><span class="check-label">Creatine</span>${checkVal(cl.creatine)}</div>
            <div class="check-row"><span class="check-label">Hydration</span>${checkVal(cl.hydrationL, 'L')}</div>
            <div class="check-row"><span class="check-label">Nutrition</span>${checkVal(cl.nutritionQuality)}</div>
            <div class="check-row"><span class="check-label">Sleep quality</span>${checkVal(cl.sleepQuality)}</div>
          </div>
          <div class="card">
            <div class="card-head"><h3>Body Status</h3></div>
            ${sorenessHTML}
            ${(body.injuries || []).length ? `<div style="margin-top:8px;font-size:11px;color:#d9534f;">⚠ ${body.injuries.join(', ')}</div>` : ''}
          </div>
          ${meals.length ? `
            <div class="card">
              <div class="card-head"><h3>Meals</h3></div>
              ${meals.map(m => `
                <div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:12px;">
                  <span style="color:var(--text-2);margin-right:8px;">${escapeHtml(m.time || '')}</span>
                  ${escapeHtml(m.description)}
                </div>
              `).join('')}
            </div>` : ''}
        </div>
        ${dayData?.notes ? `<div style="margin-top:16px;padding:14px;background:var(--bg-2);border:1px solid var(--border);border-radius:8px;font-size:13px;color:var(--text-2);line-height:1.6;white-space:pre-wrap;">${escapeHtml(dayData.notes)}</div>` : ''}
      </div>
    </details>
  `;
}
