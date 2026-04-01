import { useState, useEffect, useCallback } from "react";
import { Box, Chip, Stack, Typography, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const imageModules = import.meta.glob(
    "../assets/img/me/*.{jpg,png}",
    { eager: true }
) as Record<string, { default: string }>;

type Photo = { src: string; filename: string; category: string };

function getCategory(filename: string): string {
    if (filename.startsWith("ai-epic")) return "AI Epic";
    if (filename.startsWith("ai-funny")) return "AI Funny";
    if (filename.startsWith("ai-normal")) return "AI Normal";
    if (filename.startsWith("ai-art")) return "AI Art";
    if (filename.startsWith("anime")) return "Anime";
    if (filename.startsWith("pro")) return "Pro";
    if (filename.startsWith("normal")) return "Normal";
    if (filename.startsWith("funny")) return "Funny";
    return "Other";
}

const allPhotos: Photo[] = Object.entries(imageModules)
    .map(([path, mod]) => {
        const filename = path.split("/").pop()!.replace(/\.(jpg|png)$/, "");
        return { src: mod.default, filename, category: getCategory(filename) };
    })
    .filter((p) => p.filename !== "pro-1")
    .sort((a, b) => a.filename.localeCompare(b.filename));

const categoryOrder = ["Pro", "Normal", "Funny", "Anime", "AI Art", "AI Epic", "AI Funny", "AI Normal"];
const availableCategories = [
    "All",
    ...categoryOrder.filter((c) => allPhotos.some((p) => p.category === c)),
];

const VISIBLE = 3;
const INTERVAL = 3500;

export default function PhotoCarousel() {
    const theme = useTheme();
    const isEnhanced = theme.palette.mode === "dark";
    const [activeCategory, setActiveCategory] = useState("All");
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [dir, setDir] = useState(1);

    const filtered =
        activeCategory === "All"
            ? allPhotos
            : allPhotos.filter((p) => p.category === activeCategory);

    const advance = useCallback(
        (d: number) => {
            setDir(d);
            setIndex((prev) => (prev + d * VISIBLE + filtered.length) % filtered.length);
        },
        [filtered.length]
    );

    useEffect(() => {
        setIndex(0);
    }, [activeCategory]);

    useEffect(() => {
        if (paused) return;
        const t = setInterval(() => advance(1), INTERVAL);
        return () => clearInterval(t);
    }, [paused, advance]);

    if (filtered.length === 0) return null;

    const visibleCount = Math.min(VISIBLE, filtered.length);
    const visible = Array.from({ length: visibleCount }, (_, i) =>
        filtered[(index + i) % filtered.length]
    );

    return (
        <Box>
            {/* Category filters */}
            <Stack direction="row" flexWrap="wrap" gap={1} mb={3}>
                {availableCategories.map((cat) => (
                    <Chip
                        key={cat}
                        label={cat}
                        onClick={() => setActiveCategory(cat)}
                        sx={{
                            cursor: "pointer",
                            fontWeight: activeCategory === cat ? 700 : 500,
                            fontSize: "0.78rem",
                            bgcolor:
                                activeCategory === cat
                                    ? isEnhanced
                                        ? "rgba(0,214,252,0.12)"
                                        : "primary.main"
                                    : isEnhanced
                                    ? "rgba(255,255,255,0.04)"
                                    : "action.hover",
                            color:
                                activeCategory === cat
                                    ? isEnhanced
                                        ? "#00d6fc"
                                        : "#fff"
                                    : "text.secondary",
                            border: "1px solid",
                            borderColor:
                                activeCategory === cat
                                    ? isEnhanced
                                        ? "rgba(0,214,252,0.4)"
                                        : "primary.main"
                                    : isEnhanced
                                    ? "rgba(255,255,255,0.07)"
                                    : "divider",
                            "&:hover": {
                                bgcolor: isEnhanced
                                    ? "rgba(0,214,252,0.08)"
                                    : "action.selected",
                            },
                            transition: "all 0.2s",
                        }}
                    />
                ))}
            </Stack>

            {/* Carousel */}
            <Box
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={`${activeCategory}-${index}`}
                        initial={{ opacity: 0, x: dir > 0 ? 40 : -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: dir > 0 ? -40 : 40 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(3, 1fr)",
                                },
                                gap: 2,
                            }}
                        >
                            {visible.map((photo) => (
                                <Box key={photo.filename}>
                                    <Box
                                        sx={{
                                            borderRadius: 2,
                                            overflow: "hidden",
                                            aspectRatio: "3/4",
                                            bgcolor: isEnhanced
                                                ? "rgba(255,255,255,0.03)"
                                                : "grey.100",
                                            border: "1px solid",
                                            borderColor: isEnhanced
                                                ? "rgba(255,255,255,0.07)"
                                                : "divider",
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={photo.src}
                                            alt={photo.category}
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
                                                transition: "transform 0.4s ease",
                                                "&:hover": { transform: "scale(1.04)" },
                                            }}
                                        />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </motion.div>
                </AnimatePresence>

                {/* Nav */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        mt: 2.5,
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={() => advance(-1)}
                        sx={{
                            color: isEnhanced ? "rgba(0,214,252,0.7)" : "text.secondary",
                            border: "1px solid",
                            borderColor: isEnhanced ? "rgba(0,214,252,0.25)" : "divider",
                            "&:hover": {
                                borderColor: isEnhanced ? "#00d6fc" : "primary.main",
                            },
                        }}
                    >
                        <FiChevronLeft size={16} />
                    </IconButton>

                    <Typography
                        variant="caption"
                        sx={{ color: "text.disabled", minWidth: 60, textAlign: "center" }}
                    >
                        {Math.floor(index / VISIBLE) + 1} / {Math.ceil(filtered.length / VISIBLE)}
                    </Typography>

                    <IconButton
                        size="small"
                        onClick={() => advance(1)}
                        sx={{
                            color: isEnhanced ? "rgba(0,214,252,0.7)" : "text.secondary",
                            border: "1px solid",
                            borderColor: isEnhanced ? "rgba(0,214,252,0.25)" : "divider",
                            "&:hover": {
                                borderColor: isEnhanced ? "#00d6fc" : "primary.main",
                            },
                        }}
                    >
                        <FiChevronRight size={16} />
                    </IconButton>
                </Box>
            </Box>

            {/* Disclaimer */}
            <Typography
                variant="caption"
                sx={{
                    display: "block",
                    textAlign: "center",
                    mt: 2,
                    color: "text.disabled",
                    fontStyle: "italic",
                    fontSize: "0.72rem",
                }}
            >
                * No AI was harmed during this photoshoot. The AI-generated ones, however, demanded royalties.
            </Typography>
        </Box>
    );
}
