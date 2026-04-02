import { useEffect, useRef, useState } from "react";
import { Box, Typography, Chip, Button, IconButton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FiArrowLeft, FiArrowRight, FiExternalLink } from "react-icons/fi";
import gsap from "gsap";
import { projects } from "@/data/projects";
import { useUiStore } from "@/store/uiStore";
import { useSfx } from "@/hooks/useSfx";

export default function HomeProjectSlider() {
    const theme = useTheme();
    const isEnhanced = theme.palette.mode === "dark";
    const isRich = useUiStore((s) => s.visualMode === "rich");

    const { playSwipe } = useSfx();
    const [current, setCurrent] = useState(0);
    const currentRef = useRef(0);
    const isAnimatingRef = useRef(false);

    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Init: GSAP owns all positioning from the start
    useEffect(() => {
        slideRefs.current.forEach((el, i) => {
            if (!el) return;
            gsap.set(el, { xPercent: i === 0 ? 0 : 100, visibility: "visible" });
        });
    }, []);

    const goTo = (nextIdx: number) => {
        if (isAnimatingRef.current || nextIdx === currentRef.current) return;

        const outIdx = currentRef.current;
        const dir = nextIdx > outIdx ? 1 : -1;

        const outSlide = slideRefs.current[outIdx];
        const inSlide = slideRefs.current[nextIdx];
        const inContent = contentRefs.current[nextIdx];

        if (!outSlide || !inSlide) return;

        isAnimatingRef.current = true;

        gsap.set(inSlide, { xPercent: dir * 100 });

        const tl = gsap.timeline({
            onComplete: () => {
                isAnimatingRef.current = false;
                currentRef.current = nextIdx;
                setCurrent(nextIdx);
            },
        });

        tl.to(outSlide, { xPercent: -dir * 100, duration: 0.65, ease: "power3.inOut" }, 0);
        tl.to(inSlide, { xPercent: 0, duration: 0.65, ease: "power3.inOut" }, 0);

        if (inContent) {
            const children = Array.from(inContent.children) as HTMLElement[];
            tl.fromTo(
                children,
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.07, duration: 0.45, ease: "power2.out" },
                0.3
            );
        }
    };

    const prev = () => { playSwipe(); goTo((currentRef.current - 1 + projects.length) % projects.length); };
    const next = () => { playSwipe(); goTo((currentRef.current + 1) % projects.length); };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Autoplay — rich mode only
    useEffect(() => {
        if (!isRich) return;
        const id = window.setInterval(() => {
            goTo((currentRef.current + 1) % projects.length);
        }, 3000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRich]);

    const accentColor = isEnhanced ? "#00d6fc" : theme.palette.primary.main;

    return (
        <Box sx={{ width: "100%", position: "relative" }}>
            {/* Slide viewport */}
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: 340, sm: 420, md: 520 },
                    overflow: "hidden",
                    borderRadius: "12px",
                    ...(isEnhanced && {
                        border: "1px solid rgba(0,214,252,0.12)",
                        boxShadow: "0 0 40px rgba(0,0,0,0.6)",
                    }),
                }}
            >
                {projects.map((project, i) => (
                    <Box
                        key={project.id}
                        ref={(el) => { slideRefs.current[i] = el as HTMLDivElement | null; }}
                        sx={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: project.backgroundColor,
                            willChange: "transform",
                            // Hidden until GSAP init effect runs — prevents flash/overflow
                            visibility: i === 0 ? "visible" : "hidden",
                        }}
                    >
                        {/* Project image — right half */}
                        <Box
                            sx={{
                                display: { xs: "none", md: "block" },
                                position: "absolute",
                                top: 0,
                                right: 0,
                                width: "45%",
                                height: "100%",
                                overflow: "hidden",
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
                                    opacity: 0.6,
                                    maskImage: "linear-gradient(to right, transparent 0%, black 30%)",
                                    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%)",
                                }}
                            />
                        </Box>

                        <Box
                            ref={(el) => { contentRefs.current[i] = el as HTMLDivElement | null; }}
                            sx={{ maxWidth: 560, width: "100%", px: { xs: 3, sm: 4, md: 8 }, position: "relative", zIndex: 1 }}
                        >
                            <Typography
                                variant="overline"
                                sx={{
                                    color: accentColor,
                                    letterSpacing: "0.3em",
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    display: "block",
                                    mb: 1,
                                    opacity: 0.8,
                                }}
                            >
                                {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                            </Typography>

                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    color: project.textColor,
                                    fontSize: { xs: "1.35rem", sm: "2rem", md: "2.6rem" },
                                    lineHeight: 1.1,
                                    mb: 1,
                                    ...(isEnhanced && {
                                        textShadow: "0 0 20px rgba(0,188,212,0.25)",
                                    }),
                                }}
                            >
                                {project.title}
                            </Typography>

                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: project.textColor,
                                    opacity: 0.65,
                                    mb: 2,
                                    fontSize: { xs: "0.9rem", md: "1rem" },
                                }}
                            >
                                {project.subtitle}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: project.textColor,
                                    opacity: 0.55,
                                    lineHeight: 1.75,
                                    mb: 3,
                                    maxWidth: 460,
                                    fontSize: "0.9rem",
                                    display: { xs: "none", sm: "block" },
                                }}
                            >
                                {project.description}
                            </Typography>

                            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
                                {project.tags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        size="small"
                                        sx={{
                                            bgcolor: "rgba(255,255,255,0.1)",
                                            color: project.textColor,
                                            border: "1px solid rgba(255,255,255,0.2)",
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
                                        borderColor: "rgba(255,255,255,0.35)",
                                        color: project.textColor,
                                        fontSize: "0.8rem",
                                        "&:hover": {
                                            borderColor: "rgba(255,255,255,0.7)",
                                            bgcolor: "rgba(255,255,255,0.08)",
                                        },
                                    }}
                                >
                                    View Project
                                </Button>
                            )}
                        </Box>
                    </Box>
                ))}

                {/* Arrow buttons */}
                <IconButton
                    onClick={prev}
                    aria-label="Previous project"
                    sx={{
                        position: "absolute",
                        left: { xs: 8, md: 16 },
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2,
                        bgcolor: "rgba(0,0,0,0.4)",
                        color: "#fff",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.65)" },
                        backdropFilter: "blur(4px)",
                    }}
                >
                    <FiArrowLeft size={18} />
                </IconButton>
                <IconButton
                    onClick={next}
                    aria-label="Next project"
                    sx={{
                        position: "absolute",
                        right: { xs: 8, md: 16 },
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2,
                        bgcolor: "rgba(0,0,0,0.4)",
                        color: "#fff",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.65)" },
                        backdropFilter: "blur(4px)",
                    }}
                >
                    <FiArrowRight size={18} />
                </IconButton>
            </Box>

            {/* Thumbnail strip */}
            <Box
                sx={{
                    display: "flex",
                    gap: 1.5,
                    mt: 2,
                    px: 0.5,
                    overflowX: "auto",
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                {projects.map((project, i) => (
                    <Box
                        key={project.id}
                        onClick={() => { playSwipe(); goTo(i); }}
                        sx={{ flexShrink: 0, width: { xs: 100, sm: 120 }, cursor: "pointer" }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                height: { xs: 56, sm: 64 },
                                borderRadius: "6px",
                                backgroundColor: project.backgroundColor,
                                backgroundImage: `url(${project.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                border: current === i
                                    ? `1px solid ${accentColor}`
                                    : "1px solid transparent",
                                boxShadow: current === i
                                    ? `0 0 12px ${accentColor}55`
                                    : "none",
                                transition: "border-color 0.125s, box-shadow 0.125s, opacity 0.125s",
                                opacity: current === i ? 1 : 0.5,
                                "&:hover": { opacity: 0.9 },
                            }}
                        />
                        <Typography
                            sx={{
                                mt: 0.75,
                                color: "text.secondary",
                                fontSize: "0.65rem",
                                fontWeight: current === i ? 700 : 400,
                                lineHeight: 1.2,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                transition: "font-weight 0.125s",
                            }}
                        >
                            {project.title}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
