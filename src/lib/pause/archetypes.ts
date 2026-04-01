export interface PauseArchetype {
  id: number;
  name: string;
  description: string;
  baseline: number;
  color: string;
  traits: string[];
}

export const ARCHETYPES: PauseArchetype[] = [
  { id: 1, name: "The Burnt-Out Professional", description: "High-achiever drowning in deadlines, surviving on delivery apps and caffeine.", baseline: 55, color: "#E85D3A", traits: ["Works 50+ hours/week", "Skips meals or stress-eats", "High screen time", "Poor sleep quality"] },
  { id: 2, name: "The Former Athlete", description: "Once fit, now struggling as metabolism slows and old habits don't work.", baseline: 65, color: "#3A8FE8", traits: ["Used to be very active", "Eating same portions but moving less", "Nostalgic about past fitness"] },
  { id: 3, name: "The Overwhelmed Parent", description: "Putting everyone else first, grabbing whatever food is fast and easy.", baseline: 50, color: "#E8A83A", traits: ["Zero personal time", "Eats kids' leftovers", "Exhausted constantly"] },
  { id: 4, name: "The Social Butterfly", description: "Life revolves around events, dinners, and drinks with friends.", baseline: 60, color: "#C23AE8", traits: ["Multiple social events weekly", "FOMO drives decisions", "Weekend warrior mentality"] },
  { id: 5, name: "The Night Owl", description: "Comes alive after dark, makes worst decisions between 10pm\u20132am.", baseline: 58, color: "#3A3AE8", traits: ["Reversed sleep schedule", "Late-night snacker", "Mornings are the enemy"] },
  { id: 6, name: "The Emotional Eater", description: "Food is comfort, reward, and coping mechanism all in one.", baseline: 52, color: "#E83A6F", traits: ["Eats feelings", "Reward = food", "Cycles of guilt"] },
  { id: 7, name: "The Serial Starter", description: "Has tried every diet, app, and program. Starts strong, fades fast.", baseline: 55, color: "#3AE8A8", traits: ["Graveyard of diet apps", "High initial enthusiasm", "Quick to abandon"] },
  { id: 8, name: "The Mindless Grazer", description: "Doesn't overeat at meals but constantly nibbles throughout the day.", baseline: 57, color: "#E8D43A", traits: ["Never feels truly full", "Always snacking", "Eats out of boredom"] },
  { id: 9, name: "The Perfectionist Quitter", description: "One slip-up ruins everything. All or nothing mentality.", baseline: 53, color: "#FF6B6B", traits: ["Binary thinking", "Extremely self-critical", "Restart Monday mentality"] },
  { id: 10, name: "The Mindful Aspirant", description: "Already on the journey, needs tools to stay consistent and go deeper.", baseline: 70, color: "#6BE8A0", traits: ["Health-conscious already", "Seeks balance", "Self-aware"] },
];

export function scoreArchetype(q1: string, q2: string, q3: string[]): PauseArchetype {
  const scores: Record<number, number> = {};
  for (let i = 1; i <= 10; i++) scores[i] = 0;

  // Q1 scoring
  if (q1 === "routine") { scores[1] += 3; scores[2] += 2; }
  if (q1 === "passion") { scores[2] += 3; }
  if (q1 === "night") { scores[5] += 3; }
  if (q1 === "forgot") { scores[7] += 2; scores[9] += 1; }
  if (q1 === "slow") { scores[10] += 2; }

  // Q2 scoring
  if (q2 === "busy") { scores[1] += 2; scores[4] += 1; }
  if (q2 === "hollow") { scores[1] += 3; scores[6] += 2; }
  if (q2 === "tired") { scores[3] += 3; scores[1] += 2; }
  if (q2 === "lost") { scores[9] += 3; scores[6] += 1; }
  if (q2 === "adapting") { scores[10] += 3; }

  // Q3 scoring
  if (q3.includes("late_order")) { scores[6] += 3; scores[5] += 2; }
  if (q3.includes("doomscroll")) { scores[5] += 3; scores[8] += 1; }
  if (q3.includes("spending")) { scores[4] += 2; scores[6] += 1; }
  if (q3.includes("skip_overeat")) { scores[8] += 3; }
  if (q3.includes("weekend")) { scores[4] += 3; }
  if (q3.includes("grazing")) { scores[8] += 3; }
  if (q3.includes("performing")) { scores[1] += 2; scores[7] += 1; }
  if (q3.includes("night_diff")) { scores[5] += 2; scores[6] += 2; }

  let maxId = 1, maxScore = 0;
  for (const [id, score] of Object.entries(scores)) {
    if (score > maxScore) { maxScore = score; maxId = Number(id); }
  }
  return ARCHETYPES.find((a) => a.id === maxId) || ARCHETYPES[0];
}
