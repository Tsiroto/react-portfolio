import { useMemo, useCallback, useEffect } from "react";
import clickMp3 from "@/assets/accept.mp3";
import { useAudioStore } from "@/store/audioStore";

export function useSfx() {
    const hasInteracted = useAudioStore((s) => s.hasInteracted);
    const isSfxMuted = useAudioStore((s) => s.isSfxMuted);
    const sfxVolume = useAudioStore((s) => s.sfxVolume);

    // Create independent audio elements for concurrency
    const click = useMemo<HTMLAudioElement>(() => new Audio(clickMp3), []);
    const hover = useMemo<HTMLAudioElement>(() => new Audio(clickMp3), []);

    useEffect(() => {
        const effective = isSfxMuted ? 0 : sfxVolume;
        click.volume = effective;
        hover.volume = effective;
    }, [isSfxMuted, sfxVolume, click, hover]);

    const playClick = useCallback(() => {
        if (!hasInteracted || isSfxMuted) return;
        click.currentTime = 0;
        click.play().catch(() => {});
    }, [click, hasInteracted, isSfxMuted]);

    const playHover = useCallback(() => {
        if (!hasInteracted || isSfxMuted) return;
        hover.currentTime = 0;
        hover.play().catch(() => {});
    }, [hover, hasInteracted, isSfxMuted]);

    return { playClick, playHover };
}
