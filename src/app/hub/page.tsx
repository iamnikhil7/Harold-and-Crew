"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import HaroldOrb from "@/components/HaroldOrb";

const reflections = [
  "You've been a bit out of rhythm this week",
  "You seem more steady after slower sessions",
  "Something feels slightly off today",
  "You've been pushing a bit lately",
  "Good to see you finding some rhythm",
];

const secondaryActivities = [
  {
    name: "Lunch Walk Tomorrow",
    atmosphere: "Casual, drop-in, no commitment",
    timing: "Tuesday 12:30 PM",
    haroldNote: "Low effort. Might be a good way to break up your day.",
    href: "/hub/activity/lunch-walk",
  },
  {
    name: "Pickup Basketball Tonight",
    atmosphere: "Competitive but welcoming, all skill levels",
    timing: "Tonight 7:00 PM",
    haroldNote:
      "You've had good energy the past few days. This could be a good outlet.",
    href: "/hub/activity/pickup-basketball",
  },
  {
    name: "Thursday Evening Yoga",
    atmosphere: "Gentle, restorative, beginner-friendly",
    timing: "Thursday 6:30 PM",
    haroldNote: "Slower sessions might help right now.",
    href: "/hub/activity/evening-yoga",
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HubPage() {
  const [greeting, setGreeting] = useState("Good evening");
  const [reflection, setReflection] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(true);

  useEffect(() => {
    setGreeting(getGreeting());
    setReflection(reflections[Math.floor(Math.random() * reflections.length)]);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16 space-y-10">
        {/* 3.1 Hub Header */}
        <header className="flex items-center gap-3">
          <HaroldOrb size={32} />
          <h1 className="font-serif text-2xl">{greeting}</h1>
        </header>

        {/* 3.2 Harold's Brief Reflection */}
        {showReflection && reflection && (
          <div className="p-4 rounded-2xl bg-surface border border-border flex items-center gap-4">
            <HaroldOrb size={40} />
            <p className="text-sm text-muted flex-1">{reflection}</p>
            <button
              onClick={() => setShowReflection(false)}
              className="text-muted/50 hover:text-foreground transition-colors text-sm shrink-0"
              aria-label="Dismiss reflection"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 3.3 Weekly Anchor Activity */}
        <section className="space-y-3">
          <span className="uppercase text-xs tracking-wider text-muted/50">
            Your anchor
          </span>
          <div className="p-8 rounded-2xl bg-surface border border-border card-hover relative overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-harold/5 blur-3xl pointer-events-none" />
            <div className="relative space-y-4">
              <h2 className="font-serif text-xl">Sunday Morning Easy Run</h2>
              <p className="text-sm text-muted">
                Easy-paced, conversational, all levels welcome
              </p>
              <div className="flex flex-col gap-1 text-sm text-muted">
                <span>Sundays at 8:00 AM</span>
                <span>Starts at Central Park South entrance</span>
              </div>
              <p className="text-sm text-harold/70 italic">
                &ldquo;This might help you build some consistency. Longer
                sessions like this one tend to create rhythm.&rdquo;
              </p>
              <p className="text-xs text-muted/40">
                18 people joined last week
              </p>
              <Link
                href="/hub/activity/sunday-run"
                className="inline-block mt-2 px-5 py-2.5 rounded-full bg-accent text-foreground text-sm font-medium hover:bg-accent-soft transition-colors"
              >
                I&apos;m interested
              </Link>
            </div>
          </div>
        </section>

        {/* 3.4 Secondary Activity Options */}
        <section className="space-y-3">
          <span className="uppercase text-xs tracking-wider text-muted/50">
            This week
          </span>
          <div className="grid sm:grid-cols-3 gap-4">
            {secondaryActivities.map((activity) => (
              <div
                key={activity.href}
                className="p-6 rounded-2xl bg-surface border border-border card-hover flex flex-col gap-3"
              >
                <h3 className="font-serif text-base">{activity.name}</h3>
                <p className="text-xs text-muted">{activity.atmosphere}</p>
                <p className="text-xs text-muted/70">{activity.timing}</p>
                <p className="text-xs text-harold/70 italic flex-1">
                  &ldquo;{activity.haroldNote}&rdquo;
                </p>
                <Link
                  href={activity.href}
                  className="text-xs text-muted hover:text-foreground transition-colors mt-auto"
                >
                  View details &rarr;
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Settings Link */}
        <footer className="pt-6 flex justify-center">
          <Link
            href="/settings"
            className="text-xs text-muted/40 hover:text-muted transition-colors flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Settings
          </Link>
        </footer>
      </main>
    </div>
  );
}
