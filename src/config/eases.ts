import type { Transition } from "framer-motion";

export const EASES: Record<string, Transition["ease"]> = {
    linear: "linear",
    easeInOut: "easeInOut",
    easeIn: "easeIn",
    easeOut: "easeOut",

    smooth: [0.42, 0, 0.58, 1],           // Standard smooth in/out
    snappy: [0.7, 0, 0.84, 0],            // Fast start, sharp snap end
    bounce: [0.68, -0.55, 0.27, 1.55],    // Overshoot bounce effect
    gentle: [0.25, 0.1, 0.25, 1],         // Softer ease, like CSS ease
};
