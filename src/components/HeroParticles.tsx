import { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { useUiStore } from "@/store/uiStore";
import { playlistAnalyserRef } from "@/hooks/usePlaylistAudio";

const MAX_PARTICLES = 300;
const MAX_LIFE_FRAMES = 15 * 60; // 15s at 60fps
const BASS_BINS = 6;

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    gravity: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
    a1: number;
    a2: number;
    a3: number;
    a4: number;
}

let _nextId = 0;

// Psychedelic palette — pick a random vivid hue then offset a second one
// for a two-tone neon gradient feel per stroke
const VIVID_HUES = [0, 30, 60, 90, 120, 160, 190, 210, 260, 290, 320, 345];

function randomVividColor(energy: number): string {
    const h = VIVID_HUES[Math.floor(Math.random() * VIVID_HUES.length)]
        + Math.floor(Math.random() * 30) - 15; // slight drift
    const s = 90 + Math.random() * 10;         // 90–100% saturation
    const l = 50 + (energy / 255) * 25;        // 50–75% lightness, louder = brighter
    const a = 0.55 + Math.random() * 0.45;     // 0.55–1.0 alpha — nothing dark
    return `hsla(${h},${s}%,${l}%,${a})`;
}

function createParticle(w: number, h: number, energy: number): Particle {
    return {
        id: _nextId++,
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        gravity: 1,
        life: 0,
        maxLife: Math.random() * MAX_LIFE_FRAMES,
        color: randomVividColor(energy),
        size: 0.1,
        a1: 40 + energy * 0.4,
        a2: Math.random() * 4 + 1,
        a3: 0,
        a4: 1,
    };
}

function drawParticle(
    ctx: CanvasRenderingContext2D,
    p: Particle
): boolean {
    ctx.beginPath();
    ctx.lineWidth = p.size;
    ctx.moveTo(p.x, p.y);

    for (let k = 0; k < 10; k++) {
        p.x += p.a1 * Math.sin(p.a2 * p.vx) + p.a3 * p.vx * Math.sin(p.a4 * p.vx);
        p.y += p.a1 * Math.cos(p.a2 * p.vx) + p.a3 * p.vx * Math.cos(p.a4 * p.vx);
        p.vy += p.gravity;
        p.vx += p.gravity;
        ctx.lineTo(p.x, p.y);
    }

    ctx.strokeStyle = p.color;
    ctx.stroke();

    p.life++;
    return p.life < p.maxLife;
}

function getBassEnergy(analyser: AnalyserNode | null): number {
    if (!analyser) return 0;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < BASS_BINS; i++) sum += data[i];
    return sum / BASS_BINS; // 0–255
}

export default function HeroParticles() {
    const isRich = useUiStore((s) => s.visualMode === "rich");
    const theme = useTheme();
    const isLight = theme.palette.mode === "light";
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!isRich) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let rafId: number;
        const particles = new Map<number, Particle>();

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const loop = () => {
            rafId = requestAnimationFrame(loop);

            const w = canvas.width;
            const h = canvas.height;
            const energy = getBassEnergy(playlistAnalyserRef.current);

            // Transparent fill — trails persist but fade slightly
            ctx.fillStyle = isLight ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
            ctx.fillRect(0, 0, w, h);

            // Spawn: 0–4 particles/frame based on energy, respect cap
            const spawnCount = Math.floor((energy / 255) * 4);
            for (let i = 0; i < spawnCount; i++) {
                if (particles.size >= MAX_PARTICLES) break;
                const p = createParticle(w, h, energy);
                particles.set(p.id, p);
            }

            // Spawn at least 1 even when silent so canvas isn't dead
            if (particles.size < 10) {
                const p = createParticle(w, h, 0);
                particles.set(p.id, p);
            }

            // Draw & prune dead particles
            for (const [id, p] of particles) {
                const alive = drawParticle(ctx, p);
                if (!alive) particles.delete(id);
            }
        };

        loop();

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", resize);
        };
    }, [isRich, isLight]);

    if (!isRich) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                display: "block",
                pointerEvents: "none",
                zIndex: 0,
                opacity: isLight ? 0.3 : 1,
            }}
        />
    );
}
