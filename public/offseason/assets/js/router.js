// ===========================================================
//  ROUTING
// ===========================================================
document.querySelectorAll('#tabs button').forEach(b => {
  b.addEventListener('click', () => switchView(b.dataset.view));
});
function switchView(view) {
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('section.view').forEach(s => s.classList.toggle('active', s.id === 'view-' + view));
  if (view === 'today') renderToday();
  if (view === 'all') renderAll();
  if (view === 'programs') renderPrograms();
  if (view === 'mobility') renderMobility();
  if (view === 'insights') renderInsights();
  if (view === 'week') renderWeek();
  if (view === 'schedule') renderSchedule();
  if (view === 'plan') renderPlan();
}
window.switchView = switchView;
