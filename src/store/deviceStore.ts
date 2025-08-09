import { create } from "zustand";
import type { InputMethod } from "@/types/types";
import { detectDeviceType } from "./device";

interface DeviceState {
    deviceType: InputMethod;
    setDeviceType: (type: InputMethod) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
    deviceType: detectDeviceType(),
    setDeviceType: (type) => set({ deviceType: type }),
}));

// Attach listener to detect changes in input capabilities
if (typeof window !== "undefined") {
    const updateDeviceType = () => {
        const newType = detectDeviceType();

        // Log in development mode for QA
        if (import.meta.env.DEV) {
            console.log(`[DeviceStore] Device type changed to: ${newType}`);
        }

        useDeviceStore.setState({ deviceType: newType });
    };

    // Runs when the pointing device changes (e.g., mouse ↔ touch)
    window.matchMedia("(pointer: coarse)").addEventListener("change", updateDeviceType);

    // Fallback: re-check on resize (some devices swap modes on orientation change)
    window.addEventListener("resize", updateDeviceType);
}
