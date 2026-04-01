import { Box, Container, Typography, Button, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export default function GlobalFooter() {
    const theme = useTheme();
    const isEnhanced = theme.palette.mode === "dark";

    const sectionBorder = isEnhanced
        ? "1px solid rgba(0,214,252,0.1)"
        : `1px solid ${theme.palette.divider}`;

    return (
        <>
            {/* ===== CONTACT ===== */}
            <Box
                id="contact"
                component="section"
                sx={{
                    py: { xs: 10, md: 14 },
                    textAlign: "center",
                    bgcolor: isEnhanced ? "rgba(5,5,5,0.75)" : theme.palette.background.paper,
                    borderTop: sectionBorder,
                    backdropFilter: isEnhanced ? "blur(10px)" : "none",
                }}
            >
                <Container maxWidth="sm">
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
                            }}
                        >
                            Let's Talk
                        </Typography>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                mt: 0.5,
                                mb: 2,
                                ...(isEnhanced && {
                                    textShadow: "0 0 20px rgba(0,188,212,0.3)",
                                }),
                            }}
                        >
                            Get In Touch
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: "text.secondary", mb: 4, lineHeight: 1.7 }}
                        >
                            Have a project in mind or just want to say hi? My inbox is always open.
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            href="mailto:doufasg@gmail.com"
                            startIcon={<FiMail />}
                            sx={{
                                px: 5,
                                mb: 4,
                                fontWeight: 700,
                                ...(isEnhanced && {
                                    background: "linear-gradient(90deg, #ff00f0, #00eaff)",
                                    color: "#050505",
                                    boxShadow: "0 0 20px rgba(0,234,255,0.35)",
                                    "&:hover": {
                                        boxShadow: "0 0 32px rgba(0,234,255,0.6)",
                                    },
                                }),
                            }}
                        >
                            Say Hello
                        </Button>

                        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                            <IconButton
                                component="a"
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    color: isEnhanced ? "rgba(255,255,255,0.6)" : "text.secondary",
                                    "&:hover": { color: isEnhanced ? "#00d6fc" : "primary.main" },
                                }}
                            >
                                <FiGithub size={22} />
                            </IconButton>
                            <IconButton
                                component="a"
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    color: isEnhanced ? "rgba(255,255,255,0.6)" : "text.secondary",
                                    "&:hover": { color: isEnhanced ? "#00d6fc" : "primary.main" },
                                }}
                            >
                                <FiLinkedin size={22} />
                            </IconButton>
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* Footer bar */}
            <Box
                component="footer"
                sx={{
                    py: 3,
                    pb: "calc(1.5rem + 72px)",
                    textAlign: "center",
                    borderTop: sectionBorder,
                    bgcolor: isEnhanced ? "rgba(0,0,0,0.8)" : "background.paper",
                }}
            >
                <Typography variant="caption" sx={{ color: "text.secondary", opacity: 0.5 }}>
                    © {new Date().getFullYear()} Giorgos Ntoufas
                </Typography>
            </Box>
        </>
    );
}
