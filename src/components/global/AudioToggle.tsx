import { IconButton, Tooltip } from "@mui/material";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { motion } from "framer-motion";
import type { Theme } from "@mui/material/styles";
import type { SxProps, SystemStyleObject } from "@mui/system";

import type { AudioToggleOwnProps } from "@/types/types";
import { STRINGS, POSITIONS, TRANSITIONS } from "@/config/constants";
import { useAudioStore } from "@/store/audioStore";

const containerSx = (theme: Theme): SystemStyleObject<Theme> => ({
    position: "fixed",
    zIndex: POSITIONS.audioToggle.zIndex ?? theme.zIndex.tooltip + 1,
    top: POSITIONS.audioToggle.top,
    right: POSITIONS.audioToggle.right,
    pointerEvents: "auto",
});

const buttonSx = (theme: Theme): SystemStyleObject<Theme> => ({
    backdropFilter: "blur(6px)",
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor:
        theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.04)",
    boxShadow: theme.shadows[3],
    "&:hover": {
        backgroundColor:
            theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.10)"
                : "rgba(0,0,0,0.08)",
    },
});

export default function AudioToggle({ hidden = false, sx, onHover }: AudioToggleOwnProps) {
    const isMuted = useAudioStore((s) => s.isMuted);
    const hasInteracted = useAudioStore((s) => s.hasInteracted);
    const toggleMuted = useAudioStore((s) => s.toggleMuted);

    // Gate rendering until first user interaction (autoplay policy UX)
    if (hidden || !hasInteracted) return null;

    const ariaLabel = isMuted
        ? STRINGS.audioToggleLabelOff
        : STRINGS.audioToggleLabelOn;

    const tooltip = isMuted
        ? STRINGS.audioToggleTipOff
        : STRINGS.audioToggleTipOn;

    const mergedSx: SxProps<Theme> = (theme) => ({
        ...containerSx(theme),
        ...buttonSx(theme),
        ...(typeof sx === "function"
            ? (sx as (t: Theme) => SystemStyleObject<Theme> | undefined)(theme)
            : sx || {}),
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={TRANSITIONS.fast}
            style={{ pointerEvents: "none" }}
        >
            <div style={{ pointerEvents: "auto" }}>
                <Tooltip title={tooltip} placement="left">
                    <IconButton
                        aria-label={ariaLabel}
                        aria-pressed={!isMuted}
                        onClick={toggleMuted}
                        onMouseEnter={onHover}
                        size="large"
                        disableRipple
                        sx={mergedSx}
                    >
                        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                    </IconButton>
                </Tooltip>
            </div>
        </motion.div>
    );
}
