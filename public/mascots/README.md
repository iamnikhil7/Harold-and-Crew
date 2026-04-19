# Mascots

Drop the Harold & Crew mascot PNGs here. The website reads from this folder
via `src/lib/mascots.ts`.

## Naming convention

Export each mascot from Figma as PNG @3x with a transparent background.
Use kebab-case, no spaces.

### Expected files (the app looks for these first)

| File | Used for |
|---|---|
| `harold.png` | Main Harold mascot — hero, onboarding intro, headers, hub |
| `harold-neutral.png` *(optional)* | Default Harold expression |
| `harold-happy.png` *(optional)* | Harold when resisting a pause / thriving |
| `harold-stressed.png` *(optional)* | Harold when stress is accumulating |
| `harold-sleepy.png` *(optional)* | Harold when recovery is low |
| `crew-pink.png` | Pink crew member (landing top-left) |
| `crew-yellow.png` | Yellow crew member (landing top-left) |
| `crew-white.png` | White crew member (landing top-left) |
| `crew-blue.png` | Blue crew member (archetype reveal) |

If an optional file is missing, the site falls back to `harold.png`.

## Adding new mascots

1. Drop the PNG in `/public/mascots/`
2. Add an entry to `src/lib/mascots.ts`
3. Reference it in a screen via `<MascotImage name="harold-happy" .../>`

No code change needed if you use one of the expected filenames above.
