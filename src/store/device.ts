import type { InputMethod } from "@/types/types";

export function detectDeviceType(): InputMethod {
    if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
        return "touch";
    }
    return "keyboard";
}
