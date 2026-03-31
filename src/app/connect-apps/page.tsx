"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AppItem {
  name: string;
  description: string;
  category: string;
  tag: string;
  connected: boolean;
}

const appCategories = [
  {
    id: "health",
    title: "Health Trackers",
    description: "Movement, sleep, and recovery data",
    apps: [
      { name: "Apple Health", description: "Steps, heart rate, activity rings", category: "health" as const, tag: "safe" as const, connected: false },
      { name: "Whoop", description: "Sleep score, HRV, recovery", category: "health" as const, tag: "safe" as const, connected: false },
      { name: "Oura", description: "Sleep, readiness, activity", category: "health" as const, tag: "safe" as const, connected: false },
      { name: "Strava", description: "Workouts, runs, cycling", category: "health" as const, tag: "safe" as const, connected: false },
    ],
  },
  {
    id: "delivery",
    title: "Delivery & Food",
    description: "Order patterns and timing",
    apps: [
      { name: "DoorDash", description: "Order history, time of orders", category: "delivery" as const, tag: "trigger" as const, connected: false },
      { name: "UberEats", description: "Order history, time of orders", category: "delivery" as const, tag: "trigger" as const, connected: false },
      { name: "Instacart", description: "Cart contents, frequency", category: "delivery" as const, tag: "watch" as const, connected: false },
    ],
  },
  {
    id: "social",
    title: "Social & Screen Time",
    description: "Usage patterns and session data",
    apps: [
      { name: "Instagram", description: "Screen time, session duration", category: "social" as const, tag: "trigger" as const, connected: false },
      { name: "TikTok", description: "Screen time, session duration", category: "social" as const, tag: "trigger" as const, connected: false },
      { name: "YouTube", description: "Watch time, session data", category: "social" as const, tag: "watch" as const, connected: false },
    ],
  },
  {
    id: "spending",
    title: "Spending",
    description: "Purchase patterns and impulse buying",
    apps: [
      { name: "Bank (via Plaid)", description: "Transaction patterns", category: "spending" as const, tag: "watch" as const, connected: false },
      { name: "Amazon", description: "Order history, patterns", category: "spending" as const, tag: "trigger" as const, connected: false },
    ],
  },
];

const tagColors: Record<string, { bg: string; border: string; text: string }> = {
  trigger: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
  watch: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  safe: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
};

export default function ConnectAppsPage() {
  const router = useRouter();
  const [apps, setApps] = useState<AppItem[]>(
    appCategories.flatMap((cat) => cat.apps as AppItem[])
  );
  const [flaggedApps, setFlaggedApps] = useState<Set<string>>(new Set());
  const [showFlags, setShowFlags] = useState(false);

  const toggleApp = (name: string) => {
    setApps((prev) =>
      prev.map((a) => (a.name === name ? { ...a, connected: !a.connected } : a))
    );
  };

  const toggleFlag = (name: string) => {
    setFlaggedApps((prev) => {
      const n = new Set(prev);
      n.has(name) ? n.delete(name) : n.add(name);
      return n;
    });
  };

  const connectedCount = apps.filter((a) => a.connected).length;

  const handleContinue = () => {
    localStorage.setItem("pause_connected_apps", JSON.stringify(apps.filter((a) => a.connected).map((a) => a.name)));
    localStorage.setItem("pause_flagged_apps", JSON.stringify(Array.from(flaggedApps)));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Connect your apps</h1>
        <p className="text-sm text-muted mb-8">
          PAUSE uses data from your apps to learn your patterns. Connect what you&apos;re comfortable with — you can always change this later.
        </p>

        {appCategories.map((cat) => (
          <div key={cat.id} className="mb-8">
            <div className="mb-3">
              <h2 className="text-sm font-semibold">{cat.title}</h2>
              <p className="text-xs text-muted">{cat.description}</p>
            </div>
            <div className="space-y-2">
              {apps
                .filter((a) => a.category === cat.id)
                .map((app) => {
                  const tc = tagColors[app.tag];
                  return (
                    <button
                      key={app.name}
                      onClick={() => toggleApp(app.name)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        app.connected
                          ? "bg-accent/5 border-accent/20"
                          : "bg-surface border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{app.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${tc.bg} ${tc.border} border ${tc.text}`}>
                              {app.tag}
                            </span>
                          </div>
                          <p className="text-xs text-muted mt-0.5">{app.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          app.connected ? "bg-accent border-accent" : "border-white/15"
                        }`}>
                          {app.connected && (
                            <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}

        {/* Flag problem apps */}
        {connectedCount > 0 && (
          <div className="mb-8 p-5 rounded-xl bg-surface border border-white/5">
            <button
              onClick={() => setShowFlags(!showFlags)}
              className="w-full text-left flex items-center justify-between"
            >
              <div>
                <h3 className="text-sm font-semibold">Flag your problem apps</h3>
                <p className="text-xs text-muted mt-0.5">Which connected apps do you consider your problem apps? These will be monitored more closely.</p>
              </div>
              <svg className={`w-4 h-4 text-muted transition-transform ${showFlags ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {showFlags && (
              <div className="mt-4 space-y-2">
                {apps.filter((a) => a.connected).map((app) => (
                  <button
                    key={app.name}
                    onClick={() => toggleFlag(app.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                      flaggedApps.has(app.name) ? "bg-red-500/10 text-red-400" : "bg-surface-light text-muted hover:text-foreground"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center text-[9px] ${
                      flaggedApps.has(app.name) ? "bg-red-500 border-red-500 text-white" : "border-white/15"
                    }`}>
                      {flaggedApps.has(app.name) ? "\u2713" : ""}
                    </span>
                    {app.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <button
          onClick={handleContinue}
          className="w-full py-3 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent-soft transition-all mb-3"
        >
          {connectedCount > 0
            ? `Continue with ${connectedCount} app${connectedCount > 1 ? "s" : ""}`
            : "Skip for now"}
        </button>
        <p className="text-center text-xs text-muted/40">You can connect apps anytime from settings.</p>
      </div>
    </div>
  );
}
