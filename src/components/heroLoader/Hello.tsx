import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type {GlowingPromptProps} from "@/types/types";
import "@/styles/hello.css";

const Hello = ({ deviceType, onStart }: GlowingPromptProps) => {
    const fullText = deviceType === "touch" ? "tap to begin" : "press enter or click to begin";
    const [displayedText, setDisplayedText] = useState("");
    const [glitchIndex, setGlitchIndex] = useState<number | null>(null);
    const indexRef = useRef(0);

    // Typing + glitch animation
    useEffect(() => {
        const interval = setInterval(() => {
            if (indexRef.current < fullText.length) {
                const nextChar = fullText[indexRef.current];
                setDisplayedText((prev) => prev + nextChar);

                if (Math.random() < 0.3) {
                    setGlitchIndex(indexRef.current);
                    setTimeout(() => setGlitchIndex(null), 80);
                }

                indexRef.current += 1;
            } else {
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [fullText]);

    // Keydown listener (Enter)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") onStart();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onStart]);

    // Click = covers both tap and mouse click
    const handleClick = () => {
        onStart();
    };

    return (
        <motion.div
            className="hello-wrapper"
            onClick={handleClick}
            tabIndex={0}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="hello-button kave-btn">
                <span className="kave-line" />
                {displayedText.split("").map((char, i) => (
                    <span
                        key={i}
                        className={glitchIndex === i ? "glitch" : ""}
                    >
            {char}
          </span>
                ))}
            </div>
        </motion.div>
    );
};

export default Hello;
