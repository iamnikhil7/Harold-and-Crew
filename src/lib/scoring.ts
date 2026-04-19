interface Response {
  questionId: number;
  responseType: string;
  responseText?: string;
  responseChoice?: string | string[] | number;
}

interface ScoringResult {
  primaryArchetypeId: number;
  primaryScore: number;
  secondaryArchetypeId: number;
  secondaryScore: number;
  allScores: Record<number, number>;
}

/**
 * Archetype weights for the 6-question Harold & Crew intake. Each choice
 * contributes points to one or more of the 10 archetypes; the highest
 * score becomes the user's primary archetype.
 */
export function calculateArchetypeScores(responses: Response[]): ScoringResult {
  const scores: Record<number, number> = {};
  for (let i = 1; i <= 10; i++) scores[i] = 0;

  for (const r of responses) {
    const v = r.responseChoice;
    switch (r.questionId) {
      // 1/6 — Mornings
      case 1: {
        if (v === "slow_intentional") { scores[10] += 3; scores[2] += 1; }
        if (v === "coffee_go") { scores[1] += 2; scores[2] += 2; }
        if (v === "extra_sleep") { scores[5] += 2; scores[6] += 1; }
        if (v === "catching_up") { scores[1] += 2; scores[5] += 2; }
        break;
      }

      // 2/6 — Movement today
      case 2: {
        if (v === "walk_run") { scores[2] += 3; scores[10] += 1; }
        if (v === "home_workout") { scores[10] += 2; scores[2] += 1; }
        if (v === "sport") { scores[2] += 2; scores[4] += 2; }
        if (v === "gym") { scores[2] += 3; scores[9] += 1; }
        if (v === "group_classes") { scores[4] += 3; scores[3] += 1; }
        if (v === "not_much") { scores[7] += 2; scores[1] += 2; }
        break;
      }

      // 3/6 — What you stopped doing
      case 3: {
        if (v === "exercise") { scores[2] += 3; scores[7] += 1; }
        if (v === "creative") { scores[10] += 2; scores[7] += 1; }
        if (v === "social") { scores[4] += 2; scores[3] += 2; }
        if (v === "reading") { scores[5] += 1; scores[10] += 1; scores[1] += 1; }
        break;
      }

      // 4/6 — Average Tuesday
      case 4: {
        if (v === "pretty_good") { scores[10] += 3; }
        if (v === "going_flow") { scores[10] += 1; scores[4] += 1; scores[8] += 1; }
        if (v === "depends") { scores[7] += 2; scores[8] += 2; }
        if (v === "overwhelmed") { scores[1] += 3; scores[3] += 2; scores[6] += 1; }
        break;
      }

      // 5/6 — What you reach for when stressed
      case 5: {
        if (v === "food") { scores[6] += 3; scores[8] += 2; }
        if (v === "phone") { scores[5] += 3; scores[8] += 1; }
        if (v === "isolate") { scores[5] += 2; scores[6] += 1; scores[3] += 1; }
        if (v === "movement") { scores[2] += 2; scores[10] += 2; }
        break;
      }

      // 6/6 — Familiar patterns (multi-select)
      case 6: {
        const vals = Array.isArray(v) ? v : [];
        if (vals.includes("late_nights")) { scores[5] += 2; scores[6] += 1; }
        if (vals.includes("screen_time")) { scores[5] += 2; scores[8] += 1; }
        if (vals.includes("irregular_food")) { scores[6] += 2; scores[8] += 2; }
        if (vals.includes("poor_sleep")) { scores[1] += 2; scores[5] += 1; }
        if (vals.includes("not_going_out")) { scores[3] += 2; scores[4] += 1; }
        if (vals.includes("socially_absent")) { scores[3] += 2; scores[1] += 1; }
        break;
      }
    }
  }

  const sorted = Object.entries(scores)
    .map(([id, score]) => ({ id: Number(id), score }))
    .sort((a, b) => b.score - a.score);

  return {
    primaryArchetypeId: sorted[0].id,
    primaryScore: sorted[0].score,
    secondaryArchetypeId: sorted[1].id,
    secondaryScore: sorted[1].score,
    allScores: scores,
  };
}

export function generateGoalSuggestions(
  archetypeId: number,
  responses: Response[],
): string[] {
  const g: Record<number, string[]> = {
    1: [
      "Protect your mornings — even 20 minutes before the day takes over",
      "Leave work at a set time at least 3 days this week",
      "Eat one meal that isn't at your desk",
      "Put your phone in another room before sleep",
    ],
    2: [
      "Move your body before 7pm — not for fitness, for how it makes tomorrow feel",
      "Try one new form of movement",
      "Listen to your body's recovery signals",
      "Eat for who you are now, not who you were",
    ],
    3: [
      "Take 15 minutes this week that are purely yours",
      "Eat one meal you chose for yourself",
      "Ask for help with one thing",
      "Move your body for 10 minutes",
    ],
    4: [
      "Say no to one social event this week",
      "Before saying yes, ask: do I actually want this?",
      "Eat one meal at home, by choice",
      "Notice when you're matching someone else's pace",
    ],
    5: [
      "Put your phone down an hour before sleep",
      "Set a wind-down alarm at 10pm",
      "Eat your last meal before 9pm at least 3 days",
      "Find one thing to do between 10-11pm that isn't a screen",
    ],
    6: [
      "Before you eat, pause and ask: am I hungry, or feeling something?",
      "Find one non-food comfort",
      "Eat one meal the old you would recognize",
      "When the craving hits, wait 10 minutes",
    ],
    7: [
      "Pick one thing and do it for 7 days straight",
      "Don't research a new program this week",
      "The goal isn't perfection. It's still being here on day 8.",
      "Celebrate consistency, not intensity",
    ],
    8: [
      "Before you snack, drink water and wait 5 minutes",
      "Eat at the table, not standing or at your desk",
      "Notice when you're eating without choosing to",
      "Keep one area of your home snack-free",
    ],
    9: [
      "When you slip, don't restart — just continue",
      "Replace 'I ruined it' with 'I'm learning'",
      "Track progress in weeks, not days",
      "Be kind to yourself when things aren't perfect",
    ],
    10: [
      "Spend one evening the way your past self would have",
      "Go deeper on one habit instead of wider",
      "Share your journey with someone",
      "Notice what disrupts your consistency",
    ],
  };

  const goals = [...(g[archetypeId] || g[10])];

  const stress = responses.find((r) => r.questionId === 5);
  if (stress?.responseChoice === "phone")
    goals.push(
      "Before opening your go-to app, ask: is this what I actually want right now?",
    );
  if (stress?.responseChoice === "food")
    goals.push("Next time the craving comes, set a timer for 3 minutes.");

  return goals.slice(0, 6);
}
