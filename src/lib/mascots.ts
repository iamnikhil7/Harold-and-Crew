/**
 * Registry for Harold & Crew mascot assets. Every screen looks up mascot
 * images through this module so you can drop PNGs into /public/mascots/
 * and the whole app picks them up without touching a component.
 *
 * Add or rename mascots here — the filenames on disk must match.
 */

export type MascotName =
  | "harold"
  | "harold-neutral"
  | "harold-happy"
  | "harold-stressed"
  | "harold-sleepy"
  | "crew-pink"
  | "crew-yellow"
  | "crew-white"
  | "crew-blue";

const SOURCES: Record<MascotName, string> = {
  harold: "/mascots/harold.png",
  "harold-neutral": "/mascots/harold-neutral.png",
  "harold-happy": "/mascots/harold-happy.png",
  "harold-stressed": "/mascots/harold-stressed.png",
  "harold-sleepy": "/mascots/harold-sleepy.png",
  "crew-pink": "/mascots/crew-pink.png",
  "crew-yellow": "/mascots/crew-yellow.png",
  "crew-white": "/mascots/crew-white.png",
  "crew-blue": "/mascots/crew-blue.png",
};

/**
 * Resolve a mascot name to a public path. The base mascot (`harold`) is
 * always expected to exist; everything else is optional. When a file is
 * missing on disk it simply 404s — call `mascot()` directly and let the
 * component set a fallback, or use `mascotOrHarold()` to auto-fall-back
 * to the default Harold image.
 */
export function mascot(name: MascotName): string {
  return SOURCES[name];
}

export function mascotOrHarold(name: MascotName): string {
  return SOURCES[name] ?? SOURCES.harold;
}

/**
 * The three-mascot crew lineup shown on the landing page top-left and
 * around the archetype reveal. Update the order here to change the
 * arrangement everywhere.
 */
export const CREW_LINEUP: MascotName[] = ["crew-pink", "harold", "crew-yellow"];

export const ARCHETYPE_LINEUP: MascotName[] = [
  "crew-yellow",
  "harold",
  "crew-white",
];
