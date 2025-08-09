import { motion } from "framer-motion";
import GlitchTypingText from "./GlitchTypingText";

export default function StartPrompt({ visible, text }: { visible: boolean; text: string }) {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ zIndex: 2 }}
        >
            {visible && <GlitchTypingText text={text} />}
        </motion.div>
    );
}
