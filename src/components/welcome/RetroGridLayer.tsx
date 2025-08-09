import { forwardRef } from "react";
import { motion } from "framer-motion";
import RetroGrid from "./RetroGrid";
import { OPACITY, TRANSITIONS } from "@/config/constants";

type Props = { started: boolean };

const RetroGridLayer = forwardRef<HTMLDivElement, Props>(
    ({ started }, ref) => (
    <motion.div ref={ref}
        initial={{ opacity: OPACITY.gridIdle }}
        animate={{ opacity: started ? OPACITY.gridActive : OPACITY.gridIdle }}
        transition={TRANSITIONS.gridFade}
    >
        <RetroGrid speedSec={8} lineColor="#00d6fc" />
    </motion.div>
));
export default RetroGridLayer;
