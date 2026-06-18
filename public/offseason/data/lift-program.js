// data/lift-program.js — Week-by-week LIFT mesocycle, Weeks 8–16 (Jun 22 → Aug 23).
// Built 2026-06-16 from the "Elite Athletic Blueprint" (Fitness-Fatigue / Dual-Factor model)
// the specialist handed Rider, RECONCILED to Rider's real calendar.
//
// IMPORTANT reconciliation notes (the specialist's doc had Rider's timeline wrong):
//   - The specialist's week numbers were wrong, so they're ignored; his PHASE LOGIC is
//     mapped onto Rider's real calendar instead. (Offseason corrected 2026-06-17 to start
//     Mon May 18 = Week 1; today Jun 15–21 = Week 5 of 11. This file keeps its own Wk8–16
//     labels — they're anchored to dates / linked from schedule.js via liftPlanWeek.)
//   - Milestones adopted from the doc: Peak Aug 1 · First exhibition game Aug 3 ·
//     Regular-season opener Aug 22.
//   - Rider's own fact kept: joins the Tokyo Wilds (Tokyo) Jul 20 — on-ice daily takes over
//     from then, so solo dryland shrinks Weeks 12+ (the specialist didn't know this).
//
// Schema (read by the "Plan" tab in index.html):
//   window.LIFT_PROGRAM = {
//     name, source, model, fitnessFatigue (explainer), monitoring[], weeks[]
//   }
//   weeks[] = { week, dates, block, blockTag, anchorDate?, milestone?, goal, guidelines[],
//               days: { D1:{...}, D2:{...}, D3:{...} } }
//   day     = { focus, intent, note?, exercises: [ { name, scheme, load, rest, cue } ] }
//
// blockTag drives color/where-am-I highlighting: accumulate | deload | transmute | taper | maintain

