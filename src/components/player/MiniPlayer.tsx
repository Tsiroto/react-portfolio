import { Box, Typography, IconButton, Slider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useUiStore } from "@/store/uiStore";
import {
    IoPlaySkipBack,
    IoPlaySkipForward,
    IoPlay,
    IoPause,
    IoList,
} from "react-icons/io5";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { usePlaylistStore } from "@/store/playlistStore";
import { playlist } from "@/data/playlist";
import PlaylistPanel from "./PlaylistPanel";
import { playlistAnalyserRef } from "@/hooks/usePlaylistAudio";

function SpectrumBar() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let rafId: number;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const draw = () => {
            rafId = requestAnimationFrame(draw);
            const analyser = playlistAnalyserRef.current;
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);

            if (!analyser) {
                // idle: slow rainbow sweep
                const t = performance.now() / 2000;
                const grad = ctx.createLinearGradient(0, 0, w, 0);
                for (let i = 0; i <= 6; i++) {
                    grad.addColorStop(i / 6, `hsla(${((t + i / 6) % 1) * 360},100%,55%,0.35)`);
                }
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
                return;
            }

            const data = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(data);
            const bins = data.length;
            const barW = w / bins;

            for (let i = 0; i < bins; i++) {
                const v = data[i] / 255;              // 0–1
                const hue = (i / bins) * 360;         // full rainbow across width
                const lightness = 35 + v * 40;        // 35%–75%
                const alpha = 0.15 + v * 0.85;        // dim when silent
                ctx.fillStyle = `hsla(${hue},100%,${lightness}%,${alpha})`;
                ctx.fillRect(i * barW, 0, Math.ceil(barW), h);
            }
        };

        draw();
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                width: "100%",
                height: "3px",
                display: "block",
                pointerEvents: "none",
            }}
        />
    );
}

function formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MiniPlayer() {
    const theme = useTheme();
    const isEnhanced = theme.palette.mode === "dark";
    const isRich = useUiStore((s) => s.visualMode === "rich");

    const currentIndex = usePlaylistStore((s) => s.currentIndex);
    const isPlaying = usePlaylistStore((s) => s.isPlaying);
    const currentTime = usePlaylistStore((s) => s.currentTime);
    const duration = usePlaylistStore((s) => s.duration);
    const isPanelOpen = usePlaylistStore((s) => s.isPanelOpen);
    const togglePlay = usePlaylistStore((s) => s.togglePlay);
    const nextTrack = usePlaylistStore((s) => s.nextTrack);
    const prevTrack = usePlaylistStore((s) => s.prevTrack);
    const seekTo = usePlaylistStore((s) => s.seekTo);
    const setCurrentTime = usePlaylistStore((s) => s.setCurrentTime);
    const togglePanel = usePlaylistStore((s) => s.togglePanel);

    const track = playlist[currentIndex];

    const bg = isEnhanced ? "rgba(18,18,18,0.6)" : "rgba(255,255,255,0.92)";
    const border = isEnhanced
        ? "1px solid rgba(0,214,252,0.12)"
        : `1px solid ${theme.palette.divider}`;
    const activeColor = isEnhanced ? "#00d6fc" : theme.palette.primary.main;
    const iconColor = isEnhanced ? "rgba(255,255,255,0.7)" : theme.palette.text.secondary;
    const iconHover = isEnhanced ? "#fff" : theme.palette.text.primary;
    const sliderColor = isEnhanced ? "#00d6fc" : theme.palette.primary.main;

    const handleSeek = (_: Event, value: number | number[]) => {
        const t = value as number;
        seekTo?.(t);
        setCurrentTime(t);
    };

    return (
        <>
            <PlaylistPanel open={isPanelOpen} />

            <motion.div
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.3 }}
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                }}
            >
                <Box
                    sx={{
                        background: bg,
                        backdropFilter: "blur(20px)",
                        borderTop: border,
                        px: { xs: 1.5, sm: 3 },
                        py: 0,
                        height: 72,
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr auto auto", sm: "1fr 2fr 1fr" },
                        alignItems: "center",
                        gap: { xs: 1, sm: 2 },
                    }}
                >
                    {/* ── Left: track info ── */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                borderRadius: 1.5,
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: isEnhanced
                                    ? "rgba(0,214,252,0.1)"
                                    : theme.palette.action.hover,
                                border: `1px solid ${activeColor}33`,
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            <BsMusicNoteBeamed size={16} color={activeColor} />
                            {isPlaying && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        bgcolor: `${activeColor}18`,
                                        animation: "pulse 2s ease-in-out infinite",
                                        "@keyframes pulse": {
                                            "0%, 100%": { opacity: 0 },
                                            "50%": { opacity: 1 },
                                        },
                                    }}
                                />
                            )}
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="body2"
                                noWrap
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "0.82rem",
                                    color: isEnhanced ? "#fff" : "text.primary",
                                    ...(isPlaying && isEnhanced && {
                                        color: activeColor,
                                        textShadow: "0 0 8px rgba(0,214,252,0.5)",
                                    }),
                                }}
                            >
                                {track.title}
                            </Typography>
                            <Typography
                                variant="caption"
                                noWrap
                                sx={{
                                    color: isEnhanced ? "rgba(255,255,255,0.4)" : "text.secondary",
                                    fontSize: "0.72rem",
                                }}
                            >
                                {track.artist}
                            </Typography>
                        </Box>
                    </Box>

                    {/* ── Center: controls + progress ── */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0.5,
                        }}
                    >
                        {/* Playback buttons */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
                            <IconButton
                                size="small"
                                onClick={prevTrack}
                                sx={{ color: iconColor, "&:hover": { color: iconHover } }}
                            >
                                <IoPlaySkipBack size={16} />
                            </IconButton>

                            <IconButton
                                onClick={togglePlay}
                                sx={{
                                    width: 34,
                                    height: 34,
                                    bgcolor: isEnhanced ? "#fff" : "text.primary",
                                    color: isEnhanced ? "#000" : "#fff",
                                    "&:hover": {
                                        bgcolor: isEnhanced ? activeColor : "primary.dark",
                                        transform: "scale(1.06)",
                                    },
                                    transition: "all 0.15s ease",
                                }}
                            >
                                {isPlaying ? <IoPause size={16} /> : <IoPlay size={16} />}
                            </IconButton>

                            <IconButton
                                size="small"
                                onClick={nextTrack}
                                sx={{ color: iconColor, "&:hover": { color: iconHover } }}
                            >
                                <IoPlaySkipForward size={16} />
                            </IconButton>
                        </Box>

                        {/* Progress bar */}
                        <Box
                            sx={{
                                display: { xs: "none", sm: "flex" },
                                alignItems: "center",
                                gap: 1,
                                width: "100%",
                                maxWidth: 340,
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: isEnhanced ? "rgba(255,255,255,0.4)" : "text.secondary",
                                    fontSize: "0.68rem",
                                    minWidth: 30,
                                    textAlign: "right",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {formatTime(currentTime)}
                            </Typography>

                            <Slider
                                size="small"
                                min={0}
                                max={duration || 1}
                                value={currentTime}
                                onChange={handleSeek}
                                sx={{
                                    flex: 1,
                                    color: sliderColor,
                                    height: 3,
                                    padding: "10px 0",
                                    "& .MuiSlider-thumb": {
                                        width: 10,
                                        height: 10,
                                        opacity: 0,
                                        transition: "opacity 0.15s",
                                        "&:hover, &.Mui-active": { opacity: 1 },
                                        boxShadow: `0 0 6px ${activeColor}88`,
                                    },
                                    "&:hover .MuiSlider-thumb": { opacity: 1 },
                                    "& .MuiSlider-rail": {
                                        bgcolor: isEnhanced ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)",
                                    },
                                }}
                            />

                            <Typography
                                variant="caption"
                                sx={{
                                    color: isEnhanced ? "rgba(255,255,255,0.4)" : "text.secondary",
                                    fontSize: "0.68rem",
                                    minWidth: 30,
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {formatTime(duration)}
                            </Typography>
                        </Box>
                    </Box>

                    {/* ── Right: playlist toggle ── */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5 }}>
                        <IconButton
                            size="small"
                            onClick={togglePanel}
                            title="Playlist"
                            sx={{
                                color: isPanelOpen ? activeColor : iconColor,
                                "&:hover": { color: iconHover },
                                ...(isPanelOpen && isEnhanced && {
                                    filter: "drop-shadow(0 0 6px rgba(0,214,252,0.6))",
                                }),
                            }}
                        >
                            <IoList size={18} />
                        </IconButton>
                    </Box>
                </Box>

                {/* Spectrum bar — audio-reactive rainbow across the top */}
                {isRich && <SpectrumBar />}
            </motion.div>
        </>
    );
}
