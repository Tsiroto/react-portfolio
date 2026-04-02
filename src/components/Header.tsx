import { useState } from "react";
import { useSfx } from "@/hooks/useSfx";
import {
    AppBar, Box, Toolbar, Typography, Button, IconButton,
    Tooltip, Drawer, List, ListItemButton, ListItemText, Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoSettingsOutline, IoCloseOutline, IoMenuOutline } from "react-icons/io5";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import OptionsModal from "@/components/OptionsModal";

const navLinks = [
    { label: "Home", to: "/" },
    { label: "Projects", to: "/projects" },
    { label: "About", to: "/about" },
];

export default function Header() {
    const theme = useTheme();
    const isEnhanced = theme.palette.mode === "dark";
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [optionsOpen, setOptionsOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { playClick, playHover, playMenuOpen, playMenuClose } = useSfx();

    const handleContact = () => {
        setDrawerOpen(false);
        if (location.pathname === "/") {
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate("/");
            setTimeout(() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }, 300);
        }
    };

    const activeColor = isEnhanced ? "#00d6fc" : theme.palette.primary.main;

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: isEnhanced
                        ? "rgba(0,0,0,0.6)"
                        : "rgba(255,255,255,0.88)",
                    boxShadow: "none",
                    backdropFilter: "blur(12px)",
                    borderBottom: isEnhanced
                        ? "1px solid rgba(0,214,252,0.15)"
                        : "1px solid rgba(0,0,0,0.08)",
                    zIndex: 10,
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: { xs: 56, md: 64 } }}>
                    {/* Logo */}
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            fontWeight: 700,
                            textDecoration: "none",
                            color: "text.primary",
                            fontSize: { xs: "1rem", md: "1.1rem" },
                            letterSpacing: isEnhanced ? "0.05em" : "normal",
                            ...(isEnhanced && {
                                textShadow: "0 0 12px rgba(0,214,252,0.5)",
                            }),
                        }}
                    >
                        Giorgos Ntoufas
                    </Typography>

                    {/* Desktop nav */}
                    {!isMobile && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            {navLinks.filter(l => l.to !== "/").map((link) => (
                                <Button
                                    key={link.to}
                                    component={Link}
                                    to={link.to}
                                    color="inherit"
                                    onMouseEnter={playHover}
                                    onClick={playClick}
                                    sx={{
                                        fontSize: "0.85rem",
                                        letterSpacing: "0.05em",
                                        opacity: location.pathname === link.to ? 1 : 0.75,
                                        fontWeight: location.pathname === link.to ? 700 : 400,
                                        color: location.pathname === link.to ? activeColor : "inherit",
                                        "&:hover": { opacity: 1 },
                                    }}
                                >
                                    {link.label}
                                </Button>
                            ))}
                            <Button
                                color="inherit"
                                onClick={handleContact}
                                onMouseEnter={playHover}
                                sx={{ fontSize: "0.85rem", letterSpacing: "0.05em", opacity: 0.75, "&:hover": { opacity: 1 } }}
                            >
                                Contact
                            </Button>
                            <Tooltip title="Options">
                                <IconButton
                                    onClick={() => { playMenuOpen(); setOptionsOpen(true); }}
                                    size="small"
                                    sx={{
                                        ml: 0.5,
                                        color: isEnhanced ? "rgba(255,255,255,0.65)" : "text.secondary",
                                        "&:hover": {
                                            color: isEnhanced ? "#00d6fc" : "text.primary",
                                            ...(isEnhanced && { filter: "drop-shadow(0 0 6px rgba(0,214,252,0.5))" }),
                                        },
                                        transition: "all 0.2s",
                                    }}
                                >
                                    <IoSettingsOutline size={18} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}

                    {/* Mobile right icons */}
                    {isMobile && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <IconButton
                                onClick={() => setOptionsOpen(true)}
                                size="small"
                                sx={{
                                    color: isEnhanced ? "rgba(255,255,255,0.65)" : "text.secondary",
                                    "&:hover": { color: isEnhanced ? "#00d6fc" : "text.primary" },
                                }}
                            >
                                <IoSettingsOutline size={20} />
                            </IconButton>
                            <IconButton
                                onClick={() => { playMenuOpen(); setDrawerOpen(true); }}
                                size="small"
                                sx={{
                                    color: isEnhanced ? "rgba(255,255,255,0.85)" : "text.primary",
                                    "&:hover": { color: activeColor },
                                }}
                            >
                                <IoMenuOutline size={24} />
                            </IconButton>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {/* Mobile bottom drawer */}
            <Drawer
                anchor="bottom"
                open={drawerOpen}
                onClose={() => { playMenuClose(); setDrawerOpen(false); }}
                PaperProps={{
                    sx: {
                        background: isEnhanced ? "rgba(10,10,10,0.97)" : "rgba(255,255,255,0.98)",
                        backdropFilter: "blur(24px)",
                        borderTop: isEnhanced
                            ? "1px solid rgba(0,214,252,0.2)"
                            : `1px solid ${theme.palette.divider}`,
                        borderRadius: "20px 20px 0 0",
                        pb: "env(safe-area-inset-bottom)",
                    },
                }}
            >
                {/* Handle bar */}
                <Box sx={{ display: "flex", justifyContent: "center", pt: 1.5, pb: 0.5 }}>
                    <Box sx={{
                        width: 36, height: 4, borderRadius: 2,
                        bgcolor: isEnhanced ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
                    }} />
                </Box>

                {/* Drawer header */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 1.5 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 700,
                            color: isEnhanced ? "rgba(255,255,255,0.4)" : "text.disabled",
                            fontSize: "0.72rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                        }}
                    >
                        Navigation
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => { playMenuClose(); setDrawerOpen(false); }}
                        sx={{ color: isEnhanced ? "rgba(255,255,255,0.4)" : "text.secondary" }}
                    >
                        <IoCloseOutline size={20} />
                    </IconButton>
                </Box>

                <Divider sx={{ borderColor: isEnhanced ? "rgba(255,255,255,0.06)" : "divider" }} />

                {/* Nav links */}
                <List sx={{ px: 1, py: 1 }}>
                    {navLinks.map((link) => {
                        const active = location.pathname === link.to;
                        return (
                            <ListItemButton
                                key={link.to}
                                component={Link}
                                to={link.to}
                                onMouseEnter={playHover}
                                onClick={() => { playClick(); setDrawerOpen(false); }}
                                sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                    py: 1.5,
                                    px: 2.5,
                                    bgcolor: active
                                        ? (isEnhanced ? "rgba(0,214,252,0.08)" : `${theme.palette.primary.main}12`)
                                        : "transparent",
                                    "&:hover": {
                                        bgcolor: isEnhanced ? "rgba(0,214,252,0.06)" : `${theme.palette.primary.main}0A`,
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={link.label}
                                    primaryTypographyProps={{
                                        fontWeight: active ? 700 : 500,
                                        fontSize: "1.1rem",
                                        color: active ? activeColor : (isEnhanced ? "rgba(255,255,255,0.85)" : "text.primary"),
                                    }}
                                />
                                {active && (
                                    <Box sx={{
                                        width: 6, height: 6, borderRadius: "50%",
                                        bgcolor: activeColor,
                                        boxShadow: isEnhanced ? `0 0 8px ${activeColor}` : "none",
                                    }} />
                                )}
                            </ListItemButton>
                        );
                    })}

                    {/* Contact */}
                    <ListItemButton
                        onClick={handleContact}
                        onMouseEnter={playHover}
                        sx={{
                            borderRadius: 2,
                            py: 1.5,
                            px: 2.5,
                            "&:hover": {
                                bgcolor: isEnhanced ? "rgba(0,214,252,0.06)" : `${theme.palette.primary.main}0A`,
                            },
                        }}
                    >
                        <ListItemText
                            primary="Contact"
                            primaryTypographyProps={{
                                fontWeight: 500,
                                fontSize: "1.1rem",
                                color: isEnhanced ? "rgba(255,255,255,0.85)" : "text.primary",
                            }}
                        />
                    </ListItemButton>
                </List>

                <Divider sx={{ borderColor: isEnhanced ? "rgba(255,255,255,0.06)" : "divider" }} />

                {/* Social links */}
                <Box sx={{ display: "flex", gap: 1, px: 3, py: 2.5, alignItems: "center" }}>
                    <IconButton
                        component="a"
                        href="https://github.com/Tsiroto"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: isEnhanced ? "rgba(255,255,255,0.5)" : "text.secondary",
                            "&:hover": { color: activeColor },
                        }}
                    >
                        <FiGithub size={20} />
                    </IconButton>
                    <IconButton
                        component="a"
                        href="https://www.linkedin.com/in/georgios-ntoufas/"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: isEnhanced ? "rgba(255,255,255,0.5)" : "text.secondary",
                            "&:hover": { color: activeColor },
                        }}
                    >
                        <FiLinkedin size={20} />
                    </IconButton>
                </Box>
            </Drawer>

            <OptionsModal open={optionsOpen} onClose={() => { playMenuClose(); setOptionsOpen(false); }} />
        </>
    );
}
