import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";

const imageModules = import.meta.glob(
    "../assets/img/me/*.{jpg,png}",
    { eager: true }
) as Record<string, { default: string }>;

const photos = Object.entries(imageModules)
    .map(([path, mod]) => {
        const filename = path.split("/").pop()!.replace(/\.(jpg|png)$/, "");
        return { src: mod.default, filename };
    })
    .filter((p) => p.filename !== "pro-1")
    .sort((a, b) => a.filename.localeCompare(b.filename));

const INTERVAL = 2800;

export default function HomePhotoSlider() {
    const theme = useTheme();
    const isEnhanced = theme.palette.mode === "dark";
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const t = setInterval(
            () => setIndex((prev) => (prev + 1) % photos.length),
            INTERVAL
        );
        return () => clearInterval(t);
    }, [paused]);

    if (photos.length === 0) return null;

    return (
        <Box
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            sx={{
                position: "relative",
                width: "100%",
                maxWidth: { xs: "100%", sm: 480 },
                mx: "auto",
                aspectRatio: "9/16",
                maxHeight: { xs: 420, sm: 540 },
                borderRadius: 1,
                overflow: "hidden",
                border: "1px solid",
                borderColor: isEnhanced ? "rgba(0,214,252,0.15)" : "divider",
                boxShadow: isEnhanced
                    ? "0 0 40px rgba(0,214,252,0.08)"
                    : "0 8px 40px rgba(0,0,0,0.1)",
            }}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Box
                        component="img"
                        src={photos[index].src}
                        alt="About photo"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "top",
                            display: "block",
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Dot indicators */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 0.75,
                    zIndex: 2,
                }}
            >
                {photos.map((_, i) => (
                    <Box
                        key={i}
                        onClick={() => setIndex(i)}
                        sx={{
                            width: i === index ? 16 : 6,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: i === index ? "#fff" : "rgba(255,255,255,0.45)",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            "&:hover": { bgcolor: "#fff" },
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}
