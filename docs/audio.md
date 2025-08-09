# 🎧 Audio System Overview

Your app now has a centralized, persistent audio state + cleanly separated UI controls + two independent volume channels (SFX & BGM), all fully type-safe and SSR-safe.

---

## 1. Global State — `audioStore.ts`
- **Tech:** Zustand + persist middleware
- **State:**
  - `isMuted`: master mute toggle
  - `hasInteracted`: session-only flag (browser autoplay compliance)
  - `sfxVolume`: [0..1], persisted
  - `bgVolume`: [0..1], persisted
- **Actions:**
  - `setMuted`, `toggleMuted`
  - `setHasInteracted`
  - `setSfxVolume` & `setBgVolume` (clamped)
  - `reset` (full reset to defaults)
- **Persistence:** `isMuted`, `sfxVolume`, `bgVolume` in `localStorage` (SSR-safe with no-op storage fallback)
- **Not Persisted:** `hasInteracted` — resets every full page load

---

## 2. SFX Hook — `useSfx.ts`
- **Purpose:** play short sound effects (click/hover)
- **Behavior:**
  - Creates two independent `<audio>` elements for concurrency
  - Respects `hasInteracted` (no sound before user gesture)
  - Respects `isMuted` and `sfxVolume` (live updates)
- **Public API:** `playClick()`, `playHover()`

---

## 3. BGM Hook — `useBgAudio.ts`
- **Purpose:** handle background music & audio-reactive visuals
- **Behavior:**
  - Creates a looping `<audio>` once started
  - Autoplays after first interaction (avoids autoplay block)
  - Respects `isMuted` and `bgVolume` (or overrideVolume)
  - Sets `preload="auto"`, `crossOrigin="anonymous"`
  - Resumes suspended `AudioContext` (Safari fix)
  - Uses `AnalyserNode` to drive CSS variables on `gridRef`
    (`--grid-audio-boost` & `--grid-glow`)
  - Stops & cleans up on unmount or when stopped
- **Optimization:** skips analyser loop when tab is hidden

---

## 4. AudioToggle Component
- **Purpose:** quick mute/unmute button
- **Behavior:**
  - Reads `isMuted` & `hasInteracted` from store
  - Calls `toggleMuted()` directly
  - Hides until first interaction
  - Fully MUI-styled + constants for labels/tooltips

---

## 5. VolumeMenu Component
- **Purpose:** popup for audio preferences
- **UI:**
  - Popover triggered by a small settings icon
  - Contains:
    - Master mute switch
    - SFX Volume slider
    - Background Volume slider
  - Sliders update store in real time (affects SFX & BGM immediately)
- **Positioning:** fixed near `AudioToggle`
- **Extensible:** can be replaced with a Drawer later for full settings panel

---

## 6. Interaction Flow
1. **On first click/tap/keypress** (in WelcomeScreen or similar):
   - `setHasInteracted(true)` in store
   - Audio components become visible
   - BGM can start autoplay, SFX hooks allowed to play
2. **Muting via AudioToggle or VolumeMenu** instantly updates store & all subscribers (SFX, BGM)
3. **Sliders in VolumeMenu** update `sfxVolume` / `bgVolume`, reflected in real time

---

## 7. Key Advantages
- Single source of truth for all audio state
- Type-safe & SSR-safe
- Volume separation (no “all or nothing” volume control)
- Persisted user preferences
- Autoplay compliance (no accidental sound before interaction)
- Scalable (easy to add more SFX or audio-reactive elements)

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                           Audio Layer                            │
├──────────────────────────────────────────────────────────────────┤
│                   Zustand Store: useAudioStore                   │
│  ──────────────────────────────────────────────────────────────  │
│  State: isMuted | hasInteracted | sfxVolume | bgVolume           │
│  Actions: setMuted · toggleMuted · setHasInteracted ·            │
│           setSfxVolume · setBgVolume · reset                     │
│  Persisted: isMuted, sfxVolume, bgVolume                         │
│  Ephemeral: hasInteracted                                        │
└──────────────────────────────────────────────────────────────────┘
            ▲                          ▲                      ▲
            │                          │                      │
         subscribes                 subscribes             subscribes
            │                          │                      │
            │                          │                      │
┌─────────────────────┐     ┌──────────────────────┐   ┌──────────────────────┐
│   AudioToggle UI    │     │     VolumeMenu       │   │      useSfx()        │
│  (IconButton, MUI)  │     │  (Popover + Sliders) │   │  (click/hover SFX)   │
│  - reads: isMuted   │     │  - reads: isMuted,   │   │  - reads: isMuted,   │
│          hasInter.. │     │           sfxVolume, │   │           sfxVolume, │
│  - calls: toggleMuted│    │           bgVolume   │   │           hasInter.. │
│  - hidden until      │    │  - calls: setMuted,  │   │  - plays after       │
│    hasInteracted     │    │          setSfxVolume│   │    first interaction │
└─────────┬───────────┘    │          setBgVolume  │   └──────────┬───────────┘
          │                └──────────────────────┘              │
          │                                                      │
          │                      subscribes                      │
          │                                                      │
          │                             ▲                        │
          │                             │                        │
          │                        ┌──────────┐                  │
          └──────────────────────► │ useBgAudio│ ◄───────────────┘
                                   │ (BGM +    │
                                   │  Analyser)│
                                   │ - reads: isMuted, bgVolume,
                                   │           hasInteracted
                                   │ - sets CSS vars on gridRef
                                   └──────────┘
```

---

## First-interaction sequence
```
User click/keypress
   │
   ├─> WelcomeScreen: setHasInteracted(true)
   │
   ├─> AudioToggle now renders (was gated by hasInteracted)
   │
   ├─> useBgAudio starts (creates <audio>, resumes AudioContext)
   │       └─ volume = isMuted ? 0 : bgVolume
   │
   └─> useSfx allowed to play effects (click/hover), volume = isMuted ? 0 : sfxVolume
```

## When user changes settings
```
VolumeMenu slider (SFX/BGM) ──► setSfxVolume / setBgVolume ──►
    useSfx / useBgAudio react immediately (volumes update live)

AudioToggle or Mute switch ──► toggle/setMuted ──►
    all subscribers (useSfx/useBgAudio/UI) reflect mute instantly
```
