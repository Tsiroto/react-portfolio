// src/utils/modeMapping.ts
import type { VisitorMode, Mode } from "@/types/types";

/** Storage key for persisted theme mode */
export const THEME_STORAGE_KEY = "themeMode";

/** Map visitor-facing label → actual MUI theme mode */
export const visitorToTheme = (m: VisitorMode): Mode =>
    m === "light" ? "light" : "dark";

/** Map theme mode → visitor-facing label */
export const themeToVisitor = (m: Mode): VisitorMode =>
    m === "light" ? "light" : "enhanced";

/** Runtime check for safe localStorage usage (SSR-safe) */
const canUseStorage = () =>
    typeof window !== "undefined" && typeof window.localStorage !== "undefined";

/** Persist a theme mode ("light" | "dark") */
export function saveThemeMode(mode: Mode): void {
    if (!canUseStorage()) return;
    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
        // noop
    }
}

/** Load a theme mode from storage, with a fallback (default: "dark") */
export function loadThemeMode(fallback: Mode = "dark"): Mode {
    if (!canUseStorage()) return fallback;
    try {
        const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
        return raw === "light" || raw === "dark" ? (raw as Mode) : fallback;
    } catch {
        return fallback;
    }
}

/** Convenience: persist based on visitor choice ("light" | "enhanced") */
export function persistFromVisitorMode(
    visitorMode: VisitorMode,
    fallback: Mode = "dark"
): Mode {
    const themeMode = visitorToTheme(visitorMode) || fallback;
    saveThemeMode(themeMode);
    return themeMode;
}

/** Optional: clear saved theme mode */
export function clearSavedThemeMode(): void {
    if (!canUseStorage()) return;
    try {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
    } catch {
        // noop
    }
}
