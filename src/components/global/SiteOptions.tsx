import React, { useState, useId } from "react";
import {
    IconButton,
    Popover,
    Box,
    Stack,
    Typography,
    Slider,
    Switch,
    FormControlLabel,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Button,
    Divider,
} from "@mui/material";
import type { SxProps } from "@mui/system";
import type { Theme } from "@mui/material/styles";

import SettingsIcon from "@mui/icons-material/Settings";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { useAudioStore } from "@/store/audioStore";
import { useUiStore } from "@/store/uiStore";
import { STRINGS, POSITIONS, FEATURES, POPOVER_MS } from "@/config/constants";

const containerSx: SxProps<Theme> = (theme) => ({
    position: "fixed",
    zIndex: (POSITIONS.siteOptions.zIndex ?? theme.zIndex.tooltip) + 1,
    top: POSITIONS.siteOptions.top ?? 16,
    right: POSITIONS.siteOptions.right ?? 16,
});

const panelSx: SxProps<Theme> = (theme) => ({
    p: 2,
    width: 320,
    backdropFilter: "blur(8px)",
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor:
        theme.palette.mode === "dark"
            ? "rgba(20,20,20,0.85)"
            : "rgba(255,255,255,0.9)",
    boxShadow: theme.shadows[6],
    borderRadius: 2,
});

export default function SiteOptions() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const isOpen = Boolean(anchorEl);
    const btnId = useId();

    // Audio state
    const hasInteracted = useAudioStore((s) => s.hasInteracted);
    const isMuted = useAudioStore((s) => s.isMuted);
    const sfxVolume = useAudioStore((s) => s.sfxVolume);
    const bgVolume = useAudioStore((s) => s.bgVolume);
    const setMuted = useAudioStore((s) => s.setMuted);
    const setSfxVolume = useAudioStore((s) => s.setSfxVolume);
    const setBgVolume = useAudioStore((s) => s.setBgVolume);
    const resetPrefs = useAudioStore((s) => s.resetPrefs);
    const resetUiPrefs = useUiStore((s) => s.resetUiPrefs);

    const handleReset = () => {
        resetPrefs();   // audio prefs -> defaults (keeps hasInteracted true)
        resetUiPrefs(); // theme -> enhanced
        setAnchorEl(null);
    };

    // Mode state
    const mode = useUiStore((s) => s.mode);
    const setMode = useUiStore((s) => s.setMode);

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    // Hide until interaction (same policy as audio)
    if (!FEATURES.audioEnabled || !hasInteracted) return null;

    const TriggerIcon = isOpen ? CloseRoundedIcon : SettingsIcon;
    const triggerTip = isOpen ? "Close" : (STRINGS.siteOptions ?? "Site Options");

    return (
        <Box sx={containerSx}>
            <Tooltip title={triggerTip}>
                <IconButton
                    id={btnId}
                    aria-label={triggerTip}
                    aria-haspopup="dialog"
                    onClick={isOpen ? handleClose : handleOpen}
                    size="large"
                >
                    <TriggerIcon />
                </IconButton>
            </Tooltip>

            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{ sx: panelSx }}
                transitionDuration={POPOVER_MS}
            >
                <Stack spacing={2}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle2">
                            {STRINGS.theme ?? "Theme"}
                        </Typography>
                        <ToggleButtonGroup
                            exclusive
                            size="small"
                            value={mode}
                            onChange={(_, v) => v && setMode(v)}
                            aria-label="Theme selection"
                        >
                            <ToggleButton value="light" aria-label="Light">
                                {STRINGS.lightMode ?? "Light Mode"}
                            </ToggleButton>
                            <ToggleButton value="enhanced" aria-label="Enhanced">
                                {STRINGS.enhancedMode ?? "Enhanced Mode"}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Stack>

                    {/* Audio */}
                    <Typography variant="subtitle2">
                        {STRINGS.volume ?? "Audio"}
                    </Typography>

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
                            {(STRINGS.sfxVolume ?? "SFX Volume") + `: ${Math.round(sfxVolume * 100)}`}
                        </Typography>
                        <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            value={sfxVolume}
                            onChange={(_, v) => setSfxVolume(v as number)}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(v) => `${Math.round((v as number) * 100)}`}
                            getAriaLabel={() => STRINGS.sfxVolume ?? "SFX Volume"}
                        />
                    </Stack>

                    <Stack spacing={1}>
                        <Typography variant="caption">
                            {(STRINGS.bgmVolume ?? "Background Volume") + `: ${Math.round(bgVolume * 100)}`}
                        </Typography>
                        <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            value={bgVolume}
                            onChange={(_, v) => setBgVolume(v as number)}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(v) => `${Math.round((v as number) * 100)}`}
                            getAriaLabel={() => STRINGS.bgmVolume ?? "Background Volume"}
                        />
                    </Stack>

                    <Divider />

                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleReset}
                        fullWidth
                    >
                        {STRINGS.reset ?? "Reset to defaults"}
                    </Button>
                </Stack>
            </Popover>
        </Box>
    );
}
