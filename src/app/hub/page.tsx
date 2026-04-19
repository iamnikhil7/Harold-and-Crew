"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Insight {
  headline: string;
  body: string;
  weekDots: ("green" | "yellow" | "red")[];
  haroldNote: string;
}

const insights: Insight[] = [
  {
    headline: "Something feels slightly off today",
    body: "Your energy is dipping, sleep's been erratic, and the weekend is coming up fast. Subtle, but worth noticing.",
    weekDots: ["yellow", "yellow", "green", "yellow", "red", "yellow", "yellow"],
    haroldNote:
      "Some light movement might help right now. Even 15 minutes of the rest of your day feels. Don't stress it.",
  },
  {
    headline: "You've been finding rhythm this week",
    body: "Movement is up, sleep is steadier, and your recovery numbers look good. Nice and steady.",
    weekDots: ["green", "green", "green", "yellow", "green", "green", "green"],
    haroldNote:
      "Keep it slow, keep it honest. Something social this weekend could lock it in.",
  },
  {
    headline: "Stress seems to be accumulating",
    body: "A few late nights and quiet mornings. Your body is asking for a softer gear.",
    weekDots: ["yellow", "red", "red", "red", "yellow", "yellow", "green"],
    haroldNote: "A gentler session today could reset the rhythm. No hero hours.",
  },
];

interface Activity {
  slug: string;
  title: string;
  tag: string;
  when: string;
  image: string;
}

const activities: Activity[] = [
  {
    slug: "sunday-run",
    title: "East Lawn Park",
    tag: "Easy Jog / Walk",
    when: "Sun · 8:00 AM",
    image:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=400&q=80",
  },
  {
    slug: "pickup-basketball",
    title: "Pickup Basketball",
    tag: "Casual, all levels",
    when: "Tonight · 7:00 PM",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80",
  },
  {
    slug: "morning-walkk",
    title: "Morning Walk",
    tag: "Gentle · waterfront",
    when: "Wed · 7:15 AM",
    image:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=400&q=80",
  },
  {
    slug: "evening-yoga",
    title: "Mat & an Hour",
    tag: "Restorative yoga",
    when: "Thu · 6:30 PM",
    image:
      "https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&w=400&q=80",
  },
];

const dotColor: Record<string, string> = {
  green: "#6B8F6B",
  yellow: "#D9A569",
  red: "#D98B7A",
};

