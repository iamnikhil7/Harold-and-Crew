"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface AppRow {
  key: string;
  name: string;
  category: string;
  iconEmoji: string;
  iconBg: string;
  iconColor: string;
}

const APPS: AppRow[] = [
  {
    key: "apple_health",
    name: "Apple Health",
    category: "Health & Performance tracker",
    iconEmoji: "\u2764\ufe0f",
    iconBg: "#FDE2E4",
    iconColor: "#E11D48",
  },
  {
    key: "oura",
    name: "Oura Ring",
    category: "Health & Performance tracker",
    iconEmoji: "\u25CB",
    iconBg: "#F3F4F6",
    iconColor: "#111827",
  },
  {
    key: "whoop",
    name: "Whoop",
    category: "Health & Performance tracker",
    iconEmoji: "W",
    iconBg: "#111827",
    iconColor: "#FFFFFF",
  },
  {
    key: "myfitnesspal",
    name: "MyFitnessPal",
    category: "Food & Workout Logging",
    iconEmoji: "\u2708\ufe0f",
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
  },
  {
    key: "calai",
    name: "Cal.ai",
    category: "Food Logging",
    iconEmoji: "Cal",
    iconBg: "#111827",
    iconColor: "#FFFFFF",
  },
];

export default function ConnectAppsPage() {
  const router = useRouter();
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setConnected((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleReveal = () => {
    try {
      localStorage.setItem(
        "harold_connected_apps",
        JSON.stringify(Object.keys(connected).filter((k) => connected[k])),
      );
    } catch {}
    router.push("/archetype");
  };

  return (
    <div
      className="relative min-h-full flex flex-col"
      style={{ background: "var(--gradient-page)" }}
    >
      {/* Top Harold peek */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 0.8, x: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-12 right-0 z-0 pointer-events-none"
      >
        <Image
          src="/harold-mascot.png"
          alt="Harold peek"
          width={96}
          height={96}
          className="rounded-[28%] -rotate-12 translate-x-6"
          style={{ filter: "drop-shadow(0 10px 20px rgba(100,80,60,0.15))" }}
        />
      </motion.div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-2 relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/harold-mascot.png"
            alt="Harold"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span
            className="font-serif italic text-sm"
            style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontStyle: "italic",
              color: "var(--accent)",
            }}
          >
            Harold &amp; Crew
          </span>
        </Link>
      </div>

      <div className="flex-1 px-6 pt-4 pb-8 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif italic leading-[1.15] mb-3"
          style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontStyle: "italic",
            color: "#2C2418",
            fontSize: "clamp(1.5rem, 5.5vw, 2rem)",
            maxWidth: "20ch",
          }}
        >
          Want Harold to observe your patterns?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm leading-relaxed mb-6"
          style={{ color: "var(--muted)" }}
        >
          He can look at your health, sleep, recovery, &amp; activity data to
          help you understand what it means in your daily life.
        </motion.p>

        {/* App list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-2xl overflow-hidden mb-3"
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(180,165,140,0.25)",
            boxShadow: "0 10px 30px rgba(61,53,41,0.08)",
          }}
        >
          {APPS.map((app, idx) => {
            const isOn = !!connected[app.key];
            return (
              <button
                key={app.key}
                onClick={() => toggle(app.key)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/60 transition-colors"
                style={{
                  borderTop:
                    idx === 0 ? "none" : "1px solid rgba(180,165,140,0.18)",
                }}
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                  style={{ background: app.iconBg, color: app.iconColor }}
                >
                  {app.iconEmoji}
                </span>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold truncate"
                    style={{ color: "#2C2418" }}
                  >
                    {app.name}
                  </div>
                  <div
                    className="text-xs truncate"
                    style={{ color: "var(--muted-soft)" }}
                  >
                    {app.category}
                  </div>
                </div>
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-base font-semibold transition-all"
                  style={{
                    background: isOn ? "var(--accent)" : "rgba(180,165,140,0.15)",
                    color: isOn ? "#F5F0E8" : "var(--muted)",
                  }}
                >
                  {isOn ? "\u2713" : "+"}
                </span>
              </button>
            );
          })}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="w-full py-3 rounded-2xl text-sm font-semibold mb-10"
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(180,165,140,0.25)",
            color: "#2C2418",
          }}
        >
          + Add
        </motion.button>
      </div>

      {/* Bottom Crew peek */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.85, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute bottom-24 left-0 z-0 pointer-events-none"
      >
        <Image
          src="/harold-mascot.png"
          alt="Crew peek"
          width={64}
          height={64}
          className="rounded-[28%] rotate-6 -translate-x-4"
          style={{ filter: "drop-shadow(0 8px 16px rgba(100,80,60,0.12))" }}
        />
      </motion.div>

      {/* CTA — anchored at bottom */}
      <div
        className="sticky bottom-0 px-6 pb-8 pt-4 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(245,240,232,0) 0%, rgba(217,178,125,0.3) 30%, rgba(139,111,71,0.85) 80%, #5C4F3D 100%)",
        }}
      >
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={handleReveal}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-semibold text-sm"
          style={{
            background: "#3D3529",
            color: "#F5F0E8",
            boxShadow: "0 14px 40px rgba(61,53,41,0.4)",
          }}
        >
          Reveal Identity
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
        </motion.button>
      </div>
    </div>
  );
}
