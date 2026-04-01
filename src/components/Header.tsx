import { useState } from "react";
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import OptionsModal from "@/components/OptionsModal";

const navLinks = [
    { label: "Projects", to: "/projects" },
    { label: "About", to: "/about" },
];

export default function Header() {
    const theme = useTheme();
    const isEnhanced = theme.palette.mode === "dark";
    const [optionsOpen, setOptionsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleContact = () => {
        if (location.pathname === "/home") {
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate("/home");
            setTimeout(() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }, 300);
        }
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: isEnhanced
                        ? "rgba(0,0,0,0.6)"
                        : "rgba(255,255,255,0.8)",
                    boxShadow: "none",
                    backdropFilter: "blur(12px)",
                    borderBottom: isEnhanced
                        ? "1px solid rgba(0,214,252,0.15)"
                        : "1px solid rgba(0,0,0,0.08)",
                    zIndex: 10,
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/home"
                        sx={{
                            fontWeight: 700,
                            textDecoration: "none",
                            color: "text.primary",
                            letterSpacing: isEnhanced ? "0.05em" : "normal",
                            ...(isEnhanced && {
                                textShadow: "0 0 12px rgba(0,214,252,0.5)",
                            }),
                        }}
                    >
                        Giorgos Ntoufas
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {navLinks.map((link) => (
                            <Button
                                key={link.to}
                                component={Link}
                                to={link.to}
                                color="inherit"
                                sx={{
                                    fontSize: "0.85rem",
                                    letterSpacing: "0.05em",
                                    opacity: 0.85,
                                    "&:hover": { opacity: 1 },
                                }}
                            >
                                {link.label}
                            </Button>
                        ))}
                        <Button
                            color="inherit"
                            onClick={handleContact}
                            sx={{
                                fontSize: "0.85rem",
                                letterSpacing: "0.05em",
                                opacity: 0.85,
                                "&:hover": { opacity: 1 },
                            }}
                        >
                            Contact
                        </Button>

                        <Tooltip title="Options">
                            <IconButton
                                onClick={() => setOptionsOpen(true)}
                                size="small"
                                aria-label="Open options"
                                sx={{
                                    ml: 0.5,
                                    color: isEnhanced ? "rgba(255,255,255,0.65)" : "text.secondary",
                                    "&:hover": {
                                        color: isEnhanced ? "#00d6fc" : "text.primary",
                                        ...(isEnhanced && {
                                            filter: "drop-shadow(0 0 6px rgba(0,214,252,0.5))",
                                        }),
                                    },
                                    transition: "all 0.2s",
                                }}
                            >
                                <IoSettingsOutline size={18} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>

            <OptionsModal open={optionsOpen} onClose={() => setOptionsOpen(false)} />
        </>
    );
}
