import { Box, Typography, Container, Button, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import HomeProjectSlider from "@/components/HomeProjectSlider";
import HomePhotoSlider from "@/components/HomePhotoSlider";
import HeroParticles from "@/components/HeroParticles";

export default function Home() {
    const theme = useTheme();
    const isEnhanced = theme.palette.mode === "dark";

    const sectionBg = isEnhanced ? "rgba(5,5,5,0.75)" : theme.palette.background.paper;
    const sectionBorder = isEnhanced
        ? "1px solid rgba(0,214,252,0.1)"
        : `1px solid ${theme.palette.divider}`;

    return (
        <Box
            sx={{
                position: "relative",
                zIndex: 1,
                bgcolor: isEnhanced ? "transparent" : "background.default",
            }}
        >
            {/* ===== HERO ===== */}
            <Box
                id="hero"
                component="section"
                sx={{
                    height: "100dvh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    px: 3,
                    pt: 8,
                    position: "relative",
                    overflow: "hidden",
                    ...(isEnhanced && {
                        background:
                            "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 70%)",
                    }),
                }}
            >
                <HeroParticles />

                <Box sx={{
                    maxWidth: 720,
                    borderRadius: 2,
                    p: 2,
                    position: "relative",
                    zIndex: 1,
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Typography
                            variant="overline"
                            sx={{
                                color: "primary.main",
                                letterSpacing: "0.35em",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                display: "block",
                                mb: 1,
                            }}
                        >
                            Frontend Developer
                        </Typography>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: "2.6rem", sm: "3.5rem", md: "5rem" },
                                lineHeight: 1.05,
                                letterSpacing: "-0.02em",
                                color: "text.primary",
                                ...(isEnhanced && {
                                    textShadow:
                                        "0 0 40px rgba(0,188,212,0.6), 0 0 80px rgba(0,188,212,0.25)",
                                }),
                            }}
                        >
                            Giorgos Ntoufas
                        </Typography>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                color: "text.secondary",
                                mt: 2,
                                fontWeight: 300,
                                fontSize: { xs: "1rem", md: "1.25rem" },
                                lineHeight: 1.6,
                            }}
                        >
                            Building performant, web experiences.
                        </Typography>
                    </motion.div>
                </Box>

                {/* Scroll-down arrow */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    style={{ position: "absolute", bottom: 100 }}
                >
                    <Box
                        component="a"
                        href="#projects"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0.5,
                            cursor: "pointer",
                            textDecoration: "none",
                            color: isEnhanced ? "rgba(0,214,252,0.6)" : "text.secondary",
                            "&:hover": {
                                color: isEnhanced ? "#00d6fc" : "text.primary",
                            },
                            transition: "color 0.2s",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "0.65rem",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                opacity: 0.7,
                            }}
                        >
                            Scroll
                        </Typography>
                        <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <FiChevronDown size={22} />
                        </motion.div>
                    </Box>
                </motion.div>
            </Box>

            {/* ===== PROJECTS SLIDER ===== */}
            <Box
                id="projects"
                component="section"
                sx={{
                    bgcolor: sectionBg,
                    borderTop: sectionBorder,
                    backdropFilter: isEnhanced ? "blur(10px)" : "none",
                    py: { xs: 8, md: 12 },
                    scrollMarginTop: "64px",
                }}
            >
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography
                            variant="overline"
                            sx={{
                                color: "primary.main",
                                letterSpacing: "0.3em",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                            }}
                        >
                            Selected Work
                        </Typography>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                mt: 0.5,
                                mb: 4,
                                ...(isEnhanced && {
                                    textShadow: "0 0 20px rgba(0,188,212,0.3)",
                                }),
                            }}
                        >
                            Projects
                        </Typography>
                    </motion.div>

                    <HomeProjectSlider />

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Box sx={{ textAlign: "center", mt: 5 }}>
                            <Button
                                component={Link}
                                to="/projects"
                                variant="contained"
                                size="large"
                                sx={{
                                    px: 5,
                                    fontWeight: 700,
                                    ...(isEnhanced && {
                                        background: "linear-gradient(90deg, #ff00f0, #00eaff)",
                                        color: "#050505",
                                        boxShadow: "0 0 20px rgba(0,234,255,0.35)",
                                        "&:hover": { boxShadow: "0 0 32px rgba(0,234,255,0.6)" },
                                    }),
                                }}
                            >
                                View My Work
                            </Button>
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* ===== ABOUT SNIPPET ===== */}
            <Box
                id="contact"
                component="section"
                sx={{
                    py: { xs: 10, md: 14 },
                    bgcolor: isEnhanced ? "rgba(0,0,0,0.6)" : "background.default",
                    borderTop: sectionBorder,
                    backdropFilter: isEnhanced ? "blur(10px)" : "none",
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
                        {/* Left: text */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                            >
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: "primary.main",
                                        letterSpacing: "0.3em",
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        display: "block",
                                        textAlign: { xs: "center", md: "left" },
                                    }}
                                >
                                    Who I Am
                                </Typography>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 800,
                                        mt: 0.5,
                                        mb: 3,
                                        textAlign: { xs: "center", md: "left" },
                                        ...(isEnhanced && {
                                            textShadow: "0 0 20px rgba(0,188,212,0.3)",
                                        }),
                                    }}
                                >
                                    About Me
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: "text.secondary",
                                        lineHeight: 1.85,
                                        fontSize: "1.05rem",
                                        mb: 4,
                                        textAlign: { xs: "center", md: "left" },
                                    }}
                                >
                                    I'm a frontend developer based in Greece, passionate about
                                    crafting polished, interactive web experiences. I enjoy the
                                    intersection of design and engineering — turning ideas into
                                    products that look and feel great.
                                </Typography>
                                <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                                    <Button
                                        component={Link}
                                        to="/about"
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            px: 4,
                                            fontWeight: 600,
                                            ...(isEnhanced && {
                                                borderColor: "rgba(0,214,252,0.5)",
                                                color: "#00d6fc",
                                                "&:hover": {
                                                    borderColor: "#00d6fc",
                                                    background: "rgba(0,214,252,0.05)",
                                                },
                                            }),
                                        }}
                                    >
                                        Learn More
                                    </Button>
                                </Box>
                            </motion.div>
                        </Grid>

                        {/* Right: photo slider */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.15 }}
                            >
                                <HomePhotoSlider />
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: "block",
                                        textAlign: "center",
                                        mt: 1.5,
                                        color: "text.disabled",
                                        fontStyle: "italic",
                                        fontSize: "0.7rem",
                                    }}
                                >
                                    * No AI was harmed during this photoshoot.
                                </Typography>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
