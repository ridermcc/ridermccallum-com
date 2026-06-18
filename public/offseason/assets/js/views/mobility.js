// ===========================================================
//  MOBILITY VIEW
// ===========================================================
function renderMobility() {
  const el = document.getElementById('mobility-content');
  const m = DATA.mobilityLibrary;
  if (!m) { el.innerHTML = `<div class="empty">No mobility library loaded.</div>`; return; }
  el.innerHTML = `
    ${m.source ? `<div class="mob-source">Source: ${escapeHtml(m.source)}</div>` : ''}
    <div class="mob-grid">
      <div class="mob-col">
        <h3>Lower</h3>
        ${(m.lower || []).map(l => `
          <a class="mob-link" href="${escapeHtml(l.url)}" target="_blank" rel="noopener">
            <span class="name">${escapeHtml(l.name)}</span>
            <span class="arrow">↗</span>
          </a>`).join('')}
      </div>
      <div class="mob-col">
        <h3>Upper</h3>
        ${(m.upper || []).map(l => `
          <a class="mob-link" href="${escapeHtml(l.url)}" target="_blank" rel="noopener">
            <span class="name">${escapeHtml(l.name)}</span>
            <span class="arrow">↗</span>
          </a>`).join('')}
      </div>
    </div>
  `;
}
