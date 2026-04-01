import { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, IconButton, Chip, Stack } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { projects } from "../data/projects";
import gsap from "gsap";
import { FaPause, FaPlay } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { useUiStore } from "@/store/uiStore";

const slideVariants = {
    initial: { opacity: 0, x: "6%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "-6%" },
};

export default function ProjectSlider() {
    const theme = useTheme();
    const isEnhanced = theme.palette.mode === "dark";
    const isRich = useUiStore((s) => s.visualMode === "rich");

    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const project = projects[index];

    const bgRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<number | null>(null);

    // Auto slide
    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = window.setInterval(() => {
                setIndex((prev) => (prev + 1) % projects.length);
            }, 6000);
        } else {
            clearInterval(intervalRef.current!);
        }
        return () => clearInterval(intervalRef.current!);
    }, [isPlaying]);

    // GSAP floating orbs (enhanced mode only)
    useEffect(() => {
        if (!isRich) return;
        gsap.to(".slider-orb", {
            y: "-=20",
            duration: 3,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            stagger: 0.3,
        });
    }, [isRich]);

    // Parallax on mouse move (enhanced mode only)
    useEffect(() => {
        if (!isRich) return;
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 15;
            const y = (e.clientY / window.innerHeight - 0.5) * 15;
            gsap.to(bgRef.current, { x, y, duration: 0.6, ease: "power2.out" });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isRich]);

    const goTo = (i: number) => setIndex(i);

    return (
        <Box
            sx={{
                width: "100%",
                height: "100vh",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Floating orbs background (rich mode only) */}
            {isRich && (
                <Box
                    ref={bgRef}
                    sx={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
                >
                    {[...Array(5)].map((_, i) => (
                        <Box
                            key={i}
                            className="slider-orb"
                            sx={{
                                width: { xs: 60, md: 100 },
                                height: { xs: 60, md: 100 },
                                borderRadius: "50%",
                                background: i % 2 === 0
                                    ? "radial-gradient(circle, rgba(0,214,252,0.12), transparent)"
                                    : "radial-gradient(circle, rgba(255,0,240,0.08), transparent)",
                                position: "absolute",
                                top: `${15 + i * 18}%`,
                                left: `${10 + i * 18}%`,
                            }}
                        />
                    ))}
                </Box>
            )}

            {/* Slide content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={project.id}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: isEnhanced ? project.backgroundColor : undefined,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1,
                    }}
                >
                    {/* Light mode gets a themed background */}
                    {!isEnhanced && (
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                bgcolor: "background.paper",
                                borderTop: "1px solid",
                                borderColor: "divider",
                            }}
                        />
                    )}

                    {/* Project image — right side */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "block" },
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "45%",
                            height: "100%",
                            overflow: "hidden",
                            zIndex: 1,
                        }}
                    >
                        <Box
                            component="img"
                            src={project.image}
                            alt={project.title}
                            sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                opacity: isEnhanced ? 0.55 : 0.75,
                                maskImage: "linear-gradient(to right, transparent 0%, black 30%)",
                                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%)",
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 2,
                            maxWidth: 700,
                            width: "100%",
                            px: { xs: 3, md: 6 },
                            textAlign: { xs: "center", md: "left" },
                            color: isEnhanced ? project.textColor : "text.primary",
                        }}
                    >
                        {/* Tags */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                justifyContent={{ xs: "center", md: "flex-start" }}
                                sx={{ mb: 2, gap: 0.5 }}
                            >
                                {project.tags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        size="small"
                                        sx={{
                                            bgcolor: isEnhanced ? "rgba(0,214,252,0.12)" : "primary.main",
                                            color: isEnhanced ? "#00d6fc" : "#fff",
                                            border: isEnhanced ? "1px solid rgba(0,214,252,0.3)" : "none",
                                            fontSize: "0.7rem",
                                            fontWeight: 600,
                                        }}
                                    />
                                ))}
                            </Stack>
                        </motion.div>

                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Typography
                                variant="h3"
                                gutterBottom
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: "1.8rem", md: "2.8rem" },
                                    ...(isEnhanced && {
                                        textShadow: "0 0 20px rgba(0,214,252,0.3)",
                                    }),
                                }}
                            >
                                {project.title}
                            </Typography>
                        </motion.div>

                        {/* Subtitle */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    opacity: 0.75,
                                    fontWeight: 400,
                                    fontSize: { xs: "1rem", md: "1.15rem" },
                                    mb: 1,
                                }}
                            >
                                {project.subtitle}
                            </Typography>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    opacity: 0.65,
                                    mb: 3,
                                    lineHeight: 1.7,
                                    maxWidth: 520,
                                    mx: { xs: "auto", md: 0 },
                                }}
                            >
                                {project.description}
                            </Typography>
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Stack
                                direction="row"
                                spacing={2}
                                justifyContent={{ xs: "center", md: "flex-start" }}
                            >
                                {project.link !== "#" ? (
                                    <Button
                                        variant="contained"
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        endIcon={<FiExternalLink />}
                                        sx={{
                                            ...(isEnhanced && {
                                                background: "linear-gradient(90deg, #ff00f0, #00eaff)",
                                                color: "#000",
                                                fontWeight: 700,
                                            }),
                                        }}
                                    >
                                        View Project
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        disabled
                                        sx={{ opacity: 0.4 }}
                                    >
                                        Coming Soon
                                    </Button>
                                )}
                            </Stack>
                        </motion.div>
                    </Box>
                </motion.div>
            </AnimatePresence>

            {/* Slide indicators */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 28,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 3,
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                }}
            >
                {projects.map((_, i) => (
                    <Box
                        key={i}
                        onClick={() => goTo(i)}
                        sx={{
                            width: i === index ? 24 : 8,
                            height: 8,
                            borderRadius: 4,
                            bgcolor: i === index
                                ? (isEnhanced ? "#00d6fc" : "primary.main")
                                : (isEnhanced ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"),
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                        }}
                    />
                ))}
            </Box>

            {/* Play / Pause */}
            <Box sx={{ position: "absolute", bottom: 20, right: 20, zIndex: 3 }}>
                <IconButton
                    onClick={() => setIsPlaying((p) => !p)}
                    size="small"
                    sx={{
                        color: isEnhanced ? "rgba(255,255,255,0.5)" : "text.secondary",
                        "&:hover": { color: isEnhanced ? "#00d6fc" : "text.primary" },
                    }}
                >
                    {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
                </IconButton>
            </Box>
        </Box>
    );
}
