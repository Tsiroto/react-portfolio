import { useEffect, useRef } from "react";
import { useAudioStore } from "@/store/audioStore";
import { usePlaylistStore } from "@/store/playlistStore";
import { useUiStore } from "@/store/uiStore";
import { playlist } from "@/data/playlist";

// Shared analyser — any component can read frequency data from this
export const playlistAnalyserRef: { current: AnalyserNode | null } = { current: null };
let _audioCtx: AudioContext | null = null;

/**
 * Manages the audio element for the playlist.
 *
 * - Rich/enhanced mode: autoplays when `hasInteracted` is true
 * - Simple/light mode: waits for user action
 * - Pauses (and remembers state) when music is muted; resumes on unmute
 *   only if it was playing before mute
 * - Single-track playlists loop by restarting the same element
 * - Multi-track playlists advance on track end (last → first loops back)
 */
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

    // Refs so effects can read latest values without being re-triggered
    const isPlayingRef = useRef(isPlaying);
    isPlayingRef.current = isPlaying;

    const isMutedRef = useRef(isMuted);
    isMutedRef.current = isMuted;

    const bgVolumeRef = useRef(bgVolume);
    bgVolumeRef.current = bgVolume;

    // Whether music was playing before the last mute — used to resume on unmute
    const wasPlayingBeforeMuteRef = useRef(false);

    // Auto-start in rich/enhanced mode once the user has interacted
    useEffect(() => {
        if (isRich && hasInteracted) {
            setIsPlaying(true);
        }
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
        audio.volume = isMutedRef.current ? 0 : bgVolumeRef.current;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);

        const handleEnded = () => {
            // Advance to next track; wraps back to 0 after the last track
            nextTrack();
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        audioRef.current = audio;

        // Build / reuse AudioContext and attach analyser to this element
        try {
            const AudioContextCtor =
                window.AudioContext ||
                (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (AudioContextCtor) {
                if (!_audioCtx || _audioCtx.state === "closed") {
                    _audioCtx = new AudioContextCtor();
                }
                if (_audioCtx.state === "suspended") _audioCtx.resume().catch(() => {});
                const source = _audioCtx.createMediaElementSource(audio);
                const analyser = _audioCtx.createAnalyser();
                analyser.fftSize = 256;
                source.connect(analyser);
                analyser.connect(_audioCtx.destination);
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
            if (audioRef.current === audio) audioRef.current = null;
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
        // User hit play on a direct URL — mark interaction so the audio
        // creation effect re-runs (it depends on hasInteracted) and the
        // new element starts playing because isPlayingRef is already true.
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

    // Sync volume live (never recreates the audio element)
    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.volume = isMuted ? 0 : bgVolume;
    }, [isMuted, bgVolume]);
}
