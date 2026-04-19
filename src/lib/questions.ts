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

/** Unsplash helpers — warm lifestyle photography */
const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

export const questions: Question[] = [
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
        value: "early_routine",
        image: img("photo-1507120410856-1f35574c3b45"),
      },
      {
        label: "Coffee & Go",
        value: "passion_first",
        image: img("photo-1509042239860-f550ce710b93"),
      },
      {
        label: "A few extra mins of sleep",
        value: "slow_mornings",
        image: img("photo-1541199249251-f713e6145474"),
      },
      {
        label: "Catching up",
        value: "not_morning",
        image: img("photo-1512446816042-444d641267d4"),
      },
    ],
  },
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
        value: "movement",
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
        value: "relax",
        image: img("photo-1518455027359-f3f8164ba6bd"),
      },
    ],
  },
  {
    id: 3,
    part: 1,
    text: "How did you used to recharge?",
    sensitiveText: "What helped you feel rested?",
    hint: "Think about what actually worked.",
    type: "single_choice",
    cardLayout: "grid",
    options: [
      {
        label: "Moving",
        value: "A",
        image: img("photo-1502224562085-639556652f33"),
      },
      {
        label: "People",
        value: "B",
        image: img("photo-1529156069898-49953e39b3ac"),
      },
      {
        label: "Stillness",
        value: "C",
        image: img("photo-1470770841072-f978cf4d019e"),
      },
      {
        label: "Creating",
        value: "D",
        image: img("photo-1452860606245-08befc0ff44b"),
      },
    ],
  },
  {
    id: 4,
    part: 1,
    text: "When you were at your most consistent — what did it feel like?",
    sensitiveText: "When things felt steady — what did it feel like?",
    type: "single_choice",
    cardLayout: "grid",
    options: [
      {
        label: "Effortless",
        value: "A",
        image: img("photo-1500530855697-b586d89ba3ee"),
      },
      {
        label: "Disciplined",
        value: "B",
        image: img("photo-1540575467063-178a50c2df87"),
      },
      {
        label: "Social",
        value: "C",
        image: img("photo-1529156069898-49953e39b3ac"),
      },
      {
        label: "Structural",
        value: "D",
        image: img("photo-1556761175-5973dc0f32e7"),
      },
    ],
  },
  {
    id: 5,
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
        value: "friends",
        image: img("photo-1529156069898-49953e39b3ac"),
      },
      {
        label: "Reading / Learning",
        value: "reading",
        image: img("photo-1512820790803-83ca734da794"),
      },
    ],
  },
  {
    id: 6,
    part: 1,
    text: "What part of your day did you used to protect?",
    sensitiveText: "Was there a part of your day that felt sacred?",
    type: "single_choice",
    cardLayout: "grid",
    options: [
      {
        label: "Mornings",
        value: "mornings",
        image: img("photo-1507525428034-b723cf961d3e"),
      },
      {
        label: "Workouts",
        value: "workouts",
        image: img("photo-1534438327276-14e5300c3a48"),
      },
      {
        label: "Meals",
        value: "meals",
        image: img("photo-1484723091739-30a097e8f929"),
      },
      {
        label: "Evenings",
        value: "evenings",
        image: img("photo-1505142468610-359e7d316be0"),
      },
    ],
  },
  {
    id: 7,
    part: 1,
    text: "How do you feel on an average Tuesday?",
    sensitiveText: "A typical day now — what feeling comes up?",
    type: "single_choice",
    cardLayout: "grid",
    options: [
      {
        label: "Pretty good",
        value: "A",
        image: img("photo-1506905925346-21bda4d32df4"),
      },
      {
        label: "Going with the flow",
        value: "B",
        image: img("photo-1519681393784-d120267933ba"),
      },
      {
        label: "Depends on the day",
        value: "E",
        image: img("photo-1418065460487-3e41a6c84dc5"),
      },
      {
        label: "Overwhelmed",
        value: "C",
        image: img("photo-1499209974431-9dddcece7f88"),
      },
    ],
  },
  {
    id: 8,
    part: 2,
    text: "How much of your identity is your job right now?",
    sensitiveText: "How much of who you are is connected to work?",
    hint: "Slide to where it feels honest.",
    type: "slider",
    sliderMin: 0,
    sliderMax: 100,
    sliderMinLabel: "None of it",
    sliderMaxLabel: "Almost all of it",
  },
  {
    id: 9,
    part: 2,
    text: "Last time you did something purely for joy?",
    sensitiveText: "Last time you did something just because it felt good?",
    type: "single_choice",
    cardLayout: "grid",
    options: [
      {
        label: "This week",
        value: "A",
        image: img("photo-1531058020387-3be344556be6"),
      },
      {
        label: "This month",
        value: "B",
        image: img("photo-1523580494863-6f3031224c94"),
      },
      {
        label: "Can't remember",
        value: "C",
        image: img("photo-1499209974431-9dddcece7f88"),
      },
      {
        label: "I don't let myself",
        value: "D",
        image: img("photo-1521790797524-b2497295b8a0"),
      },
    ],
  },
  {
    id: 10,
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
        value: "shutdown",
        image: img("photo-1455642305367-68834a9d4337"),
      },
      {
        label: "Movement / Exercise",
        value: "exercise",
        image: img("photo-1486218119243-13883505764c"),
      },
    ],
  },
  {
    id: 11,
    part: 2,
    text: "Which patterns feel the most familiar?",
    sensitiveText: "Do any of these feel familiar?",
    hint: "Select all that resonate.",
    type: "multi_select",
    cardLayout: "list",
    options: [
      { label: "Staying up later than planned", value: "night_different" },
      { label: "Too much screen time", value: "phone_checking" },
      { label: "Irregular food habits", value: "irregular_food" },
      { label: "Poor sleep", value: "poor_sleep" },
      { label: "Not going out like I used to", value: "stopped_without_deciding" },
      { label: "Socially absent", value: "busier_less_self" },
    ],
  },
  {
    id: 12,
    part: 2,
    text: "When do you feel most like yourself?",
    sensitiveText: "When do you feel most at ease?",
    type: "single_choice",
    cardLayout: "grid",
    options: [
      {
        label: "Morning",
        value: "A",
        image: img("photo-1506368249639-73a05d6f6488"),
      },
      {
        label: "Afternoon",
        value: "B",
        image: img("photo-1500534314209-a25ddb2bd429"),
      },
      {
        label: "Evening",
        value: "C",
        image: img("photo-1502082553048-f009c37129b9"),
      },
      {
        label: "Rarely",
        value: "D",
        image: img("photo-1500964757637-c85e8a162699"),
      },
    ],
  },
  {
    id: 13,
    part: 2,
    text: "Which version of yourself do you miss?",
    sensitiveText: "What part of yourself would you like back?",
    type: "single_choice",
    cardLayout: "grid",
    options: [
      {
        label: "The active one",
        value: "active_self",
        image: img("photo-1552674605-db6ffd4facb5"),
      },
      {
        label: "The creative one",
        value: "creative_self",
        image: img("photo-1452860606245-08befc0ff44b"),
      },
      {
        label: "The present one",
        value: "present_self",
        image: img("photo-1506905925346-21bda4d32df4"),
      },
      {
        label: "The confident one",
        value: "confident_self",
        image: img("photo-1500648767791-00dcc994a43e"),
      },
      {
        label: "The connected one",
        value: "social_self",
        image: img("photo-1529156069898-49953e39b3ac"),
      },
      {
        label: "Not sure yet",
        value: "something_off",
        image: img("photo-1507003211169-0a1dd7228f2d"),
      },
    ],
  },
  {
    id: 14,
    part: 2,
    text: "What changed that made the old routines hard?",
    sensitiveText: "What shifted that made things harder?",
    type: "single_choice",
    cardLayout: "grid",
    options: [
      {
        label: "Work took over",
        value: "work_took_over",
        image: img("photo-1556761175-5973dc0f32e7"),
      },
      {
        label: "Life changed",
        value: "life_change",
        image: img("photo-1517436026-beea98725a0b"),
      },
      {
        label: "Relationships",
        value: "relationships",
        image: img("photo-1511895426328-dc8714191300"),
      },
      {
        label: "Gradual drift",
        value: "gradual_drift",
        image: img("photo-1418065460487-3e41a6c84dc5"),
      },
      {
        label: "Body changed",
        value: "body_changed",
        image: img("photo-1552196563-55cd4e45efb3"),
      },
      {
        label: "Burnout",
        value: "mental_health",
        image: img("photo-1499209974431-9dddcece7f88"),
      },
    ],
  },
];
