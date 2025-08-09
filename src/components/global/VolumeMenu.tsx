import React, { useState, useId } from "react";
import {
    IconButton,
    Popover,
    Box,
    Slider,
    Typography,
    Stack,
    Switch,
    FormControlLabel,
} from "@mui/material";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import type { SxProps } from "@mui/system";
import type { Theme } from "@mui/material/styles";
import { useAudioStore } from "@/store/audioStore";
import { STRINGS, POSITIONS, TRANSITIONS, FEATURES } from "@/config/constants";
import { motion } from "framer-motion";

const containerSx: SxProps<Theme> = (theme) => ({
    position: "fixed",
    zIndex: (POSITIONS.audioToggle.zIndex ?? theme.zIndex.tooltip) + 1,
    top: (POSITIONS.audioToggle.top ?? 16) + 52,
    right: POSITIONS.audioToggle.right ?? 16,
});

const panelSx: SxProps<Theme> = (theme) => ({
    p: 2,
    width: 280,
    backdropFilter: "blur(8px)",
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor:
        theme.palette.mode === "dark"
            ? "rgba(20,20,20,0.85)"
            : "rgba(255,255,255,0.9)",
    boxShadow: theme.shadows[6],
    borderRadius: 2,
});

export default function VolumeMenu() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const isOpen = Boolean(anchorEl);
    const btnId = useId();

    const isMuted = useAudioStore((s) => s.isMuted);
    const sfxVolume = useAudioStore((s) => s.sfxVolume);
    const bgVolume = useAudioStore((s) => s.bgVolume);
    const setMuted = useAudioStore((s) => s.setMuted);
    const setSfxVolume = useAudioStore((s) => s.setSfxVolume);
    const setBgVolume = useAudioStore((s) => s.setBgVolume);

    const hasInteracted = useAudioStore((s) => s.hasInteracted);

    if (!FEATURES.audioEnabled || !hasInteracted) return null;

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={TRANSITIONS.fast}
            style={{ pointerEvents: "none" }}
        >
            <Box sx={containerSx as SxProps<Theme>} style={{ pointerEvents: "auto" }}>
                <IconButton
                    id={btnId}
                    aria-label="Open audio settings"
                    aria-haspopup="dialog"
                    onClick={handleOpen}
                    size="large"
                >
                    <SettingsRoundedIcon />
                </IconButton>

                <Popover
                    open={isOpen}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{ sx: panelSx }}
                >
                    <Stack spacing={2}>
                        <Typography variant="subtitle1">{STRINGS.volume ?? "Volume"}</Typography>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isMuted}
                                    onChange={(e) => setMuted(e.target.checked)}
                                    inputProps={{ "aria-label": STRINGS.mute ?? "Mute" }}
                                />
                            }
                            label={STRINGS.mute ?? "Mute"}
                        />

                        <Stack spacing={1}>
                            <Typography variant="caption">
                                {STRINGS.sfxVolume ?? "SFX Volume"}: {(Math.round(sfxVolume * 100))}
                            </Typography>
                            <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                value={sfxVolume}
                                onChange={(_, v) => setSfxVolume(v as number)}
                                valueLabelDisplay="auto"
                                getAriaLabel={() => STRINGS.sfxVolume ?? "SFX Volume"}
                                getAriaValueText={(v) => `${Math.round((v as number) * 100)}`}
                            />
                        </Stack>

                        <Stack spacing={1}>
                            <Typography variant="caption">
                                {STRINGS.bgmVolume ?? "Background Volume"}: {Math.round(bgVolume * 100)}
                            </Typography>
                            <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                value={bgVolume}
                                onChange={(_, v) => setBgVolume(v as number)}
                                valueLabelDisplay="auto"
                                getAriaLabel={() => STRINGS.bgmVolume ?? "Background Volume"}
                                getAriaValueText={(v) => `${Math.round((v as number) * 100)}`}
                            />
                        </Stack>
                    </Stack>
                </Popover>
            </Box>
        </motion.div>
    );
}
