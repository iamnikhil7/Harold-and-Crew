-- PAUSE App — Complete Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE priority_type AS ENUM ('physical_health', 'nutritional_health', 'digital_wellness');
CREATE TYPE app_type AS ENUM ('health', 'delivery', 'social', 'spending');
CREATE TYPE app_tag AS ENUM ('trigger', 'watch', 'safe');
CREATE TYPE signal_category AS ENUM ('movement', 'nutrition', 'screen_time', 'spending', 'sleep', 'social', 'work_stress');
CREATE TYPE vulnerability_decision AS ENUM ('no_action', 'monitor', 'intercept');
CREATE TYPE pause_outcome AS ENUM ('resisted', 'overrode', 'snoozed', 'modified');
CREATE TYPE habit_status AS ENUM ('active', 'graduated', 'paused');
CREATE TYPE adaptation_type AS ENUM ('timing_shift', 'friction_increase', 'friction_decrease', 'suggestion_reframe', 'root_cause_identified');
CREATE TYPE response_type AS ENUM ('open_text', 'single_choice', 'multi_select', 'slider');
CREATE TYPE suggestion_response AS ENUM ('done', 'snoozed', 'skipped');
CREATE TYPE digital_response AS ENUM ('put_down', 'redirected', 'overrode');
CREATE TYPE digital_moment_type AS ENUM ('doomscrolling', 'morning_open', 'late_night', 'compulsive_switching');
CREATE TYPE nutrition_pattern_type AS ENUM ('late_night', 'repeat_items', 'empty_grocery', 'skipped_meals');

-- ============================================================
-- USERS & SETTINGS
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anonymous_id UUID UNIQUE DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  personal_why TEXT,
  sensitivity_mode BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  account_linked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  sensitivity_mode BOOLEAN DEFAULT FALSE,
  notification_preferences JSONB DEFAULT '{}',
  observation_period_days INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ONBOARDING
-- ============================================================
CREATE TABLE onboarding_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  question_part INTEGER NOT NULL CHECK (question_part IN (1, 2)),
  response_type response_type NOT NULL,
  response_text TEXT,
  response_choice JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_text TEXT NOT NULL,
  is_system_generated BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ARCHETYPES
-- ============================================================
CREATE TABLE archetypes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  wellness_baseline INTEGER NOT NULL CHECK (wellness_baseline BETWEEN 0 AND 100),
  key_traits JSONB NOT NULL DEFAULT '[]',
  trigger_points JSONB NOT NULL DEFAULT '[]',
  avatar_config JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE user_archetypes (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  archetype_id INTEGER NOT NULL REFERENCES archetypes(id),
  primary_score FLOAT NOT NULL DEFAULT 0,
  secondary_archetype_id INTEGER REFERENCES archetypes(id),
  secondary_score FLOAT DEFAULT 0,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id)
);

CREATE TABLE archetype_scoring_rules (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  response_value TEXT NOT NULL,
  archetype_id INTEGER NOT NULL REFERENCES archetypes(id),
  weight FLOAT NOT NULL DEFAULT 1.0
);

-- ============================================================
-- PRIORITIES & CONNECTED APPS
-- ============================================================
CREATE TABLE user_priorities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  priority_type priority_type NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, priority_type)
);

CREATE TABLE connected_apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  app_type app_type NOT NULL,
  tag app_tag DEFAULT 'watch',
  is_connected BOOLEAN DEFAULT FALSE,
  oauth_token_encrypted TEXT,
  last_synced_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_app_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  flagged_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, app_name)
);

-- ============================================================
-- SIGNALS & SENSING
-- ============================================================
CREATE TABLE signal_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  signal_category signal_category NOT NULL,
  signal_type TEXT NOT NULL,
  signal_value JSONB NOT NULL DEFAULT '{}',
  source_app TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE
);

CREATE TABLE signal_baselines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  signal_category signal_category NOT NULL,
  baseline_data JSONB NOT NULL DEFAULT '{}',
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, signal_category)
);

CREATE TABLE signal_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pattern_type TEXT NOT NULL,
  pattern_data JSONB NOT NULL DEFAULT '{}',
  confidence_score FLOAT DEFAULT 0 CHECK (confidence_score BETWEEN 0 AND 1),
  first_detected_at TIMESTAMPTZ DEFAULT NOW(),
  last_confirmed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VULNERABILITY & CONTEXT ENGINE
-- ============================================================
CREATE TABLE vulnerability_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score FLOAT NOT NULL CHECK (score BETWEEN 0 AND 1),
  contributing_signals JSONB DEFAULT '{}',
  goal_alignment JSONB DEFAULT '{}',
  archetype_factor JSONB DEFAULT '{}',
  time_context JSONB DEFAULT '{}',
  decision vulnerability_decision DEFAULT 'no_action',
  assessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PAUSE EVENTS
