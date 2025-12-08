import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSoundFX } from '../context/SoundContext';
import { Monitor, Zap, Palette, Volume2, VolumeX } from 'lucide-react';
import CustomCursor from './CustomCursor';
import MagneticButton from './MagneticButton';
import DotGrid from './DotGrid';
import CommandPalette from './CommandPalette';
import CyberpunkHUD from './CyberpunkHUD';
import AccessDenied from './AccessDenied';
import Footer from './Footer';

const Layout = ({ children }) => {
    const { theme, setTheme } = useTheme();
    const { isMuted, toggleMute, playHover, playClick, playDenied } = useSoundFX();
    const [isDenied, setIsDenied] = useState(false);
    const [isIdle, setIsIdle] = useState(false);

    useEffect(() => {
        const handleSecurityBreach = (e) => {
            e.preventDefault();
            setIsDenied(true);
            playDenied();
            // Persistent until dismissed
        };

        window.addEventListener('contextmenu', handleSecurityBreach);
        window.addEventListener('copy', handleSecurityBreach);

        return () => {
            window.removeEventListener('contextmenu', handleSecurityBreach);
            window.removeEventListener('copy', handleSecurityBreach);
        };
    }, [playDenied]);

    const themes = [
        { id: 'cyberpunk', icon: Monitor, label: 'Cyber' },
        { id: 'futuristic', icon: Zap, label: 'Future' },
        { id: 'creative', icon: Palette, label: 'Art' },
    ];

    const handleThemeChange = (id) => {
        playClick();
        setTheme(id);
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 cursor-none 
      ${theme === 'cyberpunk' ? 'bg-cyber-blue text-cyber-neon' : ''}
      ${theme === 'futuristic' ? 'bg-slate-950 text-cyan-400' : ''}
      ${theme === 'creative' ? 'bg-purple-950 text-pink-300' : ''}
    `}>
            <CustomCursor />
            <CommandPalette />
            {theme === 'cyberpunk' && <CyberpunkHUD onIdleChange={setIsIdle} />}
            {isDenied && <AccessDenied onDismiss={() => setIsDenied(false)} />}

            {/* Controls Container */}
            <div className="fixed top-6 right-6 z-50 flex flex-col gap-4 items-end">

                {/* Theme Switcher */}
                <div className="flex gap-2 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
                    {themes.map((t) => (
                        <MagneticButton key={t.id}>
                            <button
                                onClick={() => handleThemeChange(t.id)}
                                onMouseEnter={playHover}
                                className={`p-2 rounded-full transition-all duration-300 ${theme === t.id
                                    ? 'bg-white/20 text-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                                    : 'text-white/50 hover:text-white hover:bg-white/10'
                                    }`}
                                title={t.label}
                            >
                                <t.icon size={20} />
                            </button>
                        </MagneticButton>
                    ))}
                </div>

                {/* Sound Toggle */}
                <MagneticButton>
                    <button
                        onClick={() => { playClick(); toggleMute(); }}
                        onMouseEnter={playHover}
                        className="p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </MagneticButton>
            </div>

            <div className={`relative z-10 transition-all duration-1000 ease-in-out ${isIdle ? 'blur-[50px] opacity-50' : 'blur-0 opacity-100'}`}>
                <main>
                    {children}
                </main>
                <Footer />
            </div>

            {/* Background Effects */}
            <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-all duration-1000 ease-in-out ${isIdle ? 'blur-[50px]' : 'blur-0'}`}>
                <DotGrid />
                {theme === 'cyberpunk' && (
                    <>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_2px,3px_100%] pointer-events-none animate-scanline" />
                        <div className="absolute inset-0 bg-cyber-blue/90" />
                    </>
                )}
                {theme === 'futuristic' && (
                    <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-500/20 rounded-full blur-[100px]" />
                )}
                {theme === 'creative' && (
                    <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-purple-900 via-pink-900 to-orange-900 opacity-50" />
                )}
            </div>
        </div>
    );
};

export default Layout;
