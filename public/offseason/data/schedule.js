// data/schedule.js — Master off-season plan. Claude reads to know what's prescribed today/this week.
// Claude updates this as programs start, Rider adjusts plans, or skating ramps up.

window.SCHEDULE = {
  // Default weekly template — flexible, adjusts as skating ramps up
  // Claude uses this as the starting point but adapts week-by-week
  // Blended-conditioning weekly template (handoff Phase 1 blueprint). Hard work on Tue/Thu plyo days;
  // Zone 2 bike Wed PM + Sun. conditioningNote tells Claude how the day's conditioning shifts by phase.
  weeklyTemplate: {
    monday:    { primary: "lift-d1", secondary: ["mobility"] },
    tuesday:   { primary: "plyo", secondary: ["conditioning", "mobility"] },   // plyo (CNS) → max-velocity sprints
    wednesday: { primary: "lift-d2", secondary: ["conditioning", "mobility"] }, // PM: 60-min Zone 2 bike
    thursday:  { primary: "plyo", secondary: ["mobility"] },                    // plyo (elasticity/fascia); +shuttles in Phase 2/3
    friday:    { primary: "lift-d3", secondary: ["mobility"] },
    saturday:  { primary: null, secondary: ["mobility", "rest"] },              // deep-tissue decompression; opt Z3 tempo in Phase 2
    sunday:    { primary: "conditioning", secondary: ["mobility"] }             // 45–60 min Zone 2 bike, active recovery flush
  },
  conditioningNote:
    "Tue = max-velocity linear sprints post-plyo (full recovery). Wed PM + Sun = Zone 2 bike (118–137 bpm). " +
    "Phase 2 (Jun 22+) adds Oil Barons shuttles Tue/Thu at 1:3 work:rest + a Z3 tempo session. " +
    "Phase 3 (Jul 13+) = HIIT Tue/Thu (45s redline / 90s recover), long cardio dropped. Peak for Aug 1.",

  // Periodization phases — retargeted to peak for the Aug 1 first game (was Sep 1 camp)
  phases: [
    { name: "Foundation", weeks: "1–2",   start: "2026-05-18", end: "2026-05-31", dates: "May 18 – May 31",      focus: "Establish lift rotation, build habits, ease into volume. Plyo Base eases in. No conditioning yet." },
    { name: "Build / Aerobic Engine", weeks: "3–5", start: "2026-06-01", end: "2026-06-21", dates: "June 1 – June 21", focus: "Conditioning Phase 1: Zone 2 bike base ×2/wk + Tue max-velocity sprints. Oil Barons Tempo 60s / 110s ladder. Plyo Build." },
    { name: "Peak Accumulation / Overreach", weeks: "6", start: "2026-06-22", end: "2026-06-28", dates: "June 22 – 28", focus: "Fitness-Fatigue blueprint Phase 1. Highest-volume strength week + conditioning Phase 2 begins (Oil Barons shuttles Tue/Thu, 1:3 work:rest). Dig deep into the fatigue well; mechanics over load. Expect on-ice pop to dip late-week — that's fatigue masking fitness." },
    { name: "System Reset / Deload", weeks: "7", start: "2026-06-29", end: "2026-07-05", dates: "June 29 – July 5", focus: "Strategic deload. Cut resistance + conditioning volume ~50%, hold intensity moderate-high, no failure. Skating shifts to flow/technical. Clears acute fatigue (decays ~3× faster than fitness) so the built strength surfaces." },
    { name: "Transmutation / Power", weeks: "8–9", start: "2026-07-06", end: "2026-07-19", dates: "July 6 – 19", focus: "Convert max force → rate of force development. First week loaded ballistics (jump squats, KB swings, resisted bounds); second week reactive/min-contact (depth jumps, unresisted bounds). Conditioning Phase 3 HIIT (45s redline / 90s recover) begins Jul 13. Last solo block in Sundsvall." },
    { name: "Camp + Taper", weeks: "10–11", start: "2026-07-20", end: "2026-08-02", dates: "July 20 – Aug 2", focus: "Jul 20: JOIN TOKYO WILDS — on-ice daily takes over, gym goes minimalist (PAP neural primers only, ~40% volume cut). Manage jet lag (Tokyo +7h). Second week peak taper into the Aug 1 PEAK target. First exhibition game Aug 3." },
    { name: "In-Season Maintenance", weeks: "12–14", start: "2026-08-03", end: "2026-08-23", dates: "Aug 3 – 23", focus: "Pivot Build → strict Maintenance. Microdose: 2 movement-snacks/wk (15–20 min), 1–2 heavy sets per pattern @ 80–90% / 2–4 reps. Weekly tissue + pelvis work (Copenhagen, lateral lunges, hip-flexor release). Autonomic self-monitoring. Aug 3 exhibition → Aug 22 REGULAR-SEASON OPENER." }
  ],

  // Week-by-week plan. Claude fills in specifics as the off-season progresses.
  // Each day's `planned` array is flexible — Claude adjusts based on how Rider feels,
  // what he's done recently, and what programs prescribe.
  weeks: [
    {
      week: 1,
      dates: "May 18–24",
      phase: "Foundation",
      focus: "Add plyo Base — Session A (low volume). Lifts continue.",
      plyoPhase: "Base (intro)",
      days: {
        "2026-05-18": { planned: ["lift-d1"], notes: "Full body" },
        "2026-05-19": { planned: ["plyo-base-A", "mobility"], notes: "FIRST PLYO SESSION. Base phase, low volume. ~20–25 min." },
        "2026-05-20": { planned: ["lift-d2"], notes: "Upper + lower plyo finisher" },
        "2026-05-21": { planned: ["mobility"], notes: "Recovery — assess legs after first plyo" },
        "2026-05-22": { planned: ["lift-d3"], notes: "Lower" },
        "2026-05-23": { planned: ["mobility"], notes: "Light" },
        "2026-05-24": { planned: ["rest"], notes: "Full rest" }
      }
    },
    {
      week: 2,
      dates: "May 25–31",
      phase: "Foundation",
      focus: "Plyo Base — 2 sessions/week (Session A + B). Last week before conditioning kicks in.",
      plyoPhase: "Base",
      days: {
        "2026-05-25": { planned: ["lift-d1"], notes: "Full body" },
        "2026-05-26": { planned: ["plyo-base-A", "mobility"], notes: "Plyo Base — Session A (linear/vertical focus)" },
        "2026-05-27": { planned: ["lift-d2"], notes: "Upper + lower plyo finisher" },
        "2026-05-28": { planned: ["plyo-base-B", "mobility"], notes: "Plyo Base — Session B (lateral/agility) + mobility" },
        "2026-05-29": { planned: ["lift-d3"], notes: "Lower" },
        "2026-05-30": { planned: ["mobility"], notes: "Light recovery" },
        "2026-05-31": { planned: ["rest"], notes: "Full rest — week before Build phase" }
      }
    },
    {
      week: 3,
      dates: "June 1–7",
      phase: "Build / Aerobic Engine",
      focus: "Conditioning Phase 1 starts. Layer aerobic Zone 2 bike onto the week + Tue max-velocity sprints. Hold HR 118–137 on bike rides — practice nasal breathing. Log a morning RHR this week to fine-tune zones.",
      plyoPhase: "Base (final week)",
      conditioningPhase: "Phase 1 — Aerobic Engine Builder",
      days: {
        "2026-06-01": { planned: ["lift-d1", "mobility"], notes: "Full body. Conditioning block officially begins." },
        "2026-06-02": { planned: ["plyo", "conditioning", "mobility"], notes: "Plyo (CNS) → short break → max-velocity linear sprints (>90s rest between reps). Watch plantar/calf — if ankles click or feel glued, move sprints to the bike. Pair with Oil Barons Tempo 60s if legs are fresh." },
        "2026-06-03": { planned: ["lift-d2", "conditioning", "mobility"], notes: "Upper lift AM. PM: 60-min Zone 2 bike (118–137 bpm, 75–85 RPM, resistance L6–7). Nasal breathing the whole ride." },
        "2026-06-04": { planned: ["plyo", "mobility"], notes: "Plyo — elasticity / fascia focus (pogo, rotational, ribcage). No hard sprints (Phase 1 keeps Thu easy)." },
        "2026-06-05": { planned: ["lift-d3", "mobility"], notes: "Lower body." },
        "2026-06-06": { planned: ["mobility", "rest"], notes: "1-hr mobility & deep-tissue decompression. Rest day." },
        "2026-06-07": { planned: ["conditioning", "mobility"], notes: "45–60 min Zone 2 bike — active recovery / leg flush. Keep it strictly Z2." }
      }
    },
    {
      week: 4,
      dates: "June 8–14",
      phase: "Build / Aerobic Engine",
      focus: "Conditioning Phase 1 continues — Zone 2 bike base ×2/wk + Tue max-velocity sprints. Plyo Build. Rider self-arranged ice in Sundsvall this week (2 skates) — ahead of the Jul 20 Tokyo on-ice start.",
      plyoPhase: "Build",
      conditioningPhase: "Phase 1 — Aerobic Engine Builder",
      days: {
        "2026-06-08": { planned: ["lift-d1", "mobility"], notes: "Full body + mobility." },
        "2026-06-09": { planned: ["plyo", "conditioning", "mobility"], notes: "Plyo (CNS) → max-velocity linear sprints + mobility." },
        "2026-06-10": { planned: ["lift-d2", "conditioning", "mobility"], notes: "Upper lift. PM: 60-min Zone 2 bike (118–137 bpm). Evening skate added (8:00–9:15pm)." },
        "2026-06-11": { planned: ["plyo", "conditioning", "mobility"], notes: "Plyo (elasticity/fascia) + mobility. Conditioning NOT completed — afternoon skate (1:00–2:45pm) instead." },
        "2026-06-12": { planned: ["lift-d3", "mobility"], notes: "Lower body + mobility." },
        "2026-06-13": { planned: ["mobility", "rest"], notes: "Rest day — 1-hr mobility & deep-tissue decompression." },
        "2026-06-14": { planned: ["conditioning", "mobility"], notes: "45–60 min Zone 2 bike — active recovery / leg flush." }
      }
    },
    {
      week: 5,
      dates: "June 15–21",
      phase: "Build / Aerobic Engine",
      focus: "FINAL week of Phase 1 (Aerobic Engine). Cap the Zone 2 base — push the Wed + Sun rides toward 60–70 min, hold 118–137 bpm, nasal breathing. Plyo Build peak week. Then Jun 22 = Phase 2 (Hybrid Transition): Oil Barons shuttles Tue/Thu (1:3 work:rest) + a Z3 tempo session begin. SKATING now Mon/Wed/Fri (3×/wk) — all three land on lift days, so keep ice on those days lighter / skill-tempo, not gassers, and lift before skating where possible. With ice 3×/wk, hold plyo at Build (don't add volume). Knee from Jun 2 held up through plyo + 2 skates; keep an eye on it on lower/plyo/skate days.",
      plyoPhase: "Build (peak week)",
      conditioningPhase: "Phase 1 — Aerobic Engine Builder (final week)",
      days: {
        "2026-06-15": { planned: ["lift-d1", "skating", "mobility"], notes: "Full body lift + skate + mobility. Lift first, skate skill/tempo (not a gasser)." },
        "2026-06-16": { planned: ["plyo", "conditioning", "mobility"], notes: "Plyo (CNS) → max-velocity linear sprints (>90s rest between reps) + mobility." },
        "2026-06-17": { planned: ["lift-d2", "skating", "conditioning", "mobility"], notes: "Upper lift + skate. PM: 60–70 min Zone 2 bike (118–137 bpm). Watch total load with ice on a conditioning day." },
        "2026-06-18": { planned: ["plyo", "mobility"], notes: "Plyo — elasticity / fascia focus (pogo, rotational). Phase 1 keeps Thu easy — no hard sprints." },
        "2026-06-19": { planned: ["lift-d3", "skating", "mobility"], notes: "Lower body lift + skate + mobility. Knee check before loading; keep the skate light on legs after D3." },
        "2026-06-20": { planned: ["mobility", "rest"], notes: "Rest day — 1-hr mobility & deep-tissue decompression." },
        "2026-06-21": { planned: ["conditioning", "mobility"], notes: "Last Phase 1 ride — 60–70 min Zone 2 bike, strictly Z2. Caps the aerobic base before shuttles start Jun 22." }
      }
    },
    {
      week: 6,
      dates: "June 22–28",
      phase: "Peak Accumulation / Overreach",
      focus: "OVERREACH — highest-volume strength week (lift plan Week 8). Conditioning Phase 2 begins: Oil Barons shuttles Tue/Thu at 1:3 work:rest. Skating Mon/Wed/Fri (keep ice skill/tempo on lift days, lift first). Top lift sets RPE 8–9, never to failure. Knee check on lower/plyo days. Pop will fade by Sunday — that's the plan; Week 9 deload unmasks it.",
      plyoPhase: "Build → Peak",
      conditioningPhase: "Phase 2 — Hybrid Transition (shuttles begin)",
      liftPlanWeek: 8,
      days: {
        "2026-06-22": { planned: ["lift-d1", "skating", "mobility"], notes: "D1 Full Body (overreach volume) — lift first, then skate skill/tempo." },
        "2026-06-23": { planned: ["plyo", "conditioning", "mobility"], notes: "Plyo (CNS) → Oil Barons 60yd shuttles ×10 (1:3 work:rest). HARD day." },
        "2026-06-24": { planned: ["lift-d2", "skating", "mobility"], notes: "D2 Upper + plyo finisher + skate. Optional PM Z2 bike if legs allow." },
        "2026-06-25": { planned: ["plyo", "conditioning", "mobility"], notes: "Plyo (elasticity) → shuttles ×10 (1:3). HARD day." },
        "2026-06-26": { planned: ["lift-d3", "skating", "mobility"], notes: "D3 Lower (overreach) + light skate. Knee check before loading." },
        "2026-06-27": { planned: ["mobility", "rest"], notes: "Rest — 1-hr mobility / decompression. Optional easy Z3 tempo if fresh." },
        "2026-06-28": { planned: ["conditioning", "mobility"], notes: "Z2 bike active flush (45–60 min). End of the overreach." }
      }
    },
    {
      week: 7,
      dates: "June 29–July 5",
      phase: "System Reset / Deload",
      focus: "DELOAD — cut lift volume ~50% (lift plan Week 9), keep loads moderate-high, NO failure. Conditioning −50%. Skating = flow / technical only. Leave the gym fresher than you arrived. Pop should return by week's end as fatigue clears.",
      plyoPhase: "Deload (light, crisp)",
      conditioningPhase: "Phase 2 — reduced volume (deload)",
      liftPlanWeek: 9,
      days: {
        "2026-06-29": { planned: ["lift-d1", "skating", "mobility"], notes: "D1 deload (2 sets/lift, fast bar). Easy flow skate." },
        "2026-06-30": { planned: ["plyo", "mobility"], notes: "Light plyo, crisp + low volume. Drop the hard shuttle today." },
        "2026-07-01": { planned: ["lift-d2", "mobility"], notes: "D2 deload. Smooth tempo, leave reps in the tank." },
        "2026-07-02": { planned: ["plyo", "conditioning", "mobility"], notes: "Light plyo + ONE easy shuttle set or Z2 — half the usual." },
        "2026-07-03": { planned: ["lift-d3", "skating", "mobility"], notes: "D3 deload (light). Flow skate." },
        "2026-07-04": { planned: ["mobility", "rest"], notes: "Rest + mobility." },
        "2026-07-05": { planned: ["conditioning", "mobility"], notes: "Easy Z2 flush. Recovery, not training." }
      }
    },
    {
      week: 8,
      dates: "July 6–12",
      phase: "Transmutation / Power",
      focus: "TRANSMUTATION A — convert strength to power (lift plan Week 10). Loaded ballistics: jump squats, KB swings, resisted skater bounds, MB slams. 100% intent, long rest, hard-stop on >10% drop. Strength held with 1–2 heavy anchors only. Plyo Peak. Conditioning Phase 2 shuttles continue.",
      plyoPhase: "Peak",
      conditioningPhase: "Phase 2 — Hybrid Transition",
      liftPlanWeek: 10,
      days: {
        "2026-07-06": { planned: ["lift-d1", "skating", "mobility"], notes: "D1 full-body power (anchor + ballistics) + skate." },
        "2026-07-07": { planned: ["plyo", "conditioning", "mobility"], notes: "Plyo (peak) → shuttles ×10 (90yd, 1:3). HARD." },
        "2026-07-08": { planned: ["lift-d2", "skating", "mobility"], notes: "D2 upper power + lateral bounds + skate." },
        "2026-07-09": { planned: ["plyo", "conditioning", "mobility"], notes: "Plyo (peak) → shuttles. HARD." },
        "2026-07-10": { planned: ["lift-d3", "skating", "mobility"], notes: "D3 lower power (jump squats, resisted bounds) + skate. Knee check." },
        "2026-07-11": { planned: ["mobility", "rest"], notes: "Rest + mobility. Optional Z3 tempo." },
        "2026-07-12": { planned: ["conditioning", "mobility"], notes: "Z2 flush." }
      }
    },
    {
      week: 9,
      dates: "July 13–19",
      phase: "Transmutation / Power",
      focus: "TRANSMUTATION B — reactive / minimal ground-contact (lift plan Week 11). Depth jumps, unresisted bounds, plyo push-ups, Nordic drops. Anchors drop to one primer set. Conditioning Phase 3 HIIT begins (45s redline / 90s recover). LAST solo week in Sundsvall — travel to Tokyo at week's end. Tissue quality daily.",
      plyoPhase: "Peak (reactive)",
      conditioningPhase: "Phase 3 — Hockey-Specific Peak (HIIT begins)",
      liftPlanWeek: 11,
      days: {
        "2026-07-13": { planned: ["lift-d1", "skating", "mobility"], notes: "D1 reactive (primer + continuous/depth jumps) + skate." },
        "2026-07-14": { planned: ["plyo", "conditioning", "mobility"], notes: "Plyo → HIIT 45s redline / 90s recover ×6–8. HARD." },
        "2026-07-15": { planned: ["lift-d2", "skating", "mobility"], notes: "D2 reactive (plyo push-ups, unresisted bounds) + skate." },
        "2026-07-16": { planned: ["plyo", "conditioning", "mobility"], notes: "Plyo → HIIT. HARD." },
        "2026-07-17": { planned: ["lift-d3", "skating", "mobility"], notes: "D3 reactive (depth-to-broad, lateral bounds, Nordics) + skate." },
        "2026-07-18": { planned: ["mobility", "rest"], notes: "Rest + mobility. Begin travel prep." },
        "2026-07-19": { planned: ["conditioning", "mobility"], notes: "Light flush + tissue work. Travel-ready." }
      }
    },
    {
      week: 10,
      dates: "July 20–26",
      phase: "Camp + Taper",
      focus: "JOIN TOKYO WILDS — on-ice daily with the team. Gym = minimalist neural primers only (lift plan Week 12), 1–2 short touches all week. Let skating carry the load. Priority #1 is jet-lag / circadian adaptation (Tokyo +7h). Daily tissue: adductors, TFL, hip flexors. Skip the gym if a team skate was brutal.",
      plyoPhase: "Maintain (team handles output)",
      conditioningPhase: "Phase 3 — skating IS the conditioning",
      liftPlanWeek: 12,
      days: {
        "2026-07-20": { planned: ["skating", "mobility"], notes: "Travel + arrival + first team skate. JOIN TOKYO WILDS. Mobility, manage jet lag." },
        "2026-07-21": { planned: ["skating", "lift-d1", "mobility"], notes: "Team skate + optional ~20-min full-body neural primer (if legs fresh)." },
        "2026-07-22": { planned: ["skating", "mobility"], notes: "Team skate + mobility/tissue." },
        "2026-07-23": { planned: ["skating", "lift-d2", "mobility"], notes: "Team skate + optional ~15-min upper primer." },
        "2026-07-24": { planned: ["skating", "mobility"], notes: "Team skate + mobility." },
        "2026-07-25": { planned: ["skating", "mobility"], notes: "Team skate or rest + tissue work." },
        "2026-07-26": { planned: ["rest", "mobility"], notes: "Rest + mobility. Bank sleep." }
      }
    },
    {
      week: 11,
      dates: "July 27–Aug 2",
      phase: "Camp + Taper",
      focus: "PEAK TAPER (lift plan Week 13). One heavy PAP primer early in the week, then nothing that creates soreness. Aug 1 = PEAK target — fitness is built, the job is to un-mask it. Sleep, hydrate, eat. First exhibition game Aug 3 (next week). Skip lower lifting — fresh legs.",
      plyoPhase: "Taper (PAP only)",
      conditioningPhase: "Phase 3 peak — skating + sharpening",
      liftPlanWeek: 13,
      days: {
        "2026-07-27": { planned: ["skating", "lift-d1", "mobility"], notes: "Team skate + full-body PAP primer (2×2 @ 87% + jumps). Early-week only." },
        "2026-07-28": { planned: ["skating", "mobility"], notes: "Team skate + mobility." },
        "2026-07-29": { planned: ["skating", "mobility"], notes: "Team skate + optional light upper primer." },
        "2026-07-30": { planned: ["skating", "mobility"], notes: "Team skate, sharpening + mobility." },
        "2026-07-31": { planned: ["skating", "mobility"], notes: "Light skate + mobility." },
        "2026-08-01": { planned: ["skating", "mobility"], notes: "PEAK TARGET. Sharp skills skate + mobility. Conditioning peaks here." },
        "2026-08-02": { planned: ["rest", "mobility"], notes: "Activation + mobility. Day before first exhibition." }
      }
    },
    {
      week: 12,
      dates: "Aug 3–9",
      phase: "In-Season Maintenance",
      focus: "FIRST EXHIBITION GAME Aug 3. Pivot to strict maintenance (lift plan Week 14). Two 15–20 min movement-snacks this week: 1–2 heavy sets per pattern @ 85–90% / 2–4 reps. Weekly Copenhagen + lateral lunge + hip-flexor release. Run the autonomic self-check. Team game schedule TBD — fit snacks post-practice on good CNS days.",
      conditioningPhase: "In-season — skating carries it",
      liftPlanWeek: 14,
      days: {
        "2026-08-03": { planned: ["game", "mobility"], notes: "FIRST EXHIBITION GAME. Mobility after." },
        "2026-08-04": { planned: ["skating", "lift-d1", "mobility"], notes: "Practice + Snack 1 (lower/posterior, ~18 min) post-skate." },
        "2026-08-05": { planned: ["skating", "mobility"], notes: "Practice + mobility/tissue." },
        "2026-08-06": { planned: ["skating", "lift-d2", "mobility"], notes: "Practice + Snack 2 (upper push/pull, ~18 min)." },
        "2026-08-07": { planned: ["skating", "mobility"], notes: "Practice + mobility." },
        "2026-08-08": { planned: ["skating", "mobility"], notes: "Skate/game (team TBD) + mobility." },
        "2026-08-09": { planned: ["rest", "mobility"], notes: "Rest + mobility." }
      }
    },
    {
      week: 13,
      dates: "Aug 10–16",
      phase: "In-Season Maintenance",
      focus: "Strict maintenance repeats (lift plan Week 15). Same two movement-snacks, auto-regulated — if grip weak / RHR up / motivation flat, cut to one or skip. Hard-stop on >10% speed/jump drop. Copenhagen + lateral lunge + hip-flexor release stay non-negotiable. Team schedule TBD.",
      conditioningPhase: "In-season — skating carries it",
      liftPlanWeek: 15,
      days: {
        "2026-08-10": { planned: ["skating", "lift-d1", "mobility"], notes: "Practice + Snack 1 (alternate squat/hinge from last week)." },
        "2026-08-11": { planned: ["skating", "mobility"], notes: "Practice + mobility." },
        "2026-08-12": { planned: ["skating", "lift-d2", "mobility"], notes: "Practice + Snack 2 (upper) + tissue work." },
        "2026-08-13": { planned: ["skating", "mobility"], notes: "Practice + mobility." },
        "2026-08-14": { planned: ["skating", "mobility"], notes: "Skate/game (team TBD) + mobility." },
        "2026-08-15": { planned: ["skating", "mobility"], notes: "Skate/game (team TBD) + mobility." },
        "2026-08-16": { planned: ["rest", "mobility"], notes: "Rest + mobility." }
      }
    },
    {
      week: 14,
      dates: "Aug 17–23",
      phase: "In-Season Maintenance",
      focus: "OPENER WEEK (lift plan Week 16). One heavy PAP primer early, nothing heavy in the 48h before Aug 22. Tissue + sleep priority. REGULAR-SEASON OPENER Aug 22. After this, the Weeks 14–15 microdose template repeats all season — ask Claude to roll it forward.",
      conditioningPhase: "In-season — skating carries it",
      liftPlanWeek: 16,
      days: {
        "2026-08-17": { planned: ["skating", "lift-d1", "mobility"], notes: "Practice + early-week PAP primer (~12 min)." },
        "2026-08-18": { planned: ["skating", "mobility"], notes: "Practice + mobility." },
        "2026-08-19": { planned: ["skating", "mobility"], notes: "Practice + optional light upper touch." },
        "2026-08-20": { planned: ["skating", "mobility"], notes: "Light practice + mobility. Nothing heavy from here." },
        "2026-08-21": { planned: ["skating", "mobility"], notes: "Activation skate + mobility. Day before the opener." },
        "2026-08-22": { planned: ["game", "mobility"], notes: "REGULAR-SEASON OPENER. Mobility after." },
        "2026-08-23": { planned: ["rest", "mobility"], notes: "Rest + mobility. Season is underway." }
      }
    }
  ],

  // Plyo session prescriptions (used in weeks 3–4 ramp-in, before full Build phase)
  plyoSessions: {
    "plyo-base-A": {
      name: "Plyo Base — Session A (Linear/Vertical)",
      duration: "20–25 min",
      blocks: [
        { name: "Warm-up", drills: ["Dynamic warm-up — 5 min", "Lateral shuffle / carioca 3 × 10m each way"] },
        { name: "Power (quality > volume, full recovery)", drills: ["Tuck Jumps — 2 × 5", "Broad Jumps — 2 × 4 (focus soft land)"] },
        { name: "Speed", drills: ["Short Acceleration Sprints — 4 × 10–15m @ 70–80%, walk back full"] },
        { name: "Footwork", drills: ["Two-Footed Quick Hops — 2 × 8s", "Quick Line Taps — 2 × 8s"] },
        { name: "Cooldown", drills: ["Forward / Reverse Lunges — 2 × 6/leg", "Hip openers"] }
      ],
      notes: "FIRST plyo session: stay sub-maximal. Focus form, soft landings, posterior chain. Stop early if IT band/quad acts up."
    },
    "plyo-base-B": {
      name: "Plyo Base — Session B (Lateral/Agility)",
      duration: "20–25 min",
      blocks: [
        { name: "Warm-up", drills: ["Dynamic warm-up — 5 min", "Lateral shuffle / carioca 3 × 10m each way"] },
        { name: "Lateral Power", drills: ["Skater (Side-to-Side) Jumps — 2 × 6/side (sub-max, controlled)", "Broad Jumps — 2 × 4"] },
        { name: "Speed", drills: ["Short Acceleration Sprints — 4 × 10–15m @ 70–80%"] },
        { name: "Footwork", drills: ["Quick Line Taps — 2 × 10s", "Two-Footed Quick Hops — 2 × 10s"] },
        { name: "Cooldown", drills: ["Forward / Reverse Lunges — 2 × 8/leg", "Hip openers + adductor stretch"] }
      ],
      notes: "Second plyo session of the week. Pair lateral skater jumps with sprint + footwork. IT band check before skater jumps."
    }
  }
};
