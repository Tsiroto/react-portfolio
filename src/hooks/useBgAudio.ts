import { useEffect, useRef } from "react";
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
    const audioGraphMadeRef = useRef(false);
    const ctxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);

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
        a.crossOrigin = "anonymous";
        a.volume = latestVolume(latest.current);
        a.play().catch(() => {});
        audioRef.current = a;

        return () => {
            a.pause();
            a.src = "";
            if (audioRef.current === a) audioRef.current = null;
        };
    }, [started, hasInteracted, src]);

    // Build analyser graph — kept for audio-reactive visuals
    useEffect(() => {
        const audioEl = audioRef.current;
        if (!started || !audioEl || audioGraphMadeRef.current) return;

        const AudioContextCtor =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext })
                .webkitAudioContext;

        if (!AudioContextCtor) return;

        let ctx: AudioContext | null = null;
        let analyser: AnalyserNode | null = null;

        try {
            ctx = new AudioContextCtor();
            if (ctx.state === "suspended") ctx.resume().catch(() => {});
            const source = ctx.createMediaElementSource(audioEl);
            analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyser.connect(ctx.destination);
        } catch {
            return;
        }

        ctxRef.current = ctx;
        analyserRef.current = analyser;
        audioGraphMadeRef.current = true;

        return () => {
            analyser?.disconnect();
            ctx?.close().catch(() => {});
            analyserRef.current = null;
            ctxRef.current = null;
            audioGraphMadeRef.current = false;
        };
    }, [started, src]);

    return { audioRef, analyserRef };
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
