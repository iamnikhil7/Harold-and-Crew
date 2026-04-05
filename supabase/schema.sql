-- Harold & Crew — Supabase Schema
-- Run this in the Supabase SQL editor to create all tables

-- 1. Users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text,
  location text,
  archetype text,
  activity_preferences text[] default '{}',
  identity_anchor text,
  wellness_baseline integer default 50,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Health Connections
create table if not exists public.health_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  provider text not null, -- 'apple_health' | 'wearable' | 'manual'
  connected boolean default false,
  permissions text[] default '{}',
  connected_at timestamptz,
  disconnected_at timestamptz,
  created_at timestamptz default now()
);

-- 3. Health Patterns (detected by the pattern engine)
create table if not exists public.health_patterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  pattern_type text not null,
  severity text not null default 'mild',
  title text not null,
  caption text not null,
  insight text,
  data_points jsonb default '[]',
  orb_state text default 'neutral',
  active boolean default true,
  detected_at timestamptz default now(),
  dismissed_at timestamptz
);

-- 4. Activities (curated community activities)
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text not null,
  description text,
  atmosphere text,
  timing text not null,
  schedule text,
  day_of_week integer,
  time_of_day text,
  duration_minutes integer default 60,
  location_name text,
  location_lat numeric,
  location_lng numeric,
  what_to_bring text,
  harold_note text,
  intensity text default 'low',
  max_participants integer,
  is_anchor boolean default false,
  source text default 'curated',
  source_id text,
  source_url text,
  image_url text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. User Activities (participation tracking)
create table if not exists public.user_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  activity_id uuid references public.activities(id) on delete cascade not null,
  status text not null default 'interested',
  joined_at timestamptz default now(),
  attended_at timestamptz,
  reflection_shown boolean default false,
  reflection_dismissed boolean default false,
  notes text
);

-- 6. Harold Reflections
create table if not exists public.harold_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  type text not null,
  message text not null,
  detail text,
  orb_state text default 'neutral',
  related_pattern_id uuid references public.health_patterns(id),
  related_activity_id uuid references public.activities(id),
  seen boolean default false,
  dismissed boolean default false,
  created_at timestamptz default now(),
  seen_at timestamptz,
  dismissed_at timestamptz
);

-- Indexes
create index if not exists idx_health_connections_user on public.health_connections(user_id);
create index if not exists idx_health_patterns_user on public.health_patterns(user_id);
create index if not exists idx_health_patterns_active on public.health_patterns(user_id, active);
create index if not exists idx_activities_type on public.activities(type);
create index if not exists idx_activities_slug on public.activities(slug);
create index if not exists idx_user_activities_user on public.user_activities(user_id);
create index if not exists idx_user_activities_activity on public.user_activities(activity_id);
create index if not exists idx_harold_reflections_user on public.harold_reflections(user_id);
create index if not exists idx_harold_reflections_unseen on public.harold_reflections(user_id, seen);

-- Row Level Security
alter table public.users enable row level security;
alter table public.health_connections enable row level security;
alter table public.health_patterns enable row level security;
alter table public.user_activities enable row level security;
alter table public.harold_reflections enable row level security;

create policy "Users read own data" on public.users for select using (auth.uid() = id);
create policy "Users update own data" on public.users for update using (auth.uid() = id);
create policy "Users read own health connections" on public.health_connections for select using (auth.uid() = user_id);
create policy "Users manage own health connections" on public.health_connections for all using (auth.uid() = user_id);
create policy "Users read own patterns" on public.health_patterns for select using (auth.uid() = user_id);
create policy "Users read own user_activities" on public.user_activities for select using (auth.uid() = user_id);
create policy "Users manage own user_activities" on public.user_activities for all using (auth.uid() = user_id);
create policy "Anyone can read activities" on public.activities for select using (true);
create policy "Users read own reflections" on public.harold_reflections for select using (auth.uid() = user_id);
create policy "Users update own reflections" on public.harold_reflections for update using (auth.uid() = user_id);

-- Seed: curated activities
insert into public.activities (name, slug, type, description, atmosphere, timing, schedule, day_of_week, time_of_day, duration_minutes, location_name, harold_note, intensity, is_anchor, what_to_bring) values
  ('Sunday Morning Easy Run', 'sunday-run', 'run', 'Easy-paced, conversational run through the park.', 'Easy-paced, conversational, all levels welcome', 'Sundays at 8:00 AM', 'weekly', 0, '08:00', 75, 'Central Park South entrance', 'This might help you build some consistency.', 'low', true, 'Running shoes, water bottle'),
  ('Lunch Walk', 'lunch-walk', 'walk', 'A casual midday walk to break up the day.', 'Casual, drop-in, no commitment', 'Tuesdays at 12:30 PM', 'weekly', 2, '12:30', 30, 'Bryant Park', 'Low effort. Might be a good way to break up your day.', 'low', false, 'Comfortable shoes'),
  ('Pickup Basketball', 'pickup-basketball', 'sport', 'Friendly pickup games. All skill levels welcome.', 'Competitive but welcoming, all skill levels', 'Thursdays at 7:00 PM', 'weekly', 4, '19:00', 90, 'West 4th Street Courts', 'You''ve had good energy. This could be a good outlet.', 'high', false, 'Athletic shoes, water'),
  ('Thursday Evening Yoga', 'evening-yoga', 'yoga', 'Gentle, restorative yoga focused on breathing.', 'Gentle, restorative, beginner-friendly', 'Thursdays at 6:30 PM', 'weekly', 4, '18:30', 60, 'Yoga Studio on 14th St', 'Slower sessions might help right now.', 'low', false, 'Yoga mat (extras available)')
on conflict (slug) do nothing;

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at before update on public.users for each row execute function update_updated_at();
create trigger activities_updated_at before update on public.activities for each row execute function update_updated_at();

create or replace view public.activity_participation as
select
  a.id as activity_id,
  a.slug,
  count(ua.id) filter (where ua.status = 'attended' and ua.attended_at > now() - interval '7 days') as attended_last_week,
  count(ua.id) filter (where ua.status in ('interested', 'joined')) as currently_interested
from public.activities a
left join public.user_activities ua on ua.activity_id = a.id
group by a.id, a.slug;
