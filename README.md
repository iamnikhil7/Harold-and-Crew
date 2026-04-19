# Harold & Crew

A gentle companion that helps people notice their patterns, understand
their rhythms, and reconnect with the version of themselves they actually
like. Built with Next.js 16, TypeScript, Tailwind CSS, and Supabase.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Repo layout

```
.
├── docs/
│   └── design-references/   iPhone mock screenshots — the visual source of truth
├── public/
│   ├── mascots/             Harold + crew mascot PNGs (drop Figma exports here)
│   ├── crew/                Pre-arranged mascot group compositions
│   ├── team/                Founder headshots
│   ├── brand/               Logos, wordmarks
│   ├── images/              Lifestyle / product imagery
│   └── icons/               SVG utility icons
├── src/
│   ├── app/                 Next.js App Router pages + API routes
│   ├── components/          Shared React components
│   │   ├── PhoneHeader.tsx  Shared mobile header (Harold lockup)
│   │   ├── PillButton.tsx   Shared chocolate CTA pill
│   │   ├── MascotImage.tsx  Mascot with auto-fallback to Harold
│   │   └── ...
│   └── lib/                 Data + domain logic
│       ├── mascots.ts       Mascot name → public path registry
│       ├── questions.ts     6-question onboarding quiz
│       ├── scoring.ts       Archetype scoring from quiz answers
│       └── archetypes.ts    10 archetype definitions
└── supabase/                Schema + migrations
```

## Asset conventions

### Mascots (`/public/mascots/`)

Drop Figma PNG exports here using kebab-case filenames. See
`/public/mascots/README.md` for the expected filename list. The app
references mascots through `src/lib/mascots.ts`, and
`<MascotImage name="...">` falls back to `harold.png` when a specific
mascot is missing.

### Team (`/public/team/`)

Founder headshots. One file per founder, lowercase, no spaces.

### Design references (`/docs/design-references/`)

The iPhone mocks the app is being built against. Treat these as the
source of truth for spacing, colors, typography, and motion.

## App flow

1. `/` — landing with "Let's Go!" CTA
2. `/onboarding` — 6-question intake (mornings, movement, what you
   stopped doing, average Tuesday, stress response, familiar patterns)
3. `/connect-apps` — optional wearable / health app connections
4. `/archetype` — archetype reveal with poetic tagline
5. `/hub` — daily Harold note, anchor activity, suggestions

## Tech

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS 4 + CSS variables (see `src/app/globals.css`)
- **Motion:** framer-motion
- **Backend:** Supabase (Auth, Postgres, Realtime, Storage)
- **Deploy:** Vercel (auto-deploys from `main`)

## Deployment

Pushing to `main` auto-deploys to the production Vercel URL. Feature
branches get their own preview URLs.
