import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Minimize2, Maximize2, Music } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAchievements } from '../context/AchievementContext';
import ElectricBorder from './ElectricBorder';

const PLAYLIST = [
    {
        title: "Neon Highway",
        artist: "Synthwave Boy",
        url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a7346b.mp3"
    },
    {
        title: "Cyber City",
        artist: "Retro Future",
        url: "https://cdn.pixabay.com/download/audio/2022/02/07/audio_183f072038.mp3"
    },
    {
        title: "Night Raid",
        artist: "Dark Synth",
        url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_5269428642.mp3"
    },
    {
        title: "Mainframe Breach",
        artist: "Hacker T",
        url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3"
    }
];

const MusicPlayer = () => {
    const { theme } = useTheme();
    const { unlockAchievement } = useAchievements();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isMinimized, setIsMinimized] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [playedTracks, setPlayedTracks] = useState(new Set());

    const audioRef = useRef(new Audio(PLAYLIST[0].url));
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const analyserRef = useRef(null);
    const audioContextRef = useRef(null);
    const sourceRef = useRef(null);

    // Initialize Audio Context & Visualizer
    useEffect(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 64; // Low resolution for retro feel

            // Connect audio element to analyser
            // Note: This requires user interaction first to work in some browsers
        }
    }, []);

    // Handle Track Changes
    useEffect(() => {
        const audio = audioRef.current;
        audio.src = PLAYLIST[currentTrackIndex].url;
        audio.volume = volume;

        if (isPlaying) {
            audio.play().catch(e => console.log("Playback failed:", e));
        }

        // Achievement Tracking
        setPlayedTracks(prev => {
            const newSet = new Set(prev);
            newSet.add(currentTrackIndex);
            if (newSet.size >= 3) {
                unlockAchievement('dj');
            }
            return newSet;
        });

        // Setup Visualizer Connection on first play
        if (isPlaying && !sourceRef.current && audioContextRef.current) {
            try {
                sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
                sourceRef.current.connect(analyserRef.current);
                analyserRef.current.connect(audioContextRef.current.destination);
            } catch (e) {
                console.warn("MediaElementSource already connected or CORS issue");
            }
        }

    }, [currentTrackIndex]);

    // Handle Play/Pause
    useEffect(() => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.play().catch(e => console.log("Playback failed:", e));
            drawVisualizer();
        } else {
            audio.pause();
            cancelAnimationFrame(animationRef.current);
        }
    }, [isPlaying]);

    // Handle Volume
    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    // Visualizer Loop
    const drawVisualizer = () => {
        if (!canvasRef.current || !analyserRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyserRef.current.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;

                const r = barHeight + (25 * (i / bufferLength));
                const g = 250 * (i / bufferLength);
                const b = 50;

                ctx.fillStyle = theme === 'cyberpunk'
                    ? `rgb(${r + 100}, 0, 0)` // Red/Pink
                    : `rgb(0, ${g}, ${b + 100})`; // Cyan/Blue

                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
        setIsPlaying(true);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
        setIsPlaying(true);
    };

    if (isMinimized) {
        return (
            <div
                onClick={() => setIsMinimized(false)}
                className={`fixed bottom-6 right-6 z-50 p-3 rounded-full cursor-pointer transition-all hover:scale-110 ${theme === 'cyberpunk'
                        ? 'bg-cyber-red text-black shadow-[0_0_15px_#ff003c]'
                        : 'bg-cyan-500 text-black shadow-[0_0_15px_cyan]'
                    }`}
            >
                <Music size={24} className={isPlaying ? 'animate-spin-slow' : ''} />
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-80 font-mono">
            <ElectricBorder
                color={theme === 'cyberpunk' ? 'red' : 'cyan'}
                className="w-full"
                innerClassName={`p-4 ${theme === 'cyberpunk'
                        ? 'bg-black/90 text-cyber-red'
                        : 'bg-slate-900/90 text-cyan-400'
                    }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                        <Music size={16} />
                        <span className="text-xs font-bold tracking-widest">CYBER_DECK_v2</span>
                    </div>
                    <button onClick={() => setIsMinimized(true)} className="hover:opacity-70">
                        <Minimize2 size={16} />
                    </button>
                </div>

                {/* Visualizer */}
                <div className="h-16 bg-black/50 mb-4 rounded overflow-hidden border border-white/5">
                    <canvas ref={canvasRef} width="280" height="64" className="w-full h-full" />
                </div>

                {/* Track Info */}
                <div className="mb-4 text-center">
                    <div className="text-lg font-bold truncate">{PLAYLIST[currentTrackIndex].title}</div>
                    <div className="text-xs opacity-60">{PLAYLIST[currentTrackIndex].artist}</div>
                </div>

                {/* Controls */}
                <div className="flex justify-center items-center gap-4 mb-4">
                    <button onClick={prevTrack} className="hover:scale-110 transition-transform">
                        <SkipBack size={20} />
                    </button>
                    <button
                        onClick={togglePlay}
                        className={`p-3 rounded-full ${theme === 'cyberpunk'
                                ? 'bg-cyber-red text-black hover:bg-white'
                                : 'bg-cyan-500 text-black hover:bg-white'
                            } transition-colors`}
                    >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button onClick={nextTrack} className="hover:scale-110 transition-transform">
                        <SkipForward size={20} />
                    </button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2 px-2">
                    <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)}>
                        {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className={`w-full h-1 appearance-none rounded cursor-pointer ${theme === 'cyberpunk' ? 'bg-cyber-red/30 accent-cyber-red' : 'bg-cyan-400/30 accent-cyan-400'
                            }`}
                    />
                </div>
            </ElectricBorder>
        </div>
    );
};

export default MusicPlayer;
