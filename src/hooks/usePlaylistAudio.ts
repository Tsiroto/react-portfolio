import { useEffect, useRef } from "react";
import { useAudioStore } from "@/store/audioStore";
import { usePlaylistStore } from "@/store/playlistStore";
import { useUiStore } from "@/store/uiStore";
import { playlist } from "@/data/playlist";
import { getOrCreateAudioContext } from "@/utils/audioContext";

// Shared analyser — any component can read frequency data from this
export const playlistAnalyserRef: { current: AnalyserNode | null } = { current: null };

export function usePlaylistAudio() {
    const hasInteracted = useAudioStore((s) => s.hasInteracted);
    const isMuted = useAudioStore((s) => s.isMuted);
    const bgVolume = useAudioStore((s) => s.bgVolume);

    const visualMode = useUiStore((s) => s.visualMode);
    const isRich = visualMode === "rich";

    const currentIndex = usePlaylistStore((s) => s.currentIndex);
    const isPlaying = usePlaylistStore((s) => s.isPlaying);
    const setHasInteracted = useAudioStore((s) => s.setHasInteracted);
    const setIsPlaying = usePlaylistStore((s) => s.setIsPlaying);
    const nextTrack = usePlaylistStore((s) => s.nextTrack);
    const setCurrentTime = usePlaylistStore((s) => s.setCurrentTime);
    const setDuration = usePlaylistStore((s) => s.setDuration);
    const registerSeek = usePlaylistStore((s) => s.registerSeek);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const gainRef = useRef<GainNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    // Refs so effects can read latest values without being re-triggered
    const isPlayingRef = useRef(isPlaying);
    isPlayingRef.current = isPlaying;

    const isMutedRef = useRef(isMuted);
    isMutedRef.current = isMuted;

    const bgVolumeRef = useRef(bgVolume);
    bgVolumeRef.current = bgVolume;

    // Whether music was playing before the last mute — used to resume on unmute
    const wasPlayingBeforeMuteRef = useRef(false);

    // Auto-start in rich/enhanced mode — delayed 2s to leave space after welcome music fades
    useEffect(() => {
        if (!isRich || !hasInteracted) return;
        const t = window.setTimeout(() => setIsPlaying(true), 1000);
        return () => clearTimeout(t);
    }, [isRich, hasInteracted, setIsPlaying]);

    // Pause when muted, resume when unmuted (if it was playing before)
    useEffect(() => {
        if (isMuted) {
            wasPlayingBeforeMuteRef.current = isPlayingRef.current;
            setIsPlaying(false);
        } else {
            if (wasPlayingBeforeMuteRef.current) {
                setIsPlaying(true);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMuted]);

    // Create / replace the audio element whenever the track or interaction state changes
    useEffect(() => {
        if (!hasInteracted) return;

        const track = playlist[currentIndex];
        const audio = new Audio(track.src);
        audio.preload = "auto";
        // Keep audio.volume at 1 — volume is controlled via GainNode (works on iOS)
        audio.volume = 1;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => { nextTrack(); };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        audioRef.current = audio;

        // Build Web Audio graph: source → gain → analyser → destination
        // GainNode controls volume on all platforms including iOS (unlike audio.volume)
        try {
            const ctx = getOrCreateAudioContext();
            if (ctx) {
                if (ctx.state === "suspended") ctx.resume().catch(() => {});

                const source = ctx.createMediaElementSource(audio);
                const gain = ctx.createGain();
                const analyser = ctx.createAnalyser();
                analyser.fftSize = 256;

                gain.gain.value = isMutedRef.current ? 0 : bgVolumeRef.current;

                source.connect(gain);
                gain.connect(analyser);
                analyser.connect(ctx.destination);

                sourceRef.current = source;
                gainRef.current = gain;
                playlistAnalyserRef.current = analyser;
            }
        } catch {
            // analyser unavailable — visuals degrade gracefully
        }

        if (isPlayingRef.current) {
            audio.play().catch(() => {});
        }

        return () => {
            audio.pause();
            audio.src = "";
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
            // Disconnect all nodes so the AudioContext is clean for next track
            sourceRef.current?.disconnect();
            gainRef.current?.disconnect();
            playlistAnalyserRef.current?.disconnect();
            if (audioRef.current === audio) audioRef.current = null;
            sourceRef.current = null;
            gainRef.current = null;
            playlistAnalyserRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, hasInteracted]);

    // Register the seek bridge with the store
    useEffect(() => {
        registerSeek((time) => {
            if (audioRef.current) {
                audioRef.current.currentTime = time;
            }
        });
    }, [registerSeek]);

    // Sync play / pause
    useEffect(() => {
        if (isPlaying && !hasInteracted) {
            setHasInteracted(true);
            return;
        }
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.play().catch(() => {});
        } else {
            audio.pause();
        }
    }, [isPlaying, hasInteracted, setHasInteracted]);

    // Sync volume via GainNode (works on iOS) with audio.volume as fallback
    useEffect(() => {
        const level = isMuted ? 0 : bgVolume;
        if (gainRef.current) {
            gainRef.current.gain.value = level;
        } else if (audioRef.current) {
            audioRef.current.volume = level;
        }
    }, [isMuted, bgVolume]);
}
