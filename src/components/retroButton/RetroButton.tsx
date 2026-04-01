import { Button, type ButtonProps } from "@mui/material";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "./RetroButton.module.css";

interface RetroButtonProps extends ButtonProps {
    selected?: boolean;
}

export default function RetroButton({ selected = false, children, ...props }: RetroButtonProps) {
    const rectsRef = useRef<SVGRectElement[]>([]);

    useEffect(() => {
        if (selected) {
            gsap.to(rectsRef.current, {
                duration: 0.8,
                ease: "elastic.out(1, 0.3)",
                x: "100%",
                stagger: 0.01,
                overwrite: true,
            });

            gsap.fromTo(
                rectsRef.current,
                { fill: "#0c79f7" },
                {
                    fill: "#76b3fa",
                    duration: 0.1,
                    repeat: -1,
                }
            );
        } else {
            gsap.to(rectsRef.current, {
                duration: 0.8,
                ease: "elastic.out(1, 0.3)",
                x: "-100%",
                stagger: 0.01,
                overwrite: true,
            });
        }
    }, [selected]);

    return (
        <Button
            className={`${styles.retroButton} ${selected ? styles.selected : ""}`}
            {...props}
        >
            <span className={styles.label}>{children}</span>

            <svg className={styles.scanlines} width="100%" height="100%">
                <g className="left">
                    {Array.from({ length: 25 }).map((_, i) => (
                        <rect
                            key={i}
                            ref={(el) => {
                                if (el) rectsRef.current[i] = el;
                            }}
                            x="-100%"
                            y={i * 2}
                            width="100%"
                            height="2"
                        />
                    ))}
                </g>
            </svg>
        </Button>
    );
}
