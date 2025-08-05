import { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../data/projects";
import gsap from "gsap";
import { FaPause, FaPlay } from "react-icons/fa";

const slideVariants = {
    initial: { opacity: 0, x: "100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "-100%" },
};

export default function ProjectSlider() {
    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const project = projects[index];

    const bgRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<number | null>(null);

    // Auto Slide
    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = window.setInterval(() => {
                setIndex((prev) => (prev + 1) % projects.length);
            }, 5000);
        } else {
            clearInterval(intervalRef.current!);
        }

        return () => clearInterval(intervalRef.current!);
    }, [isPlaying]);

    // GSAP floating background animation
    useEffect(() => {
        if (bgRef.current) {
            gsap.to(".floating", {
                y: "-=30",
                duration: 3,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.2,
            });
        }
    }, []);

    // Parallax on mouse move
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 20;
            const y = (e.clientY / innerHeight - 0.5) * 20;
            gsap.to(bgRef.current, {
                x,
                y,
                duration: 0.5,
                ease: "power2.out",
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const togglePlay = () => setIsPlaying((prev) => !prev);

    return (
        <Box
            ref={containerRef}
            sx={{
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Floating background */}
            <Box
                ref={bgRef}
                sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                    overflow: "hidden",
                }}
            >
                {[...Array(6)].map((_, i) => (
                    <Box
                        key={i}
                        className="floating"
                        sx={{
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            backgroundColor: "rgba(255,255,255,0.05)",
                            position: "absolute",
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            transform: "translate(-50%, -50%)",
                            zIndex: 0,
                        }}
                    />
                ))}
            </Box>

            {/* Slide content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={project.id}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.6 }}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backgroundColor: project.backgroundColor,
                        color: project.textColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        zIndex: 1,
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Typography variant="h3" gutterBottom>
                            {project.title}
                        </Typography>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Typography variant="h6" gutterBottom>
                            {project.subtitle}
                        </Typography>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Button variant="outlined" onClick={() => setIndex((prev) => (prev + 1) % projects.length)}>
                            Next Project
                        </Button>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Play / Pause Button */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    zIndex: 2,
                }}
            >
                <IconButton onClick={togglePlay} sx={{ color: "white" }}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </IconButton>
            </Box>
        </Box>
    );
}
