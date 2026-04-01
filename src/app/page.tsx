"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const features = [
  { name: "Harold", status: "Active", tagline: "Your Heart Insight Agent", desc: "Watches your data and surfaces what you'd miss. Conversational, contextual, rare enough to matter.", color: "#FF8897", href: "/harold" },
  { name: "PAUSE", status: "Active", tagline: "Your Behavioral Intelligence Layer", desc: "Identity-anchored interventions at the moment you need them. Mirrors, not blocks. Zero shame.", color: "#E85D3A", href: "/pause" },
  { name: "Crew", status: "Coming Soon", tagline: "A New Kind of Lifestyle Agent", desc: "Something different is being built. Stay tuned.", color: "#9DB0FF", href: "/crew" },
];

const steps = [
  { n: "01", title: "Connect your data sources", desc: "Wearables, apps, trackers" },
  { n: "02", title: "Attune learns silently", desc: "No dashboards, no effort" },
  { n: "03", title: "Harold surfaces insights", desc: "During downtime, like content" },
  { n: "04", title: "PAUSE intervenes at the right moment", desc: "With your own words" },
  { n: "05", title: "Awareness builds naturally", desc: "Behavior shifts over time" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-harold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-crew/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-[1.1] tracking-tight mb-6 animate-in">
            Health awareness that
            <br />fits your life
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed mb-10 animate-in-d1">
            Attune transforms your health data into moments of awareness — delivered when you&apos;re actually ready to notice.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in-d2">
            <Link href="/harold" className="px-6 py-3 rounded-lg bg-harold text-background font-medium text-sm hover:opacity-90 transition-all">
              Meet Harold
            </Link>
            <Link href="/pause" className="px-6 py-3 rounded-lg border border-white/10 text-foreground font-medium text-sm hover:bg-surface-light transition-all">
              Explore PAUSE
            </Link>
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video rounded-2xl bg-surface border border-border flex items-center justify-center relative overflow-hidden">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-6 h-6 text-white/30 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-sm text-muted">Product Demo — Coming Soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#FF8897" }}>Features</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">Three agents, one mission</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {features.map((f) => (
              <Link key={f.name} href={f.href} className={`p-6 rounded-xl bg-surface border border-border hover:border-white/15 transition-all group ${f.status === "Coming Soon" ? "opacity-60" : ""}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-serif text-lg font-bold" style={{ color: f.color }}>{f.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${f.status === "Active" ? "bg-white/10 text-white/60" : "bg-white/5 text-white/30"}`}>{f.status}</span>
                </div>
                <p className="text-sm font-medium mb-2">{f.tagline}</p>
                <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">How it works</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">Five steps to awareness</h2>
          </div>
          <div className="grid sm:grid-cols-5 gap-4">
            {steps.map((s) => (
              <div key={s.n} className="p-4 rounded-xl bg-surface border border-border">
                <span className="text-xs font-mono text-accent">{s.n}</span>
                <h3 className="text-sm font-semibold mt-2 mb-1">{s.title}</h3>
                <p className="text-xs text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">About us</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-8">Closing the awareness gap</h2>
          <div className="space-y-6 text-muted leading-relaxed">
            <p>
              There&apos;s a growing gap between the amount of health data available and the ability of individuals to meaningfully use it. Attune addresses that gap by transforming data into accessible, contextual, and personally relevant content.
            </p>
            <p>
              By meeting users where they already are — rather than asking them to change — it creates a more realistic and sustainable approach to health awareness.
            </p>
            <p className="font-serif text-foreground text-xl italic">
              &ldquo;Behavior change is not driven by instruction, but by perception.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-muted/40">
          <span className="font-serif font-bold">ATTUNE</span>
          <span>Health awareness that fits your life</span>
        </div>
      </footer>
    </div>
  );
}
