/**
 * Activity Discovery Service
 *
 * Integrates with Meetup and Eventbrite APIs to discover real-world
 * community activities near the user's location.
 *
 * Phase 3: Full API integration. Currently uses structured stubs
 * that return realistic data. Replace with real API calls when
 * API keys are configured.
 *
 * Environment variables needed:
 * - MEETUP_API_KEY (for Meetup GraphQL API)
 * - EVENTBRITE_API_KEY (for Eventbrite REST API)
 */

export interface DiscoveredActivity {
  name: string;
  slug: string;
  type: string;
  description: string;
  atmosphere: string;
  timing: string;
  location_name: string;
  source: "meetup" | "eventbrite";
  source_id: string;
  source_url: string;
  intensity: string;
  participant_count?: number;
}

interface DiscoveryOptions {
  location: string;
  type?: string | null;
  limit?: number;
}

const categoryMap: Record<string, string> = {
  running: "run", jogging: "run", "trail running": "run",
  walking: "walk", hiking: "walk",
  yoga: "yoga", pilates: "yoga", meditation: "yoga",
  basketball: "sport", soccer: "sport", volleyball: "sport", tennis: "sport",
  "group fitness": "fitness", crossfit: "fitness", cycling: "fitness", swimming: "fitness",
  "social events": "community", "outdoor activities": "community", wellness: "community",
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

function inferAtmosphere(name: string, description: string): string {
  const text = `${name} ${description}`.toLowerCase();
  if (text.includes("beginner") || text.includes("all levels")) return "Welcoming, all levels";
  if (text.includes("competitive") || text.includes("advanced")) return "Competitive but friendly";
  if (text.includes("casual") || text.includes("social")) return "Casual, drop-in, social";
  if (text.includes("gentle") || text.includes("restorative")) return "Gentle, restorative";
  return "Community-driven, open to all";
}

function inferIntensity(name: string, type: string): string {
  const text = name.toLowerCase();
  if (text.includes("easy") || text.includes("gentle") || text.includes("walk") || type === "yoga") return "low";
  if (text.includes("hiit") || text.includes("competitive") || text.includes("race") || type === "sport") return "high";
  return "moderate";
}

async function fetchFromMeetup(options: DiscoveryOptions): Promise<DiscoveredActivity[]> {
  const apiKey = process.env.MEETUP_API_KEY;
  if (!apiKey) return getMeetupStubs(options);

  try {
    const query = `
      query ($lat: Float!, $lon: Float!, $query: String, $first: Int) {
        rankedEvents(filter: { lat: $lat, lon: $lon, query: $query, source: EVENTS }, first: $first) {
          edges { node { id title description eventUrl dateTime venue { name city } going group { name } } }
        }
      }
    `;
    const response = await fetch("https://api.meetup.com/gql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ query, variables: { lat: 40.7128, lon: -74.006, query: options.type || "fitness wellness running yoga", first: options.limit || 6 } }),
    });
    if (!response.ok) return getMeetupStubs(options);
    const data = await response.json();
    const edges = data?.data?.rankedEvents?.edges || [];
    return edges.map((edge: { node: { id: string; title: string; description: string; eventUrl: string; dateTime: string; venue?: { name: string }; going: number } }) => {
      const event = edge.node;
      const type = Object.entries(categoryMap).find(([key]) => event.title.toLowerCase().includes(key) || event.description?.toLowerCase().includes(key))?.[1] || "community";
      return { name: event.title, slug: `meetup-${slugify(event.title)}`, type, description: event.description?.slice(0, 200) || "", atmosphere: inferAtmosphere(event.title, event.description || ""), timing: new Date(event.dateTime).toLocaleDateString("en-US", { weekday: "long", hour: "numeric", minute: "2-digit" }), location_name: event.venue?.name || options.location, source: "meetup" as const, source_id: event.id, source_url: event.eventUrl, intensity: inferIntensity(event.title, type), participant_count: event.going };
    });
  } catch { return getMeetupStubs(options); }
}

