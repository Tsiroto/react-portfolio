import { Box, Typography, Container, Stack, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import PhotoCarousel from "@/components/PhotoCarousel";

const skills = [
    "React", "TypeScript", "JavaScript", "MUI",
    "Framer Motion", "GSAP", "Zustand", "React Native",
    "WordPress", "Elementor", "HTML", "CSS",
];

export default function About() {
    const theme = useTheme();
    const isEnhanced = theme.palette.mode === "dark";

    return (
        <Box
            sx={{
                position: "relative",
                zIndex: 1,
                minHeight: "100vh",
                bgcolor: isEnhanced ? "transparent" : "background.default",
                pt: 12,
                pb: 10,
            }}
        >
            <Container maxWidth="md">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    {/* Title */}
                    <Typography
                        variant="overline"
                        sx={{
                            color: "primary.main",
                            letterSpacing: "0.3em",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                        }}
                    >
                        Who I Am
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 900,
                            mt: 0.5,
                            mb: 5,
                            ...(isEnhanced && {
                                textShadow: "0 0 20px rgba(0,188,212,0.3)",
                            }),
                        }}
                    >
                        About Me
                    </Typography>

                    {/* Photo carousel */}
                    <Box mb={8}>
                        <PhotoCarousel />
                    </Box>

                    {/* Bio */}
                    <Typography
                        variant="body1"
                        sx={{ color: "text.secondary", lineHeight: 1.85, fontSize: "1.05rem", mb: 2 }}
                    >
                        I'm a frontend developer and project manager based in Athens, focused on building clean, functional, and user-driven web experiences.
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: "text.secondary", lineHeight: 1.85, fontSize: "1.05rem", mb: 2 }}
                    >
                        My background is a mix of development and real-world project work. I've worked extensively with WordPress, creating custom themes, working with ACF, and handling everything from layout implementation to performance improvements. I'm comfortable with HTML, CSS, JavaScript, and tools like Bootstrap and jQuery, and I've also started expanding into React to move toward more modern frontend development.
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: "text.secondary", lineHeight: 1.85, fontSize: "1.05rem", mb: 2 }}
                    >
                        What sets me apart isn't just the code—it's the way I approach projects. I understand both the technical and business side. I've worked with marketers, optimized websites based on performance data, and managed projects from concept to delivery. That means I don't just build things that "work"—I build things that make sense.
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: "text.secondary", lineHeight: 1.85, fontSize: "1.05rem", mb: 6 }}
                    >
                        Right now, I'm focused on improving my React skills while continuing to build and refine real-world projects.
                    </Typography>

                    {/* Skills */}
                    <Typography component="h3" variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Skills & Technologies
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {skills.map((skill) => (
                            <Chip
                                key={skill}
                                label={skill}
                                sx={{
                                    bgcolor: isEnhanced
                                        ? "rgba(0,214,252,0.08)"
                                        : "action.hover",
                                    color: isEnhanced ? "#00d6fc" : "text.primary",
                                    border: isEnhanced
                                        ? "1px solid rgba(0,214,252,0.25)"
                                        : "1px solid",
                                    borderColor: isEnhanced ? "transparent" : "divider",
                                    fontWeight: 500,
                                    fontSize: "0.8rem",
                                }}
                            />
                        ))}
                    </Stack>
                </motion.div>
            </Container>
        </Box>
    );
}
