import { useState } from "react";
import {
    Box, Typography, Container, Card, CardContent,
    Stack, Chip, Button,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { FiExternalLink } from "react-icons/fi";
import { projects, filterOptions } from "@/data/projects";
import type { Project } from "@/data/projects";

type FilterState = {
    framework: string[];
    stack: string[];
    features: string[];
};

const EMPTY: FilterState = { framework: [], stack: [], features: [] };

function toggle(arr: string[], value: string): string[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function matchesFilters(project: Project, active: FilterState): boolean {
    const { framework, stack, features } = active;
    if (framework.length && !framework.some((f) => project.filters.framework.includes(f))) return false;
    if (stack.length && !stack.some((s) => project.filters.stack.includes(s))) return false;
    if (features.length && !features.some((f) => project.filters.features.includes(f))) return false;
    return true;
}

const filterGroups: { key: keyof FilterState; label: string }[] = [
    { key: "framework", label: "Framework" },
    { key: "stack", label: "Tech Stack" },
    { key: "features", label: "Features" },
];

export default function Projects() {
    const theme = useTheme();
    const isEnhanced = theme.palette.mode === "dark";
    const accentColor = isEnhanced ? "#00d6fc" : theme.palette.primary.main;

    const [active, setActive] = useState<FilterState>(EMPTY);

    const hasActiveFilters = Object.values(active).some((arr) => arr.length > 0);
    const filtered = projects.filter((p) => matchesFilters(p, active));

    const sectionBorder = isEnhanced
        ? "1px solid rgba(0,214,252,0.1)"
        : `1px solid ${theme.palette.divider}`;

    return (
        <Box
            sx={{
                position: "relative",
                zIndex: 1,
                minHeight: "100vh",
                bgcolor: isEnhanced ? "transparent" : "background.default",
                pt: 10,
                pb: 6,
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography
                        variant="overline"
                        sx={{ color: "primary.main", letterSpacing: "0.3em", fontSize: "0.75rem", fontWeight: 600 }}
                    >
                        Portfolio
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 900,
                            mt: 0.5,
                            mb: 1,
                            ...(isEnhanced && { textShadow: "0 0 20px rgba(0,188,212,0.3)" }),
                        }}
                    >
                        Projects
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary", mb: 5, maxWidth: 540, lineHeight: 1.7 }}>
                        A selection of work spanning WordPress, React, and beyond.
                    </Typography>
                </motion.div>

                {/* Filter row */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <Box
                        sx={{
                            mb: 5,
                            p: 2.5,
                            borderRadius: 2,
                            border: sectionBorder,
                            bgcolor: isEnhanced ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                        }}
                    >
                        <Stack spacing={2}>
                            {filterGroups.map(({ key, label }) => (
                                <Box key={key}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "text.secondary",
                                            fontWeight: 700,
                                            letterSpacing: "0.12em",
                                            textTransform: "uppercase",
                                            fontSize: "0.65rem",
                                            display: "block",
                                            mb: 1,
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                    <Stack direction="row" flexWrap="wrap" gap={1}>
                                        {filterOptions[key].map((option) => {
                                            const selected = active[key].includes(option);
                                            return (
                                                <Chip
                                                    key={option}
                                                    label={option}
                                                    size="small"
                                                    onClick={() =>
                                                        setActive((prev) => ({
                                                            ...prev,
                                                            [key]: toggle(prev[key], option),
                                                        }))
                                                    }
                                                    sx={{
                                                        cursor: "pointer",
                                                        fontWeight: selected ? 700 : 400,
                                                        fontSize: "0.75rem",
                                                        bgcolor: selected
                                                            ? isEnhanced ? `${accentColor}22` : `${accentColor}18`
                                                            : "transparent",
                                                        color: selected ? accentColor : "text.secondary",
                                                        border: `1px solid ${selected ? accentColor : (isEnhanced ? "rgba(255,255,255,0.12)" : theme.palette.divider)}`,
                                                        transition: "all 0.18s",
                                                        "&:hover": {
                                                            bgcolor: isEnhanced ? "rgba(255,255,255,0.06)" : "action.hover",
                                                            borderColor: accentColor,
                                                        },
                                                    }}
                                                />
                                            );
                                        })}
                                    </Stack>
                                </Box>
                            ))}

                            {/* Clear button */}
                            {hasActiveFilters && (
                                <Box>
                                    <Button
                                        size="small"
                                        onClick={() => setActive(EMPTY)}
                                        sx={{
                                            fontSize: "0.72rem",
                                            color: "text.secondary",
                                            px: 1.5,
                                            minHeight: 0,
                                            "&:hover": { color: accentColor },
                                        }}
                                    >
                                        Clear filters
                                    </Button>
                                </Box>
                            )}
                        </Stack>
                    </Box>
                </motion.div>

                {/* Results count */}
                <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", display: "block", mb: 2.5, fontSize: "0.78rem" }}
                >
                    {filtered.length} {filtered.length === 1 ? "project" : "projects"}
                    {hasActiveFilters && " matching filters"}
                </Typography>

                {/* Project grid */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                        gap: 3,
                    }}
                >
                    <AnimatePresence mode="popLayout">
                        {filtered.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.25 }}
                            >
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        border: sectionBorder,
                                        bgcolor: isEnhanced
                                            ? "rgba(14,14,14,0.85)"
                                            : theme.palette.background.paper,
                                        boxShadow: isEnhanced ? "0 4px 24px rgba(0,0,0,0.5)" : theme.shadows[2],
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: isEnhanced
                                                ? "0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,214,252,0.15)"
                                                : theme.shadows[8],
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 180,
                                            overflow: "hidden",
                                            position: "relative",
                                            bgcolor: project.backgroundColor,
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
                                                objectPosition: "top",
                                                display: "block",
                                                transition: "transform 0.4s ease",
                                                ".MuiCard-root:hover &": {
                                                    transform: "scale(1.04)",
                                                },
                                            }}
                                        />
                                    </Box>

                                    <CardContent sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column" }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 0.5,
                                                ...(isEnhanced && { textShadow: "0 0 10px rgba(0,188,212,0.2)" }),
                                            }}
                                        >
                                            {project.title}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "primary.main",
                                                fontWeight: 600,
                                                letterSpacing: "0.04em",
                                                display: "block",
                                                mb: 1.5,
                                            }}
                                        >
                                            {project.subtitle}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "text.secondary", lineHeight: 1.75, flex: 1, mb: 2.5 }}
                                        >
                                            {project.description}
                                        </Typography>

                                        <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mb: 2.5 }}>
                                            {project.tags.map((tag) => (
                                                <Chip
                                                    key={tag}
                                                    label={tag}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: isEnhanced ? "rgba(0,214,252,0.08)" : "action.hover",
                                                        color: isEnhanced ? "#00d6fc" : "text.primary",
                                                        border: isEnhanced
                                                            ? "1px solid rgba(0,214,252,0.25)"
                                                            : `1px solid ${theme.palette.divider}`,
                                                        fontSize: "0.72rem",
                                                        fontWeight: 500,
                                                    }}
                                                />
                                            ))}
                                        </Stack>

                                        {project.link !== "#" && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                endIcon={<FiExternalLink size={13} />}
                                                sx={{
                                                    alignSelf: "flex-start",
                                                    fontSize: "0.8rem",
                                                    ...(isEnhanced && {
                                                        borderColor: "rgba(0,214,252,0.4)",
                                                        color: "#00d6fc",
                                                        "&:hover": {
                                                            borderColor: "#00d6fc",
                                                            bgcolor: "rgba(0,214,252,0.05)",
                                                        },
                                                    }),
                                                }}
                                            >
                                                View Project
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </Box>

                {/* Empty state */}
                {filtered.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 10 }}>
                        <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
                            No projects match the selected filters.
                        </Typography>
                        <Button size="small" onClick={() => setActive(EMPTY)} sx={{ color: accentColor }}>
                            Clear filters
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
