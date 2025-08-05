import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";

const sections = [
    { label: "Projects", anchor: "#projects" },
    { label: "Showcase", anchor: "#showcase" },
    { label: "Contact", anchor: "#contact" },
];

export default function Header() {
    return (
        <AppBar
            position="fixed"
            sx={{
                background: "transparent",
                boxShadow: "none",
                backdropFilter: "blur(10px)",
                zIndex: 10,
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Giorgos Ntoufas
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                    {sections.map((sec) => (
                        <Button
                            key={sec.anchor}
                            href={sec.anchor}
                            color="inherit"
                            sx={{ fontSize: "0.9rem" }}
                        >
                            {sec.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
