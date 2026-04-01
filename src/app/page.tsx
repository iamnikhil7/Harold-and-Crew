"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const features = [
  { name: "Harold", status: "Active", tagline: "Your Heart Insight Agent", desc: "Watches your data and surfaces what you'd miss. Conversational, contextual, rare enough to matter.", color: "#FF8897", href: "/harold" },
  { name: "PAUSE", status: "Active", tagline: "Your Behavioral Intelligence Layer", desc: "Identity-anchored interventions at the moment you need them. Mirrors, not blocks. Zero shame.", color: "#E85D3A", href: "/pause" },
  { name: "Crew", status: "Coming Soon", tagline: "A New Kind of Lifestyle Agent", desc: "Something different is being built. Stay tuned.", color: "#9DB0FF", href: "/crew" },
];

const steps = [
  { n: "01", title: "Connect your data", desc: "Wearables, apps, trackers" },
  { n: "02", title: "Attune learns silently", desc: "No dashboards, no effort" },
  { n: "03", title: "Harold surfaces insights", desc: "During downtime, like content" },
  { n: "04", title: "PAUSE intervenes", desc: "With your own words" },
  { n: "05", title: "Awareness builds", desc: "Behavior shifts over time" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — first */}
      <section className="min-h-[90vh] flex items-center justify-center px-6 pt-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-harold/[0.03] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h1 className="text-5xl sm:text-7xl leading-[1.05] tracking-tight mb-6 animate-in">
            Health awareness<br />that fits your life
          </h1>
          <p className="text-muted text-base max-w-lg mx-auto leading-relaxed mb-10 animate-in-d1">
            Attune transforms your health data into moments of awareness — delivered when you&apos;re actually ready to notice.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in-d2">
            <Link href="/harold" className="px-7 py-3 rounded-full text-sm font-medium transition-all hover:opacity-90" style={{ background: "#FF8897", color: "#0B0B0B" }}>
              Meet Harold
            </Link>
            <Link href="/pause" className="px-7 py-3 rounded-full border border-white/10 text-sm font-medium hover:bg-white/[0.03] transition-all">
              Explore PAUSE
            </Link>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.15em] text-muted/50 mb-6">About Attune</p>
          <h2 className="text-3xl sm:text-4xl leading-[1.15] mb-8">
            Closing the gap between data and awareness
          </h2>
          <div className="space-y-5 text-muted leading-relaxed">
            <p>
              There&apos;s a growing gap between the amount of health data available and the ability of individuals to meaningfully use it. Attune addresses that gap by transforming data into accessible, contextual, and personally relevant content.
            </p>
            <p>
              By meeting users where they already are — rather than asking them to change — it creates a more realistic and sustainable approach to health awareness.
            </p>
            <blockquote className="text-foreground/80 text-xl leading-relaxed pl-5 border-l-2 border-accent/30 my-8">
              Behavior change is not driven by instruction, but by perception.
            </blockquote>
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.15em] text-muted/40 mb-4 text-center">A look at life, awareness, and the moments in between</p>
          <div className="aspect-video rounded-2xl bg-surface border border-border flex items-center justify-center">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border border-white/[0.06] flex items-center justify-center mx-auto mb-3" style={{ animation: "breathe-circle 4s ease-in-out infinite" }}>
                <svg className="w-5 h-5 text-white/15 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <p className="text-sm text-muted/30">Coming Soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.15em] text-harold/50 mb-3">Features</p>
          <h2 className="text-3xl mb-12">Three agents, one mission</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {features.map((f) => (
              <Link key={f.name} href={f.href} className={`group p-6 rounded-2xl bg-surface border border-border hover:border-white/[0.08] transition-all ${f.status === "Coming Soon" ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-medium" style={{ color: f.color }}>{f.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-muted/40">{f.status}</span>
                </div>
                <p className="text-sm font-medium mb-2">{f.tagline}</p>
                <p className="text-sm text-muted/50 leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.15em] text-accent/50 mb-3">How it works</p>
          <h2 className="text-3xl mb-12">Five steps to awareness</h2>
          <div className="grid sm:grid-cols-5 gap-3">
            {steps.map((s) => (
              <div key={s.n} className="p-5 rounded-2xl bg-surface border border-border">
                <span className="text-xs font-mono text-accent/50">{s.n}</span>
                <h3 className="text-sm font-medium mt-3 mb-1">{s.title}</h3>
                <p className="text-xs text-muted/40">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-10 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-muted/25">
          <span className="font-medium">Attune</span>
          <span>Health awareness that fits your life</span>
        </div>
      </footer>
    </div>
  );
}
