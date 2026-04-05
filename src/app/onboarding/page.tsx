"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import HaroldOrb from "@/components/HaroldOrb";

const activityOptions = [
  "Running/Walking",
  "Yoga/Stretching",
  "Recreational Sports",
  "Group Fitness",
  "Community Events",
  "Open to Anything",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState("");
  const [activityPreferences, setActivityPreferences] = useState<string[]>([]);
  const [healthConnection, setHealthConnection] = useState<string | null>(null);

  const toggleActivity = (activity: string) => {
    setActivityPreferences((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const saveAndAdvance = (nextStep: number) => {
    localStorage.setItem(
      "harold_onboarding",
      JSON.stringify({ location, activityPreferences, healthConnection })
    );
    setStep(nextStep);
  };

  const handleHealthChoice = (choice: string) => {
    setHealthConnection(choice);
    localStorage.setItem(
      "harold_onboarding",
      JSON.stringify({
        location,
        activityPreferences,
        healthConnection: choice,
      })
    );
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F0]">
      <Navbar />

      {/* Step 1: Welcome */}
      {step === 1 && (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center animate-in">
            <div className="flex justify-center mb-8 animate-in-d1">
              <HaroldOrb state="neutral" size={100} />
            </div>
            <h1 className="font-serif text-3xl mb-4 animate-in-d2">
              Hi. I&apos;m Harold.
            </h1>
            <p className="text-[#F5F5F0]/60 leading-relaxed mb-10 animate-in-d3">
              I&apos;m here to help you notice patterns you might otherwise
              miss—and connect you to experiences that help restore rhythm to
              your life.
            </p>
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3 rounded-lg text-sm font-medium bg-[#FF8897] text-[#0B0B0B] hover:opacity-90 transition-opacity animate-in-d4"
            >
              Let&apos;s start
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Location & Activity Preferences */}
      {step === 2 && (
        <div className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
          <div className="max-w-lg w-full animate-in">
            <h2 className="font-serif text-2xl mb-6">Where are you?</h2>

            <div className="mb-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or neighborhood"
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F5F5F0] placeholder:text-[#F5F5F0]/25 focus:outline-none focus:border-[#FF8897]/40 transition-colors"
              />
            </div>
            <p className="text-xs text-[#F5F5F0]/40 mb-1">
              This helps me find group activities near you.
            </p>
            <p className="text-xs text-[#F5F5F0]/25 mb-10">
              Your location stays private—it&apos;s only used for activity
              suggestions.
            </p>

            <h3 className="font-serif text-lg mb-4 animate-in-d1">
              What sounds appealing?
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-8">
              {activityOptions.map((activity) => {
                const selected = activityPreferences.includes(activity);
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

            <button
              onClick={() => saveAndAdvance(3)}
              className="w-full py-3 rounded-lg text-sm font-medium bg-[#FF8897] text-[#0B0B0B] hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Health Data Connection */}
      {step === 3 && (
        <div className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
          <div className="max-w-lg w-full animate-in">
            <h2 className="font-serif text-2xl mb-3">
              Want me to observe patterns?
            </h2>
            <p className="text-[#F5F5F0]/60 leading-relaxed mb-8 text-sm">
              I can look at your health data—sleep, recovery, activity—and help
              you understand what it means. Or we can skip this for now.
            </p>

            <div className="space-y-2 mb-6">
              {[
                { id: "apple_health", label: "Connect Apple Health" },
                { id: "wearable", label: "Connect Wearable" },
                { id: "skip", label: "Skip for now" },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleHealthChoice(option.id)}
                  className="w-full text-left px-4 py-4 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-[#F5F5F0]/80 hover:border-white/10 hover:text-[#F5F5F0] transition-all"
                >
                  {option.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-[#F5F5F0]/25">
              Your data never leaves your device or my interpretations. I
              don&apos;t store raw metrics.
            </p>
          </div>
        </div>
      )}

      {/* Step 4: First Harold Reflection */}
      {step === 4 && (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center animate-in">
            <div className="flex justify-center mb-8 animate-in-d1">
              <HaroldOrb state="neutral" size={120} />
            </div>
            <p className="text-[#F5F5F0]/70 leading-relaxed mb-10 text-lg animate-in-d2">
              I&apos;ll be here when you need me—not every day, just when
              there&apos;s something worth noticing.
            </p>
            <button
              onClick={() => router.push("/hub")}
              className="px-8 py-3 rounded-lg text-sm font-medium bg-[#FF8897] text-[#0B0B0B] hover:opacity-90 transition-opacity animate-in-d3"
            >
              Show me the Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
