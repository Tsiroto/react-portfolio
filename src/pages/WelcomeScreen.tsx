import { useRef, useCallback } from "react";
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import { useAudioStore } from "@/store/audioStore";
import { useUiStore } from "@/store/uiStore";

import { useSfx } from "@/hooks/useSfx";
import { useBgAudio } from "@/hooks/useBgAudio";

import SiteOptions from "@/components/global/SiteOptions";
import GlitchTypingText from "@/components/welcome/GlitchTypingText";
import WelcomeLoader from "@/components/welcome/WelcomeLoader";
import ModeButtons from "@/components/welcome/ModeButtons";

import bgm from "@/assets/test-bg-audio.mp3";
import { DURATIONS, OPACITY, TRANSITIONS, STRINGS } from "@/config/constants";
import type { Mode, WelcomeScreenProps } from "@/types/types";

export default function WelcomeScreen({ onModeChange }: WelcomeScreenProps) {
    // Global audio state
    const hasInteracted = useAudioStore((s) => s.hasInteracted);
    const setHasInteracted = useAudioStore((s) => s.setHasInteracted);
    const isMuted = useAudioStore((s) => s.isMuted);

    // Intro phase state
    const introPhase = useUiStore((s) => s.introPhase);
    const setIntroPhase = useUiStore((s) => s.setIntroPhase);
    const setMode = useUiStore((s) => s.setMode); // keeps local "light|enhanced" if you use it elsewhere

    // SFX
    const { playClick, playHover } = useSfx();

    // Background visual + audio
    const gridRef = useRef<HTMLDivElement | null>(null);
    useBgAudio({
        started: hasInteracted && introPhase !== "idle",
        isMuted,
        src: bgm,
        gridRef,
    });

    // Derived UI flags
    const showPrompt = !hasInteracted && introPhase === "idle";
    const showLoader = hasInteracted && introPhase === "loading";
    const showModeSelect = hasInteracted && introPhase === "select";

    // First interaction handler (click, touch, Enter/Space)
    const begin = useCallback(() => {
        if (hasInteracted) return;
        setHasInteracted(true);
        playClick();
        setIntroPhase("loading");
    }, [hasInteracted, setHasInteracted, playClick, setIntroPhase]);

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (!showPrompt) return;
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                begin();
            }
        },
        [showPrompt, begin]
    );

    const handleLoaderComplete = () => {
        setIntroPhase("select");
    };

    const handleSelectMode = (mode: Mode) => {
        playClick();
        setMode(mode);
        onModeChange?.(mode);
    };

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: "100dvh",
                overflow: "hidden",
                bgcolor: (t) => t.palette.background.default,
            }}
            onClick={showPrompt ? begin : undefined}
            onPointerDown={showPrompt ? begin : undefined}
            onKeyDown={onKeyDown}
            tabIndex={0} // enable key events
            role="application"
            aria-label="Welcome Screen"
        >
            {/* Background layer (subtle → full) */}
            <Box
                ref={gridRef}
                className="ambient-background"
                sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                    opacity: showModeSelect ? OPACITY.bgFull : OPACITY.bgDim,
                    transition: "opacity 800ms ease",
                }}
            />

            <AnimatePresence>
                {(showPrompt || showLoader) && (
                    <motion.div
                        key="black-overlay"
                        initial={{ opacity: OPACITY.overlayIn }}
                        animate={{ opacity: showLoader ? 0.35 : 0.7 }}
                        exit={{ opacity: OPACITY.overlayOut }}
                        transition={TRANSITIONS.overlayFade}
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "black",
                            zIndex: 1,
                            pointerEvents: "none",
                        }}
                    />
                )}
            </AnimatePresence>

            {/* First interaction prompt */}
            <AnimatePresence>
                {showPrompt && (
                    <motion.div
                        key="prompt"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={TRANSITIONS.fast}
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 2,
                            display: "grid",
                            placeItems: "center",
                        }}
                    >
                        <GlitchTypingText text={STRINGS.pressEnter} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loader */}
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

            {/* Mode selection + options */}
            <AnimatePresence>
                {showModeSelect && (
                    <motion.div
                        key="mode-select"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={TRANSITIONS.fast}
                        style={{ position: "absolute", inset: 0, zIndex: 4 }}
                    >
                        <Box
                            sx={{
                                height: "100%",
                                display: "grid",
                                placeItems: "center",
                                p: 2,
                            }}
                        >
                            <ModeButtons
                                show
                                onModeChange={handleSelectMode}
                                onHover={playHover}
                            />
                        </Box>

                        <SiteOptions />
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
}
