import { Box, Container, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export default function GlobalFooter() {
    const theme = useTheme();
    const isEnhanced = theme.palette.mode === "dark";
    const [disclaimerOpen, setDisclaimerOpen] = useState(false);

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
                                href="https://github.com/Tsiroto"
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
                                href="https://www.linkedin.com/in/georgios-ntoufas/"
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                }}
            >
                <Typography variant="caption" sx={{ color: "text.secondary", opacity: 0.5 }}>
                    © {new Date().getFullYear()} Giorgos Ntoufas
                </Typography>
                <Typography
                    variant="caption"
                    onClick={() => setDisclaimerOpen(true)}
                    sx={{
                        color: "text.secondary",
                        opacity: 0.35,
                        cursor: "pointer",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                        "&:hover": { opacity: 0.7 },
                        transition: "opacity 0.2s",
                    }}
                >
                    Disclaimers & Credits
                </Typography>
            </Box>

            {/* Disclaimers Modal */}
            <Dialog
                open={disclaimerOpen}
                onClose={() => setDisclaimerOpen(false)}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: isEnhanced ? "#0d0d0d" : "background.paper",
                            border: isEnhanced ? "1px solid rgba(0,214,252,0.15)" : undefined,
                            borderRadius: 2,
                        },
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Disclaimers & Credits</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        AI Assistance
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 3, lineHeight: 1.8 }}>
                        Parts of this project were built with the assistance of AI tools, including code generation
                        and copy refinement. The concept, design, visual direction, and all source material are
                        entirely my own.
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        Audio Credits
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                        The music featured on this site is used for personal/portfolio purposes only. I do not own,
                        claim, or hold any rights to any of the audio tracks. All rights belong to their respective
                        artists and rights holders. No commercial use is intended.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setDisclaimerOpen(false)} variant="text" size="small">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
