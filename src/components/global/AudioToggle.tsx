import { IconButton } from "@mui/material";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { motion } from "framer-motion";
import { useAudioStore } from "@/store/audioStore";
import type { AudioToggleProps } from "@/types/types";

export default function AudioToggle({ hidden }: AudioToggleProps) {
    const { isMuted, setMuted, hasInteracted } = useAudioStore();

    if (hidden) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hasInteracted ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ position: "fixed", top: 16, right: 16, zIndex: 9999 }}
        >
            <IconButton
                onClick={() => setMuted(!isMuted)}
                sx={{ color: "#00d6fc" }}
                aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
        </motion.div>
    );
}
