"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { archetypes } from "@/lib/archetypes";
import Link from "next/link";

export default function ProgressPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [resistCount, setResistCount] = useState(0);
  const [overrideCount, setOverrideCount] = useState(0);
  const [archetypeName, setArchetypeName] = useState("");
  const [goals, setGoals] = useState<string[]>([]);

  useEffect(() => {
    const archetypeId = parseInt(localStorage.getItem("pause_archetype_id") || "0");
    if (!archetypeId) { router.push("/auth"); return; }

    const found = archetypes.find((a) => a.id === archetypeId);
    if (found) setArchetypeName(found.name);

    setResistCount(parseInt(localStorage.getItem("pause_resist_count") || "0"));
    setOverrideCount(parseInt(localStorage.getItem("pause_override_count") || "0"));
    setGoals(JSON.parse(localStorage.getItem("pause_goals") || "[]"));
    setMounted(true);
  }, [router]);

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  );

  const totalPauses = resistCount + overrideCount;
  const resistRate = totalPauses > 0 ? Math.round((resistCount / totalPauses) * 100) : 0;
  const points = resistCount * 10;
  const graduationProgress = Math.min(100, (points / 200) * 100);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent/15 flex items-center justify-center">
              <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            </div>
            <span className="font-semibold text-sm">PAUSE</span>
          </Link>
          <span className="text-xs text-muted">{archetypeName}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Your progress</h1>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="p-4 rounded-xl bg-surface border border-white/5 text-center">
            <p className="text-2xl font-bold text-accent">{points}</p>
            <p className="text-xs text-muted mt-1">Points</p>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-white/5 text-center">
            <p className="text-2xl font-bold text-emerald-400">{resistCount}</p>
            <p className="text-xs text-muted mt-1">Resisted</p>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-white/5 text-center">
            <p className="text-2xl font-bold">{totalPauses}</p>
            <p className="text-xs text-muted mt-1">Total pauses</p>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-white/5 text-center">
            <p className="text-2xl font-bold">{resistRate}%</p>
            <p className="text-xs text-muted mt-1">Resist rate</p>
          </div>
        </div>

        {/* Graduation progress */}
        <div className="p-5 rounded-xl bg-surface border border-white/5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Graduation progress</h3>
            <span className="text-xs text-muted">{points} / 200 points</span>
          </div>
          <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden mb-2">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${graduationProgress}%` }} />
          </div>
          <p className="text-xs text-muted">
            {graduationProgress >= 100
              ? "You've reached the graduation threshold! Keep going for 30 consecutive days."
              : `${200 - points} more points needed. Earn 10 points per resistance.`}
          </p>
        </div>

        {/* Goals */}
        {goals.length > 0 && (
          <div className="p-5 rounded-xl bg-surface border border-white/5 mb-6">
            <h3 className="text-sm font-semibold mb-3">Active goals</h3>
            <div className="space-y-2">
              {goals.map((g, i) => (
                <p key={i} className="text-sm text-muted leading-relaxed">{"\u2022"} {g}</p>
              ))}
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="p-5 rounded-xl bg-surface border border-white/5">
          <h3 className="text-sm font-semibold mb-3">How graduation works</h3>
          <ul className="space-y-2 text-xs text-muted">
            <li>{"\u2022"} Each resistance earns 10 points</li>
            <li>{"\u2022"} Modified responses also count as wins</li>
            <li>{"\u2022"} Overrides earn 0 points — but are never punished</li>
            <li>{"\u2022"} Graduate at 200 points + 30 days of &gt;70% resistance rate</li>
            <li>{"\u2022"} After graduation, add a new habit to work on</li>
          </ul>
        </div>

        <div className="text-center mt-6">
          <Link href="/dashboard" className="text-sm text-accent hover:text-accent-soft transition-colors">
            Back to dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