-- ============================================================
CREATE TABLE pause_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trigger_signal JSONB DEFAULT '{}',
  vulnerability_score FLOAT,
  cooldown_duration_seconds INTEGER NOT NULL DEFAULT 30,
  user_why_shown TEXT,
  witness_shown BOOLEAN DEFAULT FALSE,
  outcome pause_outcome,
  override_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pause_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pattern_signature TEXT NOT NULL,
  total_pauses INTEGER DEFAULT 0,
  total_resisted INTEGER DEFAULT 0,
  total_overridden INTEGER DEFAULT 0,
  last_pause_at TIMESTAMPTZ,
  UNIQUE(user_id, pattern_signature)
);

-- ============================================================
-- NUTRITION
-- ============================================================
CREATE TABLE nutrition_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_app TEXT,
  order_items JSONB DEFAULT '[]',
  order_total DECIMAL(10,2),
  order_time TIMESTAMPTZ DEFAULT NOW(),
  is_late_night BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE nutrition_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pattern_type nutrition_pattern_type NOT NULL,
  occurrences INTEGER DEFAULT 0,
  last_occurred TIMESTAMPTZ,
  confidence FLOAT DEFAULT 0 CHECK (confidence BETWEEN 0 AND 1),
  UNIQUE(user_id, pattern_type)
);

CREATE TABLE grocery_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  suggested_items JSONB DEFAULT '[]',
  based_on_receipt_id UUID,
  was_helpful BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PHYSICAL HEALTH
-- ============================================================
CREATE TABLE physical_health_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  suggestion_text TEXT NOT NULL,
  suggestion_type TEXT DEFAULT 'workout',
  timing_window TEXT,
  response suggestion_response,
  skip_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DIGITAL WELLNESS
-- ============================================================
CREATE TABLE screen_time_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  session_start TIMESTAMPTZ,
  session_end TIMESTAMPTZ,
  duration_minutes INTEGER,
  is_flagged_app BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE digital_vulnerability_moments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  moment_type digital_moment_type NOT NULL,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  intervention_delivered BOOLEAN DEFAULT FALSE
);

CREATE TABLE digital_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  suggestion_text TEXT NOT NULL,
  anchor_activity TEXT,
  response digital_response,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROGRESS & ADAPTATION
-- ============================================================
CREATE TABLE habit_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  habit_type TEXT NOT NULL,
  total_pauses INTEGER DEFAULT 0,
  total_resisted INTEGER DEFAULT 0,
  total_overridden INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  status habit_status DEFAULT 'active',
  graduated_at TIMESTAMPTZ,
  UNIQUE(user_id, habit_type)
);

CREATE TABLE adaptation_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  adaptation_type adaptation_type NOT NULL,
  details JSONB DEFAULT '{}',
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_observation_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id)
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_signal_events_user_category ON signal_events(user_id, signal_category);
CREATE INDEX idx_signal_events_recorded ON signal_events(recorded_at);
CREATE INDEX idx_pause_events_user ON pause_events(user_id, created_at);
CREATE INDEX idx_vulnerability_user ON vulnerability_assessments(user_id, assessed_at);
CREATE INDEX idx_onboarding_user ON onboarding_responses(user_id, question_id);
CREATE INDEX idx_screen_time_user ON screen_time_events(user_id, created_at);
CREATE INDEX idx_nutrition_orders_user ON nutrition_orders(user_id, order_time);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_archetypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_app_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE vulnerability_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pause_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE pause_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE physical_health_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_time_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_vulnerability_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_observation_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own settings" ON user_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own responses" ON onboarding_responses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own goals" ON user_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can read own archetype" ON user_archetypes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own priorities" ON user_priorities FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own apps" ON connected_apps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own flags" ON user_app_flags FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own signals" ON signal_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can read own baselines" ON signal_baselines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own patterns" ON signal_patterns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own vulnerability" ON vulnerability_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own pauses" ON pause_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can read own pause patterns" ON pause_patterns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own orders" ON nutrition_orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can read own nutrition patterns" ON nutrition_patterns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own grocery suggestions" ON grocery_suggestions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own health suggestions" ON physical_health_suggestions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own screen time" ON screen_time_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can read own digital moments" ON digital_vulnerability_moments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own digital suggestions" ON digital_suggestions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can read own progress" ON habit_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own adaptation log" ON adaptation_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own observation status" ON user_observation_status FOR SELECT USING (auth.uid() = user_id);

-- Archetypes are readable by everyone (public reference data)
CREATE POLICY "Archetypes are public" ON archetypes FOR SELECT USING (true);

