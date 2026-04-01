import { useRef, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useAudioStore } from "@/store/audioStore";
import { useUiStore } from "@/store/uiStore";

import { useSfx } from "@/hooks/useSfx";
import { useBgAudio } from "@/hooks/useBgAudio";

import WelcomeLoader from "@/components/welcome/WelcomeLoader";
import ModeButtons from "@/components/welcome/ModeButtons";
import StartPrompt from "@/components/welcome/StartPrompt";

import bgm from "@/assets/test-bg-audio.mp3";
import { DURATIONS, TRANSITIONS, STRINGS } from "@/config/constants";
import type { Mode, VisitorMode, WelcomeScreenProps } from "@/types/types";
import { THEME_STORAGE_KEY, visitorToTheme, themeToVisitor } from "@/utils/modeMapping";

export default function WelcomeScreen({ onModeChange }: WelcomeScreenProps) {
    const navigate = useNavigate();

    // Global audio state
    const hasInteracted = useAudioStore((s) => s.hasInteracted);
    const setHasInteracted = useAudioStore((s) => s.setHasInteracted);
    const isMuted = useAudioStore((s) => s.isMuted);

    // Intro phase state ("idle" | "loading" | "select" | "exiting")
    const introPhase = useUiStore((s) => s.introPhase);
    const setIntroPhase = useUiStore((s) => s.setIntroPhase);

    // Theme mode setter ("light" | "dark")
    const mode = useUiStore((s) => s.mode);
    const setMode = useUiStore((s) => s.setMode);
    const setVisualMode = useUiStore((s) => s.setVisualMode);

    // Background control
    const showBackground = useUiStore((s) => s.showBackground);
    const setBackgroundVisible = useUiStore((s) => s.setBackgroundVisible);

    // SFX
    const { playClick, playHover } = useSfx();

    // Background audio
    useBgAudio({
        started: hasInteracted && introPhase !== "idle",
        isMuted,
        src: bgm,
    });

    // Focus container (a11y)
    const rootRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        rootRef.current?.focus();
    }, []);

    // Show/hide background based on interaction
    useEffect(() => {
        setBackgroundVisible(hasInteracted);
    }, [hasInteracted, setBackgroundVisible]);

    // Derived UI flags
    const isIdle = introPhase === "idle";
    const showLoader = hasInteracted && introPhase === "loading";
    const showModeSelect = hasInteracted && introPhase === "select";
    const isExiting = introPhase === "exiting";

    // Click anywhere during idle → start the flow
    const handleStart = () => {
        if (!isIdle) return;
        setHasInteracted(true);
        setIntroPhase("loading");
    };

    // Loader completion → go to select
    const handleLoaderComplete = () => setIntroPhase("select");

    // Navigate after exit animation
    const [pendingNavigate, setPendingNavigate] = useState(false);

    const handleSelectVisitorMode = (visitorMode: VisitorMode) => {
        const themeMode: Mode = visitorToTheme(visitorMode);
        playClick();

        try {
            localStorage.setItem(THEME_STORAGE_KEY, themeMode);
            localStorage.setItem("portfolio_welcome_seen", "true");
        } catch {
            /* ignore */
        }

        setMode(themeMode);
        setVisualMode(visitorMode === "enhanced" ? "rich" : "simple");
        onModeChange?.(themeMode);

        // Set the background type for the portfolio page
        showBackground(visitorMode === "enhanced" ? "ambient" : "minimal");

        setIntroPhase("exiting");
        setPendingNavigate(true);
    };

    const handleExitComplete = () => {
        if (pendingNavigate) {
            setPendingNavigate(false);
            navigate("/home");
        }
    };

    return (
        <Box
            ref={rootRef}
            onClick={handleStart}
            sx={{
                position: "relative",
                width: "100%",
                height: "100dvh",
                overflow: "hidden",
                cursor: isIdle ? "pointer" : "default",
            }}
            tabIndex={0}
            onKeyDown={(e) => {
                if (isIdle && (e.key === "Enter" || e.key === " ")) handleStart();
            }}
            role="application"
            aria-label="Welcome Screen"
        >
            {/* === Idle: click-to-start prompt === */}
            <AnimatePresence>
                {isIdle && (
                    <motion.div
                        key="start-prompt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 2,
                            display: "grid",
                            placeItems: "center",
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <StartPrompt visible text={STRINGS.pressEnter} />
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                style={{ color: "rgba(0,214,252,0.5)", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
                            >
                                click anywhere
                            </motion.div>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* === Loader === */}
            <AnimatePresence>
                {showLoader && (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={TRANSITIONS.fast}
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 3,
                            display: "grid",
                            placeItems: "center",
                        }}
                    >
                        <WelcomeLoader
                            duration={DURATIONS.loadingDefault}
                            onComplete={handleLoaderComplete}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* === Mode selection === */}
            <AnimatePresence>
                {showModeSelect && (
                    <motion.div
                        key="mode-select"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={TRANSITIONS.fast}
                        style={{ position: "absolute", inset: 0, zIndex: 4 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Box
                            sx={{
                                height: "100%",
                                display: "grid",
                                placeItems: "center",
                                p: 2,
                            }}
                        >
                            <Box sx={{ textAlign: "center" }}>
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    style={{
                                        color: "rgba(0,214,252,0.7)",
                                        fontSize: "0.8rem",
                                        letterSpacing: "0.25em",
                                        textTransform: "uppercase",
                                        marginBottom: "2rem",
                                    }}
                                >
                                    Choose your experience
                                </motion.p>
                                <ModeButtons
                                    show
                                    onModeChange={handleSelectVisitorMode}
                                    onHover={playHover}
                                    currentMode={themeToVisitor(mode)}
                                />
                            </Box>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* === Exit animation wrapper === */}
            <AnimatePresence>
                {isExiting && (
                    <motion.div
                        key="exit"
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        onAnimationComplete={handleExitComplete}
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 5,
                            pointerEvents: "none",
                        }}
                    />
                )}
            </AnimatePresence>
        </Box>
    );
}
