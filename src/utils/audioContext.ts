let _ctx: AudioContext | null = null;

/**
 * Returns the shared AudioContext, creating it if needed.
 * Safe to call outside a gesture — but the context will be suspended until
 * unlockAudioContext() is called from a user interaction.
 */
export function getOrCreateAudioContext(): AudioContext | null {
    const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    if (!_ctx || _ctx.state === "closed") {
        _ctx = new Ctor();
    }
    return _ctx;
}

/**
 * Call this synchronously inside a user gesture handler (tap / click).
 * Resumes the shared context and plays a silent one-frame buffer, which is
 * required to fully unlock Web Audio on iOS Safari.
 */
export function unlockAudioContext(): void {
    const ctx = getOrCreateAudioContext();
    if (!ctx || ctx.state !== "suspended") return;
    ctx.resume().catch(() => {});
    try {
        const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0);
    } catch {
        // ignore — resume() alone is usually enough on Android
    }
}
