"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const priorities = [
  { type: "physical_health", title: "Physical Health", description: "Movement, fitness, recovery, and how your body feels day to day.", color: "text-emerald-400", activeColor: "border-emerald-400/40 bg-emerald-500/10", iconPath: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
  { type: "nutritional_health", title: "Nutritional Health", description: "What you eat, when you eat, delivery habits, and your relationship with food.", color: "text-amber-400", activeColor: "border-amber-400/40 bg-amber-500/10", iconPath: "M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12" },
  { type: "digital_wellness", title: "Digital Wellness", description: "Screen time, scrolling habits, phone dependency, and attention patterns.", color: "text-violet-400", activeColor: "border-violet-400/40 bg-violet-500/10", iconPath: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" },
];

export default function PrioritiesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleContinue = () => {
    if (selected.size === 0) return;
    localStorage.setItem("pause_priorities", JSON.stringify(Array.from(selected)));
    router.push("/connect-apps");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6 bg-background">
      <div className="max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-2">Set your priorities</h1>
        <p className="text-sm text-muted mb-8">Choose the areas you want PAUSE to focus on. Select at least one.</p>
        <div className="space-y-3 mb-8">
          {priorities.map((p) => {
            const isActive = selected.has(p.type);
            return (
              <button key={p.type} onClick={() => setSelected((prev) => { const n = new Set(prev); n.has(p.type) ? n.delete(p.type) : n.add(p.type); return n; })} className={`w-full text-left p-5 rounded-xl border transition-all ${isActive ? p.activeColor : "bg-surface border-white/5 hover:border-white/10"}`}>
                <div className="flex items-start gap-4">
                  <div className={`${isActive ? p.color : "text-muted"} transition-colors`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={p.iconPath} />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold mb-1">{p.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{p.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${isActive ? "bg-accent border-accent" : "border-white/15"}`}>
                    {isActive && <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <button onClick={handleContinue} disabled={selected.size === 0} className={`w-full py-3 rounded-lg text-sm font-medium transition-all ${selected.size > 0 ? "bg-accent text-background hover:bg-accent-soft" : "bg-surface-light text-muted/30 cursor-not-allowed"}`}>
          Continue to dashboard
        </button>
      </div>
    </div>
  );
}
