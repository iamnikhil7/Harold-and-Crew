/**
 * Pattern Recognition Engine
 *
 * Integrates the existing pattern detection (health/patterns.ts) with Supabase.
 * Runs analysis on a user's simulated health data, detects patterns, stores them
 * in the database, and generates Harold reflections when needed.
 *
 * When real health APIs are connected, replace the data source in getHealthData().
 */

import { supabase } from "@/lib/supabase";
import { generateWeek, type SimProfile } from "@/lib/health/simulator";
import { detectPatterns } from "@/lib/health/patterns";
import type { OrbState, Severity } from "@/lib/supabase/types";

/** Map pattern severity to orb state */
function severityToOrbState(severity: Severity, patternCount: number): OrbState {
  if (patternCount >= 3 || severity === "significant") return "stressed";
  if (severity === "moderate") return "neutral";
  return "recovered";
}

/** Determine simulation profile from user archetype */
function archetypeToProfile(archetype: string | null): SimProfile {
  if (!archetype) return "declining";
  const lower = archetype.toLowerCase();
  if (lower.includes("mindful") || lower.includes("aspirant")) return "healthy";
  if (lower.includes("driven") || lower.includes("burnt")) return "stressed";
  if (lower.includes("night owl") || lower.includes("owl")) return "declining";
  if (lower.includes("rhythm") || lower.includes("seeker")) return "recovering";
  return "declining";
}

/** Harold's reflection messages based on detected patterns */
const reflectionTemplates: Record<string, { message: string; detail: string }[]> = {
  rising_rhr: [
    { message: "Your heart has been working harder than usual.", detail: "Resting heart rate has crept up this week. It often means accumulated stress or insufficient recovery. Harold thinks a couple of solid nights could shift things." },
    { message: "Something\u2019s asking more of your body than usual.", detail: "Your cardiovascular baseline has shifted upward. This isn\u2019t alarming, but it\u2019s the kind of thing worth noticing before it becomes a pattern." },
  ],
  declining_sleep: [
    { message: "Your nights have been lighter than usual.", detail: "Sleep quality has softened over the past few days. Less restorative sleep can make everything feel heavier \u2014 even before obvious fatigue shows up." },
    { message: "Rest hasn\u2019t been reaching you the way it should.", detail: "Deep sleep percentage has dropped, which means your body isn\u2019t getting the recovery it needs even when you\u2019re in bed." },
  ],
  low_movement: [
    { message: "Your body has been quieter than usual this week.", detail: "Movement has dropped below your usual rhythm. Even small amounts of movement can shift your entire baseline \u2014 a short walk could be enough." },
    { message: "You\u2019ve been still for a while.", detail: "Activity levels are lower than what your body seems to need for baseline wellbeing. Harold isn\u2019t pushing you \u2014 just noticing." },
  ],
  high_screen: [
    { message: "You\u2019ve been on your phone more than usual.", detail: "Screen time has been elevated, especially in the evenings. The scroll is usually the symptom, not the cause \u2014 something might be asking for your attention." },
  ],
  stress_accumulation: [
    { message: "Stress is stacking without a full reset.", detail: "Multiple signals \u2014 heart rate, sleep, movement \u2014 are pointing in the same direction. Harold thinks one genuinely restorative activity could help break the cycle." },
  ],
  hrv_drop: [
    { message: "Your body\u2019s ability to bounce back is lower than usual.", detail: "Heart rate variability has been trending down, which means your nervous system is stuck in a more reactive state. Recovery, not intensity, is what\u2019s needed." },
  ],
};

