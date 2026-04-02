import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Stack,
    Switch,
    Slider,
    ToggleButton,
    ToggleButtonGroup,
    Divider,
    Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IoClose } from "react-icons/io5";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { useAudioStore } from "@/store/audioStore";
import { useUiStore, type VisualMode } from "@/store/uiStore";
import { WELCOME_SEEN_KEY } from "@/App";
import { THEME_STORAGE_KEY } from "@/utils/modeMapping";

type Props = {
    open: boolean;
    onClose: () => void;
};

function SectionHeader({ label }: { label: string }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Typography
                variant="overline"
                sx={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                }}
            >
                {label}
            </Typography>
            <Divider sx={{ flex: 1 }} />
        </Box>
    );
}

function VolumeRow({
    icon,
    label,
    value,
    onChange,
    disabled,
    accentColor,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    onChange: (v: number) => void;
    disabled?: boolean;
    accentColor: string;
}) {
    return (
        <Box sx={{ opacity: disabled ? 0.4 : 1, transition: "opacity 0.2s" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <Box sx={{ color: "text.secondary", display: "flex", fontSize: 14 }}>{icon}</Box>
                    <Typography variant="caption" sx={{ fontWeight: 500, fontSize: "0.78rem" }}>
                        {label}
                    </Typography>
                </Box>
                <Typography
                    variant="caption"
                    sx={{
                        color: "text.secondary",
                        fontSize: "0.72rem",
                        fontVariantNumeric: "tabular-nums",
                        minWidth: 28,
                        textAlign: "right",
                    }}
                >
                    {Math.round(value * 100)}%
                </Typography>
            </Box>
            <Slider
                size="small"
                min={0}
                max={1}
                step={0.01}
                value={value}
                disabled={disabled}
                onChange={(_, v) => onChange(v as number)}
                sx={{
                    color: accentColor,
                    height: 4,
                    "& .MuiSlider-thumb": {
                        width: 12,
                        height: 12,
                        boxShadow: "none",
                        "&:hover": { boxShadow: `0 0 0 6px ${accentColor}22` },
                    },
                    "& .MuiSlider-rail": { opacity: 0.25 },
                }}
            />
        </Box>
    );
}

export default function OptionsModal({ open, onClose }: Props) {
    const theme = useTheme();
    const isEnhanced = theme.palette.mode === "dark";
    const accentColor = isEnhanced ? "#00d6fc" : theme.palette.primary.main;

    // Audio
    const isMuted = useAudioStore((s) => s.isMuted);
    const isSfxMuted = useAudioStore((s) => s.isSfxMuted);
    const bgVolume = useAudioStore((s) => s.bgVolume);
    const sfxVolume = useAudioStore((s) => s.sfxVolume);
    const setMuted = useAudioStore((s) => s.setMuted);
    const setSfxMuted = useAudioStore((s) => s.setSfxMuted);
    const setBgVolume = useAudioStore((s) => s.setBgVolume);
    const setSfxVolume = useAudioStore((s) => s.setSfxVolume);
    const resetAudioPrefs = useAudioStore((s) => s.resetPrefs);
    const setHasInteracted = useAudioStore((s) => s.setHasInteracted);

    // Visuals
    const visualMode = useUiStore((s) => s.visualMode);
    const setVisualMode = useUiStore((s) => s.setVisualMode);
    const mode = useUiStore((s) => s.mode);
    const setMode = useUiStore((s) => s.setMode);
    const resetUiPrefs = useUiStore((s) => s.resetUiPrefs);

    const handleReset = () => {
        // Clear persisted storage
        try {
            localStorage.removeItem(WELCOME_SEEN_KEY);
            localStorage.removeItem(THEME_STORAGE_KEY);
            localStorage.removeItem("audio-store");
            localStorage.removeItem("ui-store");
        } catch { /* ignore */ }

        // Reset in-memory store state
        resetAudioPrefs();
        setHasInteracted(false);
        resetUiPrefs();
        setVisualMode("rich");
        setMode("light");

        onClose();

        // Cover the flash of unstyled content during reload
        const cover = document.createElement("div");
        cover.style.cssText = "position:fixed;inset:0;background:#0a0a0a;z-index:99999;";
        document.body.appendChild(cover);

        window.location.reload();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    background: isEnhanced
                        ? "rgba(14,14,14,0.96)"
                        : theme.palette.background.paper,
                    backdropFilter: "blur(20px)",
                    border: isEnhanced
                        ? "1px solid rgba(0,214,252,0.12)"
                        : `1px solid ${theme.palette.divider}`,
                    boxShadow: isEnhanced
                        ? "0 24px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(0,214,252,0.05)"
                        : theme.shadows[8],
                    overflow: "visible",
                },
            }}
            slotProps={{
                backdrop: {
                    sx: {
                        backdropFilter: "blur(4px)",
                        bgcolor: isEnhanced ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)",
                    },
                },
            }}
        >
            {/* Title row */}
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 1,
                    pt: 2.5,
                    px: 3,
                    fontWeight: 700,
                    fontSize: "1rem",
                    letterSpacing: "0.02em",
                    ...(isEnhanced && {
                        color: "#fff",
                        textShadow: "0 0 12px rgba(0,214,252,0.35)",
                    }),
                }}
            >
                Options
                <IconButton
                    size="small"
                    onClick={onClose}
                    aria-label="Close options"
                    sx={{
                        color: "text.secondary",
                        "&:hover": { color: "text.primary" },
                        mr: -0.5,
                    }}
                >
                    <IoClose size={18} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: 3, pb: 3, pt: 1 }}>
                <Stack spacing={3.5}>

                    {/* ── VISUALS ── */}
                    <Box>
                        <SectionHeader label="Visuals" />
                        <Stack spacing={2}>
                            {/* Experience row */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                }}
                            >
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.85rem" }}>
                                        Experience
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "text.secondary", fontSize: "0.72rem" }}
                                    >
                                        {visualMode === "rich"
                                            ? "Music & full animations"
                                            : "No autoplay, reduced motion"}
                                    </Typography>
                                </Box>
                                <ToggleButtonGroup
                                    exclusive
                                    size="small"
                                    value={visualMode}
                                    onChange={(_, v: VisualMode | null) => v && setVisualMode(v)}
                                    aria-label="Experience mode"
                                >
                                    {(["rich", "simple"] as VisualMode[]).map((v) => (
                                        <ToggleButton
                                            key={v}
                                            value={v}
                                            aria-label={v}
                                            sx={{
                                                px: 1.5,
                                                fontSize: "0.72rem",
                                                fontWeight: 600,
                                                letterSpacing: "0.04em",
                                                textTransform: "capitalize",
                                                "&.Mui-selected": {
                                                    bgcolor: isEnhanced ? `${accentColor}22` : undefined,
                                                    color: isEnhanced ? accentColor : undefined,
                                                    borderColor: isEnhanced ? `${accentColor}55` : undefined,
                                                },
                                            }}
                                        >
                                            {v}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Box>

                            {/* Theme row */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                }}
                            >
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.85rem" }}>
                                        Theme
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "text.secondary", fontSize: "0.72rem" }}
                                    >
                                        {mode === "dark" ? "Dark colours" : "Light colours"}
                                    </Typography>
                                </Box>
                                <ToggleButtonGroup
                                    exclusive
                                    size="small"
                                    value={mode}
                                    onChange={(_, v: "light" | "dark" | null) => v && setMode(v)}
                                    aria-label="Theme"
                                >
                                    {(["dark", "light"] as const).map((v) => (
                                        <ToggleButton
                                            key={v}
                                            value={v}
                                            aria-label={v}
                                            sx={{
                                                px: 1.5,
                                                fontSize: "0.72rem",
                                                fontWeight: 600,
                                                letterSpacing: "0.04em",
                                                textTransform: "capitalize",
                                                "&.Mui-selected": {
                                                    bgcolor: isEnhanced ? `${accentColor}22` : undefined,
                                                    color: isEnhanced ? accentColor : undefined,
                                                    borderColor: isEnhanced ? `${accentColor}55` : undefined,
                                                },
                                            }}
                                        >
                                            {v}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Box>
                        </Stack>
                    </Box>

                    {/* ── AUDIO ── */}
                    <Box>
                        <SectionHeader label="Audio" />
                        <Stack spacing={0}>

                            {/* Music toggle */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    py: 0.75,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <HiOutlineMusicalNote
                                        size={16}
                                        color={isMuted ? theme.palette.text.disabled : accentColor}
                                    />
                                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.85rem" }}>
                                        Music
                                    </Typography>
                                </Box>
                                <Switch
                                    size="small"
                                    checked={!isMuted}
                                    onChange={(e) => setMuted(!e.target.checked)}
                                    inputProps={{ "aria-label": "Toggle music" }}
                                    sx={{
                                        "& .MuiSwitch-switchBase.Mui-checked": {
                                            color: accentColor,
                                        },
                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                            bgcolor: accentColor,
                                        },
                                    }}
                                />
                            </Box>

                            {/* Effects toggle */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    py: 0.75,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <MdOutlineAutoAwesome
                                        size={16}
                                        color={isSfxMuted ? theme.palette.text.disabled : accentColor}
                                    />
                                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.85rem" }}>
                                        Effects
                                    </Typography>
                                </Box>
                                <Switch
                                    size="small"
                                    checked={!isSfxMuted}
                                    onChange={(e) => setSfxMuted(!e.target.checked)}
                                    inputProps={{ "aria-label": "Toggle effects" }}
                                    sx={{
                                        "& .MuiSwitch-switchBase.Mui-checked": {
                                            color: accentColor,
                                        },
                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                            bgcolor: accentColor,
                                        },
                                    }}
                                />
                            </Box>

                            {/* Volume mixer */}
                            <Box
                                sx={{
                                    mt: 1.5,
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: isEnhanced
                                        ? "rgba(255,255,255,0.03)"
                                        : "rgba(0,0,0,0.03)",
                                    border: `1px solid ${isEnhanced ? "rgba(255,255,255,0.06)" : theme.palette.divider}`,
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "text.secondary",
                                        fontSize: "0.68rem",
                                        fontWeight: 600,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        display: "block",
                                        mb: 2,
                                    }}
                                >
                                    Volume Mixer
                                </Typography>
                                <Stack spacing={2.5}>
                                    <VolumeRow
                                        icon={<HiOutlineMusicalNote />}
                                        label="Music"
                                        value={bgVolume}
                                        onChange={setBgVolume}
                                        disabled={isMuted}
                                        accentColor={accentColor}
                                    />
                                    <VolumeRow
                                        icon={<MdOutlineAutoAwesome />}
                                        label="Effects"
                                        value={sfxVolume}
                                        onChange={setSfxVolume}
                                        disabled={isSfxMuted}
                                        accentColor={accentColor}
                                    />
                                </Stack>
                            </Box>

                        </Stack>
                    </Box>

                </Stack>

                    {/* ── RESET ── */}
                    <Box sx={{ pt: 1 }}>
                        <Divider sx={{ mb: 2.5 }} />
                        <Button
                            fullWidth
                            size="small"
                            onClick={handleReset}
                            sx={{
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                letterSpacing: "0.05em",
                                color: "error.main",
                                borderColor: "error.main",
                                border: "1px solid",
                                borderRadius: 1.5,
                                py: 0.75,
                                opacity: 0.7,
                                "&:hover": { opacity: 1, bgcolor: "error.main", color: "#fff" },
                                transition: "all 0.2s",
                            }}
                        >
                            Reset to defaults
                        </Button>
                    </Box>

            </DialogContent>
        </Dialog>
    );
}