window.LIFT_PROGRAM = {
  name: "Off-Season → In-Season Lift Mesocycle",
  source: "Elite Athletic Blueprint (Fitness-Fatigue / ANS) — reconciled to Rider's calendar 2026-06-16",
  model: "Dual-Factor (Fitness-Fatigue). Accumulate fitness, then suppress volume so fatigue (which decays ~3× faster) clears and the built-up fitness shows. Force production is converted to rate-of-force-development (on-ice velocity) before the season, then microdosed to maintain.",

  fitnessFatigue: {
    headline: "Preparedness = Fitness − Fatigue",
    points: [
      "Fitness is built slowly and decays slowly. Fatigue is built fast and decays ~3× faster.",
      "You can't SHOW peak performance until volume drops and fatigue clears, un-masking the fitness underneath.",
      "Sympathetic load (heavy lifting, plyo, hard ice) is the accelerator; it suppresses motor-neuron firing over time.",
      "Parasympathetic recovery (Zone 2, deep sleep) is the repair mechanism. Your 8.5 h sleep is the engine of this whole plan — protect it.",
      "Expect a temporary dip in on-ice 'pop' at the end of the Week 8 overreach. That is fatigue masking fitness, not lost fitness. The Week 9 deload unmasks it."
    ]
  },

  // In-season autonomic self-monitoring (Section 5 of the blueprint). Surfaced on the Plan tab.
  monitoring: [
    "Morning grip strength — weak grip = CNS not recovered.",
    "Resting HR / HRV volatility — log a morning RHR to make this real (still pending).",
    "Subjective motivation + visual tracking focus during warmups.",
    "Sleep disruption despite deep fatigue = red flag.",
    "Any clear burnout sign → cut gym volume 50% for 48 h, keep on-ice quality high.",
    "Hard stop rule: if jump height / sprint time / bar speed drops >10% within a session, end the explosive work — further sets are junk fatigue."
  ],

  weeks: [
    // ───────────────────────── WEEK 8 — PEAK ACCUMULATION / OVERREACH ─────────────────────────
    {
      week: 8,
      dates: "Jun 22 – 28",
      block: "Peak Accumulation / Overreach",
      blockTag: "accumulate",
      goal: "Final high-volume strength push. Max mechanical tension + motor-unit recruitment before the deload. This is the deepest you dig into the fatigue well all summer.",
      guidelines: [
        "Highest volume week of the block. Top sets to RPE 8–9 — hard, but never grind to failure (failure adds fatigue, not fitness).",
        "Mechanics over load as fatigue builds late-week. A clean rep at 80% beats an ugly rep at 85%.",
        "Lift BEFORE you skate on shared days. Keep ice skill/tempo, not gassers.",
        "Knee check before every lower / plyo session (the Jun 2 flare).",
        "Expect your on-ice pop to fade by Sun. Don't chase it — that's the point of next week's deload."
      ],
      days: {
        D1: {
          focus: "Full Body — Posterior / Push-Pull / Power",
          intent: "Heaviest hinge of the week + explosive finisher.",
          exercises: [
            { name: "Trap Bar Deadlift", scheme: "4 × 5", load: "80–85% (top set RPE 9)", rest: "2.5–3 min", cue: "Brace 360°, push the floor away, hips and bar rise together." },
            { name: "Barbell Hip Thrust", scheme: "3 × 8", load: "RPE 8", rest: "2 min", cue: "Ribs down, full lockout, 1-sec glute squeeze at top." },
            { name: "BB Incline Press", scheme: "4 × 6", load: "RPE 8", rest: "2 min", cue: "Elbows ~45°, drive feet, controlled to chest." },
            { name: "Chest-Supported Row", scheme: "3 × 10", load: "RPE 8", rest: "90 s", cue: "Pull to sternum, squeeze, slow return." },
            { name: "DB Snatch", scheme: "4 × 3 / side", load: "explosive", rest: "full (90 s+)", cue: "Violent hip snap, punch through the top. Quality reps only." },
            { name: "Farmer Carry", scheme: "3 × 40 m", load: "heavy", rest: "90 s", cue: "Tall, ribs stacked, grip like a vice." },
            { name: "Continuous Box Jump (finisher)", scheme: "3 × 8", load: "BW", rest: "60 s", cue: "Reactive, soft landings, instant re-jump." }
          ]
        },
        D2: {
          focus: "Upper Press/Pull + Lower-Body Plyo",
          intent: "Max upper-body tension, keep one ballistic lower drill in.",
          exercises: [
            { name: "Hex/Flat Bench (6-s eccentric)", scheme: "4 × 6", load: "RPE 8", rest: "2 min", cue: "6-sec lower, explode up. Shoulder blades pinned." },
            { name: "Weighted Chin-Up", scheme: "4 × 5", load: "RPE 8", rest: "2 min", cue: "Full hang to chin over bar, no kip." },
            { name: "Power Shrug", scheme: "3 × 8", load: "heavy", rest: "90 s", cue: "Explosive shrug, hold 1 sec at top." },
            { name: "Lat Pulldown", scheme: "3 × 10", load: "RPE 8", rest: "90 s", cue: "Drive elbows to ribs, control the stretch." },
            { name: "Resisted Power Jump", scheme: "3 × 5", load: "band / light", rest: "full", cue: "Max height every rep, absorb softly." },
            { name: "Single-Arm Alt Carry", scheme: "3 × 40 m", load: "heavy", rest: "90 s", cue: "Anti-tilt — don't let the hips dump." },
            { name: "Heavy Pallof Press (finisher)", scheme: "3 × 8 / side", load: "RPE 8", rest: "45 s", cue: "Resist rotation, slow press-out." }
          ]
        },
        D3: {
          focus: "Lower Body — Squat / Posterior / Unilateral",
          intent: "Bilateral + unilateral strength at top volume.",
          exercises: [
            { name: "Box Squat", scheme: "4 × 5", load: "80%", rest: "2.5 min", cue: "Sit back to box, stay tight, explode up — no collapse." },
            { name: "Barbell RDL", scheme: "4 × 6", load: "RPE 8", rest: "2 min", cue: "Push hips back, feel the hamstring stretch, neutral spine." },
            { name: "Bulgarian Split Squat", scheme: "3 × 8 / side", load: "heavy DBs", rest: "90 s/side", cue: "Vertical shin on rear-foot, drive through front heel." },
            { name: "Leg Ext + Ham Curl (superset)", scheme: "3 × 10", load: "RPE 8", rest: "90 s", cue: "Quad/ham balance — full squeeze each end." },
            { name: "Landmine Rotational Press", scheme: "3 × 6 / side", load: "moderate", rest: "60 s", cue: "Rotate from the hips, press through the line." },
            { name: "Sled March", scheme: "2 × 40 m", load: "heavy", rest: "90 s", cue: "Low drive angle, powerful steps." }
          ]
        }
      }
    },

    // ───────────────────────── WEEK 9 — SYSTEM RESET / STRATEGIC DELOAD ─────────────────────────
    {
      week: 9,
      dates: "Jun 29 – Jul 5",
      block: "System Reset / Deload",
      blockTag: "deload",
      goal: "Clear the acute fatigue debt from the overreach while the structural gains cement. Cut resistance volume ~50%, hold intensity moderate-high, never to failure.",
      guidelines: [
        "Roughly HALF the working sets of Week 8. Same-ish loads, far fewer sets.",
        "Every rep crisp and fast. If bar speed isn't snappy, the weight is too heavy for a deload — drop it.",
        "You should leave the gym fresher than you walked in.",
        "Off-ice conditioning also −50%. Skating shifts to flow / technical, not conditioning volume.",
        "Success marker: your on-ice pop returns by week's end as fatigue clears (fitness was there the whole time)."
      ],
      days: {
        D1: {
          focus: "Full Body (deloaded)",
          intent: "Touch every pattern, half the volume, fast bar.",
          exercises: [
            { name: "Trap Bar Deadlift", scheme: "2 × 5", load: "75% (RPE 7)", rest: "2 min", cue: "Fast off the floor — speed is the goal, not strain." },
            { name: "BB Incline Press", scheme: "2 × 6", load: "RPE 7", rest: "2 min", cue: "Controlled, leave 3+ reps in the tank." },
            { name: "Chest-Supported Row", scheme: "2 × 10", load: "RPE 7", rest: "90 s", cue: "Smooth, full squeeze." },
            { name: "DB Snatch", scheme: "2 × 3 / side", load: "explosive (light)", rest: "full", cue: "Keep the CNS pattern, low volume." },
            { name: "Farmer Carry", scheme: "1 × 40 m", load: "moderate", rest: "—", cue: "Tall and easy — recovery, not a grind." }
          ]
        },
        D2: {
          focus: "Upper + Plyo (deloaded)",
          intent: "Maintain upper strength signal, fresh legs.",
          exercises: [
            { name: "Hex/Flat Bench", scheme: "2 × 6", load: "RPE 7", rest: "2 min", cue: "Smooth tempo, no grind." },
            { name: "Weighted Chin-Up", scheme: "2 × 5", load: "RPE 7", rest: "2 min", cue: "Clean reps, stop short of failure." },
            { name: "Lat Pulldown", scheme: "2 × 10", load: "RPE 7", rest: "90 s", cue: "Light pump, control the stretch." },
            { name: "Resisted Power Jump", scheme: "2 × 4", load: "light", rest: "full", cue: "Crisp, max height, fully recovered between sets." }
          ]
        },
        D3: {
          focus: "Lower (deloaded)",
          intent: "Light hinge + squat, keep tissue happy.",
          exercises: [
            { name: "Box Squat", scheme: "2 × 5", load: "72% (RPE 7)", rest: "2 min", cue: "Fast up off the box." },
            { name: "Barbell RDL", scheme: "2 × 6", load: "RPE 7", rest: "90 s", cue: "Feel the stretch, don't chase load." },
            { name: "Bulgarian Split Squat", scheme: "2 × 8 / side", load: "light", rest: "60 s/side", cue: "Balance + control, easy load." },
            { name: "Leg Ext + Ham Curl", scheme: "2 × 10", load: "RPE 6–7", rest: "60 s", cue: "Light flush for the knees." }
          ]
        }
      }
    },

    // ───────────────────────── WEEK 10 — TRANSMUTATION PHASE A ─────────────────────────
    {
      week: 10,
      dates: "Jul 6 – 12",
      block: "Transmutation A (Loaded Ballistic)",
      blockTag: "transmute",
      goal: "Convert raw strength → Rate of Force Development. Loaded, ballistic versions of the main patterns. Strength is now MAINTAINED with 1–2 heavy 'anchor' sets; the work is explosive intent.",
      guidelines: [
        "100% intent on every explosive rep. Mentally try to throw the load through the ceiling / wall.",
        "Long rest (2–3 min) between explosive sets — this is neural work, full ATP-CP recovery.",
        "Hard stop rule: if height/speed drops >10% within a movement, end it. Junk reps only add fatigue.",
        "Keep 1–2 heavy anchor sets per session to hold the strength you built — no more.",
        "Loads on jumps stay light: 10–20% bodyweight is the sweet spot for max output."
      ],
      days: {
        D1: {
          focus: "Full-Body Power",
          intent: "Anchor the hinge, then express it ballistically.",
          exercises: [
            { name: "Trap Bar Deadlift (anchor)", scheme: "2 × 3", load: "80% (maintain force)", rest: "2–3 min", cue: "Heavy but clean — this preserves strength, isn't the focus." },
            { name: "Trap Bar Jump Squat", scheme: "5 × 3", load: "~15% BW", rest: "full (2–3 min)", cue: "Explode for max height, soft land, full reset between reps." },
            { name: "Ballistic KB Swing", scheme: "4 × 6", load: "moderate-heavy", rest: "90 s", cue: "Maximal hip SNAP — the bell floats, hips do the work." },
            { name: "Wall MB Rotational Slam/Scoop", scheme: "3 × 5 / side", load: "MB", rest: "60 s", cue: "100% intent, rotate from hips, whip through." },
            { name: "Explosive Cable/Band Row", scheme: "3 × 6", load: "fast", rest: "60 s", cue: "Rip the handle, controlled return." }
          ]
        },
        D2: {
          focus: "Upper Power + Lateral",
          intent: "Ballistic press + skater-specific lateral RFD.",
          exercises: [
            { name: "Bench Press (anchor)", scheme: "2 × 3", load: "80%", rest: "2–3 min", cue: "Heavy, fast intent up." },
            { name: "Plyometric Push-Up (or band bench throw)", scheme: "5 × 3", load: "BW / band", rest: "90 s", cue: "Leave the ground / release fast, land soft, reset." },
            { name: "Weighted Chin-Up (anchor)", scheme: "2 × 4", load: "80%", rest: "2 min", cue: "Strong, controlled." },
            { name: "Band-Resisted Skater Bound", scheme: "4 × 4 / side", load: "band/MB", rest: "full", cue: "Drive lateral, STICK the landing, hold 1 sec." },
            { name: "MB Chest Pass → Sprint", scheme: "3 × (pass + 5 m)", load: "MB", rest: "90 s", cue: "Throw with intent, accelerate out immediately." }
          ]
        },
        D3: {
          focus: "Lower Power",
          intent: "Bilateral + lateral + posterior ballistics.",
          exercises: [
            { name: "Box Squat (anchor)", scheme: "2 × 3", load: "80%", rest: "2–3 min", cue: "Fast up, maintain force." },
            { name: "DB Jump Squat", scheme: "5 × 3", load: "light DBs", rest: "full", cue: "Max height, absorb landing, reset." },
            { name: "MB-Resisted Skater Bound", scheme: "4 × 4 / side", load: "MB", rest: "full", cue: "Cover lateral ground, stick + hold." },
            { name: "Single-Leg MB Slam / KB Swing", scheme: "3 × 6", load: "moderate", rest: "90 s", cue: "Single-leg posterior snap." },
            { name: "Eccentric Nordic Ham (assisted)", scheme: "3 × 4", load: "BW", rest: "90 s", cue: "Slow lower as far as control allows — hamstring insurance." }
          ]
        }
      }
    },

    // ───────────────────────── WEEK 11 — TRANSMUTATION PHASE B ─────────────────────────
    {
      week: 11,
      dates: "Jul 13 – 19",
      block: "Transmutation B (Reactive / Min Contact)",
      blockTag: "transmute",
      milestone: "Last solo week in Sundsvall — Tokyo travel at week's end.",
      goal: "Pure reactive elasticity. Minimal ground-contact time, maximal output. This is the most neural week: tiny volume, all snap. Anchors drop to a single primer set.",
      guidelines: [
        "Think 'hot floor' — minimum ground contact, instant rebound.",
        "Drop strength anchors to ONE primer set; everything else is reactive.",
        "Hard stop the moment jumps lose their snap. Quality is the entire point this week.",
        "This sets up your Tokyo arrival sharp and springy — don't bury yourself.",
        "Tissue quality daily (adductors / TFL / hip flexors) ahead of the travel + ice ramp."
      ],
      days: {
        D1: {
          focus: "Full-Body Reactive",
          intent: "Single heavy primer, then continuous + depth jumps.",
          exercises: [
            { name: "Trap Bar Deadlift (primer)", scheme: "1 × 3", load: "80%", rest: "—", cue: "One crisp heavy set to potentiate, then move to jumps." },
            { name: "Continuous Countermovement Jump", scheme: "4 × 5", load: "BW", rest: "full", cue: "Reactive, minimal ground contact, rhythmic." },
            { name: "Depth Jump (12–18\") to Vertical", scheme: "4 × 4", load: "BW", rest: "full", cue: "Drop, hit the floor like it's hot, explode up." },
            { name: "Ballistic KB Swing", scheme: "3 × 6", load: "moderate", rest: "90 s", cue: "Fast hips, float the bell." },
            { name: "MB Rotational Scoop", scheme: "3 × 5 / side", load: "MB", rest: "60 s", cue: "Whip, 100% intent." }
          ]
        },
        D2: {
          focus: "Upper Reactive + Bounds",
          intent: "Plyo push + unresisted lateral speed.",
          exercises: [
            { name: "Bench Press (primer)", scheme: "1 × 3", load: "80%", rest: "—", cue: "One potentiating set." },
            { name: "Plyometric Push-Up", scheme: "5 × 4", load: "BW", rest: "90 s", cue: "Max push off the floor, land soft, reset." },
            { name: "Unresisted Bodyweight Bound", scheme: "4 × 5 / side", load: "BW", rest: "full", cue: "Cover ground, minimum contact time." },
            { name: "Weighted Chin-Up (primer)", scheme: "2 × 4", load: "RPE 7", rest: "2 min", cue: "Maintain pulling strength, low volume." },
            { name: "MB Pass → Sprint", scheme: "4 × (pass + 5 m)", load: "MB", rest: "90 s", cue: "Transfer to acceleration." }
          ]
        },
        D3: {
          focus: "Lower Reactive",
          intent: "Depth + lateral bounds, hamstring insurance.",
          exercises: [
            { name: "Box Squat (primer)", scheme: "1 × 3", load: "80%", rest: "—", cue: "One crisp potentiating set." },
            { name: "Depth Jump to Broad", scheme: "4 × 4", load: "BW", rest: "full", cue: "Reactive drop, explode forward, soft land." },
            { name: "Unresisted Lateral Bound", scheme: "4 × 5 / side", load: "BW", rest: "full", cue: "Skating mechanics — push and cover ground." },
            { name: "Single-Leg MB Slam", scheme: "3 × 5 / side", load: "MB", rest: "90 s", cue: "Single-leg stability + snap." },
            { name: "Eccentric Nordic Ham", scheme: "3 × 4", load: "BW", rest: "90 s", cue: "Slow controlled lower — protect the hamstrings for ice." }
          ]
        }
      }
    },

    // ───────────────────────── WEEK 12 — CAMP INTEGRATION / TAPER BEGINS ─────────────────────────
    {
      week: 12,
      dates: "Jul 20 – 26",
      block: "Camp Integration / Taper",
      blockTag: "taper",
      anchorDate: "2026-07-20",
      milestone: "JOIN TOKYO WILDS — on-ice daily begins. Manage jet lag (Tokyo +7 h).",
      goal: "The team now owns your on-ice volume. Gym becomes a minimalist neural primer only — let skating carry the load. Reduce gym volume ~40% vs the transmutation weeks.",
      guidelines: [
        "Only 1–2 short gym touches this week (15–25 min each), and only if you have a window around team sessions.",
        "PAP style: a low-volume, high-load primer that wakes up fast-twitch fibers WITHOUT making you sore.",
        "Sleep + circadian adaptation is priority #1 — you're 7 h ahead of Sundsvall. Light in the morning, protect night sleep.",
        "Daily tissue quality: adductors, TFL, hip flexors, rectus femoris (ice shortens all of them → anterior pelvic tilt → dead glutes).",
        "If the team skate was brutal, skip the gym. On-ice quality > dryland this week."
      ],
      days: {
        D1: {
          focus: "Full-Body Neural Primer (optional)",
          intent: "Potentiate, don't fatigue. ~20 min.",
          note: "Slot only if you get a gym window and legs are fresh from skating.",
          exercises: [
            { name: "Trap Bar Deadlift", scheme: "2 × 3", load: "85% (fast, easy)", rest: "2–3 min", cue: "Crisp and powerful, never a grind." },
            { name: "Trap Bar Jump Squat", scheme: "3 × 3", load: "~15% BW", rest: "full", cue: "Max height, fully recovered between." },
            { name: "Wall MB Rotational Scoop", scheme: "2 × 5 / side", load: "MB", rest: "60 s", cue: "Keep the rotational pattern firing." }
          ]
        },
        D2: {
          focus: "Upper Neural Primer (optional)",
          intent: "Keep pressing/pulling strength lit. ~15 min.",
          note: "Pick this OR D1 most weeks now — two short touches total is plenty.",
          exercises: [
            { name: "Bench Press", scheme: "2 × 3", load: "85% (fast)", rest: "2–3 min", cue: "Explosive intent, leave reps in the tank." },
            { name: "Plyometric Push-Up", scheme: "3 × 3", load: "BW", rest: "90 s", cue: "Snappy, soft landings." },
            { name: "Weighted Chin-Up", scheme: "2 × 3", load: "RPE 7", rest: "2 min", cue: "Maintain pull strength, low volume." }
          ]
        },
        D3: {
          focus: "Legs — usually SKIP",
          intent: "Skating is your lower-body work now.",
          note: "Only if a skate gets cancelled. Otherwise let the ice handle legs and stay fresh.",
          exercises: [
            { name: "Box Squat", scheme: "2 × 2", load: "85% (primer)", rest: "2–3 min", cue: "One or two heavy fast singles/doubles — nothing that makes you sore." },
            { name: "Copenhagen Plank", scheme: "2 × 20 s / side", load: "BW", rest: "45 s", cue: "Groin insurance against the skating load." }
          ]
        }
      }
    },

    // ───────────────────────── WEEK 13 — PEAK TAPER + PAP ─────────────────────────
    {
      week: 13,
      dates: "Jul 27 – Aug 2",
      block: "Peak Taper + PAP",
      blockTag: "taper",
      anchorDate: "2026-08-01",
      milestone: "PEAK Aug 1 → first EXHIBITION game Aug 3.",
      goal: "Absolute peak readiness for Aug 1. Volume down another ~40%. One heavy neural primer early in the week to fire fast-twitch fibers without structural micro-tears, then let fatigue fully clear.",
      guidelines: [
        "ONE heavy primer early (Mon/Tue). Nothing the rest of the week that creates soreness.",
        "This is Post-Activation Potentiation, not training — heavy, tiny volume, fully rested.",
        "Sleep, hydrate, eat. Your fitness is already built; the job now is to un-mask it.",
        "Aug 1 = peak target. Aug 3 = first exhibition. Treat the days between as sharpening, not building.",
        "If anything feels tweaky, do less. There is zero to gain from one more set this week."
      ],
      days: {
        D1: {
          focus: "Full-Body PAP Primer (early week)",
          intent: "Wake up the system, then walk away. ~15 min.",
          exercises: [
            { name: "Trap Bar Deadlift", scheme: "2 × 2", load: "87% (fast)", rest: "3 min", cue: "Heavy, crisp, zero grind. This potentiates, it doesn't tax." },
            { name: "Countermovement Jump", scheme: "3 × 3", load: "BW", rest: "full", cue: "Max height — feel the spring the heavy pull gave you." }
          ]
        },
        D2: {
          focus: "Upper PAP Primer (optional)",
          intent: "Light neural touch only.",
          note: "Optional — only if you feel flat and want to feel snappy.",
          exercises: [
            { name: "Bench Press", scheme: "2 × 2", load: "87% (fast)", rest: "3 min", cue: "Explosive, fully recovered." },
            { name: "Plyometric Push-Up", scheme: "3 × 3", load: "BW", rest: "90 s", cue: "Snappy and soft." }
          ]
        },
        D3: {
          focus: "SKIP — fresh legs for Aug 1",
          intent: "No lower lifting this week.",
          note: "Let the legs be springy for the peak + exhibition. Skating + mobility only.",
          exercises: []
        }
      }
    },

    // ───────────────────────── WEEK 14 — IN-SEASON MAINTENANCE (microdose) ─────────────────────────
    {
      week: 14,
      dates: "Aug 3 – 9",
      block: "In-Season Maintenance (Microdose)",
      blockTag: "maintain",
      anchorDate: "2026-08-03",
      milestone: "First exhibition game Aug 3. Pivot Build → strict Maintenance.",
      goal: "Preserve raw force + muscle cross-section without adding fatigue. The In-Season Set Rule: 1–2 heavy working sets per compound pattern per WEEK, 80–90% 1RM, 2–4 reps. Movement snacks, not workouts.",
      guidelines: [
        "Two 15–20 min 'movement snacks' per week, ideally post-practice or on a good CNS day.",
        "1–2 heavy sets per pattern per WEEK total — keep intensity high (80–90%), reps low (2–4).",
        "No 60-min grind sessions, no soreness-chasing. Junk volume threatens game-day legs.",
        "Speed/power rest stays long (2–3 min) for full ATP-CP refill.",
        "Weekly tissue + pelvis work: Copenhagen planks, deep lateral lunges, active hip-flexor release.",
        "Run the autonomic self-check (grip, RHR, motivation, focus). Burnout signs → cut gym 50% for 48 h."
      ],
      days: {
        D1: {
          focus: "Snack 1 — Lower / Posterior (~18 min)",
          intent: "One heavy hinge/squat + one explosive set.",
          exercises: [
            { name: "Trap Bar Deadlift OR Box Squat", scheme: "2 × 3", load: "85–90%", rest: "2.5–3 min", cue: "Heavy, sharp, leave 1–2 in tank. This is the whole lower 'workout' for the week." },
            { name: "Trap Bar / DB Jump Squat", scheme: "1 × 3", load: "~15% BW", rest: "—", cue: "Express the strength — max height, stop if it drops." },
            { name: "Copenhagen Plank", scheme: "2 × 20–30 s / side", load: "BW", rest: "45 s", cue: "Adductor armor against skating shortening." }
          ]
        },
        D2: {
          focus: "Snack 2 — Upper Push/Pull (~18 min)",
          intent: "One heavy press + one heavy pull + tissue work.",
          exercises: [
            { name: "Bench OR Incline Press", scheme: "2 × 3", load: "85–90%", rest: "2.5 min", cue: "Crisp, powerful, no grind." },
            { name: "Weighted Chin-Up", scheme: "2 × 3", load: "85–90%", rest: "2.5 min", cue: "Strong full reps." },
            { name: "MB Rotational Slam", scheme: "1 × 5 / side", load: "MB", rest: "—", cue: "Keep the rotational power firing." },
            { name: "Hip-Flexor / Adductor Release", scheme: "5 min", load: "—", rest: "—", cue: "Active release + deep lateral lunge to fight anterior pelvic tilt." }
          ]
        },
        D3: {
          focus: "Optional power primer / SKIP",
          intent: "Only if legs feel flat before a game.",
          note: "Game-week default is skip. Skating is the volume.",
          exercises: [
            { name: "Countermovement Jump", scheme: "3 × 3", load: "BW", rest: "full", cue: "Snappy primer, stop if pop is gone." }
          ]
        }
      }
    },

    // ───────────────────────── WEEK 15 — IN-SEASON MAINTENANCE ─────────────────────────
    {
      week: 15,
      dates: "Aug 10 – 16",
      block: "In-Season Maintenance (Microdose)",
      blockTag: "maintain",
      goal: "Same strict-maintenance template. Hold force + muscle, stay fresh between games. Let auto-regulation drive volume.",
      guidelines: [
        "Repeat the two movement snacks. Same 1–2 heavy sets per pattern per week.",
        "Auto-regulate: if grip is weak / RHR up / motivation flat, cut to one snack or skip.",
        "Hard stop on any speed/jump that drops >10% in a session.",
        "Keep the weekly Copenhagen + lateral lunge + hip-flexor release non-negotiable.",
        "Banking fitness is over — the job is now subtraction: do the least that maintains."
      ],
      days: {
        D1: {
          focus: "Snack 1 — Lower / Posterior (~18 min)",
          intent: "One heavy hinge/squat + explosive.",
          exercises: [
            { name: "Box Squat OR Trap Bar Deadlift", scheme: "2 × 3", load: "85–90%", rest: "2.5–3 min", cue: "Alternate the lift you used last week. Heavy, clean." },
            { name: "DB Jump Squat", scheme: "1 × 3", load: "light", rest: "—", cue: "Max height expression." },
            { name: "Copenhagen Plank", scheme: "2 × 30 s / side", load: "BW", rest: "45 s", cue: "Progress the hold time from last week." }
          ]
        },
        D2: {
          focus: "Snack 2 — Upper Push/Pull (~18 min)",
          intent: "Heavy press + pull + tissue.",
          exercises: [
            { name: "Incline OR Bench Press", scheme: "2 × 3", load: "85–90%", rest: "2.5 min", cue: "Powerful, fresh." },
            { name: "Weighted Chin-Up", scheme: "2 × 3", load: "85–90%", rest: "2.5 min", cue: "Full strong reps." },
            { name: "MB Rotational Slam", scheme: "1 × 5 / side", load: "MB", rest: "—", cue: "Rotational output." },
            { name: "Deep Lateral Lunge + Hip-Flexor Release", scheme: "5 min", load: "—", rest: "—", cue: "Pelvis mechanics maintenance." }
          ]
        },
        D3: {
          focus: "Optional power primer / SKIP",
          intent: "Auto-regulated.",
          note: "Default skip on a game week.",
          exercises: [
            { name: "Countermovement Jump", scheme: "3 × 3", load: "BW", rest: "full", cue: "Only if you feel flat and want pop." }
          ]
        }
      }
    },

    // ───────────────────────── WEEK 16 — SEASON OPENER WEEK ─────────────────────────
    {
      week: 16,
      dates: "Aug 17 – 23",
      block: "In-Season Maintenance — Opener Week",
      blockTag: "maintain",
      anchorDate: "2026-08-22",
      milestone: "REGULAR-SEASON OPENER Aug 22.",
      goal: "Maintenance, dialed extra light into the opener. One heavy primer early in the week, then nothing but freshness and tissue work into Aug 22.",
      guidelines: [
        "One heavy neural primer early (Mon/Tue) — PAP only, no soreness.",
        "Nothing heavy in the 48 h before Aug 22. Sharp legs win the opener.",
        "Tissue quality + sleep are the priorities of the week.",
        "Run the autonomic check daily; err toward less.",
        "From here, the in-season microdose template (Weeks 14–15) repeats all season — talk to Claude to roll it forward."
      ],
      days: {
        D1: {
          focus: "Early-Week PAP Primer (~12 min)",
          intent: "Potentiate, then taper to the opener.",
          exercises: [
            { name: "Trap Bar Deadlift", scheme: "2 × 2", load: "87%", rest: "3 min", cue: "Heavy, fast, early in the week only." },
            { name: "Countermovement Jump", scheme: "3 × 3", load: "BW", rest: "full", cue: "Feel the spring." }
          ]
        },
        D2: {
          focus: "Upper touch (optional, early week)",
          intent: "Light maintenance press/pull.",
          note: "Optional and early-week only.",
          exercises: [
            { name: "Bench Press", scheme: "2 × 2", load: "85–87%", rest: "2.5 min", cue: "Crisp, fresh." },
            { name: "Weighted Chin-Up", scheme: "2 × 3", load: "85%", rest: "2.5 min", cue: "Strong reps." }
          ]
        },
        D3: {
          focus: "SKIP — fresh for the opener",
          intent: "No lower lifting in opener week.",
          note: "Skating + mobility + tissue work only into Aug 22.",
          exercises: []
        }
      }
    }
  ]
};
