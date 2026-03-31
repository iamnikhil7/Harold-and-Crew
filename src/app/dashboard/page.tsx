"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { archetypes } from "@/lib/archetypes";
import type { Archetype } from "@/lib/archetypes";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [personalWhy, setPersonalWhy] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const archetypeId = parseInt(localStorage.getItem("pause_archetype_id") || "0");
    const storedGoals = JSON.parse(localStorage.getItem("pause_goals") || "[]");
    const storedWhy = localStorage.getItem("pause_why") || "";
    const storedPriorities = JSON.parse(localStorage.getItem("pause_priorities") || "[]");

    if (!archetypeId) {
      router.push("/auth");
      return;
    }

    const found = archetypes.find((a) => a.id === archetypeId);
    if (found) setArchetype(found);
    setGoals(storedGoals);
    setPersonalWhy(storedWhy);
    setPriorities(storedPriorities);
    setMounted(true);
  }, [router]);

  const pLabels: Record<string, { label: string; color: string; bg: string }> = {
    physical_health: { label: "Physical Health", color: "text-emerald-400", bg: "bg-emerald-400" },
    nutritional_health: { label: "Nutritional Health", color: "text-amber-400", bg: "bg-amber-400" },
    digital_wellness: { label: "Digital Wellness", color: "text-violet-400", bg: "bg-violet-400" },
  };

  if (!mounted || !archetype) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent/15 flex items-center justify-center">
              <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            </div>
            <span className="font-semibold text-sm">PAUSE</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span>{archetype.icon}</span>
            <span className="text-xs">{archetype.name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Observation banner */}
        <div className="p-5 rounded-xl bg-surface border border-white/5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <h2 className="text-sm font-semibold">PAUSE is learning your patterns</h2>
          </div>
          <p className="text-xs text-muted mb-3">During the observation phase, PAUSE monitors and builds baseline patterns. No interventions yet.</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-surface-light rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: "14%" }} />
            </div>
            <span className="text-xs text-muted">Day 1 of 7</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Your Why */}
          {personalWhy && (
            <div className="p-5 rounded-xl bg-surface border border-white/5 md:col-span-2">
              <h3 className="text-xs text-muted uppercase tracking-wider mb-2">Your why</h3>
              <p className="text-lg italic leading-relaxed">&ldquo;{personalWhy}&rdquo;</p>
            </div>
          )}

          {/* Priorities */}
          <div className="p-5 rounded-xl bg-surface border border-white/5">
            <h3 className="text-xs text-muted uppercase tracking-wider mb-3">Active priorities</h3>
            <div className="space-y-2">
              {priorities.map((p) => {
                const info = pLabels[p];
                return info ? (
                  <div key={p} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${info.bg}`} />
                    <span className={`text-sm font-medium ${info.color}`}>{info.label}</span>
                  </div>
                ) : null;
              })}
              {priorities.length === 0 && <p className="text-xs text-muted">None selected</p>}
            </div>
          </div>

          {/* Goals */}
          <div className="p-5 rounded-xl bg-surface border border-white/5">
            <h3 className="text-xs text-muted uppercase tracking-wider mb-3">Your goals</h3>
            <div className="space-y-1.5">
              {goals.slice(0, 4).map((g, i) => (
                <p key={i} className="text-sm text-foreground/80 leading-relaxed">{"\u2022"} {g}</p>
              ))}
              {goals.length > 4 && <p className="text-xs text-muted">+{goals.length - 4} more</p>}
              {goals.length === 0 && <p className="text-xs text-muted">No goals set</p>}
            </div>
          </div>

          {/* Signals */}
          <div className="p-5 rounded-xl bg-surface border border-white/5 md:col-span-2">
            <h3 className="text-xs text-muted uppercase tracking-wider mb-3">Signal categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: "Movement", color: "text-emerald-400", active: priorities.includes("physical_health") },
                { name: "Nutrition", color: "text-amber-400", active: priorities.includes("nutritional_health") },
                { name: "Screen Time", color: "text-violet-400", active: priorities.includes("digital_wellness") },
                { name: "Sleep", color: "text-blue-400", active: true },
                { name: "Spending", color: "text-muted", active: false },
                { name: "Social", color: "text-muted", active: false },
                { name: "Work Stress", color: "text-muted", active: false },
              ].map((s) => (
                <div key={s.name} className="p-2.5 rounded-lg bg-surface-light text-center">
                  <p className={`text-xs font-medium ${s.active ? s.color : "text-muted/50"}`}>{s.name}</p>
                  <p className="text-[10px] text-muted/50 mt-0.5">{s.active ? "Collecting" : "Pending"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Connect apps */}
        <div className="mt-6 p-5 rounded-xl border border-dashed border-white/10 text-center">
          <p className="text-xs text-muted mb-3">Connect apps to enrich PAUSE with real data.</p>
          <button className="px-4 py-2 rounded-lg bg-surface-light border border-white/10 text-xs font-medium hover:border-accent/20 transition-colors">
            Connect apps (coming soon)
          </button>
        </div>

        {/* Start over link */}
        <div className="text-center mt-8">
          <Link href="/auth" className="text-xs text-muted/30 hover:text-muted transition-colors">
            Start over
          </Link>
        </div>
      </main>
    </div>
  );
}
