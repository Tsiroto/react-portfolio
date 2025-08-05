import { useState } from "react";
import AudioVisualizer from "./AudioVisualizer";
import GlowingPrompt from "./GlowingPrompt";
import useDeviceType from "./useDeviceType";

const HeroLoader = ({ onComplete }: { onComplete: () => void }) => {
    const { inputMethod } = useDeviceType(); // ✅ get correct value
    const [started, setStarted] = useState(false);

    const handleStart = () => {
        setStarted(true);
        setTimeout(() => onComplete(), 3000); // Placeholder
    };

    return (
        <div className="hero-loader">
            <AudioVisualizer isActive={started} />
            {!started && (
                <GlowingPrompt deviceType={inputMethod} onStart={handleStart} />
            )}
        </div>
    );
};

export default HeroLoader;
