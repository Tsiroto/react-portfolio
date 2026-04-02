import { useEffect, useRef, useCallback } from "react";
import { useAudioStore } from "@/store/audioStore";

export function useBgAudio(params: {
    started: boolean;
    isMuted: boolean;
    src: string;
    overrideVolume?: number;
}) {
    const { started, isMuted, src, overrideVolume } = params;

    const hasInteracted = useAudioStore((s) => s.hasInteracted);
    const bgVolume = useAudioStore((s) => s.bgVolume);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const fadeRafRef = useRef<number | null>(null);

    const latest = useRef({ isMuted, bgVolume, overrideVolume });

    useEffect(() => {
        latest.current.isMuted = isMuted;
        latest.current.bgVolume = bgVolume;
        latest.current.overrideVolume = overrideVolume;

        if (audioRef.current) {
            audioRef.current.volume = latestVolume(latest.current);
        }
    }, [isMuted, bgVolume, overrideVolume]);

    useEffect(() => {
        if (!(started && hasInteracted)) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
            }
            return;
        }

        const a = new Audio(src);
        a.loop = true;
        a.preload = "auto";
        a.volume = latestVolume(latest.current);
        a.play().catch(() => {});
        audioRef.current = a;

        return () => {
            if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
            a.pause();
            a.src = "";
            if (audioRef.current === a) audioRef.current = null;
        };
    }, [started, hasInteracted, src]);

    // Fade volume to 0 over `ms` milliseconds
    const fadeOut = useCallback((ms: number) => {
        const a = audioRef.current;
        if (!a) return;
        if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
        const startVol = a.volume;
        const startTime = performance.now();
        const tick = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / ms, 1);
            a.volume = startVol * (1 - progress);
            if (progress < 1) {
                fadeRafRef.current = requestAnimationFrame(tick);
            }
        };
        fadeRafRef.current = requestAnimationFrame(tick);
    }, []);

    return { audioRef, analyserRef, fadeOut };
}

function clamp01(v: number | undefined) {
    return Math.max(0, Math.min(1, v ?? 0));
}

function latestVolume(latest: {
    isMuted: boolean;
    bgVolume: number;
    overrideVolume: number | undefined;
}) {
    return latest.isMuted ? 0 : clamp01(latest.overrideVolume ?? latest.bgVolume);
}