async function fetchFromEventbrite(options: DiscoveryOptions): Promise<DiscoveredActivity[]> {
  const apiKey = process.env.EVENTBRITE_API_KEY;
  if (!apiKey) return getEventbriteStubs(options);

  try {
    const params = new URLSearchParams({ q: options.type || "fitness wellness running yoga", "location.address": options.location, "location.within": "10mi", expand: "venue", sort_by: "date" });
    const response = await fetch(`https://www.eventbriteapi.com/v3/events/search/?${params}`, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!response.ok) return getEventbriteStubs(options);
    const data = await response.json();
    const events = (data.events || []).slice(0, options.limit || 6);
    return events.map((event: { id: string; name: { text: string }; description: { text: string }; url: string; start: { local: string }; venue?: { name: string } }) => {
      const type = Object.entries(categoryMap).find(([key]) => event.name.text.toLowerCase().includes(key) || event.description?.text?.toLowerCase().includes(key))?.[1] || "community";
      return { name: event.name.text, slug: `eb-${slugify(event.name.text)}`, type, description: event.description?.text?.slice(0, 200) || "", atmosphere: inferAtmosphere(event.name.text, event.description?.text || ""), timing: new Date(event.start.local).toLocaleDateString("en-US", { weekday: "long", hour: "numeric", minute: "2-digit" }), location_name: event.venue?.name || options.location, source: "eventbrite" as const, source_id: event.id, source_url: event.url, intensity: inferIntensity(event.name.text, type) };
    });
  } catch { return getEventbriteStubs(options); }
}

function getMeetupStubs(options: DiscoveryOptions): DiscoveredActivity[] {
  const stubs: DiscoveredActivity[] = [
    { name: "Saturday Morning Run Club", slug: "meetup-saturday-morning-run-club", type: "run", description: "Join our friendly run club every Saturday! All paces welcome.", atmosphere: "Welcoming, all levels", timing: "Saturdays at 8:00 AM", location_name: `Prospect Park, ${options.location}`, source: "meetup", source_id: "meetup-run-001", source_url: "https://meetup.com", intensity: "moderate", participant_count: 24 },
    { name: "Sunset Yoga in the Park", slug: "meetup-sunset-yoga-park", type: "yoga", description: "Free outdoor yoga as the sun sets. Bring your own mat.", atmosphere: "Gentle, restorative", timing: "Wednesdays at 6:30 PM", location_name: `Central Park, ${options.location}`, source: "meetup", source_id: "meetup-yoga-001", source_url: "https://meetup.com", intensity: "low", participant_count: 35 },
    { name: "Pickup Soccer League", slug: "meetup-pickup-soccer", type: "sport", description: "Casual pickup soccer games. No experience needed!", atmosphere: "Competitive but friendly", timing: "Sundays at 10:00 AM", location_name: `Randall's Island, ${options.location}`, source: "meetup", source_id: "meetup-soccer-001", source_url: "https://meetup.com", intensity: "high", participant_count: 18 },
  ];
  return filterStubs(stubs, options);
}

function getEventbriteStubs(options: DiscoveryOptions): DiscoveredActivity[] {
  const stubs: DiscoveredActivity[] = [
    { name: "Community Wellness Walk", slug: "eb-community-wellness-walk", type: "walk", description: "A guided 45-minute walk focused on mindfulness and connection.", atmosphere: "Casual, drop-in, social", timing: "Tuesdays at 12:00 PM", location_name: `Brooklyn Bridge Park, ${options.location}`, source: "eventbrite", source_id: "eb-walk-001", source_url: "https://eventbrite.com", intensity: "low", participant_count: 15 },
    { name: "Morning HIIT Bootcamp", slug: "eb-morning-hiit-bootcamp", type: "fitness", description: "High-intensity interval training outdoors. First class free!", atmosphere: "Energetic, supportive", timing: "Mon/Wed/Fri at 6:30 AM", location_name: `Hudson River Park, ${options.location}`, source: "eventbrite", source_id: "eb-hiit-001", source_url: "https://eventbrite.com", intensity: "high", participant_count: 12 },
    { name: "Neighborhood Social Ride", slug: "eb-neighborhood-social-ride", type: "fitness", description: "Easy-paced group bike ride through the neighborhood.", atmosphere: "Casual, drop-in, social", timing: "Saturdays at 9:30 AM", location_name: `${options.location}`, source: "eventbrite", source_id: "eb-ride-001", source_url: "https://eventbrite.com", intensity: "moderate", participant_count: 20 },
  ];
  return filterStubs(stubs, options);
}

function filterStubs(stubs: DiscoveredActivity[], options: DiscoveryOptions): DiscoveredActivity[] {
  let result = stubs;
  if (options.type) result = result.filter((s) => s.type === options.type);
  return result.slice(0, options.limit || 6);
}

export async function discoverActivities(options: DiscoveryOptions): Promise<DiscoveredActivity[]> {
  const [meetupResults, eventbriteResults] = await Promise.all([fetchFromMeetup(options), fetchFromEventbrite(options)]);
  const seen = new Set<string>();
  const merged: DiscoveredActivity[] = [];
  for (const activity of [...meetupResults, ...eventbriteResults]) {
    if (!seen.has(activity.slug)) { seen.add(activity.slug); merged.push(activity); }
  }
  merged.sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0));
  return merged.slice(0, options.limit || 6);
}
