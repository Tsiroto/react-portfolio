// components/welcome/GlitchTypingText.tsx
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import "../../styles/glitchText.css";

interface GlitchTypingTextProps {
    text: string;
}

const GlitchTypingText = ({ text }: GlitchTypingTextProps) => {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index <= text.length) {
                setDisplayed(text.slice(0, index));
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 80);
        return () => clearInterval(typingInterval);
    }, [text]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="glitch-container"
        >
            <Typography variant="h5" className="glitch-text" data-text={displayed}>
                {displayed}
            </Typography>
        </motion.div>
    );
};

export default GlitchTypingText;
