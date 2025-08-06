import { useState } from "react";
import AudioVisualizer from "./AudioVisualizer";
import Hello from "./Hello.tsx";
import useDeviceType from "./useDeviceType";
import "@/styles/welcomeScreen.css";

const WelcomeScreen = ({ onComplete }: { onComplete: () => void }) => {
    const { inputMethod } = useDeviceType();
    const [started, setStarted] = useState(false);

    const handleStart = () => {
        setStarted(true);
        setTimeout(() => onComplete(), 3000); // Placeholder
    };

    return (
        <div className="hero-loader">
            <AudioVisualizer isActive={started} />
            {!started && (
                <Hello deviceType={inputMethod} onStart={handleStart} />
            )}
        </div>
    );
};

export default WelcomeScreen;