export default function HubPage() {
  const [greeting, setGreeting] = useState("Welcome back");
  const [insight, setInsight] = useState<Insight>(insights[0]);
  const [archetype, setArchetype] = useState<string | null>(null);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
    setInsight(insights[Math.floor(Math.random() * insights.length)]);
    try {
      const raw = localStorage.getItem("harold_profile");
      if (raw) {
        const p = JSON.parse(raw);
        if (p?.archetype) setArchetype(p.archetype);
      }
    } catch {}
  }, []);

  return (
    <div
      className="min-h-full"
      style={{ background: "var(--gradient-page)" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-14 pb-3">
        <div className="flex flex-col">
          <span className="text-xs" style={{ color: "var(--muted-soft)" }}>
            {greeting}
          </span>
          {archetype && (
            <span
              className="font-serif italic text-sm"
              style={{
                fontFamily: '"DM Serif Display", Georgia, serif',
                fontStyle: "italic",
                color: "var(--accent)",
              }}
            >
              {archetype}
            </span>
          )}
        </div>
        <Link
          href="/settings"
          className="text-xs"
          style={{ color: "var(--muted-soft)" }}
        >
          Settings
        </Link>
      </header>

      <main className="px-5 pb-24 space-y-6">
        {/* Insight card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-3"
          >
            <Image
              src="/harold-mascot.png"
              alt="Harold"
              width={64}
              height={64}
              className="rounded-[30%] mx-auto"
              style={{ filter: "drop-shadow(0 10px 24px rgba(100,80,60,0.18))" }}
            />
          </motion.div>

          <p className="text-xs mb-1" style={{ color: "var(--muted-soft)" }}>
            Something feels slightly off today
          </p>
          <h1
            className="font-serif italic mb-3"
            style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontStyle: "italic",
              color: "#2C2418",
              fontSize: "clamp(1.4rem, 5.5vw, 1.8rem)",
              lineHeight: 1.2,
            }}
          >
            {insight.headline}
          </h1>
          <p
            className="text-sm leading-relaxed mx-auto max-w-sm"
            style={{ color: "var(--muted)" }}
          >
            {insight.body}
          </p>

          {/* Week dots */}
          <div className="mt-5 flex justify-center gap-2">
            {insight.weekDots.map((c, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.08 * i,
                  duration: 0.3,
                  type: "spring",
                  stiffness: 400,
                }}
                className="w-3.5 h-3.5 rounded-full"
                style={{ background: dotColor[c] }}
              />
            ))}
          </div>
        </motion.section>

        {/* Harold note speech bubble */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative rounded-2xl p-4 mx-3"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(180,165,140,0.25)",
            boxShadow: "0 8px 24px rgba(61,53,41,0.06)",
          }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.15em] font-semibold mb-1 block"
            style={{ color: "var(--accent)" }}
          >
            Harold&rsquo;s note
          </span>
          <p className="text-sm" style={{ color: "#2C2418" }}>
            &ldquo;{insight.haroldNote}&rdquo;
          </p>
        </motion.div>

        {/* Feature activity */}
        <AnchorCard />

        {/* Activity grid */}
        <section>
          <h2
            className="font-serif italic mb-3"
            style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontStyle: "italic",
              color: "#2C2418",
              fontSize: "1.1rem",
            }}
          >
            Workouts around you
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {activities.map((a) => (
              <Link
                key={a.slug}
                href={`/hub/activity/${a.slug}`}
                className="choice-card"
                style={{ aspectRatio: "1 / 1" }}
              >
                <Image
                  src={a.image}
                  alt={a.title}
                  fill
                  sizes="(max-width: 480px) 50vw, 200px"
                  className="choice-card-img"
                />
                <div className="choice-card-overlay" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[10px] uppercase tracking-wide opacity-85">
                    {a.tag}
                  </div>
                  <div className="text-sm font-semibold leading-tight mt-0.5">
                    {a.title}
                  </div>
                  <div className="text-[10px] opacity-85 mt-0.5">{a.when}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pt-2"
          >
            <Link
              href="/check-in"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-semibold text-sm"
              style={{
                background: "#3D3529",
                color: "#F5F0E8",
                boxShadow: "0 14px 40px rgba(61,53,41,0.3)",
              }}
            >
              Suggest workouts for today
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function AnchorCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="overflow-hidden rounded-3xl relative"
      style={{ boxShadow: "0 14px 34px rgba(61,53,41,0.15)" }}
    >
      <div className="relative w-full aspect-[5/3]">
        <Image
          src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80"
          alt="Sunday morning run club"
          fill
          sizes="(max-width: 480px) 100vw, 430px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
          <span className="text-[10px] uppercase tracking-wider text-white/90 font-semibold">
            All levels welcome
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <span className="text-[10px] uppercase tracking-wide opacity-90">
            Run Club
          </span>
          <h3
            className="font-serif italic text-xl leading-tight"
            style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontStyle: "italic",
            }}
          >
            Saturday Morning Run
          </h3>
          <p className="text-xs opacity-90 mt-0.5">
            Sat · 8:30 AM · Prospect Heights
          </p>
        </div>
      </div>
      <div
        className="p-4"
        style={{ background: "rgba(255,252,246,0.95)" }}
      >
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Light. Social routes like these tend to help right now. Don&rsquo;t
          stress if you&rsquo;re rusty — nobody else isn&rsquo;t either.
        </p>
        <Link
          href="/hub/activity/sunday-run"
          className="inline-flex items-center gap-1 text-xs font-semibold mt-2"
          style={{ color: "var(--accent)" }}
        >
          I&rsquo;m interested →
        </Link>
      </div>
    </motion.div>
  );
}
