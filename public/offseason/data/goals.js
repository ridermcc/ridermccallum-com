// data/goals.js — Measurable off-season targets. Claude updates `current` as
// Rider hits new numbers. Targets are starting suggestions — Rider should
// confirm/adjust them.

window.GOALS = {
  targetDate: "2026-08-01",   // FIRST GAME — be in game shape by here (contract signed)
  firstGame: "2026-08-01",
  campOrSeasonEnd: "2026-09-01",
  notes:
    "PRIMARY DEADLINE moved to Aug 1 (first pro game) — conditioning peaks here. " +
    "Targets below are SUGGESTED starting points. Confirm with Claude or " +
    "say 'change my X goal to Y' and they'll update.",

  bodyComposition: [
    {
      id: "weight", label: "Bodyweight",
      baseline: 169.5, baselineDate: "2026-05-18",
      current: 175.3, currentDate: "2026-06-22",
      target: 182, unit: "lb", direction: "up",
      history: [
        { date: "2026-04-01", weight: 166.9 },
        { date: "2026-04-04", weight: 167.7 },
        { date: "2026-04-06", weight: 169.1 },
        { date: "2026-04-07", weight: 167.3 },
        { date: "2026-04-09", weight: 170.1 },
        { date: "2026-04-11", weight: 167.4 },
        { date: "2026-04-13", weight: 165.1 },
        { date: "2026-04-15", weight: 166.8 },
        { date: "2026-04-21", weight: 170.4 },
        { date: "2026-04-22", weight: 166.9 },
        { date: "2026-04-23", weight: 169.9 },
        { date: "2026-04-24", weight: 169.3 },
        { date: "2026-04-27", weight: 171.8 },
        { date: "2026-04-29", weight: 170.4 },
        { date: "2026-05-04", weight: 168.8 },
        { date: "2026-05-18", weight: 169.5 },
        { date: "2026-06-02", weight: 171.2 },
        { date: "2026-06-16", weight: 173.7 },
        { date: "2026-06-18", weight: 172.6 },
        { date: "2026-06-22", weight: 175.3 }
      ],
      note: "Lean mass gain over the offseason. +5.8 lb from the May 18 baseline (169.5 → 175.3 by Jun 22). Pre-offseason weigh-ins kept for trend context."
    },
    {
      id: "bodyfat", label: "Body fat",
      baseline: 14.0, baselineDate: "2026-06-02",
      current: 14.0, currentDate: "2026-06-02",
      target: 12.0, unit: "%", direction: "down",
      note: "SUGGESTED — first BIA scan 2026-06-02 (Renpho). Already lean; hold/trend slightly leaner into camp while gaining weight = lean mass."
    },
    {
      id: "skeletal-muscle", label: "Skeletal muscle mass",
      baseline: 38.0, baselineDate: "2026-06-02",
      current: 38.0, currentDate: "2026-06-02",
      target: 40.0, unit: "kg", direction: "up",
      note: "SUGGESTED — from 2026-06-02 BIA scan. Track alongside bodyweight to confirm gains are muscle."
    }
  ],

  // Strength + performance goals removed for now — focus on bodyweight only.
  // Add back when Rider has baseline numbers to track against.
  strength: [],
  performance: [],

  habits: {
    weeklyLifts: 3,
    weeklyMobility: 2,
    weeklyPlyo: 2,           // Tue + Thu
    weeklyConditioning: 3,   // Phase 1: 2× Zone 2 bike (Wed/Sun) + 1× Tue sprints
    weeklyAerobicZone2: 2,   // Phase 1 only — drops to 1 in Phase 2, 0 in Phase 3
    morningRHRcheckins: 3,   // log resting HR to calibrate Karvonen zones
    nightlySleepHours: 8,
    dailyHydrationL: 3,
    dailyCreatine: true,
    bodyweightCheckinsPerWeek: 3
  }
};
