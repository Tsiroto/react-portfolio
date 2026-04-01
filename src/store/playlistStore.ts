import { create } from "zustand";
import { playlist } from "@/data/playlist";

type PlaylistState = {
    currentIndex: number;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    isPanelOpen: boolean;

    // Imperative seek bridge — registered by usePlaylistAudio
    seekTo: ((time: number) => void) | null;
    registerSeek: (fn: (time: number) => void) => void;

    // Actions
    setIsPlaying: (v: boolean) => void;
    togglePlay: () => void;
    playTrack: (index: number) => void;
    nextTrack: () => void;
    prevTrack: () => void;
    setCurrentTime: (t: number) => void;
    setDuration: (d: number) => void;
    togglePanel: () => void;
    openPanel: () => void;
    closePanel: () => void;
};

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
    currentIndex: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isPanelOpen: false,
    seekTo: null,

    registerSeek: (fn) => set({ seekTo: fn }),

    setIsPlaying: (v) => set({ isPlaying: v }),
    togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

    playTrack: (index) => {
        set({ currentIndex: index, currentTime: 0, isPlaying: true });
    },

    nextTrack: () => {
        const next = (get().currentIndex + 1) % playlist.length;
        set({ currentIndex: next, currentTime: 0, isPlaying: true });
    },

    prevTrack: () => {
        const { currentTime, currentIndex } = get();
        // If more than 3s in, restart current track instead of going back
        if (currentTime > 3) {
            get().seekTo?.(0);
            set({ currentTime: 0 });
        } else {
            const prev = (currentIndex - 1 + playlist.length) % playlist.length;
            set({ currentIndex: prev, currentTime: 0, isPlaying: true });
        }
    },

    setCurrentTime: (t) => set({ currentTime: t }),
    setDuration: (d) => set({ duration: d }),

    togglePanel: () => set((s) => ({ isPanelOpen: !s.isPanelOpen })),
    openPanel: () => set({ isPanelOpen: true }),
    closePanel: () => set({ isPanelOpen: false }),
}));
