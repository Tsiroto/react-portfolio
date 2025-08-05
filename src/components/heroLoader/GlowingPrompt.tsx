import { motion } from "framer-motion";
import type {GlowingPromptProps} from "@/types/types.ts";
import "@/styles/glowingPrompt.css";
import React from "react";

const GlowingPrompt = ({ deviceType, onStart }: GlowingPromptProps) => {
    const promptText = deviceType === "touch" ? "Tap to Begin" : "Press Enter to Begin";

    const handleClick = () => {
        if (deviceType === "touch") onStart();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (deviceType === "keyboard" && e.key === "Enter") onStart();
    };

    return (
        <motion.div
            className="glowing-prompt"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {promptText}
        </motion.div>
    );
};

export default GlowingPrompt;
