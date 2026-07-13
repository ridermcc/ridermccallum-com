// data/daily/2026-06.js — June 2026 daily logs.
// Claude writes here when Rider reports workouts, meals, sleep, soreness, etc.
// One month per file keeps each file small (~200–400 lines).

window.DAILY_2026_06 = {
  "2026-06-01": {
    checklist: { lift: true, plyo: false, conditioning: false, mobility: true, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260601_1", time: "", type: "off-ice", title: "Lift: Full Body", templateId: "mhockey-os-d1", duration: 60, rpe: null, location: "", notes: "Backfilled — completed (Week 3 Build, D1 Full Body). Loads/reps not captured.", exercises: [] },
      { id: "w_20260601_2", time: "", type: "stretching", title: "Daily mobility", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Week 3 (Build) kickoff — D1 Full Body lift + daily mobility. Conditioning block begins this week."
  },

  "2026-06-02": {
    checklist: {
      lift: false,
      plyo: true,
      conditioning: true,
      mobility: false,
      skating: false,
      skillWork: false,
      creatine: null,
      hydrationL: null,
      sleepHours: null,
      sleepQuality: null,
      bodyweight: 171.2,        // 77.65 kg — BIA scan
      nutritionQuality: null
    },
    body: {
      soreness: { knee: "pain" },
      injuries: ["Knee — pain onset during plyo/conditioning; switched to gym knee strengthening. Watch before next lower-body / plyo session."],
      energyLevel: null
    },
    // Full BIA (Renpho-style) body scan — logged 2026-06-02
    bodyScan: {
      source: "BIA handle-and-foot scale",
      weightKg: 77.65,
      weightLb: 171.2,
      deviceHR: 106,            // device reading, taken standing — NOT resting HR. Flagged "High". Do not use for zones.
      bmr: 1810,               // kcal
      bmi: 23.4,
      bodyAge: 21,             // Renpho metric — IGNORE for HR zones; use chronological 24
      healthScore: 85,
      fatPct: 14.0,
      fatMassKg: 10.9,
      fatFreeMassKg: 66.7,
      visceralFat: 6,
      muscleRatePct: 80.0,
      muscleMassKg: 62.1,
      skeletalMuscleRatioPct: 48.9,
      skeletalMuscleMassKg: 38.0,
      skeletalMuscleQualityIndex: 8.6,
      bodyCellMassKg: 44.0,
      boneMassKg: 3.7,
      mineralsKg: 4.6,
      proteinPct: 17.0,
      proteinMassKg: 13.2,
      waterPct: 63.0,
      totalBodyWaterKg: 48.9,
      intracellularWaterKg: 30.7,
      extracellularWaterKg: 18.1,
      segmental: {
        leftArm:  { fatMassKg: 0.7, muscleMassKg: 3.5 },
        rightArm: { fatMassKg: 0.8, muscleMassKg: 3.5 },
        leftLeg:  { fatMassKg: 1.4, muscleMassKg: 10.8 },
        rightLeg: { fatMassKg: 1.4, muscleMassKg: 10.8 },
        trunk:    { fatPct: 119.5, fatMassKg: 5.5, muscleMassKg: 29.3, subcutaneousFatPct: 11.8 }
      }
    },
    workouts: [
      { id: "w_20260602_1", time: "", type: "plyos", title: "Plyos (CNS) — Week 3", templateId: null, duration: null, rpe: null, location: "", notes: "Completed. Tue plyo session. Knee started hurting during the session.", exercises: [] },
      { id: "w_20260602_2", time: "", type: "cardio", title: "Conditioning — max-velocity sprints", templateId: null, duration: 15, rpe: null, location: "", notes: "~15 min. Tue post-plyo linear sprints (Phase 1 — Aerobic Engine). Knee pain came on around here.", exercises: [] },
      { id: "w_20260602_3", time: "", type: "off-ice", title: "Knee strengthening (gym)", templateId: null, duration: null, rpe: null, location: "gym", notes: "Knee started hurting during plyo/conditioning, so switched to the gym for knee strengthening instead of pushing on. Mobility not done today.", exercises: [] }
    ],
    meals: [],
    notes: "Plyo + conditioning (max-velocity sprints) completed, then KNEE PAIN onset — went to the gym and did knee strengthening instead of continuing; daily mobility skipped. Watch the knee before the next lower-body lift / plyo day. Body scan logged: 171.2 lb (+1.7 from the May 18 baseline 169.5), 14.0% body fat, 38.0 kg skeletal muscle — lean and gaining. Device HR 106 is a standing handle reading, not resting HR — still need a real morning RHR to calibrate Karvonen zones. NEWS: joining the Tokyo Wilds in Tokyo, Japan on July 20 (on-ice with the team begins). First game Aug 1 stands."
  },

  // ── Week 3 (Jun 1–7) — Jun 3–7 backfilled 2026-06-17 as completed per plan, except Sunday conditioning (not done). ──
  "2026-06-03": {
    checklist: { lift: true, plyo: false, conditioning: true, mobility: true, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260603_1", time: "", type: "off-ice", title: "Lift: Upper Body", templateId: "mhockey-os-d2", duration: 60, rpe: null, location: "", notes: "Backfilled — completed (Week 3 Build, D2 Upper). Loads/reps not captured.", exercises: [] },
      { id: "w_20260603_2", time: "", type: "cardio", title: "Conditioning — Zone 2 bike", templateId: null, duration: 60, rpe: null, location: "", notes: "Backfilled — completed. PM 60-min Zone 2 bike (118–137 bpm), nasal breathing.", exercises: [] },
      { id: "w_20260603_3", time: "", type: "stretching", title: "Daily mobility", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Wednesday — D2 Upper lift + PM Zone 2 bike (60 min) + mobility."
  },

  "2026-06-04": {
    checklist: { lift: false, plyo: true, conditioning: false, mobility: true, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260604_1", time: "", type: "plyos", title: "Plyos (elasticity/fascia) — Week 3", templateId: null, duration: null, rpe: null, location: "", notes: "Backfilled — completed. Thu plyo (elasticity/fascia focus — pogo, rotational). Phase 1 keeps Thu easy, no hard sprints.", exercises: [] },
      { id: "w_20260604_2", time: "", type: "stretching", title: "Daily mobility", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Thursday — plyo (elasticity/fascia) + mobility."
  },

  "2026-06-05": {
    checklist: { lift: true, plyo: false, conditioning: false, mobility: true, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260605_1", time: "", type: "off-ice", title: "Lift: Lower Body", templateId: "mhockey-os-d3", duration: 60, rpe: null, location: "", notes: "Backfilled — completed (Week 3 Build, D3 Lower). Loads/reps not captured.", exercises: [] },
      { id: "w_20260605_2", time: "", type: "stretching", title: "Daily mobility", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Friday — D3 Lower lift + mobility."
  },

  "2026-06-06": {
    checklist: { lift: false, plyo: false, conditioning: false, mobility: true, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260606_1", time: "", type: "stretching", title: "Mobility & decompression", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed. Saturday rest day; 1-hr mobility / deep-tissue decompression.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Saturday — rest day with mobility/decompression."
  },

  "2026-06-07": {
    checklist: { lift: false, plyo: false, conditioning: false, mobility: true, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260607_1", time: "", type: "stretching", title: "Daily mobility", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled. Sunday — mobility done. Conditioning (planned Z2 bike active-recovery flush) NOT done — the one missed session of the week."
  },

  // ── Week 4 (Jun 8–14) backfilled 2026-06-14 — Rider reports he did everything except Thursday conditioning. ──
  // NOTE: Rider is already skating in Sundsvall (Wed PM + Thu afternoon), ahead of the Jul 20 Tokyo on-ice start.
  "2026-06-08": {
    checklist: { lift: true, plyo: false, conditioning: false, mobility: true, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260608_1", time: "", type: "off-ice", title: "Lift: Full Body", templateId: "mhockey-os-d1", duration: 60, rpe: null, location: "", notes: "Backfilled — completed (Week 4 Build, D1 Full Body). Loads/reps not captured.", exercises: [] },
      { id: "w_20260608_2", time: "", type: "stretching", title: "Daily mobility", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Monday — D1 Full Body + mobility."
  },

  "2026-06-09": {
    checklist: { lift: false, plyo: true, conditioning: true, mobility: true, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260609_1", time: "", type: "plyos", title: "Plyos (CNS) — Week 4", templateId: null, duration: null, rpe: null, location: "", notes: "Backfilled — completed. Tue plyo session.", exercises: [] },
      { id: "w_20260609_2", time: "", type: "cardio", title: "Conditioning — max-velocity sprints", templateId: null, duration: null, rpe: null, location: "", notes: "Backfilled — completed. Tue post-plyo linear sprints (Phase 1 — Aerobic Engine).", exercises: [] },
      { id: "w_20260609_3", time: "", type: "stretching", title: "Daily mobility", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Tuesday — plyo (CNS) → max-velocity sprints + mobility."
  },

  "2026-06-10": {
    checklist: { lift: true, plyo: false, conditioning: true, mobility: true, skating: true, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260610_1", time: "", type: "off-ice", title: "Lift: Upper Body", templateId: "mhockey-os-d2", duration: 60, rpe: null, location: "", notes: "Backfilled — completed (Week 4 Build, D2 Upper). Loads/reps not captured.", exercises: [] },
      { id: "w_20260610_2", time: "", type: "cardio", title: "Conditioning — Zone 2 bike", templateId: null, duration: 60, rpe: null, location: "", notes: "Backfilled — completed. PM Zone 2 bike base (118–137 bpm).", exercises: [] },
      { id: "w_20260610_3", time: "20:00", type: "on-ice", title: "Skate (Sundsvall)", templateId: null, duration: 75, rpe: null, location: "Sundsvall", notes: "Backfilled — completed. Evening skate 8:00–9:15pm. Self-arranged ice ahead of the Jul 20 Tokyo team start.", exercises: [] },
      { id: "w_20260610_4", time: "", type: "stretching", title: "Daily mobility", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Wednesday — D2 Upper + PM Zone 2 bike + mobility, plus an evening skate (8:00–9:15pm) in Sundsvall."
  },

  "2026-06-11": {
    checklist: { lift: false, plyo: true, conditioning: false, mobility: true, skating: true, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260611_1", time: "", type: "plyos", title: "Plyos (elasticity/fascia) — Week 4", templateId: null, duration: null, rpe: null, location: "", notes: "Backfilled — completed. Thu plyo (elasticity/fascia focus).", exercises: [] },
      { id: "w_20260611_2", time: "13:00", type: "on-ice", title: "Skate (Sundsvall)", templateId: null, duration: 105, rpe: null, location: "Sundsvall", notes: "Backfilled — completed. Afternoon skate 1:00–2:45pm.", exercises: [] },
      { id: "w_20260611_3", time: "", type: "stretching", title: "Daily mobility", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed.", exercises: [] }
    ],
    meals: [],
    notes: "Thursday — plyo + mobility done, plus an afternoon skate (1:00–2:45pm). Conditioning NOT completed — the only missed session of the week (skated in the afternoon instead)."
  },

  "2026-06-12": {
    checklist: { lift: true, plyo: false, conditioning: false, mobility: true, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260612_1", time: "", type: "off-ice", title: "Lift: Lower Body", templateId: "mhockey-os-d3", duration: 60, rpe: null, location: "", notes: "Backfilled — completed (Week 4 Build, D3 Lower). Loads/reps not captured.", exercises: [] },
      { id: "w_20260612_2", time: "", type: "stretching", title: "Daily mobility", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Friday — D3 Lower + mobility."
  },

  "2026-06-13": {
    checklist: { lift: false, plyo: false, conditioning: false, mobility: true, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260613_1", time: "", type: "stretching", title: "Mobility & decompression", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed. Saturday rest day; 1-hr mobility / deep-tissue decompression.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Saturday — rest day with mobility."
  },

  "2026-06-14": {
    checklist: { lift: false, plyo: false, conditioning: true, mobility: true, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260614_1", time: "", type: "cardio", title: "Conditioning — Zone 2 bike (recovery flush)", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed. Sunday 45–60 min Zone 2 bike, active-recovery leg flush.", exercises: [] },
      { id: "w_20260614_2", time: "", type: "stretching", title: "Daily mobility", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Sunday — Zone 2 bike active-recovery flush + mobility."
  },

  // ── Week 5 (Jun 15–21) — FINAL week of Phase 1 (Aerobic Engine). Skating now 3×/wk on lift days. ──
  "2026-06-15": {
    checklist: { lift: true, plyo: false, conditioning: false, mobility: true, skating: true, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260615_1", time: "", type: "off-ice", title: "Lift: Full Body", templateId: "mhockey-os-d1", duration: 60, rpe: null, location: "", notes: "Completed (Week 5 Build, D1 Full Body). 60 min. Loads/reps not captured.", exercises: [] },
      { id: "w_20260615_2", time: "", type: "on-ice", title: "Skate (Sundsvall)", templateId: null, duration: 120, rpe: null, location: "Sundsvall", notes: "Completed. 2 hr on-ice. Skill/tempo per plan (not a gasser), lift first.", exercises: [] },
      { id: "w_20260615_3", time: "", type: "stretching", title: "Daily mobility", templateId: null, duration: 90, rpe: null, location: "", notes: "Completed. 1.5 hr.", exercises: [] }
    ],
    meals: [],
    notes: "Monday — D1 Full Body lift (60 min) + 2 hr skate + 1.5 hr mobility. On plan (lift-d1 + skating + mobility)."
  },

  "2026-06-16": {
    checklist: { lift: false, plyo: true, conditioning: false, mobility: true, skating: true, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: 173.7, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260616_1", time: "", type: "plyos", title: "Plyos (CNS) — Week 5", templateId: null, duration: null, rpe: null, location: "", notes: "Completed. Tue plyo session (CNS, Build peak week).", exercises: [] },
      { id: "w_20260616_2", time: "", type: "on-ice", title: "Skate (Sundsvall)", templateId: null, duration: 90, rpe: null, location: "Sundsvall", notes: "Completed. 1.5 hr on-ice (replaced the planned max-velocity sprint conditioning).", exercises: [] },
      { id: "w_20260616_3", time: "", type: "stretching", title: "Daily mobility", templateId: null, duration: 60, rpe: null, location: "", notes: "Completed. 1 hr.", exercises: [] }
    ],
    meals: [],
    notes: "Tuesday — plyo (CNS) → 1.5 hr skate + 1 hr mobility. Weigh-in 173.7 lb (+2.5 from the Jun 2 BIA scan of 171.2). Planned Tue conditioning (max-velocity sprints) not done — skated instead."
  },

  "2026-06-17": {
    checklist: { lift: true, plyo: false, conditioning: false, mobility: false, skating: true, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260617_1", time: "", type: "off-ice", title: "Lift: Upper Body", templateId: "mhockey-os-d2", duration: 45, rpe: null, location: "", notes: "Completed (Week 5 Build, D2 Upper). 45 min. Loads/reps not captured.", exercises: [] },
      { id: "w_20260617_2", time: "", type: "on-ice", title: "Skate (Sundsvall)", templateId: null, duration: 60, rpe: null, location: "Sundsvall", notes: "Completed. 1 hr on-ice.", exercises: [] }
    ],
    meals: [],
    notes: "Wednesday — D2 Upper lift (45 min) + 1 hr skate. Planned PM Zone 2 bike conditioning and mobility not reported."
  },

  "2026-06-18": {
    checklist: { lift: false, plyo: false, conditioning: true, mobility: true, skating: true, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: 172.6, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260618_1", time: "", type: "cardio", title: "Conditioning — Norwegian 4x4 (bike)", templateId: null, duration: 40, rpe: null, location: "", notes: "Completed. Norwegian 4x4 VO2max intervals on the bike with warmup + cooldown, 40 min total. HR 165–170 throughout (~84–87% of HRmax 196, Zone 4); last rep 170–180 (~87–92%, into Zone 5). High-intensity day — replaced the planned easy Thu plyo.", exercises: [] },
      { id: "w_20260618_2", time: "", type: "on-ice", title: "Skate (Sundsvall)", templateId: null, duration: 120, rpe: null, location: "Sundsvall", notes: "Completed. 2 hr on-ice.", exercises: [] },
      { id: "w_20260618_3", time: "", type: "stretching", title: "Pool mobility / stretching", templateId: null, duration: 15, rpe: null, location: "pool", notes: "Completed. 15 min pool work for mobility/stretching.", exercises: [] }
    ],
    meals: [],
    notes: "Thursday — Norwegian 4x4 VO2max intervals on the bike (40 min, Zone 4 into Zone 5) + 2 hr skate + 15 min pool mobility. Weigh-in 172.6 lb (-1.1 from Jun 16's 173.7). DEVIATION FROM PLAN: today was scheduled as an EASY plyo (elasticity/fascia, no hard sprints) + mobility; instead Rider ran a hard interval session plus a 2 hr skate. That's a high-CNS / high-aerobic day stacked on Wed's lift+skate — watch fatigue heading into Fri's D3 Lower."
  },

  "2026-06-19": {
    checklist: { lift: true, plyo: false, conditioning: false, mobility: false, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260619_1", time: "", type: "off-ice", title: "Lift: Lower Body", templateId: "mhockey-os-d3", duration: 65, rpe: null, location: "home", notes: "Completed (Week 5 Build, D3 Lower) — done at home with lighter weight, higher-rep substitutes for the prescribed barbell movements. 65 min. Loads/reps not captured.", exercises: [] }
    ],
    meals: [],
    notes: "Friday — D3 Lower lift done at home (lighter weight, higher-rep substitutes), 65 min. No skate or mobility reported."
  },

  "2026-06-20": {
    checklist: { lift: false, plyo: false, conditioning: false, mobility: false, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [],
    meals: [],
    notes: "Saturday — full rest, no exercise."
  },

  "2026-06-21": {
    checklist: { lift: false, plyo: false, conditioning: false, mobility: false, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [],
    meals: [],
    notes: "Sunday — full rest, no exercise. Closes out Week 5 (final week of Phase 1, Aerobic Engine)."
  },

  "2026-06-22": {
    checklist: { lift: true, plyo: false, conditioning: false, mobility: false, skating: true, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: 175.3, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260622_1", time: "", type: "off-ice", title: "Lift: Full Body", templateId: "mhockey-os-d1", duration: 55, rpe: null, location: "", notes: "Completed (Week 6 Overreach / lift-plan Wk8, D1 Full Body — highest-volume week). 55 min. Loads/reps not captured.", exercises: [] },
      { id: "w_20260622_2", time: "", type: "on-ice", title: "Skate (Sundsvall)", templateId: null, duration: 80, rpe: null, location: "Sundsvall", notes: "Completed. 1 hr 20 min on-ice.", exercises: [] }
    ],
    meals: [],
    notes: "Monday — first day of Week 6 (Peak Accumulation / Overreach, lift-plan Wk8). D1 Full Body lift (55 min) → 1 hr 20 min skate, per plan (lift before skate). Mobility NOT done (planned). Weigh-in 175.3 lb — new high, +2.7 from Jun 18's 172.6 and +5.8 from the May 18 baseline (169.5). Overreach week: expect on-ice pop to dip late-week as fatigue accumulates — that's normal, it masks fitness."
  }
};
