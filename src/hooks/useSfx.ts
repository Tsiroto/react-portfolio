import { useMemo, useCallback, useEffect } from "react";
import clickMp3 from "@/assets/accept.mp3";
import { useAudioStore } from "@/store/audioStore";

export function useSfx() {
    const hasInteracted = useAudioStore((s) => s.hasInteracted);
    const isMuted = useAudioStore((s) => s.isMuted);
    const sfxVolume = useAudioStore((s) => s.sfxVolume);

    // Create independent audio elements for concurrency
    const click = useMemo<HTMLAudioElement>(() => new Audio(clickMp3), []);
    const hover = useMemo<HTMLAudioElement>(() => new Audio(clickMp3), []);

    useEffect(() => {
        const effective = isMuted ? 0 : sfxVolume;
        click.volume = effective;
        hover.volume = effective;
    }, [isMuted, sfxVolume, click, hover]);

    const playClick = useCallback(() => {
        if (!hasInteracted) return; // obey autoplay UX
        click.currentTime = 0;
        click.play().catch(() => {});
    }, [click, hasInteracted]);

    const playHover = useCallback(() => {
        if (!hasInteracted) return;
        hover.currentTime = 0;
        hover.play().catch(() => {});
    }, [hover, hasInteracted]);

    return { playClick, playHover };
}
