// Bootstrap: merge split data files into window.DATA for backward compat
(function() {
  const M = window.META || {};
  const P = window.PROGRAMS || {};
  const S = window.SCHEDULE || {};
  // Collect all daily logs
  const dailyMonths = [window.DAILY_2026_05, window.DAILY_2026_06, window.DAILY_2026_07, window.DAILY_2026_08].filter(Boolean);
  const daily = {};
  dailyMonths.forEach(m => Object.assign(daily, m));
  // Extract workouts array from daily logs for backward compat
  const workoutsArr = [];
  Object.entries(daily).forEach(([date, day]) => {
    (day.workouts || []).forEach(w => {
      w.date = w.date || date;
      workoutsArr.push(w);
    });
  });
  window.DATA = {
    meta: M,
    liftTemplates: P.liftTemplates || [],
    plyoProgram: P.plyoProgram || null,
    liftProgram: window.LIFT_PROGRAM || null,
    conditioningProgram: P.conditioningProgram || null,
    heartRateZones: P.heartRateZones || null,
    mobilityLibrary: P.mobilityLibrary || null,
    schedule: S,
    goals: window.GOALS || null,
    daily: daily,
    phases: S.phases || [],
    workouts: workoutsArr,
    version: M.version || 3,
    updated: M.updated || ""
  };
})();
