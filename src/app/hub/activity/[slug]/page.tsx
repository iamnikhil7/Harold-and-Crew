"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import HaroldOrb from "@/components/HaroldOrb";

const activities: Record<
  string,
  {
    name: string;
    type: string;
    typeIcon: string;
    description: string;
    atmosphere: string;
    when: string;
    where: string;
    duration: string;
    whatToBring: string;
    haroldNote: string;
    participation: string;
    communityNote: string;
  }
> = {
  "sunday-run": {
    name: "Sunday Morning Easy Run",
    type: "Running/Walking",
    typeIcon: "🏃",
    description:
      "A relaxed Sunday morning run through the park with a welcoming group of regulars and newcomers. The pace is conversational—nobody's racing.",
    atmosphere:
      "Easy-paced, conversational, all levels welcome. The group stays together and adjusts to whoever shows up.",
    when: "Every Sunday at 8:00 AM",
    where: "Central Park South entrance, near Columbus Circle",
    duration: "45-60 minutes",
    whatToBring: "Comfortable running shoes, water bottle. That's it.",
    haroldNote:
      "You seem to do better with longer, easier sessions right now. This group moves at a conversational pace—nobody's racing. That kind of rhythm tends to help when things feel a bit scattered.",
    participation: "24 people joined in the past month",
    communityNote: "Mix of regulars and newcomers, very welcoming",
  },
  "lunch-walk": {
    name: "Lunch Walk",
    type: "Running/Walking",
    typeIcon: "🚶",
    description:
      "A casual midday walk to break up your day. No agenda, no pressure—just movement and fresh air with whoever shows up.",
    atmosphere: "Casual, drop-in, no commitment. Come as you are.",
    when: "Tuesdays and Thursdays at 12:30 PM",
    where: "Bryant Park fountain, Midtown Manhattan",
    duration: "25-30 minutes",
    whatToBring: "Nothing special. Just your lunch break.",
    haroldNote:
      "Low effort, high return. Breaking up your day with movement tends to shift how the rest of the afternoon feels.",
    participation: "12 people joined in the past month",
    communityNote: "Mostly working professionals, very relaxed",
  },
  "pickup-basketball": {
    name: "Pickup Basketball",
    type: "Recreational Sports",
    typeIcon: "🏀",
    description:
      "Open pickup basketball games with a rotating group. All skill levels welcome—the focus is on playing, not competing.",
    atmosphere:
      "Competitive but welcoming, all skill levels. Games are inclusive and fun.",
    when: "Monday and Wednesday at 7:00 PM",
    where: "West 4th Street Courts, Greenwich Village",
    duration: "60-90 minutes",
    whatToBring: "Athletic shoes, water. Balls are usually available.",
    haroldNote:
      "You've had good energy the past few days. This could be a good outlet—physical, social, and just enough competition to stay engaged.",
    participation: "18 people joined in the past month",
    communityNote: "Regular crew with new faces each week",
  },
  "evening-yoga": {
    name: "Thursday Evening Yoga",
    type: "Yoga/Stretching",
    typeIcon: "🧘",
    description:
      "A gentle, restorative yoga session designed to help you wind down. Perfect for beginners or anyone needing to slow down.",
    atmosphere:
      "Gentle, restorative, beginner-friendly. No experience needed.",
    when: "Every Thursday at 6:30 PM",
    where: "Prospect Park Boathouse, Brooklyn",
    duration: "50 minutes",
    whatToBring:
      "Yoga mat if you have one (extras available). Comfortable clothes.",
    haroldNote:
      "Slower sessions might help right now. This one is designed for winding down, not pushing through.",
    participation: "15 people joined in the past month",
    communityNote: "Small, consistent group. Very beginner-friendly",
  },
};

export default function ActivityDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const activity = activities[slug];

  if (!activity) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background text-foreground pt-24 px-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="font-serif text-2xl">Activity not found</h1>
            <p className="text-muted/60">
              We couldn&apos;t find the activity you&apos;re looking for.
            </p>
            <Link
              href="/hub"
              className="inline-block text-sm text-[#FF8897] hover:underline"
            >
              &larr; Back to Hub
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-24 px-6 pb-16">
        <div className="max-w-2xl mx-auto space-y-10">
          {/* Back link */}
          <Link
            href="/hub"
            className="inline-block text-sm text-muted/60 hover:text-foreground transition-colors"
          >
            &larr; Back to Hub
          </Link>

          {/* 4.1 Activity Overview */}
          <section className="space-y-3">
            <h1 className="font-serif text-3xl">{activity.name}</h1>
            <p className="text-sm text-muted/60">
              {activity.typeIcon} {activity.type}
            </p>
            <p className="text-muted leading-relaxed">{activity.description}</p>
            <p className="text-muted leading-relaxed text-sm">
              <span className="text-muted/50">Atmosphere:</span>{" "}
              {activity.atmosphere}
            </p>
          </section>

          {/* 4.2 Logistics */}
          <section className="p-6 rounded-2xl bg-surface border border-border space-y-5">
            <div>
              <p className="text-xs uppercase text-muted/50 mb-1">When</p>
              <p className="text-foreground">{activity.when}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted/50 mb-1">Where</p>
              <p className="text-foreground">{activity.where}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted/50 mb-1">Duration</p>
              <p className="text-foreground">{activity.duration}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted/50 mb-1">
                What to bring
              </p>
              <p className="text-foreground">{activity.whatToBring}</p>
            </div>
          </section>

          {/* 4.3 Harold's Full Perspective */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl">
              Why this might fit right now
            </h2>
            <div className="flex items-start gap-4 border-l-2 border-[#FF8897]/30 pl-5 py-2">
              <div className="flex-shrink-0 mt-1">
                <HaroldOrb size={32} />
              </div>
              <p className="text-muted leading-relaxed">
                {activity.haroldNote}
              </p>
            </div>
          </section>

          {/* 4.4 Participation Information */}
          <section className="space-y-3">
            <p className="text-foreground">{activity.participation}</p>
            <p className="text-sm text-muted/60">{activity.communityNote}</p>
          </section>

          {/* 4.5 Action Buttons */}
          <section className="flex items-center gap-4 pt-2">
            <button className="bg-[#FF8897] text-black font-medium rounded-full px-7 py-3 hover:opacity-90 transition-opacity">
              I&apos;m interested
            </button>
            <Link
              href="/hub"
              className="text-muted/60 hover:text-foreground transition-colors px-4 py-3"
            >
              Not right now
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
