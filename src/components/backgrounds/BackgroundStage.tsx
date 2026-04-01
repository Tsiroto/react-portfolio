import { forwardRef } from "react";
import { motion, type Transition } from "framer-motion";
import { useUiStore, type BackgroundType } from "@/store/uiStore.ts";
import { BACKGROUND_PRESETS } from "@/config/backgroundPresets.ts";

type BackgroundStageProps = {
    visible?: boolean;               // optional override of visibility
    backgroundType?: BackgroundType; // optional override of type
    transitionOverride?: Transition; // optional manual override
};

const BackgroundStage = forwardRef<HTMLDivElement, BackgroundStageProps>(
    ({ visible, backgroundType, transitionOverride }, ref) => {
        const globalVisible = useUiStore((s) => s.backgroundVisible);
        const globalType = useUiStore((s) => s.backgroundType);

        const isVisible = visible !== undefined ? visible : globalVisible;
        const bgType = backgroundType !== undefined ? backgroundType : globalType;

        // "off" means nothing to render
        if (bgType === "off") return null;

        const preset = BACKGROUND_PRESETS[bgType as Exclude<BackgroundType, "off">];
        if (!preset) return null;

        return (
            <motion.div
                ref={ref}
                className={preset.className}
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? preset.opacity : 0 }}
                transition={transitionOverride ?? preset.transition}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                }}
            />
        );
    }
);

BackgroundStage.displayName = "BackgroundStage";
export default BackgroundStage;
