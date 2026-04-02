import dhTImg from "@/assets/img/projects/dh-t.jpg";
import tbtImg from "@/assets/img/projects/tbt.jpg";
import plainImg from "@/assets/img/projects/plain.jpg";
import htbImg from "@/assets/img/projects/htb.jpg";
import gspImg from "@/assets/img/projects/gsp.jpg";
import chirotoImg from "@/assets/img/projects/chiroto.jpg";

export type Project = {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    link: string;
    tags: string[];
    backgroundColor: string;
    textColor: string;
    image: string;
    filters: {
        framework: string[];
        stack: string[];
        features: string[];
    };
};

export type DevProject = {
    id: number;
    title: string;
    description: string;
    link: string;
    tags: string[];
};

export const projects: Project[] = [
    {
        id: 1,
        title: "DH Tamarid",
        subtitle: "Website for Investment & Development Firm",
        description:
            "Pixel-perfect WordPress site built from a PSD design for a Greek investment and development firm. Fully responsive one-page layout with clean architecture, performance optimisation, SEO setup, and GDPR compliance.",
        link: "https://dh-tamarid.com/",
        tags: ["WordPress", "Elementor", "PSD to WordPress", "Custom Theme", "SEO", "Performance"],
        backgroundColor: "#0d1e2c",
        textColor: "#ffffff",
        image: dhTImg,
        filters: {
            framework: ["WordPress"],
            stack: ["Elementor"],
            features: ["PSD to WordPress", "Custom Theme", "SEO", "Performance"],
        },
    },
    {
        id: 2,
        title: "Truth Be Told",
        subtitle: "Website for Communications Strategy Consultancy",
        description:
            "Transformed meticulously crafted Figma designs into a fully responsive, pixel-perfect WordPress website for a UK-based communications consultancy. Bold editorial aesthetic with custom Elementor Pro implementation.",
        link: "https://truthbetold.co.uk/",
        tags: ["WordPress", "Elementor", "ACF", "Figma", "Custom Theme", "SEO", "Performance"],
        backgroundColor: "#0d0d0d",
        textColor: "#ffffff",
        image: tbtImg,
        filters: {
            framework: ["WordPress"],
            stack: ["Elementor", "Figma", "ACF"],
            features: ["Custom Theme", "SEO", "Performance"],
        },
    },
    {
        id: 3,
        title: "Plain Fine Dining",
        subtitle: "Website for Fine Dining Services Company",
        description:
            "Built a custom WordPress site for plain.gr, a premium fine dining and catering company. Focused on clean design, fast load times, and a visual aesthetic that matches the brand's refined, minimalist philosophy.",
        link: "https://plain.gr/",
        tags: ["WordPress", "Elementor"],
        backgroundColor: "#1a1410",
        textColor: "#ffffff",
        image: plainImg,
        filters: {
            framework: ["WordPress"],
            stack: ["Elementor"],
            features: [],
        },
    },
    {
        id: 4,
        title: "Human to Brand",
        subtitle: "Website for Marketing Consulting Agency",
        description:
            "Built the frontend of a modern, corporate WordPress site for a social media marketing consultancy. Used Elementor, Advanced Elementor, and Advanced Custom Fields on a custom WordPress theme, with a strong focus on UI/UX and content flexibility for the client.",
        link: "https://humantobrand.com/",
        tags: ["WordPress", "Elementor", "ACF", "Custom Theme"],
        backgroundColor: "#0f1e3a",
        textColor: "#ffffff",
        image: htbImg,
        filters: {
            framework: ["WordPress"],
            stack: ["Elementor", "ACF"],
            features: ["Custom Theme"],
        },
    },
    {
        id: 5,
        title: "GSP Capital",
        subtitle: "Corporate Website for Private Equity Firm",
        description:
            "Developed a clean, professional WordPress website for GSP Capital, a private equity firm. Focused on structured layout, responsive design, and performance optimisation to reflect the firm's identity and deliver a smooth, lightweight user experience.",
        link: "https://www.gspcapital.com/",
        tags: ["WordPress", "Elementor", "ACF", "Figma"],
        backgroundColor: "#161618",
        textColor: "#f0f0f0",
        image: gspImg,
        filters: {
            framework: ["WordPress"],
            stack: ["Elementor", "ACF", "Figma"],
            features: [],
        },
    },
    {
        id: 6,
        title: "chiroto.eu",
        subtitle: "Personal Portfolio",
        description:
            "My own interactive portfolio — built with React, Vite, TypeScript, and MUI. Features a dual-mode experience (Simple vs Rich), a dual theme mode (Light vs Dark), audio-reactive effects, a GSAP/Framer Motion animation system, and a custom Web Audio playlist player.",
        link: "https://chiroto.eu/",
        tags: ["React", "Vite", "TypeScript", "Zustand", "Framer Motion", "GSAP", "MUI"],
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        image: chirotoImg,
        filters: {
            framework: ["React"],
            stack: ["Vite", "TypeScript", "Zustand", "Framer Motion", "GSAP", "MUI"],
            features: [],
        },
    },
];

// Derive unique filter options from all projects
export const filterOptions = {
    framework: [...new Set(projects.flatMap((p) => p.filters.framework))].sort(),
    stack: [...new Set(projects.flatMap((p) => p.filters.stack))].sort(),
    features: [...new Set(projects.flatMap((p) => p.filters.features))].sort(),
};

export const contributions = [
    "oceansouth.us",
    "castria.gr",
    "cooling-electrical.gr",
    "seascapefolegandros.com",
    "stefaniaplaku.com",
    "hr-revo.com",
    "lifo.gr",
];

export const devProjects: DevProject[] = [
    {
        id: 1,
        title: "Insura",
        description: "A React insurance UI — built while training with component-driven architecture, form handling, and modern React patterns.",
        link: "https://chiroto.eu/insura",
        tags: ["React", "TypeScript"],
    },
    {
        id: 2,
        title: "React to People",
        description: "A React training project exploring interactive UI patterns, state management, and component composition.",
        link: "https://chiroto.eu/react-to-people",
        tags: ["React", "TypeScript"],
    },
];
