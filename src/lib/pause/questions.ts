export interface PauseOption { emoji: string; label: string; subtitle: string; value: string; }
export interface PauseQuestion { id: number; section: string; text: string; subtitle: string; type: "single" | "multi" | "text"; options?: PauseOption[]; }

export const pauseQuestions: PauseQuestion[] = [
  {
    id: 1,
    section: "Who were you?",
    text: "When you felt most like yourself \u2014 what did mornings look like?",
    subtitle: "No wrong answers. Just a starting point.",
    type: "single",
    options: [
      { emoji: "\u2615", label: "Had a routine", subtitle: "Coffee, workout, quiet time before the day", value: "routine" },
      { emoji: "\u{1F319}", label: "Slow & easy", subtitle: "No rush, no pressure, no alarms", value: "slow" },
      { emoji: "\u26A1", label: "Straight into it", subtitle: "Sport, creative work, something I loved", value: "passion" },
      { emoji: "\u{1F634}", label: "Not a morning person", subtitle: "I came alive later in the day", value: "night" },
      { emoji: "\u{1F5BC}\u{FE0F}", label: "Can't remember", subtitle: "But it felt easier than now", value: "forgot" },
    ],
  },
  {
    id: 2,
    section: "The shift",
    text: "Your life has changed. When you think about your average day now \u2014 what\u2019s the first feeling?",
    subtitle: "Be honest. This stays between us.",
    type: "single",
    options: [
      { emoji: "\u{1F4CB}", label: "Busy but okay", subtitle: "Lots happening, managing it", value: "busy" },
      { emoji: "\u{1F573}\u{FE0F}", label: "Productive but hollow", subtitle: "Getting things done, but something's missing", value: "hollow" },
      { emoji: "\u{1F6CF}\u{FE0F}", label: "Tired in a way sleep doesn't fix", subtitle: "Running on empty, can't recharge", value: "tired" },
      { emoji: "\u{1F32B}\u{FE0F}", label: "Honestly, a bit lost", subtitle: "No clear direction right now", value: "lost" },
      { emoji: "\u{1F331}", label: "Adapting", subtitle: "Things are different but I'm figuring it out", value: "adapting" },
    ],
  },
  {
    id: 3,
    section: "Your patterns",
    text: "What patterns do you recognize in yourself right now?",
    subtitle: "Select all that apply. No judgment here.",
    type: "multi",
    options: [
      { emoji: "\u{1F355}", label: "Late-night ordering", subtitle: "Delivery apps after 10pm", value: "late_order" },
      { emoji: "\u{1F4F1}", label: "Doom-scrolling", subtitle: "Phone before bed, endless feeds", value: "doomscroll" },
      { emoji: "\u{1F6D2}", label: "Stress spending", subtitle: "Retail therapy, impulse buys", value: "spending" },
      { emoji: "\u{1F37D}\u{FE0F}", label: "Skipping then overeating", subtitle: "No meals, then too much at once", value: "skip_overeat" },
      { emoji: "\u{1F37A}", label: "Weekend bingeing", subtitle: "Good all week, different on weekends", value: "weekend" },
      { emoji: "\u{1F6CB}\u{FE0F}", label: "Constant grazing", subtitle: "Always nibbling, never full meals", value: "grazing" },
      { emoji: "\u{1F3AD}", label: "Performing a version of myself", subtitle: "Not being, just acting", value: "performing" },
      { emoji: "\u{1F303}", label: "Different person at night", subtitle: "Eat, spend, or scroll differently after dark", value: "night_diff" },
    ],
  },
  {
    id: 4,
    section: "Your why",
    text: "Why do you want to change?",
    subtitle: "Write this for future-you. When you\u2019re about to override a pause, these are the words you\u2019ll see. Make it something only you would write.",
    type: "text",
  },
];
