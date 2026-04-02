import { useMemo, useCallback, useEffect } from "react";
import buttonWav from "@/assets/sfx/button.wav";
import disabledWav from "@/assets/sfx/disabled.wav";
import swipeWav from "@/assets/sfx/swipe_05.wav";
import transitionUpWav from "@/assets/sfx/transition_up.wav";
import transitionDownWav from "@/assets/sfx/transition_down.wav";
import acceptMp3 from "@/assets/accept.mp3";
import { useAudioStore } from "@/store/audioStore";
import { useUiStore } from "@/store/uiStore";

export function useSfx() {
    const hasInteracted = useAudioStore((s) => s.hasInteracted);
    const isSfxMuted = useAudioStore((s) => s.isSfxMuted);
    const sfxVolume = useAudioStore((s) => s.sfxVolume);
    const isRich = useUiStore((s) => s.visualMode === "rich");

    const button        = useMemo(() => new Audio(buttonWav), []);
    const hover         = useMemo(() => new Audio(disabledWav), []);
    const swipe         = useMemo(() => new Audio(swipeWav), []);
    const menuOpen      = useMemo(() => new Audio(transitionUpWav), []);
    const menuClose     = useMemo(() => new Audio(transitionDownWav), []);
    const accept        = useMemo(() => new Audio(acceptMp3), []);

    useEffect(() => {
        const vol = isSfxMuted ? 0 : sfxVolume;
        [button, hover, swipe, menuOpen, menuClose, accept].forEach((a) => { a.volume = vol; });
    }, [isSfxMuted, sfxVolume, button, hover, swipe, menuOpen, menuClose, accept]);

    const play = useCallback((audio: HTMLAudioElement) => {
        if (!hasInteracted || isSfxMuted || !isRich) return;
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }, [hasInteracted, isSfxMuted, isRich]);

    const playClick     = useCallback(() => play(button),    [play, button]);
    const playHover     = useCallback(() => play(hover),     [play, hover]);
    const playSwipe     = useCallback(() => play(swipe),     [play, swipe]);
    const playMenuOpen  = useCallback(() => play(menuOpen),  [play, menuOpen]);
    const playMenuClose = useCallback(() => play(menuClose), [play, menuClose]);
    const playAccept    = useCallback(() => play(accept),    [play, accept]);

    return { playClick, playHover, playSwipe, playMenuOpen, playMenuClose, playAccept };
}
