# Audio System

The portfolio has a fully custom audio engine built on the Web Audio API with two independent channels (BGM + SFX), real-time frequency analysis, and a beat detector — all coordinated through Zustand stores and React hooks.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Zustand: audioStore                  │
│  isMuted · isSfxMuted · hasInteracted                   │
│  bgVolume · sfxVolume                                   │
│  Persisted: isMuted, isSfxMuted, bgVolume, sfxVolume    │
│  Ephemeral: hasInteracted (resets on page load)         │
└────────┬──────────────────┬──────────────────┬──────────┘
         │                  │                  │
    subscribes         subscribes         subscribes
         │                  │                  │
         ▼                  ▼                  ▼
┌─────────────┐   ┌──────────────────┐   ┌──────────┐
│  useSfx()   │   │ usePlaylistAudio │   │ Header / │
│ click/hover │   │ BGM + Analyser   │   │ MiniPlayer│
│    SFX      │   │                  │   │   UI     │
└─────────────┘   └────────┬─────────┘   └──────────┘
                           │
               exposes module-level ref
                           │
                           ▼
                  playlistAnalyserRef
                  AnalyserNode | null
                           │
              ┌────────────┴──────────────┐
              │                           │
              ▼                           ▼
     useBeatDetector()            HeroParticles (canvas)
     fixed threshold +            reads analyser directly
     cooldown beat fire           in rAF loop — no React
                                  state overhead
```

---

## Stores

### `audioStore.ts`
Zustand store with `persist` middleware.

| Field | Type | Persisted | Description |
|---|---|---|---|
| `isMuted` | boolean | yes | Master BGM mute |
| `isSfxMuted` | boolean | yes | SFX mute |
| `hasInteracted` | boolean | no | Browser autoplay gate — set on first user gesture |
| `bgVolume` | 0–1 | yes | Background music volume |
| `sfxVolume` | 0–1 | yes | Sound effects volume |

`hasInteracted` is intentionally not persisted — it resets on every page load to comply with the Web Audio API autoplay policy.

### `playlistStore.ts`
Manages playlist UI state.

| Field | Description |
|---|---|
| `currentIndex` | Active track index |
| `isPlaying` | Play / pause state |
| `currentTime` | Playback position (seconds) |
| `duration` | Track duration (seconds) |
| `registerSeek` | Bridge for programmatic seek from UI |

---

## Hooks

### `usePlaylistAudio`
**Location:** `src/hooks/usePlaylistAudio.ts`

The core BGM engine. Mounted once inside `Layout.tsx` and active for the lifetime of all inner pages.

**Responsibilities:**
- Creates a new `HTMLAudioElement` for each track change
- Handles play / pause, track advance on end, volume sync
- Auto-starts in Enhanced mode once `hasInteracted` is true
- Pauses on mute and resumes on unmute (restoring pre-mute state)
- Builds a Web Audio `AudioContext` + `AnalyserNode` (fftSize 256) and connects the element source through it
- Exports the analyser via a module-level ref: `playlistAnalyserRef`

**Module-level exports:**
```ts
export const playlistAnalyserRef: { current: AnalyserNode | null }
```

Any component or hook can import this ref and read frequency data without going through React state.

---

### `useBgAudio`
**Location:** `src/hooks/useBgAudio.ts`

Single-track looping BGM hook (used on the WelcomeScreen for ambient audio).

- Creates a looping `<audio>` element once `started && hasInteracted` is true
- Cleans up the element on stop or unmount
- Also builds an `AnalyserNode` (fftSize 256) for potential audio-reactive visuals
- Handles `crossOrigin = "anonymous"` and `AudioContext` resume (Safari)

---

### `useSfx`
**Location:** `src/hooks/useSfx.ts`

Plays short sound effects on user interaction.

- Creates two `HTMLAudioElement` instances for concurrency (overlapping SFX)
- Respects `hasInteracted`, `isSfxMuted`, `sfxVolume`
- API: `playClick()`, `playHover()`

---

### `useBeatDetector`
**Location:** `src/hooks/useBeatDetector.ts`

Real-time beat detection from the playlist analyser.

**Algorithm — Option A (fixed threshold + cooldown):**
1. Every animation frame: read `getByteFrequencyData` into a `Uint8Array`
2. Average the first `BASS_BINS` (10) bins → `energy` (0–255)
3. If `energy > THRESHOLD` and `now - lastBeat > COOLDOWN_MS`:
   - Set `isBeat = true`
   - Schedule `isBeat = false` after `FLASH_DURATION_MS`
   - Update `lastBeat` timestamp

**Tuning constants:**

| Constant | Default | Effect |
|---|---|---|
| `BASS_BINS` | 10 | How many low-frequency bins to average |
| `THRESHOLD` | 20 | Energy level (0–255) that counts as a beat |
| `COOLDOWN_MS` | 50 | Minimum ms between beats |
| `FLASH_DURATION_MS` | 100 | How long `isBeat` stays true |

Returns `boolean`. No side effects — purely reactive.

---

## Audio-Reactive Components

### `HeroParticles`
**Location:** `src/components/HeroParticles.tsx`

Canvas particle system that runs entirely inside a `requestAnimationFrame` loop — no React state updates, no re-renders.

**Each frame:**
1. Read `playlistAnalyserRef.current` → average first 6 FFT bins → `energy` (0–255)
2. Transparent fill (`rgba(0,0,0,0.08)`) — trails fade but persist
3. Spawn `floor((energy / 255) * 4)` new particles (capped at 300 total)
4. Always maintain at least 10 particles even during silence
5. Draw all alive particles, remove expired ones

**Particle motion — Lissajous curves:**
```
for k in 0..10:
    x += a1 * sin(a2 * vx)
    y += a1 * cos(a2 * vx)
    vx += gravity
