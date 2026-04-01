import type { Transition } from "framer-motion";
import type { BackgroundType } from "@/store/uiStore";
import { EASES } from "@/config/eases";

type BackgroundPreset = {
    className: string;
    opacity: number;
    transition: Transition;
};

export const BACKGROUND_PRESETS: Record<Exclude<BackgroundType, "off">, BackgroundPreset> = {
    ambient: {
        className: "ambient-background",
        opacity: 0.4,
        transition: { duration: 1.2, ease: EASES.easeInOut },
    },
    minimal: {
        className: "minimal-background",
        opacity: 1,
        transition: { duration: 0.6, ease: EASES.easeOut },
    },
};
