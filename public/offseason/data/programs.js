// data/programs.js — All program prescriptions. Claude reads when Rider asks
// "what should I do today?" or when logging a workout against a template.
// Stable file — rarely edited unless program changes.

window.PROGRAMS = {

  // ===== LIFT TEMPLATES =====
  liftTemplates: [
    // ACTIVE: M. HOCKEY OFF-SEASON 3-DAY
    {
      id: "mhockey-os-d1",
      program: "M. Hockey",
      cycle: "Off-Season 2026 (3-day)",
      day: "D1",
      focus: "Full Body",
      active: true,
      sections: [
        { name: "Primer / Plyo (2 rounds)", items: [
          { name: "Skater to Vertical",          prescription: "4 / side" },
          { name: "Depth Drop to Broad",         prescription: "4" },
          { name: "Jump Rope",                   prescription: "50" }
        ]},
        { name: "Block A — Posterior", items: [
          { name: "Trap Bar Deadlift OR Hip Thrust", prescription: "10 / 8 / 6 (wk2: 8 / 8 / 6)" },
          { name: "KB Swing",                    prescription: "3 × 5" },
          { name: "Hamstring Curl",              prescription: "3 × 8" }
        ]},
        { name: "Block B — Push + Pull", items: [
          { name: "BB Incline Press",            prescription: "10 / 8 / 6 (wk2: 8 / 8 / 6)" },
          { name: "Cable Row",                   prescription: "3 × 8" },
          { name: "Farmers Carry",               prescription: "3 × 1 lap" }
        ]},
        { name: "Block C — Power + Conditioning", items: [
          { name: "DB Snatch",                   prescription: "2 × 6 / side (wk2: 3 × 6 / side)" },
          { name: "Weighted Dip",                prescription: "2 × 8 (wk2: 3 × 5)" },
          { name: "TRX Facepull / Curl / Row",   prescription: "2 × 8 / 8 / MAX (wk2: 3 × 8 / 8 / MAX)" }
        ]},
        { name: "Finisher (2 rounds)", items: [
          { name: "BW Lunges",                   prescription: "1 lap" },
          { name: "HK Thoracic Rotation",        prescription: "6 / side" },
          { name: "Shoulder CAR",                prescription: "6" },
          { name: "Continuous Box Jump",         prescription: "20" }
        ]}
      ],
      source: "POST FULL 1 sheet · off-season-workouts)3-day-program).xlsx",
      notes: "Day 1 of 3-day rotation. Full body. Two columns = wk1 / wk2 progression."
    },
    {
      id: "mhockey-os-d2",
      program: "M. Hockey",
      cycle: "Off-Season 2026 (3-day)",
      day: "D2",
      focus: "Upper / Lower Plyo",
      active: true,
      sections: [
        { name: "Primer / Plyo (2 rounds)", items: [
          { name: "Plyo Depth Pushup",           prescription: "6 / side" },
          { name: "MB Rainbow",                  prescription: "4 / side" },
          { name: "Front / Lateral Raise",       prescription: "4 / side" }
        ]},
        { name: "Block A — Press", items: [
          { name: "Hex Bench w/ 6s eccentric",   prescription: "10/2, 8/2, 6/4 (wk2: 8/2, 6/2, 5/2)" },
          { name: "Push Up",                     prescription: "3 × MAX" },
          { name: "Power Shrug",                 prescription: "3 × 8" }
        ]},
        { name: "Block B — Pull + Carry", items: [
          { name: "Weighted Chinup → BW",        prescription: "5/5, 5/4, 5/3 (wk2: 10, 10, 8)" },
          { name: "Lat Pull Down",               prescription: "3 × 8" },
          { name: "Single-Arm Alt Carry",        prescription: "3 × 1 lap" }
        ]},
        { name: "Block C — Lower Plyo + Mobility", items: [
          { name: "Resisted Power Jump",         prescription: "3 × 6 (wk2: 2 × 6 / side)" },
          { name: "Continuous Bench Skater",     prescription: "3 × 10 / side (wk2: 2 × 12–15)" },
          { name: "Cossack Slide",               prescription: "3 × 6 / side (wk2: 2 × 8/8/MAX)" }
        ]}
      ],
      source: "POST UPPER 2 sheet · off-season-workouts)3-day-program).xlsx",
      notes: "Day 2 of 3-day rotation. Upper push/pull + lower-body plyo finisher."
    },
    {
      id: "mhockey-os-d3",
      program: "M. Hockey",
      cycle: "Off-Season 2026 (3-day)",
      day: "D3",
      focus: "Lower",
      active: true,
      sections: [
        { name: "Primer / Plyo (2 rounds)", items: [
          { name: "Plate Pogo",                  prescription: "—" },
          { name: "UH Med Ball Rotational Toss", prescription: "4 / side" },
          { name: "Depth Drop to Vertical",      prescription: "4" }
        ]},
        { name: "Block A — Squat", items: [
          { name: "Box Squat",                   prescription: "3 × 10–12 (wk2: 3 × 8–10)" },
          { name: "Banded Skater Squat",         prescription: "3 × 6 / side" },
          { name: "Band-Assisted Jump",          prescription: "3 × 6" }
        ]},
        { name: "Block B — Posterior + Quad", items: [
          { name: "Barbell RDL",                 prescription: "10 / 8 / 6 (wk2: 10 / 10 / 8)" },
          { name: "Leg Extension",               prescription: "3 × 8–12" },
          { name: "Banded Hip Flexion",          prescription: "3 × 6 / side" }
        ]},
        { name: "Block C — Press + Carry", items: [
          { name: "Landmine Rotational Press",   prescription: "2 × 6 / side" },
          { name: "Slider Cossack",              prescription: "2 × 8 / side (wk2: 2 × 12–15)" },
          { name: "Sled March",                  prescription: "2 × 1 lap" }
        ]},
        { name: "Arm Farm Finisher", items: [
          { name: "DB Alt Curl",                 prescription: "2 × 8 / side" },
          { name: "Banded Tricep Extension",     prescription: "2 × 12–15" },
          { name: "Hammer Curls",                prescription: "2 × 15–20" },
          { name: "BW Dips",                     prescription: "2 × AMRAP" }
        ]}
      ],
      source: "POST LOWER 3 sheet · off-season-workouts)3-day-program).xlsx",
      notes: "Day 3 of 3-day rotation. Lower-focused. Sheet header says 'INSEASON D2 / UPPER' — ignore, leftover artifact."
    },

    // REFERENCE: FALL 2025 + IN-SEASON CYCLES (stubs for future)
    { id: "mhockey-fall25-d1",   program: "M. Hockey", cycle: "Fall 2025 (reference)",            day: "D1", focus: "Squat / Hamstring / Incline Press / Pullup",   active: false, sections: [], source: "D1 sheet" },
    { id: "mhockey-fall25-d2",   program: "M. Hockey", cycle: "Fall 2025 (reference)",            day: "D2", focus: "Trap bar jump / LM rot press / RFE plyo",      active: false, sections: [], source: "D2 sheet" },
    { id: "mhockey-fall25-p2d1", program: "M. Hockey", cycle: "Fall 2025 P2 (reference)",         day: "D1", focus: "Zercher / LM row+press / Floor press",         active: false, sections: [], source: "P2D1 sheet" },
    { id: "mhockey-fall25-p2d2", program: "M. Hockey", cycle: "Fall 2025 P2 (reference)",         day: "D2", focus: "Trap bar jump / LM clean+press / Alt PD-row",  active: false, sections: [], source: "P2D2 sheet" },
    { id: "mhockey-in25-p1d1",   program: "M. Hockey", cycle: "In-Season 2025-26 P1 (reference)", day: "D1", focus: "Lower (Split Squat + RDL/Hamcurl)",            active: false, sections: [], source: "INSEASON D1 sheet" },
    { id: "mhockey-in25-p1d2",   program: "M. Hockey", cycle: "In-Season 2025-26 P1 (reference)", day: "D2", focus: "Upper (PD Row + Z Press + FE Floor Press)",    active: false, sections: [], source: "INSEASON D2 sheet" },
    { id: "mhockey-in25-p2d1",   program: "M. Hockey", cycle: "In-Season 2025-26 P2 (reference)", day: "D1", focus: "Lower (Split Squat + Incline Bench)",          active: false, sections: [], source: "inseason p2d1 sheet" },
    { id: "mhockey-in25-p2d2",   program: "M. Hockey", cycle: "In-Season 2025-26 P2 (reference)", day: "D2", focus: "RDL/Hip Press + BB Row + Push Press",          active: false, sections: [], source: "inseason p2d2 sheet" },
    { id: "mhockey-in25-p3d1",   program: "M. Hockey", cycle: "In-Season 2025-26 P3 (reference)", day: "D1", focus: "Hip Press / Safety Bar Box + Incline DB",      active: false, sections: [], source: "INSEASON P3D1 sheet" },
    { id: "mhockey-in25-p3d2",   program: "M. Hockey", cycle: "In-Season 2025-26 P3 (reference)", day: "D2", focus: "BB RDL + Pendlay Row + Push Press",            active: false, sections: [], source: "INSEASON P3D2 sheet" }
  ],

  // ===== PLYO / SPEED & AGILITY (extended to ~17 weeks through Sep 1) =====
  plyoProgram: {
    name: "Solo Off-Season Speed & Agility (Defenseman)",
    source: "Lucas Jones (base 9-week) + extended to Sep 1",
    durationWeeks: 17,
    notes: "Quality > volume. Full recovery between explosive reps. Prioritize landing softly + powerful hip extension. Original 9-week program extended with Maintain + Pre-Camp phases to cover full off-season.",
    phases: [
      {
        name: "Base",
        weeks: "1–3",
        goal: "Movement quality + basic power. Controlled, sub-maximal. Form first.",
        drills: [
          { name: "Tuck Jumps", prescription: "2–3 × 5", cue: "Quarter-squat → explode up, knees to chest, soft land." },
          { name: "Skater (Side-to-Side) Jumps", prescription: "2–3 × 6 per side", cue: "Lateral leap, mimic skating push. Land single-leg, immediately drive across." },
          { name: "Broad (Standing Long) Jumps", prescription: "2 × 4–6", cue: "Semi-squat → max forward jump. Drive hips, extend ankles." },
          { name: "Two-Footed Quick Hops", prescription: "2 × 5–10s", cue: "Soft knees, quick jump-rope action without rope." },
          { name: "Quick Line Taps", prescription: "2 × 5–10s", cue: "Tap feet rapidly side-to-side on a line." },
          { name: "Short Acceleration Sprints", prescription: "4 × 10–15m @ 70–80%", cue: "Knee drive + arm action. Walk back fully." },
          { name: "Lateral Shuffle / Carioca", prescription: "3 × 5–10m each way", cue: "Knees bent, side-step or grapevine." },
          { name: "Forward / Reverse Lunges", prescription: "2 × 6–8 per leg", cue: "Forward = skating stride, reverse = backward-skating musculature." }
        ]
      },
      {
        name: "Build",
        weeks: "4–6",
        goal: "Increase intensity, add single-leg + multi-directional. Approach max effort on short sprints.",
        drills: [
          { name: "Flying Sprints", prescription: "3–4 × 20–30m", cue: "Jog 5–10m for momentum, then 20m @ 90%. Full recovery." },
          { name: "Bounding", prescription: "3 × 10–15m", cue: "Exaggerated strides — push hard, cover ground." },
          { name: "Split Lunge (Jump Lunge)", prescription: "3 × 6 per leg", cue: "Explode + switch legs mid-air. Soft land." },
          { name: "Lateral Bounds", prescription: "3 × 4 per side", cue: "Continuous hops one direction: 3 right, then 3 left." },
          { name: "Backward-to-Forward Sprints", prescription: "4 × (10m back + 10m fwd)", cue: "Sprint backward 10m, turn, sprint forward 10m." },
          { name: "Deceleration Drills", prescription: "3 × 5m sprint + stop", cue: "Sprint then absorb to controlled stop." },
          { name: "Zig-Zag / T-Shuttle", prescription: "3 ×", cue: "5m fwd, 5m R shuffle, 5m back, 5m L shuffle." },
          { name: "Core Jump Matrix (optional)", prescription: "circuit", cue: "Squat jump → skater jump → quick hop → sprint." }
        ]
      },
      {
        name: "Peak",
        weeks: "7–9",
        goal: "Max effort, hockey-specific, multi-plane agility. Low volume, high intent.",
        drills: [
          { name: "Max-Effort Sprints", prescription: "4 × 20–30m @ 95–100%", cue: "Full recovery (3–5 min). Recreate hardest bursts." },
          { name: "Depth Drop to Vertical Jump", prescription: "3 × 5", cue: "Drop from 12–18\" box, immediately rebound vertically. Soft land." },
          { name: "Continuous Skater Bounds", prescription: "3 × 20–30s", cue: "Unbroken side-to-side, push tempo. Builds lateral endurance." },
          { name: "Single-Leg Lateral Hops", prescription: "3 × 6 per side", cue: "Explosive sideways hops on one leg." },
          { name: "Agility Circuit", prescription: "3 ×", cue: "Sprint 5m → shuffle 5m R → backpedal 5m → shuffle 5m L → sprint 5m." },
          { name: "Explosive Upper/Lower Mix (optional)", prescription: "circuit", cue: "Explosive push-ups or med-ball slams + short sprint." },
          { name: "Dynamic Skating Drills (optional)", prescription: "—", cue: "Mimic crossover on land, re-accelerate." }
        ]
      },
      {
        name: "Maintain",
        weeks: "10–13",
        goal: "Hold power gains. Blend Peak drills at moderate volume. Focus shifts to hockey-specific agility as skating ramps up.",
        drills: [
          { name: "Max-Effort Sprints", prescription: "3 × 20–30m @ 95%", cue: "Maintain top-end speed. Full recovery." },
          { name: "Continuous Skater Bounds", prescription: "2 × 25–30s", cue: "Lateral power endurance — key for D-men." },
          { name: "Single-Leg Lateral Hops", prescription: "2 × 6 per side", cue: "Maintain reactive lateral power." },
          { name: "Agility Circuit", prescription: "2 ×", cue: "Sprint → shuffle → backpedal → shuffle → sprint." },
          { name: "Depth Drop to Broad Jump", prescription: "2 × 4", cue: "Reactive power. Soft land, explode forward." },
          { name: "Crossover Sprint Simulation", prescription: "3 × 15m per side", cue: "Lateral crossover steps accelerating to sprint. Mimics D-zone gap-close." },
          { name: "Reactive Starts (varied)", prescription: "4 ×", cue: "Start from different positions: seated, prone, lateral. React to self-cue." }
        ]
      },
      {
        name: "Pre-Camp",
        weeks: "14–17",
        goal: "Sharpen for camp. Low volume, max intensity. Simulate game demands — quick bursts, transitions, stops/starts.",
        drills: [
          { name: "Camp-Simulation Sprints", prescription: "5 × 15–20m @ 100%", cue: "Replicate shift bursts. Full 2–3 min recovery." },
          { name: "Transition Agility (fwd→back→fwd)", prescription: "4 × 10m each", cue: "Sprint 10m, pivot, backpedal 10m, pivot, sprint 10m. D-zone pivots." },
          { name: "Skater Bounds (continuous)", prescription: "2 × 20s", cue: "All-out lateral power. Maintain quality." },
          { name: "Reactive Starts", prescription: "4 ×", cue: "Varied positions. Game-speed." },
          { name: "Short Shuttle (5-10-5)", prescription: "3 ×", cue: "5yd out, 10yd back, 5yd out. Max effort, sharp cuts." },
          { name: "Cool-down Mobility", prescription: "5–10 min", cue: "Hip openers, hamstring stretch, T-spine. Prep for camp volume." }
        ]
      }
    ]
  },

  // ===== HEART RATE ZONES (Aerobic governance layer — added 2026-06-02) =====
  // From Athletic Performance & Conditioning handoff. Governs intensity across
  // ALL conditioning. Pegged to CHRONOLOGICAL age 24 — NOT the Renpho "body age 20".
  heartRateZones: {
    chronologicalAge: 24,
    hrMax: 196,                       // Haskell & Fox: 220 − 24
    method: "Haskell & Fox baseline; refine with Karvonen (HR Reserve) once morning RHR is logged",
    bodyAgeWarning:
      "DO NOT use the Renpho 'body age' (21 on the Jun 2 scan) for HR zones. Max HR is governed by " +
      "chronological biology, not body composition. Inflating zones 3–4 bpm pushes recovery rides into " +
      "metabolic-threshold stress and disrupts systemic recovery.",
    karvonenNote:
      "Karvonen target = ((HRmax − RHR) × intensity%) + RHR. Log morning resting HR to " +
      "personalize the bands below (currently % of HRmax). The dashboard calculator does this live.",
    restingHR: null,                  // CLAUDE: set when Rider reports verified morning RHR
    zones: [
      { z: 1, name: "Very Light / Active Recovery",   low: 98,  high: 118, pct: "50–60%", use: "Recovery rides, flush days, coast intervals between hard reps." },
      { z: 2, name: "Light / Aerobic Base Sweet-Spot", low: 118, high: 137, pct: "60–70%", use: "Aerobic engine builder. Zone 2 bike. Nasal-breathing test lives here." },
      { z: 3, name: "Moderate / Aerobic Capacity",     low: 137, high: 157, pct: "70–80%", use: "Tempo intermittent intervals (Phase 2 hybrid)." },
      { z: 4, name: "Hard / Anaerobic Threshold",      low: 157, high: 176, pct: "80–90%", use: "Threshold / shuttle work approaching max." },
      { z: 5, name: "Maximum / Peak Power HIIT",       low: 176, high: 196, pct: "90–100%", use: "Game-shift redline. Shuttles, max sprints, assault-bike intervals." }
    ]
  },

  // ===== CONDITIONING (Blended: Oil Barons speed + aerobic base — retargeted to Aug 1 first game) =====
  conditioningProgram: {
    name: "Conditioning — Oil Barons Speed + Aerobic Base",
    source: "Oil Barons (Justin Rose) anaerobic ladder + Athletic Performance aerobic-base handoff",
    durationWeeks: 15,
    peakTarget: "2026-08-01",         // First game — be in game shape by here
    blend:
      "Two complementary engines. AEROBIC BASE (Zone 2 bike, from the handoff) fills the gap the " +
      "Oil Barons program lacked — builds stroke volume + capillary density to clear lactate between " +
      "shifts. ANAEROBIC SPEED (Oil Barons shuttles/110s/tempo) supplies the hard intervals. Hard days " +
      "stay hard: high-intensity work is consolidated onto Plyo days (Tue/Thu). HR zones govern intensity.",

    // 3-phase periodization (handoff's 9-week countdown mapped onto offseason wks 5–13, peaking Aug 1)
    phases: [
      {
        name: "Phase 1 — Aerobic Engine Builder",
        weeks: "Offseason 5–7",
        dates: "June 1 – June 21",
        objective: "Eccentric left-ventricular hypertrophy → stroke volume. Expand capillary density to clear lactate between shifts.",
        aerobic: "Zone 2 bike ×2/wk (Wed PM + Sun). Lock HR 120–137 bpm, 75–85 RPM, resistance L6–7. 45–60 min.",
        anaerobic: "Max-velocity linear sprints ×1/wk (Tue post-plyo). Full neuro recovery (>90s rest). Pair with Oil Barons Tempo 60s / 110s ladder.",
        zoneFocus: "Z2 (118–137)"
      },
      {
        name: "Phase 2 — Hybrid Transition",
        weeks: "Offseason 8–10",
        dates: "June 22 – July 12",
        objective: "Shift aerobic threshold up into Zone 3; ramp anaerobic capacity.",
        aerobic: "Zone 2 bike ×1/wk (Sun active flush).",
        anaerobic: "Tempo intermittent intervals ×1/wk (Wed or Sat): 45 min alternating 5 min Z2 ↔ 5 min Z3 (137–157). PLUS Oil Barons shuttles ×2/wk (Tue/Thu post-plyo) at 1:3 work:rest — the 60→90→120yd ladder is the anaerobic content.",
        zoneFocus: "Z3 (137–157) + Z5 shuttle bursts"
      },
      {
        name: "Phase 3 — Hockey-Specific Peak",
        weeks: "Offseason 11–13",
        dates: "July 13 – Aug 1 (FIRST GAME)",
        objective: "Replicate the bioenergetics of a chaotic 45s shift. Drop long-slow cardio. Be in game shape by Aug 1. NOTE: join Tokyo Wilds Jul 20 — on-ice takes over the back half.",
        aerobic: "Long aerobic dropped. Keep only Z1/Z2 coasting as recovery between reps.",
        anaerobic: "Jul 13–19 (solo): HIIT ×2/wk (Tue/Thu) — 45s redline (Z5) → 90s recovery (Z1/2), 6–8 rounds; assault/stationary bike, turf shuttles, or Oil Barons 150–200yd shuttles. Jul 20+ (with Tokyo Wilds): skating is the conditioning — cut dryland to ~1 short HIIT/wk, taper sharp, manage jet lag for Aug 1.",
        zoneFocus: "Z5 redline / Z1–2 recovery"
      }
    ],

    // How conditioning slots into the existing weekly template (Phase 1 blueprint)
    weeklyIntegration: {
      monday:    "Full Body lift + mobility (no conditioning)",
      tuesday:   "Plyos (CNS) → short break → Max-velocity linear sprints + mobility  [HARD]",
      wednesday: "Upper lift; later in day → 60-min Zone 2 bike (base builder) + mobility",
      thursday:  "Plyos (elasticity/fascia) + mobility  [HARD in Phase 2/3: add shuttles]",
      friday:    "Lower lift + mobility",
      saturday:  "1-hr mobility & deep-tissue decompression (rest)  [Phase 2: optional Z3 tempo]",
      sunday:    "45–60 min Zone 2 bike (active recovery / leg flush) + mobility"
    },

    // Biofeedback / auto-regulation flags from the handoff
    autoRegulation: [
      {
        flag: "Plantar / calf loading",
        signal: "Mechanical tightness, 'glued-down' tissue, or clicking in ankles/Achilles during Tue sprints or early bike rides.",
        action: "Running impact is interfering with plyo load. Shift Tue sprints to zero-impact Air/Assault/stationary bike — keep the metabolic demand, protect tissue quality."
      },
      {
        flag: "Ribcage posture / respiratory",
        signal: "Can't hold nasal breathing at 125–130 bpm during Zone 2 rides.",
        action: "Indicates a locked ribcage stuck in extension from lifting fatigue. Prescribe deep expansive exhales in daily mobility to stack the ribcage back down."
      }
    ],

    drillSpecs: [
      { name: "110s",            target: "18s",  intensity: "85%",   description: "Run 110 yards." },
      { name: "Tempo 60s",       target: "—",    intensity: "90–95%", description: "Run prescribed distance, walk back, repeat." },
      { name: "60yd Shuttle",    target: "14s",  intensity: "100%",  description: "5y + 10y + 15y, there and back each. = 1 rep." },
      { name: "90yd Shuttle",    target: "18s",  intensity: "100%",  description: "10y + 15y + 20y, there and back each." },
      { name: "120yd Shuttle",   target: "30s",  intensity: "100%",  description: "10y + 20y + 30y, there and back each." },
      { name: "150yd Shuttle",   target: "30s",  intensity: "100%",  description: "50y, there/back/there." },
      { name: "200yd Shuttle (25)", target: "34s", intensity: "100%", description: "25y there/back × 4." },
      { name: "200yd Shuttle (50)", target: "34s", intensity: "100%", description: "50y there/back × 2." },
      { name: "300yd Shuttle",   target: "55–60s", intensity: "100%", description: "50y there/back × 3. Camp test staple." }
    ],
    weeks: [
      { week: 1,  dates: "June 1–5",       sessions: ["Tempo 60s × 10 (full rest)",   "110s × 10 (full rest)"] },
      { week: 2,  dates: "June 8–12",      sessions: ["Tempo 60s × 10 (full rest)",   "110s × 10 (1:00 rest)"] },
      { week: 3,  dates: "June 15–19",     sessions: ["Tempo 60s × 10 (full rest)",   "110s × 15 (1:00 rest)"] },
      { week: 4,  dates: "June 22–26",     sessions: ["Tempo 60s (full rest)",        "Self test: 110s × 20 EMOM"] },
      { week: 5,  dates: "June 29–July 3", sessions: ["Tempo 60s (sprint, jog back)", "60yd shuttles × 10 (:30–:45 rest)"] },
      { week: 6,  dates: "July 1–5",       sessions: ["Tempo 60s (sprint, jog back)", "90yd shuttles × 10 (:30–:45 rest)"] },
      { week: 7,  dates: "July 8–12",      sessions: ["Tempo 60s (sprint, jog back)", "120yd shuttles × 10 (:45–1:00 rest)"] },
      { week: 8,  dates: "July 15–19",     sessions: ["Tempo 60s (sprint, jog back)", "150yd shuttles × 10 (1:15 rest)"] },
      { week: 9,  dates: "July 22–26",     sessions: ["Tempo 60s (sprint, jog back)", "150yd shuttles × 10 (1:15 rest)"] },
      { week: 10, dates: "July 28–Aug 2",  sessions: ["Tempo 60s (sprint, jog back)", "200yd shuttles × 10 (2:00 rest)"] },
      { week: 11, dates: "Aug 3–7",        sessions: ["Tempo 60s (sprint, jog back)", "200yd shuttles × 10 (2:00 rest)"] },
      { week: 12, dates: "Aug 10–14",      sessions: ["Tempo 60s (sprint, jog back)", "200yd shuttles × 8 (1:30 rest)"] },
      { week: 13, dates: "Aug 17–21",      sessions: ["Tempo 60s (sprint, jog back)", "300yd shuttles × 4 (2:30 rest)", "Camp-simulation: mixed shuttle circuit"] },
      { week: 14, dates: "Aug 24–28",      sessions: ["300yd shuttles × 5 (2:00 rest)", "200yd shuttles × 6 (1:30 rest) + 60yd × 6 (:30 rest)"] },
      { week: 15, dates: "Aug 31–Sep 1",   sessions: ["Light tempo only — stay fresh for camp. 6–8 × 60yd tempo runs, full rest."] }
    ]
  },

  // ===== MOBILITY LIBRARY =====
  mobilityLibrary: {
    source: "Fort McMurray Oil Barons (former team)",
    lower: [
      { name: "90/90 Tutorial",                 url: "https://www.youtube.com/watch?v=t4Zz6-aG8Iw" },
      { name: "90/90 (alt)",                    url: "https://www.instagram.com/tv/ByVYRi9l4tu/" },
      { name: "Hip Capsule Stretch",            url: "https://www.youtube.com/watch?v=3dq7QgoXQdM" },
      { name: "Hip Activation",                 url: "https://www.youtube.com/watch?v=Hh2aDnNzNwY" },
      { name: "Dynamic Adductor Stretch",       url: "https://www.youtube.com/watch?v=1oqLX9T4AQA" },
      { name: "Isometric Adductor Strengthening", url: "https://www.instagram.com/p/BxAbBdAl8bb/" },
      { name: "Articular Rotations",            url: "https://www.instagram.com/p/B9FAVvXFu-a/" },
      { name: "Squat Warm Up",                  url: "https://www.youtube.com/watch?v=sxpliflj0zQ&t=611s" }
    ],
    upper: [
      { name: "Banded Face Pull",               url: "https://www.youtube.com/watch?v=Gd6TGp3m03Y" },
      { name: "T-Spine Extension",              url: "https://www.youtube.com/watch?v=N7K4EYz1_Ik" },
      { name: "Dynamic Lat Stretch",            url: "https://www.youtube.com/watch?v=BvrrCYgUtr8" },
      { name: "External Rotation",              url: "https://www.instagram.com/p/B8rQGpmFJl6/" },
      { name: "Scap CARs / Axial / Cat-Cow / T-Spine Rot", url: "https://www.instagram.com/p/B2KI-mOFBju/" },
      { name: "Upper Body Warm Up",             url: "https://www.instagram.com/p/B6lPeS8FDho/" }
    ]
  }
};