/** Run full pattern analysis for a user */
export async function runPatternAnalysis(userId: string) {
  // 1. Get user archetype for simulation profile
  const { data: user } = await supabase.from("users").select("archetype").eq("id", userId).single();
  const profile = archetypeToProfile(user?.archetype || null);

  // 2. Generate health data (replace with real API data when available)
  const weekData = generateWeek(profile);

  // 3. Detect patterns
  const detected = detectPatterns(weekData);

  // 4. Deactivate old patterns for this user
  await supabase.from("health_patterns").update({ active: false }).eq("user_id", userId).eq("active", true);

  // 5. Store new patterns
  const storedPatterns = [];
  for (const pattern of detected) {
    const orbState = severityToOrbState(pattern.severity as Severity, detected.length);
    const { data } = await supabase
      .from("health_patterns")
      .insert({
        user_id: userId,
        pattern_type: pattern.type,
        severity: pattern.severity,
        title: pattern.title,
        caption: pattern.caption,
        insight: pattern.insight,
        data_points: pattern.dataPoints,
        orb_state: orbState,
        active: true,
      })
      .select()
      .single();

    if (data) storedPatterns.push(data);
  }

  // 6. Generate Harold reflections for the most important pattern (max 2-3/week)
  if (detected.length > 0) {
    const topPattern = detected[0];
    const templates = reflectionTemplates[topPattern.type] || [];
    const template = templates[Math.floor(Math.random() * templates.length)];

    if (template) {
      const { count } = await supabase
        .from("harold_reflections")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", new Date(Date.now() - 3 * 24 * 3600000).toISOString());

      if ((count || 0) < 3) {
        await supabase.from("harold_reflections").insert({
          user_id: userId,
          type: "pattern",
          message: template.message,
          detail: template.detail,
          orb_state: severityToOrbState(topPattern.severity as Severity, detected.length),
          related_pattern_id: storedPatterns[0]?.id,
        });
      }
    }
  }

  return {
    patternsDetected: detected.length,
    patterns: storedPatterns,
    profile,
    weekSummary: {
      avgStress: Math.round(weekData.reduce((s, d) => s + d.stressScore, 0) / weekData.length),
      avgSleep: parseFloat((weekData.reduce((s, d) => s + d.sleepHours, 0) / weekData.length).toFixed(1)),
      avgSteps: Math.round(weekData.reduce((s, d) => s + d.steps, 0) / weekData.length),
      avgHrv: Math.round(weekData.reduce((s, d) => s + d.hrv, 0) / weekData.length),
    },
  };
}

/** Generate a post-activity reflection */
export async function generatePostActivityReflection(userId: string, activityId: string) {
  const { data: activity } = await supabase.from("activities").select("name, type, intensity").eq("id", activityId).single();
  if (!activity) return null;

  const orbState: OrbState = activity.intensity === "high" ? "thriving" : "recovered";

  const messages: Record<string, { message: string; detail: string }> = {
    run: { message: "You seem a bit steadier today.", detail: `After ${activity.name}, your recovery signals shifted. Sleep was deeper that night, and your baseline has been calmer since.` },
    walk: { message: "That break in the middle of the day helped.", detail: "Your afternoon patterns looked different after the walk \u2014 less restlessness, a slight dip in stress signals." },
    yoga: { message: "Something shifted after that session.", detail: "Your heart rate variability improved the morning after. That means your nervous system got a genuine reset." },
    sport: { message: "Good energy. Harold could feel it.", detail: "After the game, your recovery metrics actually improved despite the intensity. The social connection probably helped too." },
    fitness: { message: "Your body responded well to that.", detail: "The workout created a positive stress response \u2014 the kind that helps your body adapt and strengthen." },
    community: { message: "Connection matters as much as movement.", detail: "Being around others shifted something subtle. Harold noticed your patterns were calmer afterward." },
  };

  const template = messages[activity.type] || messages.community;

  const { data: reflection } = await supabase
    .from("harold_reflections")
    .insert({
      user_id: userId,
      type: "post_activity",
      message: template.message,
      detail: template.detail,
      orb_state: orbState,
      related_activity_id: activityId,
    })
    .select()
    .single();

  await supabase
    .from("user_activities")
    .update({ reflection_shown: true })
    .eq("user_id", userId)
    .eq("activity_id", activityId);

  return reflection;
}
