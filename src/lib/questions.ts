export type QuestionType = "single_choice" | "multi_select" | "slider";

export interface QuestionOption {
  label: string;
  subtitle?: string;
  emoji?: string;
  value: string;
  /** Image URL used in the image-grid card layout */
  image?: string;
}

export interface Question {
  id: number;
  part: 1 | 2;
  text: string;
  sensitiveText: string;
  hint?: string;
  type: QuestionType;
  options?: QuestionOption[];
  sliderMin?: number;
  sliderMax?: number;
  sliderMinLabel?: string;
  sliderMaxLabel?: string;
  cardLayout?: "grid" | "list";
}

/** Unsplash helper — warm lifestyle imagery, identical compression. */
const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

/**
 * 6-question Harold & Crew onboarding flow.
 * Matches the reference mocks: five image-tile questions + one text-tile
 * multi-select. Every choice feeds the archetype scoring engine.
 */
export const questions: Question[] = [
  // 1/6 — Mornings
  {
    id: 1,
    part: 1,
    text: "What does your morning usually look like?",
    sensitiveText: "When things feel easier, what do mornings look like?",
    type: "single_choice",
    cardLayout: "grid",
    options: [
      {
        label: "Slow & Intentional",
        value: "slow_intentional",
        image: img("photo-1507120410856-1f35574c3b45"),
      },
      {
        label: "Coffee & Go",
        value: "coffee_go",
        image: img("photo-1509042239860-f550ce710b93"),
      },
      {
        label: "A few extra mins of sleep",
        value: "extra_sleep",
        image: img("photo-1541199249251-f713e6145474"),
      },
      {
        label: "Catching up",
        value: "catching_up",
        image: img("photo-1512446816042-444d641267d4"),
      },
    ],
  },

  // 2/6 — Movement
  {
    id: 2,
    part: 1,
    text: "What's the most realistic way you move today?",
    sensitiveText: "What kind of movement feels right for you now?",
    type: "single_choice",
    cardLayout: "grid",
    options: [
      {
        label: "Walk / Jog / Run",
        value: "walk_run",
        image: img("photo-1552674605-db6ffd4facb5"),
      },
      {
        label: "Home workouts",
        value: "home_workout",
        image: img("photo-1518611012118-696072aa579a"),
      },
      {
        label: "Sport",
        value: "sport",
        image: img("photo-1526676037777-05a232554f77"),
      },
      {
        label: "Gym",
        value: "gym",
        image: img("photo-1517836357463-d25dfeac3438"),
      },
      {
        label: "Group Classes",
        value: "group_classes",
        image: img("photo-1571019613454-1cb2f99b2d8b"),
      },
      {
        label: "Not much right now",
        value: "not_much",
        image: img("photo-1518455027359-f3f8164ba6bd"),
      },
    ],
  },

  // 3/6 — What you stopped doing
  {
    id: 3,
    part: 1,
    text: "What have you stopped doing that you miss?",
    sensitiveText: "What has quietly faded from your routine?",
    type: "single_choice",
    cardLayout: "grid",
    options: [
      {
        label: "Regular exercise",
        value: "exercise",
        image: img("photo-1518611012118-696072aa579a"),
      },
      {
        label: "Creative hobbies",
        value: "creative",
        image: img("photo-1452860606245-08befc0ff44b"),
      },
      {
        label: "Being social / present",
        value: "social",
        image: img("photo-1529156069898-49953e39b3ac"),
      },
      {
        label: "Reading / Learning",
        value: "reading",
        image: img("photo-1512820790803-83ca734da794"),
      },
    ],
  },

  // 4/6 — Average Tuesday
  {
    id: 4,
    part: 1,
    text: "How do you feel on an average Tuesday?",
    sensitiveText: "A typical day now — what feeling comes up?",
    type: "single_choice",
    cardLayout: "grid",
    options: [
      {
        label: "Pretty good",
        value: "pretty_good",
        image: img("photo-1506905925346-21bda4d32df4"),
      },
      {
        label: "Going with the flow",
        value: "going_flow",
        image: img("photo-1519681393784-d120267933ba"),
      },
      {
        label: "Depends on the day",
        value: "depends",
        image: img("photo-1418065460487-3e41a6c84dc5"),
      },
      {
        label: "Overwhelmed",
        value: "overwhelmed",
        image: img("photo-1499209974431-9dddcece7f88"),
      },
    ],
  },

  // 5/6 — What you reach for when stressed
  {
    id: 5,
    part: 2,
    text: "When stressed, what do you reach for?",
    sensitiveText: "When you're overwhelmed — what do you turn to?",
    type: "single_choice",
    cardLayout: "grid",
    options: [
      {
        label: "Comfort Food",
        value: "food",
        image: img("photo-1568901346375-23c9450c58cd"),
      },
      {
        label: "Social Media",
        value: "phone",
        image: img("photo-1512428559087-560fa5ceab42"),
      },
      {
        label: "Isolate",
        value: "isolate",
        image: img("photo-1455642305367-68834a9d4337"),
      },
      {
        label: "Movement / Exercise",
        value: "movement",
        image: img("photo-1486218119243-13883505764c"),
      },
    ],
  },

  // 6/6 — Patterns
  {
    id: 6,
    part: 2,
    text: "Which patterns feel the most familiar?",
    sensitiveText: "Do any of these feel familiar?",
    hint: "And lastly — pick every one that resonates.",
    type: "multi_select",
    cardLayout: "list",
    options: [
      { label: "Staying up later than planned", value: "late_nights" },
      { label: "Too much screen time", value: "screen_time" },
      { label: "Irregular food habits", value: "irregular_food" },
      { label: "Poor sleep", value: "poor_sleep" },
      { label: "Not going out like I used to", value: "not_going_out" },
      { label: "Socially absent", value: "socially_absent" },
    ],
  },
];
