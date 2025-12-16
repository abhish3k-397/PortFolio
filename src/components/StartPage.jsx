import React, { useEffect, useState } from 'react';
import backgroundVideo from '../assets/background.mp4';
import MagneticButton from './MagneticButton';
import { useSoundFX } from '../context/SoundContext';
import { useTheme } from '../context/ThemeContext';
import { CornerDownLeft } from 'lucide-react';

const StartPage = ({ onStart }) => {
    const { playClick, playHover } = useSoundFX();
    const { setTheme } = useTheme();
    const [step, setStep] = useState('choice'); // 'choice' or 'enter'
    const [selectedPill, setSelectedPill] = useState(null); // 'cyberpunk' or 'futuristic'
    const [focusedPill, setFocusedPill] = useState(null); // For keyboard nav

    const handleChoice = (pill) => {
        playClick();
        setSelectedPill(pill);
        setTheme(pill);
        setStep('enter');
    };

    const handleStart = async () => {
        playClick();
        if (selectedPill) setTheme(selectedPill);

        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
                await document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
                await document.documentElement.msRequestFullscreen();
            }
        } catch (err) {
            console.log("Fullscreen request denied or failed:", err);
        }
        onStart();
    };

    // Keyboard Navigation for Choice Step
    useEffect(() => {
        if (step !== 'choice') return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                setFocusedPill('cyberpunk');
                playHover();
            } else if (e.key === 'ArrowRight') {
                setFocusedPill('samurai');
                playHover();
            } else if (e.key === 'Enter') {
                if (focusedPill) {
                    handleChoice(focusedPill);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [step, focusedPill, playHover]);

    // Enter Key for Final Step
    useEffect(() => {
        if (step !== 'enter') return;
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                handleStart();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [step, onStart, selectedPill]);

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-colors duration-700 ${focusedPill === 'cyberpunk' ? 'bg-[#0a0000]' : focusedPill === 'samurai' ? 'bg-[#0f172a]' : 'bg-black'
            }`}>
            {/* Background Video - Only visible after choice */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className={`absolute w-full h-full object-contain md:object-cover transition-opacity duration-1000 ${step === 'enter' ? 'opacity-50' : 'opacity-0'
                    }`}
            >
                <source src={backgroundVideo} type="video/mp4" />
            </video>

            {step === 'choice' && (
                <div className="absolute inset-0 flex w-full h-full z-20">
                    {/* Left Side - Red Pill (Cryptic/Mysterious) */}
                    <div
                        className={`relative w-1/2 h-full flex items-center justify-center cursor-pointer transition-all duration-700 group ${focusedPill === 'cyberpunk' ? 'bg-red-950/10' : 'hover:bg-red-950/5'
                            }`}
                        onClick={() => handleChoice('cyberpunk')}
                        onMouseEnter={() => { setFocusedPill('cyberpunk'); playHover(); }}
                        onMouseLeave={() => setFocusedPill(null)}
                    >
                        {/* Red Atmosphere */}
                        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black transition-opacity duration-700 ${focusedPill === 'cyberpunk' ? 'opacity-100' : 'opacity-0'
                            }`} />

                        {/* Red Glow Effect */}
                        <div className={`absolute inset-0 bg-red-600/10 blur-[100px] transition-all duration-500 ${focusedPill === 'cyberpunk' ? 'opacity-100 scale-150' : 'opacity-0 group-hover:opacity-30'
                            }`} />

                        {/* The Red Pill */}
                        <div className={`relative w-16 h-32 md:w-24 md:h-48 rounded-full bg-gradient-to-b from-red-600 to-black shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all duration-500 z-10 ${focusedPill === 'cyberpunk' ? 'scale-110 shadow-[0_0_100px_rgba(220,38,38,0.9)] rotate-3' : 'scale-100 group-hover:scale-105 grayscale-[0.5] group-hover:grayscale-0'
                            }`}>
                            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/4 bg-white/10 rounded-full blur-sm" />
                        </div>
                    </div>

                    {/* Right Side - Blue Pill (Pleasant/Light) */}
                    <div
                        className={`relative w-1/2 h-full flex items-center justify-center cursor-pointer transition-all duration-700 group ${focusedPill === 'samurai' ? 'bg-blue-500/5' : 'hover:bg-blue-900/5'
                            }`}
                        onClick={() => handleChoice('samurai')}
                        onMouseEnter={() => { setFocusedPill('samurai'); playHover(); }}
                        onMouseLeave={() => setFocusedPill(null)}
                    >
                        {/* Blue Atmosphere */}
                        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-black transition-opacity duration-700 ${focusedPill === 'samurai' ? 'opacity-100' : 'opacity-0'
                            }`} />

                        {/* Blue Glow Effect */}
                        <div className={`absolute inset-0 bg-cyan-400/10 blur-[120px] transition-all duration-700 ${focusedPill === 'samurai' ? 'opacity-100 scale-125' : 'opacity-0 group-hover:opacity-30'
                            }`} />

                        {/* The Blue Pill */}
                        <div className={`relative w-16 h-32 md:w-24 md:h-48 rounded-full bg-gradient-to-b from-cyan-300 to-blue-600 shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-500 z-10 ${focusedPill === 'samurai' ? 'scale-110 shadow-[0_0_120px_rgba(34,211,238,0.6)] -rotate-3' : 'scale-100 group-hover:scale-105 grayscale-[0.5] group-hover:grayscale-0'
                            }`}>
                            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/4 bg-white/40 rounded-full blur-md" />
                        </div>
                    </div>

                    {/* Center Text Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <div className="text-center transition-all duration-500">
                            <h1 className={`text-4xl md:text-7xl font-black tracking-tighter transition-all duration-500 ${focusedPill === 'cyberpunk'
                                ? 'text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] scale-110 font-mono'
                                : focusedPill === 'samurai'
                                    ? 'text-cyan-200 drop-shadow-[0_0_30px_rgba(34,211,238,0.6)] scale-105 font-sans tracking-[0.2em]'
                                    : 'text-white/20 scale-100'
                                }`}>
                                {focusedPill === 'cyberpunk' ? 'WAKE_UP' : focusedPill === 'samurai' ? 'ASCEND' : 'CHOOSE'}
                            </h1>
                            <p className={`text-sm md:text-xl mt-4 transition-all duration-500 ${focusedPill === 'cyberpunk'
                                ? 'text-red-500/80 font-mono tracking-widest animate-pulse'
                                : focusedPill === 'samurai'
                                    ? 'text-cyan-300/80 font-light tracking-[0.5em]'
                                    : 'text-white/10'
                                }`}>
                                {focusedPill === 'cyberpunk' ? 'EMBRACE THE CHAOS' : focusedPill === 'samurai' ? 'DESIGN THE FUTURE' : 'YOUR DESTINY'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {step === 'enter' && (
                <div className="absolute bottom-24 z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <MagneticButton strength={0.5}>
                        <button
                            onClick={handleStart}
                            onMouseEnter={playHover}
                            className={`px-8 py-3 text-lg md:px-12 md:py-4 md:text-2xl font-bold tracking-[0.2em] border backdrop-blur-md transition-all duration-500 rounded-sm flex items-center gap-3 ${selectedPill === 'cyberpunk'
                                ? 'text-red-500 border-red-500/30 bg-red-950/30 hover:bg-red-500 hover:text-black shadow-[0_0_30px_rgba(239,68,68,0.2)]'
                                : 'text-blue-500 border-blue-500/30 bg-blue-950/30 hover:bg-blue-500 hover:text-black shadow-[0_0_30px_rgba(59,130,246,0.2)]'
                                }`}
                        >
                            ENTER SYSTEM <CornerDownLeft size={24} />
                        </button>
                    </MagneticButton>
                </div>
            )}
        </div>
    );
};

export default StartPage;
