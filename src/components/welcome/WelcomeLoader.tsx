import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import type { WelcomeLoaderProps } from "@/types/types";
import "../../styles/welcomeLoader.css";

const WelcomeLoader = ({ duration = 3000, onComplete }: WelcomeLoaderProps) => {
    const [progress, setProgress] = useState(1);

    useEffect(() => {
        const totalSteps = 100;
        const intervalTime = duration / totalSteps;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Use setTimeout to call onComplete asynchronously, preventing setState during render
                    setTimeout(() => onComplete?.(), 0);
                    return 100;
                }
                return prev + 1;
            });
        }, intervalTime);

        return () => clearInterval(interval);
    }, [duration, onComplete]);

    return (
        <Box className="loader">
            <Typography id="counter" component="span">
                Loading {progress}%
            </Typography>
            <Box className="spinner" />
        </Box>
    );
};

export default WelcomeLoader;
