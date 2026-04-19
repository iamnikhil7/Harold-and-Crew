"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Shared mobile header: tiny Harold + "Harold & Crew" serif italic
 * lockup on the left, optional right-side slot (e.g. settings link,
 * sensitivity toggle). Used on every authenticated screen so the
 * app identity stays consistent.
 */
export default function PhoneHeader({
  right,
  href = "/",
}: {
  right?: React.ReactNode;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between px-5 pt-14 pb-3 flex-shrink-0">
      <Link href={href} className="flex items-center gap-2">
        <Image
          src="/harold-mascot.png"
          alt="Harold"
          width={28}
          height={28}
          className="rounded-full"
          style={{ filter: "drop-shadow(0 4px 8px rgba(100,80,60,0.2))" }}
        />
        <span
          className="text-sm"
          style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontStyle: "italic",
            color: "var(--accent)",
          }}
        >
          Harold &amp; Crew
        </span>
      </Link>
      {right}
    </div>
  );
}
