export type OrbState = "neutral" | "stress" | "recovery";

export interface Scene {
  at: number;
  state: OrbState;
  caption: string;
}

export interface Scenario {
  id: string;
  label: string;
  scenes: Scene[];
  voiceScript: string;
  summary: string[];
  noticed: string;
  matter: string;
  steps: string[];
  ack: string;
}

export const scenarios: Record<string, Scenario> = {
  rhr: {
    id: "rhr",
    label: "Rising RHR",
    scenes: [
      { at: 700, state: "neutral", caption: "Long day?" },
      { at: 3600, state: "stress", caption: "Stress is stacking, and your body hasn't reset." },
      { at: 7600, state: "stress", caption: "You might not feel it yet\u2026" },
      { at: 10800, state: "recovery", caption: "Might be worth paying attention to." },
    ],
    voiceScript: "Long day? Stress is stacking, and your body has not fully reset. You might not feel it yet. Might be worth paying attention to.",
    summary: [
      "You've been pushing more than usual lately.",
      "Stress is rising while recovery is lagging behind.",
      "You may not feel it immediately, but it is starting to shift your baseline.",
    ],
    noticed: "Your recent pattern suggests stress load has been hanging around without a full reset.",
    matter: "When stress and sleep recovery both lag, effects can quietly build before they feel obvious.",
    steps: [
      "Aim for two genuinely solid nights this week.",
      "Trim one late-night stress trigger before bed.",
      "Check if energy and focus feel different after that.",
    ],
    ack: "Got it. I'll keep this on watch and nudge you early if it keeps building.",
  },
  sleep: {
    id: "sleep",
    label: "Declining Sleep",
    scenes: [
      { at: 700, state: "neutral", caption: "Your nights look lighter than usual." },
      { at: 3600, state: "stress", caption: "Stress is stacking while reset stays low." },
      { at: 7600, state: "stress", caption: "You may not feel it right away\u2026" },
      { at: 10800, state: "recovery", caption: "Might be worth paying attention to." },
    ],
    voiceScript: "Your nights are lighter than usual. Recovery is lagging behind stress. You may not feel it yet. Might be worth paying attention to.",
    summary: [
      "Your sleep quality has softened over recent nights.",
      "Recovery is not fully catching up with daily stress.",
      "That drift can quietly affect baseline energy and focus.",
    ],
    noticed: "Your sleep quality has trended downward across the week.",
    matter: "Less restorative sleep can make everything feel heavier, even before obvious fatigue shows up.",
    steps: [
      "Keep bedtime consistent for the next two nights.",
      "Create a 20\u201330 minute low-stimulus wind-down.",
      "Check whether morning energy feels different after that.",
    ],
    ack: "Got it. I'll keep sleep in focus and stay simple with updates.",
  },
  activity: {
    id: "activity",
    label: "Movement Drop",
    scenes: [
      { at: 700, state: "neutral", caption: "Your movement has been quieter this week." },
      { at: 3600, state: "stress", caption: "Load is stacking, and reset is lagging behind." },
      { at: 7600, state: "stress", caption: "You might not notice it immediately\u2026" },
      { at: 10800, state: "recovery", caption: "Might be worth paying attention to." },
    ],
    voiceScript: "Movement has been quieter this week. Load is building without enough reset. You might not notice it yet. Might be worth paying attention to.",
    summary: [
      "Movement has dropped below your usual rhythm.",
      "Lower activity can make stress feel heavier over time.",
      "A small rebound in movement can stabilize your baseline.",
    ],
    noticed: "Your movement trend is below your usual pattern over several days.",
    matter: "Lower movement can make stress feel stickier and recovery less efficient.",
    steps: [
      "Take one short walk between two work blocks.",
      "Pick one light activity session this week.",
      "Notice how your energy shifts after two active days.",
    ],
    ack: "Got it. I'll watch for a rebound and keep the nudges gentle.",
  },
};
