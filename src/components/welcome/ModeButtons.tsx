import { Box, Stack, ButtonBase, Typography } from "@mui/material";
import type { ModeButtonsProps, VisitorMode } from "@/types/types";

const C1 = "#ff00f0";  // magenta
const C2 = "#00eaff";  // cyan
const GRADIENT = `linear-gradient(90deg, ${C1}, ${C2})`;
const FILL_IDLE = "linear-gradient(135deg, #141414, #0a0a0a)";
const FILL_SELECTED = `linear-gradient(135deg, ${C1}, ${C2})`;

type RetroButtonProps = {
    label: string;
    selected?: boolean;
    onClick?: () => void;
    onHover?: () => void;
};

function RetroButton({ label, selected = false, onClick, onHover }: RetroButtonProps) {
    return (
        <ButtonBase
            disableRipple
            onClick={onClick}
            onMouseEnter={onHover}
            aria-pressed={selected}
            role="radio"
            tabIndex={0}
            sx={{
                position: "relative",
                px: 3,
                py: 1.25,
                minWidth: 190,
                borderRadius: 9999,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontWeight: 800,
                fontSize: 14,
                lineHeight: 1,
                color: selected ? "#051016" : "#EAFBFF",
                // Base: glassy fill + gradient border
                background: selected
                    ? `${FILL_SELECTED} padding-box, ${GRADIENT} border-box`
                    : `${FILL_IDLE} padding-box, ${GRADIENT} border-box`,
                border: "2px solid transparent",
                backgroundClip: "padding-box, border-box",
                boxShadow: selected
                    ? `0 0 0 1px #001018 inset,
             0 4px 18px rgba(0,0,0,0.7),
             0 0 22px ${C2}88,
             0 0 44px ${C1}55`
                    : `0 0 0 1px #000 inset,
             0 3px 12px rgba(0,0,0,0.65),
             0 0 14px ${C2}55,
             0 0 28px ${C1}33`,
                transition: (theme) =>
                    theme.transitions.create(
                        ["transform", "box-shadow", "background", "color"],
                        { duration: 200, easing: "ease-out" }
                    ),

                "&:hover": {
                    transform: "translateY(-2px) scale(1.03)",
                    boxShadow: selected
                        ? `0 0 0 1px #001018 inset,
               0 6px 22px rgba(0,0,0,0.7),
               0 0 28px ${C2}CC,
               0 0 56px ${C1}99`
                        : `0 0 0 1px #000 inset,
               0 5px 16px rgba(0,0,0,0.7),
               0 0 22px ${C2}AA,
               0 0 40px ${C1}66`,
                },
                "&:active": { transform: "scale(0.985)" },
                "&:focus-visible": {
                    outline: "none",
                    boxShadow: `0 0 0 2px rgba(255,255,255,0.18),
                      0 0 0 4px ${C2}55,
                      0 0 22px ${C2}AA`,
                },

                // outer neon aura (thicker ring with blur)
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: -2,
                    borderRadius: 9999,
                    background: GRADIENT,
                    opacity: 0.9,
                    filter: "blur(6px)",
                    zIndex: 0,
                },

                // inner double-line frame + top highlight
                "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 4,
                    borderRadius: 9999,
                    background:
                    // thin inner stroke
                        `linear-gradient(#ffffff10, #ffffff10) padding-box, ${GRADIENT} border-box`,
                    border: "2px solid transparent",
                    backgroundClip: "padding-box, border-box",
                    // glossy top highlight
                    boxShadow:
                        "inset 0 10px 18px rgba(255,255,255,0.08), inset 0 -10px 18px rgba(0,0,0,0.35)",
                    zIndex: 0,
                    pointerEvents: "none",
                },
            }}
        >
            <Typography component="span" sx={{ position: "relative", zIndex: 1 }}>
                {label}
            </Typography>
        </ButtonBase>
    );
}

export default function ModeButtons({
                                        show,
                                        onModeChange,
                                        onHover,
                                        currentMode,
                                        labels,
                                        sx,
                                    }: ModeButtonsProps) {
    if (!show) return null;

    const getLabel = (mode: VisitorMode) =>
        labels?.[mode] ?? (mode === "light" ? "Light Mode" : "Enhanced Mode");

    return (
        <Box
            role="radiogroup"
            aria-label="Mode selector"
            sx={{ position: "relative", zIndex: 2, ...sx }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                alignItems="center"
                justifyContent="center"
            >
                <RetroButton
                    label={getLabel("light")}
                    selected={currentMode === "light"}
                    onClick={() => onModeChange("light")}
                    onHover={onHover}
                />
                <RetroButton
                    label={getLabel("enhanced")}
                    selected={currentMode === "enhanced"}
                    onClick={() => onModeChange("enhanced")}
                    onHover={onHover}
                />
            </Stack>
        </Box>
    );
}
