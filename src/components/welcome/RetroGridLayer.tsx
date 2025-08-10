import { forwardRef } from "react";
import { motion } from "framer-motion";
import RetroGrid from "./RetroGrid";
import { OPACITY, TRANSITIONS } from "@/config/constants";

type Props = { started: boolean };

const RetroGridLayer = forwardRef<HTMLDivElement, Props>(
    ({ started }, ref) => (
    <motion.div ref={ref}
        initial={{ opacity: OPACITY.bgDim }}
        animate={{ opacity: started ? OPACITY.bgFull : OPACITY.bgDim }}
        transition={TRANSITIONS.gridFade}
    >
        <RetroGrid speedSec={8} lineColor="#00d6fc" />
    </motion.div>
));
export default RetroGridLayer;
