import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

import WelcomeLoader from "../components/welcome/WelcomeLoader";
import bgMusic from "@/assets/night-angel.mp3";
import sfxAccept from "@/assets/accept.mp3";

import { DURATIONS } from "../config/constants";

interface WelcomeScreenProps {
    onModeChange: (mode: "light" | "enhanced") => void;
}

const WelcomeScreen = ({ onModeChange }: WelcomeScreenProps) => {
    const [started, setStarted] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const bgAudioRef = useRef<HTMLAudioElement | null>(null);
    const sfxRef = useRef<HTMLAudioElement | null>(null);

    const handleStart = useCallback(() => {
        setStarted(true);

        // Play background audio
        if (!bgAudioRef.current) {
            const audio = new Audio(bgMusic);
            audio.loop = true;
            audio.volume = isMuted ? 0 : 0.5;
            audio.play().catch(err => console.warn("Autoplay blocked:", err));
            bgAudioRef.current = audio;
        }

        // Delay before mode options appear
        setTimeout(() => {
            setShowOptions(true);
        }, 3000);
    }, [isMuted]);

    const playSfx = () => {
        if (!isMuted && sfxRef.current) {
            sfxRef.current.currentTime = 0;
            sfxRef.current.play().catch(err => console.warn("SFX blocked:", err));
        }
    };

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

        return () => {
            if (bgAudioRef.current) {
                bgAudioRef.current.pause();
                bgAudioRef.current = null;
            }
        };
    }, []);

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
            {/* Mute Toggle */}
            <IconButton
                onClick={toggleMute}
                sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    color: "#00d6fc",
                    zIndex: 2,
                }}
                aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>

            {/* Initial Start Button */}
            {!started && (
                <Button
                    variant="outlined"
                    onClick={() => {
                        playSfx();
                        handleStart();
                    }}
                    sx={{
                        px: 4,
                        py: 2,
                        fontSize: "1rem",
                        borderColor: "#00d6fc",
                        color: "#00d6fc",
                        textTransform: "uppercase",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            boxShadow: "0 0 8px rgba(0, 214, 252, 0.5)",
                            backgroundColor: "rgba(0, 214, 252, 0.1)",
                        },
                    }}
                >
                    Interact to Begin
                </Button>
            )}

            {/* Loader Phase */}
            {started && !showOptions && (
                <WelcomeLoader duration={DURATIONS.loadingDefault} onComplete={() => setShowOptions(true)} />
            )}

            {/* Mode Selection */}
            {showOptions && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    style={{ display: "flex", gap: "1.5rem", marginTop: "2rem" }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            playSfx();
                            onModeChange("light");
                        }}
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
