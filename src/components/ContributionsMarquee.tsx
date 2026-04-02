import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { contributions } from "@/data/projects";
import { useUiStore } from "@/store/uiStore";

// Duplicate the list so the marquee loops seamlessly
const items = [...contributions, ...contributions];

export default function ContributionsMarquee() {
    const theme = useTheme();
    const isEnhanced = theme.palette.mode === "dark";
    const isRich = useUiStore((s) => s.visualMode === "rich");

    const separator = isEnhanced ? "rgba(0,214,252,0.3)" : theme.palette.divider;
    const textColor = isEnhanced ? "rgba(255,255,255,0.38)" : "text.disabled";

    return (
        <Box sx={{ width: "100%", overflow: "hidden", position: "relative" }}>
            {/* Fade edges */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: "none",
                    background: isEnhanced
                        ? "linear-gradient(to right, rgba(5,5,5,0.9) 0%, transparent 12%, transparent 88%, rgba(5,5,5,0.9) 100%)"
                        : `linear-gradient(to right, ${theme.palette.background.paper} 0%, transparent 12%, transparent 88%, ${theme.palette.background.paper} 100%)`,
                }}
            />

            <Box
                sx={{
                    display: "flex",
                    gap: 0,
                    width: "max-content",
                    "@keyframes marquee": {
                        "0%": { transform: "translateX(0)" },
                        "100%": { transform: "translateX(-50%)" },
                    },
                    animation: isRich ? "marquee 22s linear infinite" : "none",
                    "&:hover": { animationPlayState: "paused" },
                }}
            >
                {items.map((url, i) => (
                    <Box
                        key={i}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0,
                            flexShrink: 0,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: "monospace",
                                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                color: textColor,
                                px: 3,
                                py: 0.5,
                                whiteSpace: "nowrap",
                                transition: "color 0.2s",
                                "&:hover": {
                                    color: isEnhanced ? "rgba(0,214,252,0.7)" : "text.secondary",
                                },
                            }}
                        >
                            {url}
                        </Typography>
                        <Box
                            sx={{
                                width: "1px",
                                height: "14px",
                                bgcolor: separator,
                                flexShrink: 0,
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
