import { useEffect, useRef, type RefObject } from "react";
import { useAudioStore } from "@/store/audioStore";

type DivRef = RefObject<HTMLDivElement>;

export function useBgAudio(params: {
    started: boolean;
    isMuted: boolean;
    src: string;
    gridRef: DivRef;
    overrideVolume?: number; // optional override instead of store bgVolume
}) {
    const { started, isMuted, src, gridRef, overrideVolume } = params;

    const hasInteracted = useAudioStore((s) => s.hasInteracted);
    const bgVolume = useAudioStore((s) => s.bgVolume);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioGraphMadeRef = useRef(false);

    const ctxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const rafIdRef = useRef<number>(0);

    // Create/teardown audio element
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
        a.preload = "auto"; // ✅ help initial play
        a.crossOrigin = "anonymous"; // ✅ ensure analyser works with remote files
        a.volume = isMuted ? 0 : clamp01(overrideVolume ?? bgVolume);
        a.play().catch(() => {}); // ignore autoplay errors
        audioRef.current = a;

        return () => {
            a.pause();
            a.src = "";
            if (audioRef.current === a) audioRef.current = null;
        };
    }, [started, hasInteracted, src, isMuted, bgVolume, overrideVolume]);

    // Build analyser graph once per audio element
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

            // ✅ resume context if suspended (Safari)
            if (ctx.state === "suspended") {
                ctx.resume().catch(() => {});
            }

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

        const data = new Uint8Array(analyser.frequencyBinCount);

        const loop = () => {
            if (document.visibilityState === "hidden") {
                rafIdRef.current = requestAnimationFrame(loop);
                return;
            }
            const el = gridRef.current;
            if (!analyser || !el) {
                rafIdRef.current = requestAnimationFrame(loop);
                return;
            }
            analyser.getByteFrequencyData(data);
            let sum = 0;
            for (let i = 2; i < 32; i++) sum += data[i];
            const norm = Math.min(1, (sum / 30) / 180);
            el.style.setProperty("--grid-audio-boost", String(0.2 + norm * 0.8));
            el.style.setProperty("--grid-glow", String(0.6 + norm * 0.8));
            rafIdRef.current = requestAnimationFrame(loop);
        };
        rafIdRef.current = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(rafIdRef.current);
            analyser?.disconnect();
            ctx?.close().catch(() => {});
            analyserRef.current = null;
            ctxRef.current = null;
            audioGraphMadeRef.current = false;
        };
    }, [started, gridRef]);

    // Keep volume in sync with store/override/mute, clamped to [0,1]
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : clamp01(overrideVolume ?? bgVolume);
        }
    }, [isMuted, bgVolume, overrideVolume]);

    return { audioRef };
}

function clamp01(v: number) {
    return Math.max(0, Math.min(1, v));
}
