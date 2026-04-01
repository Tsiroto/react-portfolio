import { Box, Typography, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { IoClose } from "react-icons/io5";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { playlist } from "@/data/playlist";
import { usePlaylistStore } from "@/store/playlistStore";
import "@/styles/equalizer.css";

type Props = { open: boolean };

export default function PlaylistPanel({ open }: Props) {
    const theme = useTheme();
    const isEnhanced = theme.palette.mode === "dark";

    const currentIndex = usePlaylistStore((s) => s.currentIndex);
    const isPlaying = usePlaylistStore((s) => s.isPlaying);
    const playTrack = usePlaylistStore((s) => s.playTrack);
    const closePanel = usePlaylistStore((s) => s.closePanel);

    const bg = isEnhanced ? "#121212" : theme.palette.background.paper;
    const border = isEnhanced ? "1px solid rgba(255,255,255,0.08)" : `1px solid ${theme.palette.divider}`;
    const trackHover = isEnhanced ? "rgba(255,255,255,0.06)" : theme.palette.action.hover;
    const activeColor = isEnhanced ? "#00d6fc" : theme.palette.primary.main;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Click-outside backdrop */}
                    <Box
                        onClick={closePanel}
                        sx={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 100,
                        }}
                    />
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 340, damping: 28 }}
                    style={{
                        position: "fixed",
                        bottom: 80,
                        right: 16,
                        width: 340,
                        maxHeight: 460,
                        zIndex: 101,
                        borderRadius: 12,
                        overflow: "hidden",
                        background: bg,
                        border,
                        boxShadow: isEnhanced
                            ? "0 8px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,214,252,0.06)"
                            : "0 8px 32px rgba(0,0,0,0.15)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            px: 2,
                            py: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: border,
                            flexShrink: 0,
                        }}
                    >
                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "0.95rem",
                                    color: isEnhanced ? "#fff" : "text.primary",
                                    letterSpacing: isEnhanced ? "0.05em" : "normal",
                                    ...(isEnhanced && {
                                        textShadow: "0 0 10px rgba(0,214,252,0.4)",
                                    }),
                                }}
                            >
                                Playlist
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ color: isEnhanced ? "rgba(255,255,255,0.4)" : "text.secondary" }}
                            >
                                {playlist.length} {playlist.length === 1 ? "song" : "songs"}
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={closePanel}
                            sx={{
                                color: isEnhanced ? "rgba(255,255,255,0.5)" : "text.secondary",
                                "&:hover": { color: isEnhanced ? "#fff" : "text.primary" },
                            }}
                        >
                            <IoClose size={18} />
                        </IconButton>
                    </Box>

                    {/* Track list */}
                    <Box sx={{ overflowY: "auto", flex: 1, py: 0.5 }}>
                        {playlist.map((track, i) => {
                            const isActive = i === currentIndex;
                            const isActiveAndPlaying = isActive && isPlaying;

                            return (
                                <Box
                                    key={track.id}
                                    onClick={() => playTrack(i)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        px: 2,
                                        py: 1,
                                        cursor: "pointer",
                                        borderRadius: 1,
                                        mx: 0.5,
                                        bgcolor: isActive
                                            ? (isEnhanced ? "rgba(0,214,252,0.08)" : `${theme.palette.primary.main}12`)
                                            : "transparent",
                                        "&:hover": { bgcolor: trackHover },
                                        transition: "background 0.15s",
                                    }}
                                >
                                    {/* Track number / equalizer */}
                                    <Box
                                        sx={{
                                            width: 28,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {isActiveAndPlaying ? (
                                            <Box className="equalizer">
                                                <span />
                                                <span />
                                                <span />
                                            </Box>
                                        ) : (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: isActive
                                                        ? activeColor
                                                        : (isEnhanced ? "rgba(255,255,255,0.35)" : "text.secondary"),
                                                    fontWeight: isActive ? 700 : 400,
                                                    fontSize: "0.8rem",
                                                    lineHeight: 1,
                                                }}
                                            >
                                                {i + 1}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Album art placeholder */}
                                    <Box
                                        sx={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: 1,
                                            flexShrink: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            bgcolor: isEnhanced
                                                ? (isActive ? "rgba(0,214,252,0.15)" : "rgba(255,255,255,0.05)")
                                                : (isActive ? `${theme.palette.primary.main}20` : theme.palette.action.hover),
                                            border: isActive
                                                ? `1px solid ${activeColor}44`
                                                : "1px solid transparent",
                                        }}
                                    >
                                        <BsMusicNoteBeamed
                                            size={15}
                                            color={isActive ? activeColor : (isEnhanced ? "rgba(255,255,255,0.3)" : theme.palette.text.secondary)}
                                        />
                                    </Box>

                                    {/* Title + artist */}
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography
                                            variant="body2"
                                            noWrap
                                            sx={{
                                                fontWeight: isActive ? 600 : 400,
                                                fontSize: "0.85rem",
                                                color: isActive
                                                    ? activeColor
                                                    : (isEnhanced ? "#fff" : "text.primary"),
                                            }}
                                        >
                                            {track.title}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            noWrap
                                            sx={{
                                                color: isEnhanced ? "rgba(255,255,255,0.4)" : "text.secondary",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            {track.artist}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
