import { useEffect, useRef, useState } from "react";

const BASS_BINS = 10;          // first 5 FFT bins = sub-bass / kick range
const THRESHOLD = 20;        // 0–255 — energy level that counts as a beat
const COOLDOWN_MS = 50;      // minimum ms between two beats
const FLASH_DURATION_MS = 100; // how long isBeat stays true after a hit

export function useBeatDetector(
    analyserRef: { current: AnalyserNode | null }
): boolean {
    const [isBeat, setIsBeat] = useState(false);
    const rafRef = useRef<number>(0);
    const lastBeatRef = useRef<number>(0);
    const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const tick = () => {
            rafRef.current = requestAnimationFrame(tick);

            const analyser = analyserRef.current;
            if (!analyser) return;

            const data = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(data);

            let sum = 0;
            for (let i = 0; i < BASS_BINS; i++) sum += data[i];
            const energy = sum / BASS_BINS;

            const now = performance.now();
            if (energy > THRESHOLD && now - lastBeatRef.current > COOLDOWN_MS) {
                lastBeatRef.current = now;

                setIsBeat(true);

                if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
                flashTimerRef.current = setTimeout(() => setIsBeat(false), FLASH_DURATION_MS);
            }
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(rafRef.current);
            if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
        };
    }, [analyserRef]);

    return isBeat;
}
