import WelcomeLoader from "./WelcomeLoader";
import { DURATIONS } from "@/config/constants";

export default function LoaderGate({
                                       active,
                                       onComplete,
                                   }: {
    active: boolean;
    onComplete: () => void;
}) {
    if (!active) return null;
    return (
        <div style={{ position: "relative", zIndex: 2 }}>
            <WelcomeLoader duration={DURATIONS.loadingDefault} onComplete={onComplete} />
        </div>
    );
}
