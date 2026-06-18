// data/daily/2026-05.js — May 2026 daily logs.
// Claude writes here when Rider reports workouts, meals, sleep, soreness, etc.
// One month per file keeps each file small (~200–400 lines).

window.DAILY_2026_05 = {
  "2026-05-18": {
    checklist: {
      lift: true,
      plyo: false,
      conditioning: false,
      mobility: true,
      skating: false,
      skillWork: false,
      creatine: null,
      hydrationL: null,
      sleepHours: 7.1,
      sleepQuality: "ok",
      bodyweight: 169.5,
      nutritionQuality: null
    },
    body: {
      soreness: {},
      injuries: [],
      energyLevel: null
    },
    workouts: [
      {
        id: "w_20260518_1",
        time: "06:45",
        type: "off-ice",
        title: "Lift: Full Body",
        templateId: "mhockey-os-d1",
        duration: 75,
        rpe: null,
        location: "",
        notes:
          "First day of full-time training regiment. Week 1 Foundation, D1 Full Body.\n" +
          "Block A: chose Hip Thrust over Trap Bar DL.\n" +
          "Block B: subbed DB Incline for BB Incline Press.\n" +
          "Only Block A (Hip Thrust) and Block B (Incline + Cable Row) loads reported. KB Swing, Hamstring Curl, Farmers Carry, Block C, and Finisher not reported.",
        exercises: [
          { name: "Hip Thrust (Block A — chose hip thrust over trap bar DL)", sets: [
            { reps: 8, weight: 80,  unit: "kg", notes: "set 1 — 2 × 20kg plates/side. Prescribed reps assumed (continuing wk2 8/8/6 pattern). Bar weight not stated." },
            { reps: 8, weight: 120, unit: "kg", notes: "set 2 — 3 × 20kg plates/side. Prescribed reps assumed." },
            { reps: 6, weight: 120, unit: "kg", notes: "set 3 — 3 × 20kg plates/side. Prescribed reps assumed." }
          ]},
          { name: "DB Incline Press (subbed for BB Incline Press)", sets: [
            { reps: 8, weight: 25,   unit: "kg", notes: "set 1 — per DB. Prescribed reps assumed (continuing wk2 8/8/6 pattern). Sub: dumbbells instead of barbell." },
            { reps: 8, weight: 27.5, unit: "kg", notes: "set 2 — per DB. Prescribed reps assumed." },
            { reps: 6, weight: 30,   unit: "kg", notes: "set 3 — per DB. Prescribed reps assumed." }
          ]},
          { name: "Cable Row", sets: [
            { reps: 8, weight: 60, unit: "kg", notes: "set 1 — prescribed reps assumed (3 × 8)." },
            { reps: 8, weight: 60, unit: "kg", notes: "set 2 — prescribed reps assumed." },
            { reps: 8, weight: 60, unit: "kg", notes: "set 3 — prescribed reps assumed." }
          ]}
        ]
      },
      {
        id: "w_20260518_2",
        time: "12:10",
        type: "stretching",
        title: "Full-body mobility + strengthening",
        templateId: null,
        duration: 65,
        rpe: null,
        location: "",
        notes:
          "12:10–13:15 (65 min). Full-body mobility, stretching, and strengthening.\n" +
          "Hip mobility circuit. Shoulder mobility + strength. Knee strengthening. Full-body foam rolling.",
        exercises: []
      },
      {
        id: "w_20260518_3",
        time: "13:15",
        type: "plyos",
        title: "Turf prep — semi-explosive movement",
        templateId: null,
        duration: 15,
        rpe: null,
        location: "turf",
        notes:
          "~15 min on turf with semi-explosive movements to get moving and prep body for Tuesday (plyo Base Session A start).",
        exercises: []
      }
    ],
    meals: [],
    notes: "Day 1 of full-time training regiment (Week 1 — Foundation). Full Body D1 lift 06:45–08:00 AM (75 min). BW 169.5 lbs at 09:30 AM (the offseason-start baseline). Slept 23:15–06:20 (7.1h, ok). Block A (Hip Thrust) + Block B (DB Incline sub + Cable Row) reported. Other blocks/finisher not reported.\nPM: 65 min full-body mobility/stretching/strengthening (hips, shoulders, knees, foam roll) + 15 min turf semi-explosive prep for tomorrow's plyo start."
  },

  "2026-05-19": {
    checklist: {
      lift: false,
      plyo: true,
      conditioning: false,
      mobility: true,
      skating: false,
      skillWork: false,
      creatine: null,
      hydrationL: null,
      sleepHours: 8,
      sleepQuality: "good",
      bodyweight: null,
      nutritionQuality: null
    },
    body: {
      soreness: {},
      injuries: [],
      energyLevel: null,
      sleepWindow: "23:30–07:30"
    },
    workouts: [
      {
        id: "w_20260519_1",
        time: "08:15",
        type: "stretching",
        title: "Full-body mobility + stretching",
        templateId: null,
        duration: 45,
        rpe: null,
        location: "",
        notes:
          "08:15–09:00 (45 min). Full-body foam roll. Shoulder, hip, and back mobility. Stretching.",
        exercises: []
      },
      {
        id: "w_20260519_2",
        time: "10:15",
        type: "recovery",
        title: "Nap",
        templateId: null,
        duration: 105,
        rpe: null,
        location: "",
        notes: "10:15–12:00 (1h 45m).",
        exercises: []
      },
      {
        id: "w_20260519_3",
        time: null,
        type: "plyos",
        title: "Plyo Base — Session A + lateral movement extension",
        templateId: "plyo-base-A",
        duration: 70,
        rpe: null,
        location: "",
        notes:
          "FIRST plyo session of the off-season. Completed full Plyo Base Session A (linear/vertical: tuck jumps, broad jumps, short accel sprints, two-footed quick hops, line taps, lunges, hip openers).\n" +
          "Added ~30 min of lateral movement bursts at 60–80% effort: shuffle-to-sprint transitions, side-to-side lateral movement, backward-to-forward transition runs (overlaps with Session B lateral/agility content).\n" +
          "10-min bike before and after as warm-up / cool-down.",
        exercises: [
          { name: "Bike — warm-up", sets: [
            { reps: 1, notes: "10 min easy spin pre-session" }
          ]},
          { name: "Plyo Base Session A — full prescribed block", sets: [
            { reps: 1, notes: "Tuck Jumps 2×5, Broad Jumps 2×4, Short Accel Sprints 4×10–15m @ 70–80%, Two-Footed Quick Hops 2×8s, Quick Line Taps 2×8s, Forward/Reverse Lunges 2×6/leg, hip openers. Prescribed reps assumed." }
          ]},
          { name: "Lateral movement bursts (added — Session B–style)", sets: [
            { reps: 1, notes: "~30 min @ 60–80%: shuffle-to-sprint transitions, side-to-side lateral movement, backward-to-forward transition runs. Reps not counted." }
          ]},
          { name: "Bike — cool-down", sets: [
            { reps: 1, notes: "10 min easy spin post-session" }
          ]}
        ]
      }
    ],
    meals: [],
    notes: "Slept 23:30–07:30 (8h, good). AM mobility 08:15–09:00 (45 min): full-body roll + shoulder/hip/back mobility + stretching. Nap 10:15–12:00 (1h 45m). FIRST plyo session of the off-season: full Plyo Base Session A + ~30 min added lateral movement bursts (shuffle-to-sprint, side-to-side, backward-to-forward transitions) at 60–80%, 10-min bike either side. Effectively combined Session A + Session B content in one day — monitor IT band / quad / lower back tomorrow."
  },

  "2026-05-20": {
    checklist: {
      lift: true,
      plyo: false,
      conditioning: false,
      mobility: true,
      skating: false,
      skillWork: false,
      creatine: null,
      hydrationL: null,
      sleepHours: 7.17,
      sleepQuality: "ok",
      bodyweight: null,
      nutritionQuality: null
    },
    body: {
      soreness: {},
      injuries: [],
      energyLevel: null,
      sleepWindow: "23:20–06:30 (7h 10m). Groggy in AM, improved through the day. Carrying sleep debt — needs to make it up."
    },
    workouts: [
      {
        id: "w_20260520_1",
        time: "08:00",
        type: "off-ice",
        title: "Lift: Upper Body",
        templateId: "mhockey-os-d2",
        duration: 60,
        rpe: null,
        location: "",
        notes:
          "08:00–09:00 (60 min). Week 1 Foundation, D2 Upper / Lower Plyo.\n" +
          "Completed Primer/Plyo + Block A (Press) + Block B (Pull + Carry). Skipped Block C — lower plyo finisher (Resisted Power Jump, Continuous Bench Skater, Cossack Slide).\n" +
          "Loads reported: Hex Bench 135 lb × 3, Power Shrug 135 lb × 3, Lat Pull Down 55 kg × 3. Other exercises completed without stated loads.",
        exercises: [
          { name: "Plyo Depth Pushup (Primer)", sets: [
            { reps: 6, notes: "set 1 — reps assumed per side (prescribed 2 rounds × 6/side)" },
            { reps: 6, notes: "set 2 — reps assumed per side" }
          ]},
          { name: "MB Rainbow (Primer)", sets: [
            { reps: 4, notes: "set 1 — reps assumed per side (prescribed 2 × 4/side)" },
            { reps: 4, notes: "set 2 — reps assumed per side" }
          ]},
          { name: "Front / Lateral Raise (Primer)", sets: [
            { reps: 4, notes: "set 1 — reps assumed per side (prescribed 2 × 4/side)" },
            { reps: 4, notes: "set 2 — reps assumed per side" }
          ]},
          { name: "Hex Bench w/ 6s eccentric", sets: [
            { reps: 10, weight: 135, unit: "lb", notes: "set 1 — reps assumed per prescription (10/8/6 reps, 6s eccentric)" },
            { reps: 8,  weight: 135, unit: "lb", notes: "set 2 — reps assumed per prescription" },
            { reps: 6,  weight: 135, unit: "lb", notes: "set 3 — reps assumed per prescription. Same weight across all 3 sets" }
          ]},
          { name: "Push Up", sets: [
            { reps: null, notes: "set 1 — prescribed 3 × MAX. Count not reported" },
            { reps: null, notes: "set 2 — prescribed 3 × MAX. Count not reported" },
            { reps: null, notes: "set 3 — prescribed 3 × MAX. Count not reported" }
          ]},
          { name: "Power Shrug", sets: [
            { reps: 8, weight: 135, unit: "lb", notes: "set 1 — reps assumed (prescribed 3 × 8)" },
            { reps: 8, weight: 135, unit: "lb", notes: "set 2 — reps assumed" },
            { reps: 8, weight: 135, unit: "lb", notes: "set 3 — reps assumed" }
          ]},
          { name: "Weighted Chinup → BW", sets: [
            { reps: null, notes: "set 1 — prescribed 5/5, 5/4, 5/3 (weighted+BW). Reps/weight not reported" },
            { reps: null, notes: "set 2 — prescribed. Reps/weight not reported" },
            { reps: null, notes: "set 3 — prescribed. Reps/weight not reported" }
          ]},
          { name: "Lat Pull Down", sets: [
            { reps: 8, weight: 55, unit: "kg", notes: "set 1 — reps assumed (prescribed 3 × 8)" },
            { reps: 8, weight: 55, unit: "kg", notes: "set 2 — reps assumed" },
            { reps: 8, weight: 55, unit: "kg", notes: "set 3 — reps assumed" }
          ]},
          { name: "Single-Arm Alt Carry", sets: [
            { reps: 1, notes: "set 1 = 1 lap (prescribed 3 × 1 lap). Weight not reported" },
            { reps: 1, notes: "set 2 = 1 lap. Weight not reported" },
            { reps: 1, notes: "set 3 = 1 lap. Weight not reported" }
          ]}
        ],
        skipped: ["Block C — Lower Plyo finisher (Resisted Power Jump, Continuous Bench Skater, Cossack Slide)"]
      },
      {
        id: "w_20260520_2",
        time: "14:10",
        type: "stretching",
        title: "Ankle strength, stability + mobility",
        templateId: null,
        duration: 55,
        rpe: null,
        location: "",
        notes:
          "14:10–15:05 (55 min). Ankle-focused session.\n" +
          "WARM-UP: 10m forwards + 10m backwards walking on heels, toes, outside of feet, inside of feet.\n" +
          "MAIN: ankle strength, stability, and mobility work.\n" +
          "FINISH: ~25 min lacrosse ball rolling — feet, calves, shins.",
        exercises: []
      }
    ],
    meals: [],
    notes: "Day 3 of Week 1 (Foundation). Slept 23:20–06:30 (7h 10m, ok) — groggy in AM, better as day went on. Carrying sleep debt, prioritize catching up. AM lift 08:00–09:00 (60 min) — D2 Upper Body. Completed Primer + Block A (Press: Hex Bench 135 lb × 3, Push Up, Power Shrug 135 lb × 3) + Block B (Weighted Chinup, Lat Pull Down 55 kg × 3, SA Alt Carry). Skipped Block C lower plyo finisher. PM 14:10–15:05 (55 min) ankle strength/stability/mobility: heel/toe/outside/inside walks (10m each direction) warm-up, ankle work, ~25 min lacrosse ball rolling on feet, calves, shins."
  },

  "2026-05-23": {
    checklist: {
      lift: false,
      plyo: false,
      conditioning: false,
      mobility: false,
      skating: false,
      skillWork: false,
      creatine: null,
      hydrationL: null,
      sleepHours: 6.5,
      sleepQuality: "ok",
      bodyweight: null,
      nutritionQuality: null
    },
    body: {
      soreness: {},
      injuries: [],
      energyLevel: null
    },
    workouts: [
      {
        id: "w_20260523_1",
        time: null,
        type: "recovery",
        title: "Nap",
        templateId: null,
        duration: 240,
        rpe: null,
        location: "",
        notes: "4-hour nap on Saturday — recovery after 6.5h Friday night sleep.",
        exercises: []
      }
    ],
    meals: [],
    notes: "Slept 6.5h Friday night. 4-hour nap during the day to catch up."
  },

  "2026-05-24": {
    checklist: {
      lift: false,
      plyo: false,
      conditioning: false,
      mobility: false,
      skating: false,
      skillWork: false,
      creatine: null,
      hydrationL: null,
      sleepHours: 8.5,
      sleepQuality: "good",
      bodyweight: 170,
      nutritionQuality: null
    },
    body: {
      soreness: {},
      injuries: [],
      energyLevel: null
    },
    workouts: [],
    meals: [],
    notes: "BW 170 lbs. Slept 8.5h Saturday night (good) — recovering from short Friday night + 4h Saturday nap."
  },

  "2026-05-22": {
    checklist: {
      lift: true,
      plyo: false,
      conditioning: false,
      mobility: false,
      skating: false,
      skillWork: false,
      creatine: null,
      hydrationL: null,
      sleepHours: null,
      sleepQuality: null,
      bodyweight: null,
      nutritionQuality: null
    },
    body: {
      soreness: {},
      injuries: [],
      energyLevel: null
    },
    workouts: [
      {
        id: "w_20260522_1",
        time: null,
        type: "off-ice",
        title: "Lift: Lower Body",
        templateId: "mhockey-os-d3",
        duration: 60,
        rpe: null,
        location: "",
        notes:
          "D3 Lower Body (Week 1 — Foundation). Lighter weight and bodyweight substitutions throughout — equipment or availability constraints. Still completed a quality lower body session.",
        exercises: [
          { name: "Box Squat (lighter weight sub)", sets: [
            { reps: null, notes: "lighter weight substitution — exact load not reported. Prescribed 3 × 8–10." },
            { reps: null, notes: "set 2 — reps/load not reported" },
            { reps: null, notes: "set 3 — reps/load not reported" }
          ]},
          { name: "Banded Skater Squat", sets: [
            { reps: null, notes: "bodyweight/banded sub — load not reported. Prescribed 3 × 6/side." },
            { reps: null, notes: "set 2 — not reported" },
            { reps: null, notes: "set 3 — not reported" }
          ]},
          { name: "Band-Assisted Jump", sets: [
            { reps: null, notes: "prescribed 3 × 6 — reps not reported" },
            { reps: null, notes: "set 2 — not reported" },
            { reps: null, notes: "set 3 — not reported" }
          ]},
          { name: "Barbell RDL (lighter weight sub)", sets: [
            { reps: null, notes: "lighter weight substitution — load not reported. Prescribed 10/10/8." },
            { reps: null, notes: "set 2 — not reported" },
            { reps: null, notes: "set 3 — not reported" }
          ]}
        ]
      }
    ],
    meals: [],
    notes: "Friday D3 Lower Body lift. Equipment constraints led to lighter weight and bodyweight substitutions throughout — still a strong lower body session. Specific loads and reps not reported."
  },

  "2026-05-21": {
    checklist: {
      lift: false,
      plyo: false,
      conditioning: false,
      mobility: true,
      skating: false,
      skillWork: false,
      creatine: null,
      hydrationL: null,
      sleepHours: null,
      sleepQuality: null,
      bodyweight: 165,
      nutritionQuality: null
    },
    body: {
      soreness: {},
      injuries: [],
      energyLevel: null
    },
    workouts: [
      {
        id: "w_20260521_1",
        time: "12:10",
        type: "recovery",
        title: "Mobility / recovery / stretching / massage",
        templateId: null,
        duration: 70,
        rpe: null,
        location: "",
        notes:
          "12:10–13:20 (1h 10m). Mobility, recovery, stretching, and massage work.\n" +
          "Hit shoulders, hips, and back. Bulk of the session on IT bands — rolling out and loosening them up.",
        exercises: []
      }
    ],
    meals: [],
    notes: "Day 4 of Week 1 (Foundation). BW 165 lbs (↓4.5 from the May 18 baseline of 169.5). Mobility/recovery focus 12:10–13:20 (70 min): shoulders, hips, back, and mostly IT band rolling/loosening."
  },

  // ===== Week 2 (May 25–31) — backfilled 2026-06-02 as completed per plan. Loads/sleep not captured. =====
  "2026-05-25": {
    checklist: { lift: true, plyo: false, conditioning: false, mobility: false, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260525_1", time: "", type: "off-ice", title: "Lift: Full Body", templateId: "mhockey-os-d1", duration: 60, rpe: null, location: "", notes: "Backfilled — completed (Week 2 Foundation, D1 Full Body). Loads/reps not captured.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Week 2 — D1 Full Body lift."
  },
  "2026-05-26": {
    checklist: { lift: false, plyo: true, conditioning: false, mobility: true, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260526_1", time: "", type: "plyos", title: "Plyo Base — Session A", templateId: null, duration: null, rpe: null, location: "", notes: "Backfilled — completed. Base phase, linear/vertical focus.", exercises: [] },
      { id: "w_20260526_2", time: "", type: "stretching", title: "Daily mobility", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Plyo Base Session A + daily mobility."
  },
  "2026-05-27": {
    checklist: { lift: true, plyo: false, conditioning: true, mobility: false, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260527_1", time: "", type: "off-ice", title: "Lift: Upper Body", templateId: "mhockey-os-d2", duration: 60, rpe: null, location: "", notes: "Backfilled — completed (Week 2 Foundation, D2 Upper + lower plyo finisher). Loads/reps not captured.", exercises: [] },
      { id: "w_20260527_2", time: "", type: "cardio", title: "Conditioning — Zone 2 bike ride", templateId: null, duration: 60, rpe: null, location: "", notes: "60-min Zone 2 bike ride (aerobic base). Logged 2026-06-02.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Week 2 — D2 Upper Body lift + 60-min Zone 2 bike ride."
  },
  "2026-05-28": {
    checklist: { lift: false, plyo: true, conditioning: false, mobility: true, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260528_1", time: "", type: "plyos", title: "Hill Plyos (subbed for Plyo Base — Session B)", templateId: null, duration: null, rpe: null, location: "hill", notes: "Did HILL PLYOS instead of the planned Base Session B (lateral/agility). Completed.", exercises: [] },
      { id: "w_20260528_2", time: "", type: "stretching", title: "Daily mobility", templateId: null, duration: 50, rpe: null, location: "", notes: "Backfilled — completed.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Swapped planned Base Session B for hill plyos. + daily mobility."
  },
  "2026-05-29": {
    checklist: { lift: true, plyo: false, conditioning: false, mobility: false, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [
      { id: "w_20260529_1", time: "", type: "off-ice", title: "Lift: Lower Body", templateId: "mhockey-os-d3", duration: 60, rpe: null, location: "", notes: "Backfilled — completed (Week 2 Foundation, D3 Lower). Loads/reps not captured.", exercises: [] }
    ],
    meals: [],
    notes: "Backfilled as completed. Week 2 — D3 Lower Body lift."
  },
  "2026-05-30": {
    checklist: { lift: false, plyo: false, conditioning: false, mobility: false, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [],
    meals: [],
    notes: "Planned light mobility — NOT done. Effectively a rest day."
  },
  "2026-05-31": {
    checklist: { lift: false, plyo: false, conditioning: false, mobility: false, skating: false, skillWork: false, creatine: null, hydrationL: null, sleepHours: null, sleepQuality: null, bodyweight: null, nutritionQuality: null },
    body: { soreness: {}, injuries: [], energyLevel: null },
    workouts: [],
    meals: [],
    notes: "Full rest (planned — week before Build phase)."
  }
};
