"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const thoughts = [
  "You ordered the same thing again last night.",
  "You picked up your phone 47 times today.",
  "You skipped the gym for the third week.",
  "You said you'd go to bed early.",
  "You spent 2 hours scrolling before sleeping.",
  "You ate standing up again.",
];

export default function Home() {
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setThoughtIndex((prev) => (prev + 1) % thoughts.length);
        setFading(false);
      }, 600);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Nav — minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm tracking-widest uppercase text-muted">Pause</span>
          <Link href="/auth" className="text-sm text-muted hover:text-foreground transition-colors">
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero — editorial, quiet */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 pt-14">
        <div className="max-w-xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <p className="text-muted text-sm tracking-wide mb-12">A behavioral intelligence tool</p>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.2] tracking-tight mb-8 animate-fade-in-up-delay-1">
            You already know
            <br />
            what you should do.
          </h1>

          <div className="h-8 mb-10 animate-fade-in-up-delay-2">
            <p className={`font-serif text-lg text-accent italic transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}>
              {thoughts[thoughtIndex]}
            </p>
          </div>

          <p className="text-muted leading-relaxed mb-12 max-w-md mx-auto animate-fade-in-up-delay-2">
            PAUSE doesn&apos;t tell you what to do. It learns your patterns,
            finds the moments you&apos;re most vulnerable, and gives you back
            your own words — right when you need them.
          </p>

          <div className="animate-fade-in-up-delay-3">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-full bg-accent text-background hover:bg-accent-soft active:scale-[0.98] transition-all"
            >
              Take the questionnaire
            </Link>
            <p className="text-xs text-muted/40 mt-4">3 minutes. No account required.</p>
          </div>
        </div>
      </section>

      {/* Quiet divider */}
      <div className="max-w-12 mx-auto border-t border-white/5 my-4" />

      {/* What happens */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-muted text-sm tracking-wide mb-8">How it works</p>

          <div className="space-y-12">
            <div>
              <p className="text-accent text-sm font-medium mb-2">01 — You answer 14 questions</p>
              <p className="font-serif text-xl leading-relaxed">
                Not about your goals. About who you were before life got in the way.
                About the routines you&apos;ve quietly abandoned. About the gap between
                intention and action.
              </p>
            </div>

            <div>
              <p className="text-accent text-sm font-medium mb-2">02 — We find your pattern</p>
              <p className="font-serif text-xl leading-relaxed">
                One of ten archetypes — from the Burnt-Out Professional to the Night Owl.
                Not a diagnosis. A mirror. Something that makes you think
                <em> &ldquo;how did it know that?&rdquo;</em>
              </p>
            </div>

            <div>
              <p className="text-accent text-sm font-medium mb-2">03 — You write your why</p>
              <p className="font-serif text-xl leading-relaxed">
                In your own words. The reason that only you would write.
                This becomes the thing you see at 11pm when you&apos;re about
                to open the delivery app.
              </p>
            </div>

            <div>
              <p className="text-accent text-sm font-medium mb-2">04 — PAUSE shows up when it matters</p>
              <p className="font-serif text-xl leading-relaxed">
                Not constantly. Not randomly. Only when the pattern repeats.
                A cooldown. Your words. A quiet presence. Three layers
                between impulse and action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The difference */}
      <section className="py-24 px-6 border-y border-white/5">
        <div className="max-w-2xl mx-auto">
          <p className="text-muted text-sm tracking-wide mb-8">What makes this different</p>

          <div className="space-y-6 font-serif text-lg leading-relaxed">
            <p>
              Most apps try to <em>block</em> your bad habits.
              PAUSE creates a <em>moment</em> — just long enough for
              you to remember who you actually want to be.
            </p>
            <p className="text-muted">
              No calorie counting. No guilt. No streaks to protect.
              No angry red notifications. If you override the pause,
              the app says nothing. It just learns.
            </p>
            <p className="text-muted">
              Every response — whether you resist or give in — makes
              the next moment smarter. The system adapts to you,
              not the other way around.
            </p>
          </div>
        </div>
      </section>

      {/* Archetypes — quiet */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-muted text-sm tracking-wide mb-3">10 archetypes</p>
          <p className="font-serif text-2xl mb-10">Which one sounds familiar?</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              "The Burnt-Out Professional",
              "The Former Athlete",
              "The Overwhelmed Parent",
              "The Night Owl",
              "The Emotional Eater",
              "The Serial Starter",
              "The Mindless Grazer",
              "The Perfectionist Quitter",
              "The Social Butterfly",
              "The Mindful Aspirant",
            ].map((name) => (
              <div key={name} className="p-3 rounded-lg bg-surface border border-white/5 text-sm text-muted hover:text-foreground hover:border-accent/20 transition-colors">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* End */}
      <section className="py-32 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-serif text-2xl sm:text-3xl leading-relaxed mb-8">
            The questionnaire takes three minutes.
            <br />
            <span className="text-muted">What it shows you might take longer to forget.</span>
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-full bg-accent text-background hover:bg-accent-soft active:scale-[0.98] transition-all"
          >
            Begin
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center text-xs text-muted/30">
          PAUSE — behavioral intelligence
        </div>
      </footer>
    </div>
  );
}
