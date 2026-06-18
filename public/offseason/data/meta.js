// data/meta.js — Player context. Claude reads this FIRST every conversation.
// CLAUDE: Update currentWeek/currentPhase each Monday.
// Update startDates when Rider confirms he's starting a program.

window.META = {
  name: "Rider McCallum",
  position: "Defenseman",
  offseasonStart: "2026-05-18",   // full-time training regiment began here (May 4 was a one-off pre-start lift, discarded)
  offseasonEnd: "2026-08-01",   // First game = end of offseason (season starts here)
  totalWeeks: 11,
  currentWeek: 5,
  currentPhase: "Build",

  // CONTRACT SIGNED. First pro game Aug 1 — conditioning now peaks here, not the old Sep 1 camp.
  contractSigned: true,
  team: "Tokyo Wilds",
  teamLocation: "Tokyo, Japan",
  teamJoinDate: "2026-07-20",          // arrives + starts skating with the team here (effectively camp)
  firstGame: "2026-08-01",            // kept = peak / first-game window (see milestones — specialist calls Aug 3 the first exhibition; confirm with Rider)
  gameShapeTarget: "2026-08-01",

  // Competition calendar — adopted from the gym specialist's blueprint (2026-06-16 conversation).
  // NOTE: previously Rider said "first game Aug 1." Specialist says Aug 1 = peak, Aug 3 = first
  // exhibition, Aug 22 = regular-season opener. Treating it that way; flagged for Rider to confirm.
  milestones: {
    peakTarget:    "2026-08-01",      // exceptional conditioning + max explosive velocity
    exhibitionGame:"2026-08-03",      // first competitive exhibition
    seasonOpener:  "2026-08-22"       // official regular-season opener
  },

  chronologicalAge: 24,
  latestBodyweightLb: 172.6,           // 2026-06-18 weigh-in (-1.1 from Jun 16's 173.7)

  goals: [
    "Build posterior chain strength (DL/squat numbers)",
    "Improve lateral explosiveness for gap-close",
    "Be in game shape by Aug 1 — aerobic base + anaerobic shuttle peak",
    "Stay healthy — manage IT band / lower back"
  ],

  activePrograms: {
    lifts: "M. Hockey Off-Season 3-Day (→ Fitness-Fatigue mesocycle Wks 8–16, see lift-program.js / Plan tab)",
    plyo: "Solo Off-Season Speed & Agility (Defenseman)",
    conditioning: "Oil Barons Speed + Aerobic Base (blended, peaks Aug 1)"
  },

  startDates: {
    lifts: "2026-05-18",
    plyo: "2026-05-19 (Week 1 — Base phase, easing in)",
    conditioning: "2026-06-01 (Week 3, Build phase)",
    skating: "2026-07-20 — on-ice begins with Tokyo Wilds (Tokyo, Japan)"
  },

  // Flat date fields the viewer reads for current-week / current-phase highlighting
  plyoStartDate: "2026-05-19",
  conditioningStartDate: "2026-06-01",

  baselineBodyweight: 169.5,   // May 18 offseason-start weigh-in (was 168.8 on the discarded May 4)

  trackingDevices: {
    wearable: "none",
    scale: "Renpho — bodyweight + body comp metrics"
  },

  notes: "Week 5 (Build, final Aerobic-Engine week). OFFSEASON START CORRECTED 2026-06-17: full-time regiment began Mon May 18 (not May 4 — that was a single pre-start lift, now discarded). Everything renumbered: May 18 = Week 1, today (Jun 15–21) = Week 5 of 11 to the Aug 1 peak. The lift mesocycle keeps its internal Wk8–16 labels (keyed to training blocks; schedule weeks link via liftPlanWeek). 2026-06-16: a gym specialist handed Rider an 'Elite Athletic Blueprint' (Fitness-Fatigue / Dual-Factor + ANS); his PHASE LOGIC was mapped onto Rider's real calendar → a strength MESOCYCLE (lift-program.js, 'Plan' tab): Wk8 Overreach → Wk9 Deload → Wk10–11 Transmutation (force→RFD) → Wk12–13 Camp+Taper (Tokyo) → Wk14–16 In-Season Maintenance microdosing. Competition calendar: Aug 1 PEAK, Aug 3 first EXHIBITION game, Aug 22 regular-season OPENER (firstGame field still = Aug 1). Tokyo Wilds join Jul 20: on-ice daily takes over, gym goes minimalist from the camp block. CONTRACT SIGNED with the TOKYO WILDS (Tokyo, Japan). Blended conditioning layers Zone-2 bike base onto the Oil Barons anaerobic ladder, HR zones pegged to chronological age 24 (HRmax 196 — NOT Renpho body-age 21). Bodyweight 173.7 lb (2026-06-16, +4.2 from the May 18 baseline 169.5, +2.5 from the Jun 2 scan: 171.2 / 14.0% fat / 38.0 kg skeletal muscle). Still need a real morning RHR (scan's 106 bpm was a standing handle reading). [first plyo May 19; IT band + Jun-2 knee watch.]",

  version: 6,
  updated: "2026-06-18"   // offseason start moved to May 18 + full renumber (May 18 = Wk1); pre-May-18 sessions discarded; Jun 1–7 backfilled
};
