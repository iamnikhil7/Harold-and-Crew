"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent/15 flex items-center justify-center">
              <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            </div>
            <span className="font-semibold text-sm">PAUSE</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-in">
          <h1 className="text-2xl font-bold mb-2">Welcome to PAUSE</h1>
          <p className="text-sm text-muted mb-8">Discover your behavioral patterns and build the awareness to change them.</p>

          <button
            onClick={() => router.push("/onboarding")}
            className="w-full py-3 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent-soft active:scale-[0.99] transition-all mb-6"
          >
            Get started
          </button>

          <p className="text-center text-xs text-muted/40">No account needed. Takes 3 minutes.</p>
        </div>
      </div>
    </div>
  );
}
