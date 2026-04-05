"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const activityOptions = [
  "Running/Walking",
  "Yoga/Stretching",
  "Recreational Sports",
  "Group Fitness",
  "Community Events",
  "Open to Anything",
];

const timingOptions = ["Morning", "Afternoon", "Evening"];

interface SettingsData {
  activityPreferences: string[];
  preferredTiming: string;
  location: string;
  healthConnection: string | null;
  notifyReflections: boolean;
  notifyReminders: boolean;
}

const defaultSettings: SettingsData = {
  activityPreferences: [],
  preferredTiming: "",
  location: "",
  healthConnection: null,
  notifyReflections: true,
  notifyReminders: false,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("harold_onboarding");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings((prev) => ({
          ...prev,
          activityPreferences: parsed.activityPreferences ?? prev.activityPreferences,
          preferredTiming: parsed.preferredTiming ?? prev.preferredTiming,
          location: parsed.location ?? prev.location,
          healthConnection: parsed.healthConnection ?? prev.healthConnection,
          notifyReflections: parsed.notifyReflections ?? prev.notifyReflections,
          notifyReminders: parsed.notifyReminders ?? prev.notifyReminders,
        }));
      } catch {
        // ignore malformed data
      }
    }
    setLoaded(true);
  }, []);

  const persist = (next: SettingsData) => {
    setSettings(next);
    localStorage.setItem("harold_onboarding", JSON.stringify(next));
  };

  const toggleActivity = (activity: string) => {
    const updated = settings.activityPreferences.includes(activity)
      ? settings.activityPreferences.filter((a) => a !== activity)
      : [...settings.activityPreferences, activity];
    persist({ ...settings, activityPreferences: updated });
  };

  const setTiming = (timing: string) => {
    persist({ ...settings, preferredTiming: timing });
  };

  const setLocation = (location: string) => {
    persist({ ...settings, location });
  };

  const toggleHealthConnection = () => {
    const next =
      settings.healthConnection && settings.healthConnection !== "skip"
        ? null
        : "apple_health";
    persist({ ...settings, healthConnection: next });
  };

  const toggleNotifyReflections = () => {
    persist({ ...settings, notifyReflections: !settings.notifyReflections });
  };

  const toggleNotifyReminders = () => {
    persist({ ...settings, notifyReminders: !settings.notifyReminders });
  };

  const isHealthConnected =
    settings.healthConnection !== null && settings.healthConnection !== "skip";

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F0]">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <Link
          href="/hub"
          className="text-sm text-[#F5F5F0]/50 hover:text-[#F5F5F0]/80 transition-colors mb-6 inline-block"
        >
          &larr; Back to Hub
        </Link>

        <h1 className="font-serif text-3xl mb-8">Settings</h1>

        {/* Activity Preferences */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#272727] mb-4">
          <h2 className="font-serif text-lg mb-4">Activity Preferences</h2>

          <p className="text-sm text-[#F5F5F0]/50 mb-3">Activity types</p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {activityOptions.map((activity) => {
              const selected = settings.activityPreferences.includes(activity);
              return (
                <button
                  key={activity}
                  onClick={() => toggleActivity(activity)}
                  className={`px-4 py-3 rounded-lg text-sm text-left transition-all border ${
                    selected
                      ? "bg-[#FF8897]/10 border-[#FF8897]/40 text-[#F5F5F0]"
                      : "bg-white/[0.03] border-white/[0.06] text-[#F5F5F0]/60 hover:border-white/10 hover:text-[#F5F5F0]/80"
                  }`}
                >
                  {activity}
                </button>
              );
            })}
          </div>

          <p className="text-sm text-[#F5F5F0]/50 mb-3">Preferred timing</p>
          <div className="flex gap-2 mb-6">
            {timingOptions.map((timing) => {
              const selected = settings.preferredTiming === timing;
              return (
                <button
                  key={timing}
                  onClick={() => setTiming(timing)}
                  className={`px-4 py-2.5 rounded-lg text-sm transition-all border flex-1 ${
                    selected
                      ? "bg-[#FF8897]/10 border-[#FF8897]/40 text-[#F5F5F0]"
                      : "bg-white/[0.03] border-white/[0.06] text-[#F5F5F0]/60 hover:border-white/10 hover:text-[#F5F5F0]/80"
                  }`}
                >
                  {timing}
                </button>
              );
            })}
          </div>

          <p className="text-sm text-[#F5F5F0]/50 mb-3">Location</p>
          <input
            type="text"
            value={settings.location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City or neighborhood"
            className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F5F5F0] placeholder:text-[#F5F5F0]/25 focus:outline-none focus:border-[#FF8897]/40 transition-colors"
          />
        </div>

        {/* Health Data */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#272727] mb-4">
          <h2 className="font-serif text-lg mb-4">Health Data</h2>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#F5F5F0]/70">Connection status</span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  isHealthConnected
                    ? "bg-[#FF8897]/15 text-[#FF8897]"
                    : "bg-white/[0.06] text-[#F5F5F0]/40"
                }`}
              >
                {isHealthConnected ? "Connected" : "Not connected"}
              </span>
            </div>
            <button
              onClick={toggleHealthConnection}
              className={`text-sm px-4 py-2 rounded-lg border transition-all ${
                isHealthConnected
                  ? "border-white/10 text-[#F5F5F0]/60 hover:border-white/20 hover:text-[#F5F5F0]/80"
                  : "border-[#FF8897]/40 text-[#FF8897] hover:bg-[#FF8897]/10"
              }`}
            >
              {isHealthConnected ? "Disconnect" : "Connect"}
            </button>
          </div>

          <p className="text-xs text-[#F5F5F0]/30 leading-relaxed">
            Your data never leaves your device. Harold only sees patterns, never
            raw metrics.
          </p>
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#272727] mb-4">
          <h2 className="font-serif text-lg mb-4">Notifications</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#F5F5F0]/70">
                Harold&apos;s reflections
              </span>
              <button
                onClick={toggleNotifyReflections}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  settings.notifyReflections
                    ? "bg-[#FF8897]"
                    : "bg-white/[0.1]"
                }`}
                role="switch"
                aria-checked={settings.notifyReflections}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    settings.notifyReflections ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#F5F5F0]/70">
                Activity reminders
              </span>
              <button
                onClick={toggleNotifyReminders}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  settings.notifyReminders
                    ? "bg-[#FF8897]"
                    : "bg-white/[0.1]"
                }`}
                role="switch"
                aria-checked={settings.notifyReminders}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    settings.notifyReminders ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#272727] mb-4">
          <h2 className="font-serif text-lg mb-4">Account</h2>

          <div className="mb-4">
            <p className="text-xs text-[#F5F5F0]/40 mb-1">Email</p>
            <p className="text-sm text-[#F5F5F0]/70">user@example.com</p>
          </div>

          <div className="flex gap-4">
            <span className="text-sm text-[#F5F5F0]/40 hover:text-[#F5F5F0]/60 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-sm text-[#F5F5F0]/40 hover:text-[#F5F5F0]/60 transition-colors cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
