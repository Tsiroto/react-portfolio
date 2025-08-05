import { useEffect, useRef } from "react";

interface Props {
    isActive: boolean;
}

const AudioVisualizer = ({ isActive }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let audioCtx: AudioContext | null = null;
        let analyser: AnalyserNode | null = null;
        let source: MediaElementAudioSourceNode | null = null;
        const bufferLength = 128;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!ctx || !analyser) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            analyser.getByteFrequencyData(dataArray);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2;

                ctx.fillStyle = `rgba(0, 255, 255, ${barHeight / 128})`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        if (isActive) {
            // Setup audio
            audioCtx = new AudioContext();
            const audio = new Audio("/ambient.mp3"); // or use a prop later
            audio.loop = true;
            audio.volume = 0.5;
            audioRef.current = audio;

            source = audioCtx.createMediaElementSource(audio);
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = bufferLength * 2;

            source.connect(analyser);
            analyser.connect(audioCtx.destination);

            audio.play().catch(err => console.warn("Autoplay blocked:", err));
            animationRef.current = requestAnimationFrame(draw);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            audioCtx?.close();
        };
    }, [isActive]);

    return (
        <canvas
            ref={canvasRef}
            className="audio-visualizer-canvas"
            style={{
                position: "absolute",
                inset: 0,
                zIndex: -1,
                backgroundColor: "#000",
            }}
        />
    );
};

export default AudioVisualizer;
