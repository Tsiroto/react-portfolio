import { useCallback, useEffect, useRef, useState } from "react";
import RetroGrid from "../components/welcome/RetroGrid";
import "../styles/welcome.css";
import type { WelcomeScreenProps } from "@/types/types";

import { Box, Button, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

import WelcomeLoader from "../components/welcome/WelcomeLoader";
import GlitchTypingText from "../components/welcome/GlitchTypingText";

import { DURATIONS, STRINGS } from "../config/constants";

import bgMusic from "@/assets/test-bg-audio.mp3";
import sfxAccept from "@/assets/accept.mp3";

const WelcomeScreen = ({ onModeChange }: WelcomeScreenProps) => {
    const [started, setStarted] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [glitchVisible, setGlitchVisible] = useState(true);

    const bgAudioRef = useRef<HTMLAudioElement | null>(null);
    const sfxRef = useRef<HTMLAudioElement | null>(null);
    const hoverSfxRef = useRef<HTMLAudioElement | null>(null);
    const lastHoverTsRef = useRef(0);

    // Move this ABOVE the analyser effect so it's definitely in scope
    const gridWrapRef = useRef<HTMLDivElement | null>(null);
    const audioGraphMadeRef = useRef(false);

    const handleStart = useCallback(() => {
        if (started) return;
        setStarted(true);
        setGlitchVisible(false);

        if (!bgAudioRef.current) {
            const audio = new Audio(bgMusic);
            audio.loop = true;
            audio.volume = isMuted ? 0 : 0.5;
            audio.play().catch((err) => console.warn("Autoplay blocked:", err));
            bgAudioRef.current = audio;
        }
        // Loader will flip showOptions via onComplete
    }, [isMuted, started]);

    // Build analyser tied to the SAME bgAudio
    useEffect(() => {
        if (!started || !bgAudioRef.current || audioGraphMadeRef.current) return;

        let rafId: number;
        let audioCtx: AudioContext | null = null;
        let analyser: AnalyserNode | null = null;
        let source: MediaElementAudioSourceNode | null = null;

        try {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            source = audioCtx.createMediaElementSource(bgAudioRef.current);
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256; // 128 bins
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
        } catch (e) {
            console.warn("AudioContext init failed:", e);
            return;
        }

        audioGraphMadeRef.current = true;
        const data = new Uint8Array(analyser.frequencyBinCount);

        const loop = () => {
            if (!analyser || !gridWrapRef.current) {
                rafId = requestAnimationFrame(loop);
                return;
            }
            analyser.getByteFrequencyData(data);

            // Simple low-mid energy
            let sum = 0;
            const low = 2, high = 32;
            for (let i = low; i < high; i++) sum += data[i];
            const avg = sum / (high - low);        // 0..255
            const norm = Math.min(1, avg / 180);   // tame

            gridWrapRef.current.style.setProperty("--grid-audio-boost", (0.2 + norm * 0.8).toString());
            gridWrapRef.current.style.setProperty("--grid-glow", (0.6 + norm * 0.8).toString());

            rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(rafId);
            // keep audioCtx alive while on this screen
        };
    }, [started]);

    const playSfx = useCallback(() => {
        if (!isMuted && sfxRef.current) {
            sfxRef.current.currentTime = 0;
            sfxRef.current.play().catch((err) => console.warn("SFX blocked:", err));
        }
    }, [isMuted]);

    const playHoverSfx = useCallback(() => {
        if (!started || isMuted || !hoverSfxRef.current) return;
        const now = performance.now();
        if (now - lastHoverTsRef.current < 120) return;
        lastHoverTsRef.current = now;

        const el = hoverSfxRef.current;
        el.currentTime = 0;
        el.play().catch((err) => console.warn("Hover SFX blocked:", err));
    }, [started, isMuted]);

    const toggleMute = () => {
        const newMuteState = !isMuted;
        setIsMuted(newMuteState);
        if (bgAudioRef.current) {
            bgAudioRef.current.volume = newMuteState ? 0 : 0.5;
        }
    };

    useEffect(() => {
        sfxRef.current = new Audio(sfxAccept);
        sfxRef.current.volume = 0.5;

        hoverSfxRef.current = new Audio(sfxAccept);
        hoverSfxRef.current.volume = 0.35;

        return () => {
            if (bgAudioRef.current) {
                bgAudioRef.current.pause();
                bgAudioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (started) return;

        const trigger = () => {
            playSfx();
            handleStart();
        };

        const onClick = () => trigger();
        const onKey = () => trigger();

        window.addEventListener("click", onClick);
        window.addEventListener("keydown", onKey);

        return () => {
            window.removeEventListener("click", onClick);
            window.removeEventListener("keydown", onKey);
        };
    }, [handleStart, playSfx, started]);

    return (
        <Box
            sx={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                bgcolor: "black",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            {/* RETRO GRID — behind everything */}
            {started && (
                <motion.div
                    ref={gridWrapRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showOptions ? 0.9 : 0.4 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 0,
                        pointerEvents: "none",
                    }}
                >
                    <RetroGrid speedSec={8} lineColor="#00d6fc" />
                </motion.div>
            )}

            {/* Before start background */}
            {!started && <div className="ambient-background" />}

            {/* Mute Toggle */}
            {started && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{ position: "absolute", top: 16, right: 16, zIndex: 3 }}
                >
                    <IconButton
                        onClick={toggleMute}
                        sx={{ color: "#00d6fc" }}
                        aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
                        onMouseEnter={playHoverSfx}
                        onFocus={playHoverSfx}
                    >
                        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                    </IconButton>
                </motion.div>
            )}

            {/* Glitch prompt */}
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: glitchVisible ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                style={{ zIndex: 2 }}
            >
                {!started && <GlitchTypingText text={STRINGS.pressEnter} />}
            </motion.div>

            {/* Loader */}
            {started && !showOptions && (
                <div style={{ position: "relative", zIndex: 2 }}>
                    <WelcomeLoader
                        duration={DURATIONS.loadingDefault}
                        onComplete={() => setShowOptions(true)}
                    />
                </div>
            )}

            {/* Mode buttons */}
            {showOptions && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    style={{ display: "flex", gap: "1.5rem", marginTop: "2rem", zIndex: 2 }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            playSfx();
                            onModeChange("light");
                        }}
                        onMouseEnter={playHoverSfx}
                        onFocus={playHoverSfx}
                        sx={{ width: 150 }}
                    >
                        Light
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            playSfx();
                            onModeChange("enhanced");
                        }}
                        onMouseEnter={playHoverSfx}
                        onFocus={playHoverSfx}
                        sx={{ width: 150 }}
                    >
                        Enhanced
                    </Button>
                </motion.div>
            )}
        </Box>
    );
};

export default WelcomeScreen;