```
`a1` (stroke length) scales with `energy`, `a2` is random per particle → unique curve per stroke.

**Color:** random hue from a vivid neon palette, 90–100% saturation, 50–75% lightness (louder = brighter). Alpha always ≥ 0.55.

**Limits:**
- Max 300 active particles
- Max life: 900 frames (15s at 60fps)
- Enhanced mode only — returns `null` in Light mode

---

## Interaction Flow

```
1. User lands on /  (WelcomeScreen)
   └─> selects mode → setHasInteracted(true)

2. Audio gates open:
   └─> usePlaylistAudio: creates Audio element, builds analyser graph
   └─> useSfx: allowed to play effects
   └─> MiniPlayer: becomes interactive

3. Enhanced mode auto-starts playback
   └─> playlistAnalyserRef.current becomes a live AnalyserNode
   └─> HeroParticles canvas starts reacting on /home
   └─> useBeatDetector returns live beat boolean

4. User mutes:
   └─> audioStore.isMuted = true
   └─> usePlaylistAudio: audio.volume = 0, sets isPlaying = false
   └─> useSfx: volume = 0
   └─> Analyser still runs (no audio output, but data available)

5. User unmutes:
   └─> Resumes only if it was playing before mute
```

---

## Key Design Decisions

**Why module-level ref for the analyser?**
`requestAnimationFrame` loops (canvas, etc.) need to read frequency data every frame without triggering React re-renders. A module-level ref is readable from anywhere — hooks, components, canvas loops — without any subscription cost.

**Why not store the analyser in Zustand?**
Zustand's `persist` middleware would attempt to serialize it. Non-serializable values require explicit exclusion via `partialize`. A module-level ref is simpler for a single shared mutable value that doesn't need reactive subscriptions.

**Why separate SFX and BGM volumes?**
Common UX pattern — users often want music quiet but sound effects at normal level (or vice versa). Two independent channels with separate mute toggles.

**Why `hasInteracted` is not persisted?**
The Web Audio API requires a user gesture on every page load before audio can play. Persisting `hasInteracted` would cause audio to attempt autoplay on the next visit, which browsers block. Resetting it each session ensures compliance.
