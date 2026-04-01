# Giorgos Ntoufas — Personal Portfolio

Interactive portfolio, reacting to myself


---

## Overview

The portfolio has two independent axes of configuration chosen at the welcome screen:

**Experience mode** (`visualMode` in `uiStore`) — controls audio and animations:

| Mode | Description |
|---|---|
| **Rich** | Background music autoplays, audio-reactive particle effects, spectrum visualizer, GSAP animations |
| **Simple** | No audio autoplay, no visual effects — content only |

**Theme** (`mode` in `uiStore`) — controls the color scheme only:

| Theme | Description |
|---|---|
| **Dark** | Dark backgrounds, neon accents, retro grid |
| **Light** | Bright backgrounds, clean neutral palette |

Both axes are independent — Rich mode works on both dark and light themes. Theme switching never affects audio or animations. Both selections persist across sessions via Zustand + localStorage.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19, TypeScript, Vite |
| UI | Material UI (MUI) v7, Emotion |
| Animation | Framer Motion, GSAP |
| State | Zustand (persisted to localStorage) |
| Routing | React Router v7 |
| Audio | Web Audio API — custom hooks |
| Forms / Email | React Hook Form, EmailJS |

---

## Project Structure

```
portfolio-source/
├── public/                      # Favicons, static assets
└── src/
    ├── App.tsx                  # Router, theme provider, route guards
    ├── pages/
    │   ├── WelcomeScreen.tsx    # Mode selection entry point
    │   ├── Home.tsx             # Hero, project slider, about snippet
    │   ├── Projects.tsx         # Filterable project grid
    │   └── About.tsx            # Bio, photo carousel, skills
    ├── components/
    │   ├── layout/              # Layout wrapper (header, footer, player)
    │   ├── player/              # MiniPlayer, PlaylistPanel
    │   ├── backgrounds/         # BackgroundStage (retro grid, etc.)
    │   ├── HeroParticles.tsx    # Audio-reactive canvas particle system
    │   ├── HomeProjectSlider.tsx
    │   ├── HomePhotoSlider.tsx
    │   ├── PhotoCarousel.tsx
    │   ├── ProjectSlider.tsx
    │   ├── GlobalFooter.tsx
    │   └── Header.tsx
    ├── hooks/
    │   ├── usePlaylistAudio.ts  # Playlist engine + Web Audio analyser
    │   ├── useBgAudio.ts        # Single-track BGM hook
    │   ├── useBeatDetector.ts   # Real-time bass beat detection
    │   └── useSfx.ts            # Click / hover SFX
    ├── store/
    │   ├── uiStore.ts           # Theme mode, visual mode, background type
    │   ├── audioStore.ts        # Mute, volume, interaction flag
    │   └── playlistStore.ts     # Current track, play state, seek bridge
    ├── data/
    │   ├── projects.ts          # Project entries with images and filters
    │   └── playlist.ts          # Music playlist metadata
    ├── assets/
    │   ├── img/me/              # Personal photos (real + AI-generated)
    │   └── img/projects/        # Project screenshots
    ├── config/
    │   ├── constants.ts
    │   ├── backgroundPresets.ts
    │   └── eases.ts
    └── theme/
        ├── darkTheme.ts
        └── lightTheme.ts
```

---

## Routing

```
/          → WelcomeGuard
             ├── welcome already seen  → redirect /home
             └── first visit           → WelcomeScreen (mode selection)

/home      → Layout → Home
/projects  → Layout → Projects
/about     → Layout → About
*          → redirect /
```

Inner pages are wrapped in `RequireWelcome` — redirects to `/` if the welcome flag (`portfolio_welcome_seen`) is missing from localStorage.

---

## Audio System

See [`docs/audio.md`](docs/audio.md) for the full architecture.

**Short version:**

- Background music autoplays in Rich mode after the first user interaction (browser autoplay policy compliance)
- `usePlaylistAudio` manages the active track and exposes a Web Audio `AnalyserNode` via a shared module-level ref (`playlistAnalyserRef`)
- `useBeatDetector` reads bass-frequency bins each animation frame and fires on energy spikes above a fixed threshold + cooldown
- `HeroParticles` reads the analyser directly inside its `requestAnimationFrame` loop — no React re-renders, zero state overhead
- SFX (click / hover) run through a separate `useSfx` hook with its own independent volume channel

---

## Audio-Reactive Hero

The hero section background in Enhanced mode runs a canvas-based **Lissajous particle system** driven by real-time audio:

- Bass energy (first 6 FFT bins, 0–255) maps to **spawn rate** (0–4 particles/frame) and **stroke length**
- Particles use a vivid neon palette — full 360° hue range, 90–100% saturation, 50–75% lightness
- Hard cap of **300 active particles** to keep performance in check
- Each particle expires after a maximum of **15 seconds**
- Trail persistence is controlled by a per-frame transparent fill (`rgba(0,0,0,0.08)`)
- Falls back to nothing in Light mode — no canvas rendered

---

## Getting Started

```bash
cd portfolio-source
npm install
npm run dev        # Vite dev server with HMR
```

```bash
npm run build      # tsc + vite build → dist/
npm run preview    # Preview production build locally
```

---

## Deployment

Manual FTP to SG Hosting:

```bash
# 1. Build
npm run build

# 2. Copy dist to local server mirror (PowerShell)
Copy-Item -Path 'dist\*' -Destination '..\giorgosn8.sg-host.com\public_html\' -Recurse -Force

# 3. Upload via WinSCP CLI (FTP)
#    Credentials live in sftp-config.json (not committed)
#    Remote target: /giorgosn8.sg-host.com/public_html
```

---

## Notes

- Path alias `@` maps to `src/` — use `@/components/...` style imports throughout
- MUI v7 is used — API differs from v5/v6 in places (theme structure, `Grid` props)
- `dist/` is gitignored — never edit it directly
- `sftp-config.json` contains FTP credentials — **not committed**
- Audio requires a user gesture before playing (Web Audio API autoplay policy)
- Zustand store shapes are versioned — check the `version` field before changing any persisted state shape
