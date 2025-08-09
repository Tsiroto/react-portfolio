import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { STRINGS, TRANSITIONS } from "@/config/constants";
import type { ModeButtonsProps } from "@/types/types";

export default function ModeButtons({
                                        show,
                                        onLight,
                                        onEnhanced,
                                        onHover,
                                    }: ModeButtonsProps) {
    if (!show) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={TRANSITIONS.overlayFade}
            style={{ display: "flex", gap: "1.5rem", marginTop: "2rem", zIndex: 2 }}
        >
            <Button
                variant="contained"
                color="primary"
                onClick={onLight}
                onMouseEnter={onHover}
                onFocus={onHover}
                sx={{ width: 150 }}
                aria-label={STRINGS.lightMode}
            >
                {STRINGS.lightMode}
            </Button>

            <Button
                variant="contained"
                color="secondary"
                onClick={onEnhanced}
                onMouseEnter={onHover}
                onFocus={onHover}
                sx={{ width: 150 }}
                aria-label={STRINGS.enhancedMode}
            >
                {STRINGS.enhancedMode}
            </Button>
        </motion.div>
    );
}
