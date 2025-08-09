import { AnimatePresence, motion } from "framer-motion";
import { TRANSITIONS } from "@/config/constants";

export default function BlackOverlay({ started }: { started: boolean }) {
    return (
        <AnimatePresence>
            {!started && (
                <motion.div
                    key="black"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={TRANSITIONS.overlayFade}
                    style={{ position: "absolute", inset: 0, background: "#000", zIndex: 1 }}
                />
            )}
        </AnimatePresence>
    );
}
