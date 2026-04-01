"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function CrewPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-6 pt-16 relative overflow-hidden">
        {/* Lavender orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, rgba(157,176,255,0.6) 0%, rgba(157,176,255,0.1) 50%, transparent 70%)", animation: "breathe-circle 6s ease-in-out infinite" }} />

        <div className="relative z-10 max-w-md text-center">
          <h1 className="font-serif text-5xl font-bold mb-4" style={{ color: "#9DB0FF" }}>CREW</h1>
          <p className="text-lg text-foreground mb-4">A new kind of agent for your lifestyle.</p>
          <p className="text-sm text-muted leading-relaxed mb-10">
            We&apos;re building something different. Crew will expand Attune beyond health into your broader life patterns — work, social, personal. It&apos;s not ready yet. When it is, you&apos;ll know.
          </p>

          {!submitted ? (
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-crew/30 transition-colors"
              />
              <button
                onClick={() => { if (email.includes("@")) setSubmitted(true); }}
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{ background: "#9DB0FF", color: "#0A0A0F" }}
              >
                Notify me
              </button>
            </div>
          ) : (
            <p className="text-sm" style={{ color: "#9DB0FF" }}>We&apos;ll let you know when Crew is ready.</p>
          )}

          <Link href="/" className="block mt-10 text-xs text-muted hover:text-foreground transition-colors">
            &larr; Back to Attune
          </Link>
        </div>
      </div>
    </div>
  );
}
