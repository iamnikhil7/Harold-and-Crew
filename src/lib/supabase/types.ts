/** Database types matching supabase/schema.sql */

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  location: string | null;
  archetype: string | null;
  activity_preferences: string[];
  identity_anchor: string | null;
  wellness_baseline: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface HealthConnection {
  id: string;
  user_id: string;
  provider: "apple_health" | "wearable" | "manual";
  connected: boolean;
  permissions: string[];
  connected_at: string | null;
  disconnected_at: string | null;
  created_at: string;
}

export type PatternType =
  | "rising_rhr"
  | "declining_sleep"
  | "low_movement"
  | "high_screen"
  | "stress_accumulation"
  | "hrv_drop"
  | "late_nights";

export type Severity = "mild" | "moderate" | "significant";
export type OrbState = "stressed" | "neutral" | "recovered" | "thriving";

export interface HealthPattern {
  id: string;
  user_id: string;
  pattern_type: PatternType;
  severity: Severity;
  title: string;
  caption: string;
  insight: string | null;
  data_points: { label: string; value: string; trend: "up" | "down" | "flat" }[];
  orb_state: OrbState;
  active: boolean;
  detected_at: string;
  dismissed_at: string | null;
}

export type ActivityType = "run" | "walk" | "yoga" | "sport" | "fitness" | "community";

export interface Activity {
  id: string;
  name: string;
  slug: string;
  type: ActivityType;
  description: string | null;
  atmosphere: string | null;
  timing: string;
  schedule: string | null;
  day_of_week: number | null;
  time_of_day: string | null;
  duration_minutes: number;
  location_name: string | null;
  location_lat: number | null;
  location_lng: number | null;
  what_to_bring: string | null;
  harold_note: string | null;
  intensity: "low" | "moderate" | "high";
  max_participants: number | null;
  is_anchor: boolean;
  source: "curated" | "meetup" | "eventbrite";
  source_id: string | null;
  source_url: string | null;
  image_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type ParticipationStatus = "interested" | "joined" | "attended" | "skipped";

export interface UserActivity {
  id: string;
  user_id: string;
  activity_id: string;
  status: ParticipationStatus;
  joined_at: string;
  attended_at: string | null;
  reflection_shown: boolean;
  reflection_dismissed: boolean;
  notes: string | null;
}

export type ReflectionType = "pattern" | "post_activity" | "milestone" | "check_in" | "welcome";

export interface HaroldReflection {
  id: string;
  user_id: string;
  type: ReflectionType;
  message: string;
  detail: string | null;
  orb_state: OrbState;
  related_pattern_id: string | null;
  related_activity_id: string | null;
  seen: boolean;
  dismissed: boolean;
  created_at: string;
  seen_at: string | null;
  dismissed_at: string | null;
}

export interface ActivityParticipation {
  activity_id: string;
  slug: string;
  attended_last_week: number;
  currently_interested: number;
}

export interface Database {
  public: {
    Tables: {
      users: { Row: User; Insert: Partial<User> & Pick<User, "email">; Update: Partial<User> };
      health_connections: { Row: HealthConnection; Insert: Partial<HealthConnection> & Pick<HealthConnection, "user_id" | "provider">; Update: Partial<HealthConnection> };
      health_patterns: { Row: HealthPattern; Insert: Partial<HealthPattern> & Pick<HealthPattern, "user_id" | "pattern_type" | "severity" | "title" | "caption">; Update: Partial<HealthPattern> };
      activities: { Row: Activity; Insert: Partial<Activity> & Pick<Activity, "name" | "slug" | "type" | "timing">; Update: Partial<Activity> };
      user_activities: { Row: UserActivity; Insert: Partial<UserActivity> & Pick<UserActivity, "user_id" | "activity_id">; Update: Partial<UserActivity> };
      harold_reflections: { Row: HaroldReflection; Insert: Partial<HaroldReflection> & Pick<HaroldReflection, "user_id" | "type" | "message">; Update: Partial<HaroldReflection> };
    };
    Views: {
      activity_participation: { Row: ActivityParticipation };
    };
  };
}
