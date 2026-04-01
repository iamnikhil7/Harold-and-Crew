export function generateGoals(archetypeId: number, patterns: string[]): string[] {
  const base: Record<number, string[]> = {
    1: ["Protect your mornings — even 20 minutes before the day takes over", "Leave work at a set time at least 3 days this week", "Eat one meal that isn't at your desk", "Put your phone in another room before sleep"],
    2: ["Move your body before 7pm — not for fitness, for how it makes tomorrow feel", "Try one new form of movement this week", "Listen to your body's recovery signals", "Eat for who you are now, not who you were"],
    3: ["Take 15 minutes this week that are purely yours", "Eat one meal you chose for yourself", "Ask for help with one thing this week", "Move your body for 10 minutes — just for you"],
    4: ["Say no to one social event this week", "Before saying yes, ask: do I actually want this?", "Eat one meal at home, by choice", "Notice when you're matching someone else's pace instead of your own"],
    5: ["Put your phone down an hour before sleep", "Set a wind-down alarm at 10pm", "Eat your last meal before 9pm at least 3 days", "Find one thing to do between 10-11pm that isn't a screen"],
    6: ["Before you eat, pause and ask: am I hungry, or feeling something?", "Find one non-food comfort this week", "Eat one meal the old you would recognize", "When the craving hits, wait 10 minutes and check in"],
    7: ["Pick one thing and do it for 7 days straight — that's it", "Don't research a new program this week", "The goal isn't perfection — it's still being here on day 8", "Celebrate consistency, not intensity"],
    8: ["Before you snack, drink water and wait 5 minutes", "Eat at the table, not standing or at your desk", "Notice when you're eating without choosing to", "Keep one area of your home snack-free this week"],
    9: ["When you slip, don't restart — just continue", "Replace 'I ruined it' with 'I'm learning'", "Track progress in weeks, not days", "Be kind to yourself when things aren't perfect"],
    10: ["Spend one evening the way your past self would have", "Go deeper on one habit instead of wider", "Share your journey with someone you trust", "Notice what disrupts your consistency and name it"],
  };

  const goals = [...(base[archetypeId] || base[10])];

  // Add pattern-specific goals
  if (patterns.includes("late_order")) goals.push("Before opening delivery apps after 9pm, set a 3-minute timer first");
  if (patterns.includes("doomscroll")) goals.push("Before opening your go-to app, ask: is this what I actually want right now?");
  if (patterns.includes("spending")) goals.push("Add a 24-hour wait rule for any purchase over $30");
  if (patterns.includes("night_diff")) goals.push("Write down tomorrow's intention before the night version of you takes over");

  return goals.slice(0, 6);
}
