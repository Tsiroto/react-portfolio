import { useMemo, useRef } from "react";
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import { useAudioStore } from "@/store/audioStore";
import { useUiStore } from "@/store/uiStore";

import { useSfx } from "@/hooks/useSfx";
import { useBgAudio } from "@/hooks/useBgAudio";

import AudioToggle from "@/components/global/AudioToggle";
import VolumeMenu from "@/components/global/VolumeMenu";
import GlitchTypingText from "@/components/welcome/GlitchTypingText";
import WelcomeLoader from "@/components/welcome/WelcomeLoader";
import ModeButtons from "@/components/welcome/ModeButtons";

import { DURATIONS, TRANSITIONS, STRINGS } from "@/config/constants";

export default function WelcomeScreen() {
    // ---- global state
    const hasInteracted = useAudioStore((s) => s.hasInteracted);
    const setHasInteracted = useAudioStore((s) => s.setHasInteracted);
    const isMuted = useAudioStore((s) => s.isMuted);

    const introPhase = useUiStore((s) => s.introPhase);
    const setIntroPhase = useUiStore((s) => s.setIntroPhase);
    const setMode = useUiStore((s) => s.setMode);

    // ---- sfx hook (define before using)
    const { playClick, playHover } = useSfx();

    // ---- bg audio (gridRef drives CSS vars)
    const gridRef = useRef<HTMLDivElement | null>(null);
    const bgSrc = useMemo(() => "/audio/night-angel.mp3", []); // your file path
    useBgAudio({ started: hasInteracted && introPhase !== "idle", isMuted, src: bgSrc, gridRef });

    // ---- overlay fade: black -> subtle -> none
    const showPrompt = !hasInteracted && introPhase === "idle";
    const showLoader = hasInteracted && introPhase === "loading";
    const showModeSelect = hasInteracted && introPhase === "select";

    const onFirstInteraction = () => {
        if (!hasInteracted) {
            setHasInteracted(true);
            playClick();
            setIntroPhase("loading");
        }
    };

    const handleLoaderComplete = () => {
        setIntroPhase("select");
    };

    const handleSelectLight = () => {
        playClick();
        setMode("light");
        // later: navigate or just render <Portfolio mode="light" />
    };

    const handleSelectEnhanced = () => {
        playClick();
        setMode("enhanced");
        // later: navigate or just render <Portfolio mode="enhanced" />
    };

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: "100dvh",
                overflow: "hidden",
                bgcolor: "black",
            }}
            onClick={showPrompt ? onFirstInteraction : undefined}
            onKeyDown={showPrompt ? onFirstInteraction : undefined}
            tabIndex={0} // allow key events
        >
            {/* Background layer (subtle at idle/loading, full at select) */}
            <Box
                ref={gridRef}
                className="ambient-background" // you already have welcome.css
                sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                    opacity: showModeSelect ? 1 : 0.4,
                    transition: "opacity 800ms ease",
                }}
            />

            {/* Black overlay that dissolves by phase */}
            <AnimatePresence>
                {(showPrompt || showLoader) && (
                    <motion.div
                        key="black-overlay"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: showLoader ? 0.35 : 0.7 }}
                        exit={{ opacity: 0 }}
                        transition={TRANSITIONS.overlayFade ?? { duration: 0.6 }}
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

            {/* Prompt (first interaction) */}
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

            {/* Loader (runs for configured duration, dissolves black) */}
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

            {/* Mode select + audio UI */}
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
                                onLight={handleSelectLight}
                                onEnhanced={handleSelectEnhanced}
                                onHover={playHover}
                            />
                        </Box>

                        {/* Audio controls (appear after interaction) */}
                        <AudioToggle />
                        <VolumeMenu />
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
}
