import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import "../../styles/welcomeLoader.css";

interface WelcomeLoaderProps {
    duration?: number; // in ms
    onComplete?: () => void;
}

const WelcomeLoader = ({ duration = 3000, onComplete }: WelcomeLoaderProps) => {
    const [progress, setProgress] = useState(1);

    useEffect(() => {
        const totalSteps = 100;
        const intervalTime = duration / totalSteps;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    onComplete?.();
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
                Loading <i>{progress}%</i>
            </Typography>
            <Box className="spinner" />
        </Box>
    );
};

export default WelcomeLoader;
