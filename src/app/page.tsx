"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import HaroldOrb from "@/components/HaroldOrb";

const team = [
  {
    name: "Andy Igwe",
    role: "Founder & Researcher",
    bio: "Focused on creating experiences that feel human-first, not tech-first.",
    photo: "/Andy.png",
  },
  {
    name: "Mariana Alonso",
    role: "Founder & Designer",
    bio: "Bridging the gap between behavioral psychology and everyday digital experiences.",
    photo: "/Mariana.png",
  },
  {
    name: "Neel Pendse",
    role: "Founder, Designer & Researcher",
    bio: "Driven by the belief that great engineering can make complex things feel effortless.",
    photo: "/Neel.png",
  },
  {
    name: "Nikhil Khanal",
    role: "Founder, Designer & Developer",
    bio: "Passionate about building technology that meets people where they are, not where they should be.",
    photo: "/Nikhil.jpg",
  },
];

const steps = [
  {
    n: "01",
    title: "Observe",
    desc: "Harold quietly observes patterns from your health data and daily rhythms. No dashboards, no metrics\u2014just understanding in the background.",
  },
  {
    n: "02",
    title: "Reflect",
    desc: "Harold translates patterns into simple, human-readable reflections. You see how you\u2019re doing through motion and animation\u2014immediately felt, not analyzed.",
  },
  {
    n: "03",
    title: "Connect",
    desc: "The Hub presents 2\u20134 real-world group activities that fit your current state. Run clubs, walks, recreational sports\u2014real communities, not digital ones.",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem("haroldcrew_waitlist_email", email);
      setSubmitted(true);
      setEmail("");
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="min-h-[100vh] flex items-center justify-center px-6 pt-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[150px]"
            style={{ background: "radial-gradient(circle, rgba(255,136,151,0.07) 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Logo mark */}
          <div className="flex items-center justify-center gap-3 mb-8 animate-in">
            <HaroldOrb state="neutral" size={48} />
            <span className="text-2xl font-medium tracking-tight">Harold &amp; Crew</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl leading-[1.05] tracking-tight mb-6 animate-in-d1">
            Regain your rhythm
          </h1>
          <p className="text-base text-muted max-w-lg mx-auto leading-relaxed mb-10 animate-in-d2">
            A companion who helps you understand your patterns, connect with your community, and restore balance to your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in-d3">
            <Link
              href="/onboarding"
              className="px-7 py-3 rounded-full text-sm font-medium transition-all hover:opacity-90"
              style={{ background: "#FF8897", color: "#0B0B0B" }}
            >
              Meet Harold
            </Link>
            <Link
              href="#how-it-works"
              className="px-7 py-3 rounded-full border border-white/10 text-sm font-medium hover:bg-white/[0.03] transition-all"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-wider text-muted/50 mb-6">About Harold &amp; Crew</p>
          <h2 className="font-serif text-3xl sm:text-4xl leading-[1.15] mb-8">
            Understanding patterns, not tracking metrics
          </h2>
          <div className="space-y-5 text-muted leading-relaxed">
            <p>
              Modern life has become increasingly unstructured. Many people have access to health data but no meaningful way to interpret it. Simultaneously, they&apos;ve lost regular, shared physical activity&mdash;the very thing that creates rhythm, consistency, and connection.
            </p>
            <p>
              Harold &amp; Crew exists to help you regain that rhythm. Through a calm, character-led interface, Harold observes your patterns, translates them into simple reflections, and connects you to real-world group activities that fit your current state.
            </p>
            <blockquote className="text-foreground/80 font-serif text-xl leading-relaxed pl-5 border-l-2 border-harold/30 my-8 text-center">
              Behavior change is not driven by instruction, but by perception.
            </blockquote>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-wider text-muted/50 mb-3">How It Works</p>
          <h2 className="font-serif text-3xl sm:text-4xl mb-12">
            Three simple steps to restored rhythm
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {steps.map((s) => (
              <div key={s.n} className="p-6 rounded-2xl bg-surface border border-border card-hover">
                <span className="text-xs font-mono text-muted/50">{s.n}</span>
                <h3 className="text-sm font-medium mt-3 mb-2">{s.title}</h3>
                <p className="text-sm text-muted/50 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-wider text-muted/50 mb-3">The Team</p>
          <h2 className="font-serif text-3xl sm:text-4xl mb-4">Built by people who get it</h2>
          <p className="text-muted leading-relaxed mb-12 max-w-xl">
            We&apos;ve all experienced identity drift &mdash; slowly becoming someone we didn&apos;t fully recognize. Harold &amp; Crew is the tool we wished existed.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member) => (
              <div key={member.name} className="p-6 rounded-2xl bg-surface border border-border card-hover text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-semibold mb-1">{member.name}</h3>
                <p className="text-xs text-accent/70 mb-3">{member.role}</p>
                <p className="text-xs text-muted/50 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign Up / CTA */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl mb-3">Join the community</h2>
          <p className="text-sm text-muted mb-8 max-w-md mx-auto">
            Be among the first to experience health awareness that actually works. Sign up to get early access and updates.
          </p>

          {submitted ? (
            <div className="py-4 px-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-emerald-400 text-sm font-medium">You&apos;re on the list! We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-xl bg-background border border-white/10 text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/40 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90 whitespace-nowrap"
                style={{ background: "#FF8897", color: "#0B0B0B" }}
              >
                Sign Up
              </button>
            </form>
          )}

          <p className="text-xs text-muted/30 mt-4">No spam. Just awareness.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-serif text-sm font-medium">Harold &amp; Crew</span>
            <span className="text-xs text-muted/25">Regain your rhythm</span>
            <span className="text-xs text-muted/25">&copy; {currentYear} Harold &amp; Crew. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
