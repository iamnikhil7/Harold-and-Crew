/**
 * Health Data Simulator
 *
 * Generates realistic daily health metrics that follow believable patterns.
 * Used as a stand-in until real wearable APIs are connected.
 *
 * When real APIs are available, replace generateDay() calls with actual API data.
 * The rest of the system (pattern detection, Harold) works identically.
 */

export interface HealthDay {
  date: string; // YYYY-MM-DD
  rhr: number; // resting heart rate (bpm) — normal 55-75, elevated 76+
  hrv: number; // heart rate variability (ms) — higher is better, 30-100 range
  sleepHours: number; // total sleep
  sleepQuality: number; // 0-100 score
  deepSleepPct: number; // % of sleep that was deep
  steps: number;
  activeMinutes: number;
  screenTimeMinutes: number;
  lateBedtime: boolean; // went to bed after midnight
  stressScore: number; // computed: 0-100, higher = more stressed
}

// Personality profiles that create different baseline patterns
export type SimProfile = "healthy" | "stressed" | "declining" | "recovering";

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function jitter(base: number, range: number) {
  return base + (Math.random() - 0.5) * 2 * range;
}

const profileBaselines: Record<SimProfile, {
  rhr: number; hrv: number; sleepHours: number; sleepQuality: number;
  deepSleepPct: number; steps: number; activeMinutes: number;
  screenTime: number; lateBedChance: number;
}> = {
  healthy: { rhr: 58, hrv: 72, sleepHours: 7.5, sleepQuality: 82, deepSleepPct: 22, steps: 9000, activeMinutes: 45, screenTime: 120, lateBedChance: 0.1 },
  stressed: { rhr: 72, hrv: 38, sleepHours: 5.8, sleepQuality: 52, deepSleepPct: 12, steps: 4200, activeMinutes: 12, screenTime: 280, lateBedChance: 0.7 },
  declining: { rhr: 66, hrv: 48, sleepHours: 6.2, sleepQuality: 61, deepSleepPct: 15, steps: 5500, activeMinutes: 20, screenTime: 220, lateBedChance: 0.5 },
  recovering: { rhr: 62, hrv: 58, sleepHours: 7.0, sleepQuality: 72, deepSleepPct: 19, steps: 7500, activeMinutes: 35, screenTime: 160, lateBedChance: 0.2 },
};

export function generateDay(date: string, profile: SimProfile, dayIndex: number): HealthDay {
  const b = profileBaselines[profile];

  // Add gradual drift for declining profile
  const drift = profile === "declining" ? dayIndex * 0.3 : profile === "recovering" ? -dayIndex * 0.2 : 0;

  // Weekend effect — people sleep more, move less
  const dayOfWeek = new Date(date).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const weekendSleepBonus = isWeekend ? 0.8 : 0;
  const weekendStepPenalty = isWeekend ? -2000 : 0;

  const rhr = clamp(Math.round(jitter(b.rhr + drift, 3)), 45, 100);
  const hrv = clamp(Math.round(jitter(b.hrv - drift, 6)), 15, 120);
  const sleepHours = clamp(parseFloat(jitter(b.sleepHours + weekendSleepBonus - drift * 0.1, 0.5).toFixed(1)), 3, 10);
  const sleepQuality = clamp(Math.round(jitter(b.sleepQuality - drift * 2, 8)), 10, 100);
  const deepSleepPct = clamp(Math.round(jitter(b.deepSleepPct - drift * 0.5, 3)), 5, 35);
  const steps = clamp(Math.round(jitter(b.steps + weekendStepPenalty - drift * 100, 1500)), 500, 20000);
  const activeMinutes = clamp(Math.round(jitter(b.activeMinutes - drift * 2, 10)), 0, 120);
  const screenTimeMinutes = clamp(Math.round(jitter(b.screenTime + drift * 8, 30)), 30, 600);
  const lateBedtime = Math.random() < b.lateBedChance + drift * 0.03;

  // Compute stress score from all signals
  const rhrStress = clamp((rhr - 55) / 30 * 100, 0, 100);
  const hrvStress = clamp((80 - hrv) / 50 * 100, 0, 100);
  const sleepStress = clamp((8 - sleepHours) / 4 * 100, 0, 100);
  const moveStress = clamp((60 - activeMinutes) / 60 * 100, 0, 100);
  const screenStress = clamp((screenTimeMinutes - 120) / 300 * 100, 0, 100);
  const stressScore = clamp(Math.round(rhrStress * 0.25 + hrvStress * 0.25 + sleepStress * 0.2 + moveStress * 0.15 + screenStress * 0.15), 0, 100);

  return { date, rhr, hrv, sleepHours, sleepQuality, deepSleepPct, steps, activeMinutes, screenTimeMinutes, lateBedtime, stressScore };
}

export function generateWeek(profile: SimProfile, startDate?: Date): HealthDay[] {
  const start = startDate || new Date();
  const days: HealthDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(start);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push(generateDay(dateStr, profile, 6 - i));
  }
  return days;
}
