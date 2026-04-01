/**
 * Pattern Detection Engine
 *
 * Analyzes 7 days of health data and detects concerning trends.
 * Returns pattern objects that Harold uses to generate dynamic insights.
 */

import type { HealthDay } from "./simulator";

export type PatternType = "rising_rhr" | "declining_sleep" | "low_movement" | "high_screen" | "stress_accumulation" | "late_nights" | "hrv_drop";
export type Severity = "mild" | "moderate" | "significant";

export interface DetectedPattern {
  type: PatternType;
  severity: Severity;
  title: string;
  caption: string; // What Harold says first (short)
  insight: string; // Deeper explanation
  matter: string; // Why it matters
  steps: string[]; // Action suggestions
  dataPoints: { label: string; value: string; trend: "up" | "down" | "flat" }[];
}

function avg(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function trend(arr: number[]): "up" | "down" | "flat" {
  if (arr.length < 3) return "flat";
  const first = avg(arr.slice(0, 3));
  const last = avg(arr.slice(-3));
  const diff = last - first;
  if (Math.abs(diff) < arr[0] * 0.05) return "flat";
  return diff > 0 ? "up" : "down";
}

export function detectPatterns(days: HealthDay[]): DetectedPattern[] {
  if (days.length < 5) return [];
  const patterns: DetectedPattern[] = [];

  const rhrs = days.map((d) => d.rhr);
  const hrvs = days.map((d) => d.hrv);
  const sleepQuals = days.map((d) => d.sleepQuality);
  const sleepHrs = days.map((d) => d.sleepHours);
  const stepsList = days.map((d) => d.steps);
  const actives = days.map((d) => d.activeMinutes);
  const screens = days.map((d) => d.screenTimeMinutes);
  const stresses = days.map((d) => d.stressScore);
  const lateNights = days.filter((d) => d.lateBedtime).length;

  // RISING RHR
  const rhrTrend = trend(rhrs);
  const avgRhr = avg(rhrs);
  if (rhrTrend === "up" && avgRhr > 65) {
    const severity: Severity = avgRhr > 75 ? "significant" : avgRhr > 70 ? "moderate" : "mild";
    patterns.push({
      type: "rising_rhr",
      severity,
      title: "Rising Resting Heart Rate",
      caption: "Your heart has been working harder than usual this week.",
      insight: `Your resting heart rate has trended upward over the past ${days.length} days, averaging ${Math.round(avgRhr)} bpm. This often signals accumulated stress, poor recovery, or building fatigue.`,
      matter: "When your RHR rises without increased exercise, your body is likely under more load than it can recover from. This can affect focus, mood, and immune function before you consciously feel it.",
      steps: [
        "Prioritize two solid nights of sleep this week.",
        "Cut one late-night stress trigger — phone, news, work email.",
        "Check how you feel after 48 hours of better rest.",
      ],
      dataPoints: [
        { label: "Avg RHR", value: `${Math.round(avgRhr)} bpm`, trend: "up" },
        { label: "Week start", value: `${rhrs[0]} bpm`, trend: "flat" },
        { label: "Latest", value: `${rhrs[rhrs.length - 1]} bpm`, trend: rhrTrend },
      ],
    });
  }

  // DECLINING SLEEP
  const sleepTrend = trend(sleepQuals);
  const avgSleepQual = avg(sleepQuals);
  const avgSleepHrs = avg(sleepHrs);
  if ((sleepTrend === "down" && avgSleepQual < 70) || avgSleepHrs < 6.5) {
    const severity: Severity = avgSleepQual < 50 ? "significant" : avgSleepQual < 60 ? "moderate" : "mild";
    patterns.push({
      type: "declining_sleep",
      severity,
      title: "Sleep Quality Declining",
      caption: "Your nights have been lighter than usual.",
      insight: `Sleep quality averaged ${Math.round(avgSleepQual)}% this week with ${avgSleepHrs.toFixed(1)} hours per night. Your deep sleep percentage has also been lower, which means less restorative recovery.`,
      matter: "Less restorative sleep makes everything feel heavier — stress, decisions, cravings. It's often the first domino in a cascade of declining wellbeing, before obvious fatigue shows up.",
      steps: [
        "Keep bedtime within the same 30-minute window for the next 3 nights.",
        "Create a 20-minute wind-down with no screens.",
        "Notice if morning energy shifts after two consistent nights.",
      ],
      dataPoints: [
        { label: "Avg quality", value: `${Math.round(avgSleepQual)}%`, trend: "down" },
        { label: "Avg hours", value: `${avgSleepHrs.toFixed(1)}h`, trend: sleepTrend },
        { label: "Deep sleep", value: `${Math.round(avg(days.map((d) => d.deepSleepPct)))}%`, trend: "down" },
      ],
    });
  }

  // LOW MOVEMENT
  const avgSteps = avg(stepsList);
  const avgActive = avg(actives);
  if (avgSteps < 5000 || avgActive < 20) {
    const severity: Severity = avgSteps < 3000 ? "significant" : avgSteps < 4000 ? "moderate" : "mild";
    patterns.push({
      type: "low_movement",
      severity,
      title: "Movement Has Dropped",
      caption: "Your body has been quieter than usual this week.",
      insight: `You averaged ${Math.round(avgSteps).toLocaleString()} steps and ${Math.round(avgActive)} active minutes daily. That's below what your body seems to need for baseline recovery.`,
      matter: "Lower movement doesn't just affect fitness — it makes stress feel stickier and recovery less efficient. Even small amounts of movement can shift your entire baseline.",
      steps: [
        "Take one short walk between two work blocks today.",
        "Pick one light activity session this week — anything counts.",
        "Notice how your energy shifts after two active days.",
      ],
      dataPoints: [
        { label: "Avg steps", value: `${Math.round(avgSteps).toLocaleString()}`, trend: trend(stepsList) },
        { label: "Active min", value: `${Math.round(avgActive)}m`, trend: trend(actives) },
      ],
    });
  }

  // HIGH SCREEN TIME
  const avgScreen = avg(screens);
  if (avgScreen > 200) {
    const severity: Severity = avgScreen > 350 ? "significant" : avgScreen > 250 ? "moderate" : "mild";
    patterns.push({
      type: "high_screen",
      severity,
      title: "Screen Time Elevated",
      caption: "You've been on your phone more than usual.",
      insight: `Daily screen time averaged ${Math.round(avgScreen)} minutes this week — that's ${(avgScreen / 60).toFixed(1)} hours per day. ${lateNights > 3 ? "Combined with late nights, this suggests stress-coping scrolling." : ""}`,
      matter: "High screen time, especially late at night, disrupts melatonin production and deepens the cycle of poor sleep and higher stress. The scroll is the symptom, not the cause.",
      steps: [
        "Set your phone to grayscale after 9pm — it reduces the pull.",
        "Replace one scroll session with something tactile — a walk, a book, cooking.",
        "Notice which apps you open without thinking. That's the pattern.",
      ],
      dataPoints: [
        { label: "Daily avg", value: `${Math.round(avgScreen)}m`, trend: trend(screens) },
        { label: "Late nights", value: `${lateNights}/7`, trend: lateNights > 3 ? "up" : "flat" },
      ],
    });
  }

  // STRESS ACCUMULATION
  const avgStress = avg(stresses);
  const stressTrend = trend(stresses);
  if (avgStress > 55 && stressTrend === "up") {
    patterns.push({
      type: "stress_accumulation",
      severity: avgStress > 75 ? "significant" : "moderate",
      title: "Stress Building Without Reset",
      caption: "Stress is stacking, and your body hasn't fully reset.",
      insight: `Your composite stress score has been climbing — averaging ${Math.round(avgStress)}/100 this week. Multiple signals (heart rate, sleep, movement) are pointing in the same direction.`,
      matter: "When stress accumulates without adequate recovery, the effects compound quietly. You might not feel it as 'stress' — it shows up as brain fog, irritability, cravings, or just feeling off.",
      steps: [
        "Identify the one thing adding the most load this week. Can you reduce it by 20%?",
        "Aim for one genuinely restorative activity today — not productive, not social, just restful.",
        "Check if your RHR drops after two better nights. That's your signal.",
      ],
      dataPoints: [
        { label: "Stress score", value: `${Math.round(avgStress)}/100`, trend: "up" },
        { label: "RHR trend", value: rhrTrend, trend: rhrTrend },
        { label: "Sleep trend", value: sleepTrend, trend: sleepTrend },
      ],
    });
  }

  // HRV DROP
  const avgHrv = avg(hrvs);
  const hrvTrend = trend(hrvs);
  if (hrvTrend === "down" && avgHrv < 45) {
    patterns.push({
      type: "hrv_drop",
      severity: avgHrv < 30 ? "significant" : "moderate",
      title: "Recovery Capacity Declining",
      caption: "Your body's ability to bounce back is lower than usual.",
      insight: `Heart rate variability averaged ${Math.round(avgHrv)}ms this week — trending downward. HRV is one of the best indicators of how well your nervous system is recovering.`,
      matter: "Low HRV means your body is stuck in a more reactive state. It affects decision-making, emotional regulation, and physical recovery. It's often invisible until something breaks.",
      steps: [
        "Try 5 minutes of slow breathing before bed — 4 seconds in, 6 seconds out.",
        "Reduce high-intensity exercise for 2-3 days. Recovery is the priority.",
        "Monitor if HRV rebounds. If not after 5 days, something deeper may need attention.",
      ],
      dataPoints: [
        { label: "Avg HRV", value: `${Math.round(avgHrv)}ms`, trend: "down" },
        { label: "Best day", value: `${Math.max(...hrvs)}ms`, trend: "flat" },
        { label: "Worst day", value: `${Math.min(...hrvs)}ms`, trend: "flat" },
      ],
    });
  }

  // Sort by severity
  const severityOrder: Record<Severity, number> = { significant: 3, moderate: 2, mild: 1 };
  patterns.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);

  return patterns;
}
