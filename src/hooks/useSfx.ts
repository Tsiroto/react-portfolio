import { useRef, useEffect, useCallback } from "react";
import { useAudioStore } from "@/store/audioStore";

export function useSfx(src: string, volume = 0.5) {
    const elRef = useRef<HTMLAudioElement | null>(null);
    const { isMuted, hasInteracted } = useAudioStore();

    useEffect(() => {
        elRef.current = new Audio(src);
        elRef.current.volume = volume;
        return () => { elRef.current = null; };
    }, [src, volume]);

    const play = useCallback(() => {
        if (isMuted || !hasInteracted || !elRef.current) return;
        const el = elRef.current;
        el.currentTime = 0;
        el.play().catch(() => {});
    }, [isMuted, hasInteracted]);

    return play;
}