-- ============================================================
-- SEED: 10 Archetypes
-- ============================================================
INSERT INTO archetypes (name, description, wellness_baseline, key_traits, trigger_points, avatar_config) VALUES
(
  'The Burnt-Out Professional',
  'High-achiever drowning in deadlines, surviving on delivery apps and caffeine.',
  55,
  '["Works 50+ hours/week", "Skips meals or stress-eats", "High screen time", "Poor sleep quality"]',
  '["Late-night DoorDash orders", "Skipping the gym", "Energy drink purchases"]',
  '{"color": "amber", "states": {"default": "tired but dignified, slightly hunched, warm amber glow", "concerned": "slumped, eyes half-open", "celebrating": "straightening up with a faint glow", "glowing": "full upright posture, warm radiance"}}'
),
(
  'The Former Athlete',
  'Once fit, now struggling as metabolism slows and old habits don''t work.',
  65,
  '["Used to be very active", "Eating same portions but moving less", "Nostalgic about past fitness", "Prone to injuries"]',
  '["Large portion sizes", "Beer and sports drinks", "Skipping recovery days"]',
  '{"color": "olive-green", "states": {"default": "resting, proud figure with subtle athletic build", "concerned": "slouched, looking down", "celebrating": "upright posture, shoulders back", "glowing": "full athletic stance, vibrant green"}}'
),
(
  'The Overwhelmed Parent',
  'Putting everyone else first, grabbing whatever food is fast and easy.',
  50,
  '["Zero personal time", "Eats kids leftovers", "Exhausted constantly", "Feels guilty about self-care"]',
  '["Drive-thru runs", "Snacking after kids sleep", "Skipping workouts for family needs"]',
  '{"color": "warm-rose", "states": {"default": "warm but visibly tired, soft rose/warm gray", "concerned": "shoulders heavy, eyes tired", "celebrating": "moment of stillness, slight smile", "glowing": "relaxed, gentle warmth"}}'
),
(
  'The Social Butterfly',
  'Life revolves around events, dinners, and drinks with friends.',
  60,
  '["Multiple social events weekly", "FOMO drives decisions", "Vulnerable to peer pressure", "Weekend warrior mentality"]',
  '["Group food orders", "Happy hour invitations", "Brunches", "Peer pressure moments"]',
  '{"color": "desaturated-yellow", "states": {"default": "bright, outward-facing figure", "concerned": "looking around anxiously", "celebrating": "centered, grounded, still smiling", "glowing": "calm confidence, warm yellow"}}'
),
(
  'The Night Owl',
  'Comes alive after dark, makes worst decisions between 10pm–2am.',
  58,
  '["Reversed sleep schedule", "Late-night snacker", "Peak productivity at night", "Mornings are the enemy"]',
  '["Midnight cravings", "Endless scrolling sessions", "Late gaming sessions"]',
  '{"color": "deep-navy-indigo", "states": {"default": "quiet, slightly glowing figure in a dark room", "concerned": "dim glow, heavy eyes", "celebrating": "eyes fully open, sitting upright", "glowing": "bright starlight aura"}}'
),
(
  'The Emotional Eater',
  'Food is comfort, reward, and coping mechanism all in one.',
  52,
  '["Eats feelings", "Reward = food", "Stress = snacks", "Cycles of guilt"]',
  '["Bad day comfort food", "Celebration meals", "Boredom eating"]',
  '{"color": "warm-peach-blush", "states": {"default": "soft, rounded figure, warm peach/blush", "concerned": "curled inward, muted colors", "celebrating": "open posture, lighter expression, more saturated", "glowing": "full warmth, self-embrace"}}'
),
(
  'The Serial Starter',
  'Has tried every diet, app, and program. Starts strong, fades fast.',
  55,
  '["Graveyard of diet apps", "Unused gym memberships", "High initial enthusiasm", "Quick to abandon"]',
  '["Last meal before the diet binges", "Endless research on new programs", "Equipment purchases"]',
  '{"color": "dimmed-orange", "states": {"default": "figure in perpetual liftoff pose", "concerned": "settling back down, dimming", "celebrating": "fully upright, forward-facing, vivid orange", "glowing": "steady bright flame"}}'
),
(
  'The Mindless Grazer',
  'Doesn''t overeat at meals but constantly nibbles throughout the day.',
  57,
  '["Never feels truly full", "Always snacking", "Loses track of intake", "Eats out of boredom"]',
  '["Frequent pantry visits", "Eating while cooking", "TV snacking", "Desk snacking"]',
  '{"color": "soft-cloud-gray", "states": {"default": "wandering, slightly dazed figure", "concerned": "reaching outward, unfocused", "celebrating": "still, focused, more defined", "glowing": "clear and present"}}'
),
(
  'The Perfectionist Quitter',
  'One slip-up ruins everything. All or nothing mentality.',
  53,
  '["Rigid rules about food/exercise", "Binary thinking", "Extremely self-critical", "Restart Monday mentality"]',
  '["Ruined day binges", "Post-slip spirals", "Avoiding tracking after mistakes"]',
  '{"color": "charcoal-slate", "states": {"default": "precise, sharp-edged figure with a crack", "concerned": "crack widening, posture rigid", "celebrating": "crack healed, posture relaxed", "glowing": "smooth, integrated, at ease"}}'
),
(
  'The Mindful Aspirant',
  'Already on the journey, needs tools to stay consistent and go deeper.',
  70,
  '["Health-conscious already", "Seeks balance", "Self-aware", "Ready to level up"]',
  '["Travel disruptions", "Busy work periods", "Challenging social situations"]',
  '{"color": "teal-sage", "states": {"default": "calm, centered figure, open posture", "concerned": "slight tension, looking inward", "celebrating": "fully open stance, deepened color, steady glow", "glowing": "radiant serenity"}}'
);
