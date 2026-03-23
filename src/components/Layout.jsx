import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSoundFX } from '../context/SoundContext';
import { useAchievements } from '../context/AchievementContext';

import CustomCursor from './CustomCursor';
import MagneticButton from './MagneticButton';
import DotGrid from './DotGrid';
import CommandPalette from './CommandPalette';
import CyberpunkHUD from './CyberpunkHUD';
import AccessDenied from './AccessDenied';
import Footer from './Footer';
import HackingGame from './HackingGame';
import BreachProtocol from './BreachProtocol';

    const Layout = ({ children }) => {
    const { theme } = useTheme();
    const { playHover, playClick, playDenied } = useSoundFX();
    const { unlockAchievement } = useAchievements();
    const [isDenied, setIsDenied] = useState(false);
    const [isIdle, setIsIdle] = useState(false);
    const [showHackGame, setShowHackGame] = useState(false);
    const [isBreachActive, setIsBreachActive] = useState(false);
    const [breachDifficulty, setBreachDifficulty] = useState('medium');

    // Easter Egg: Konami Code - does nothing, just plays a sound
    useEffect(() => {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let cursor = 0;

        const handleKeyDown = (e) => {
            if (e.key === konamiCode[cursor]) {
                cursor++;
                if (cursor === konamiCode.length) {
                    playClick();
                    unlockAchievement('konami', true); // Force notification every time
                    
                    // Enter fullscreen mode 
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen().catch(err => {
                            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                        });
                    }

                    // Small delay to let user see the "Congratulations" message
                    setTimeout(() => {
                        window.location.href = 'https://projectk.abhishekcodes.tech/';
                    }, 2000);

                    cursor = 0;
                }
            } else {
                cursor = 0; // Reset if mistake
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playClick, unlockAchievement]);

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



    return (
        <div className={`min-h-screen transition-colors duration-500 cursor-none 
      ${theme === 'cyberpunk' ? 'bg-cyber-blue text-cyber-neon' : ''}
    `}>
            <CustomCursor />
            <CommandPalette onStartHack={() => setShowHackGame(true)} onStartBreach={(difficulty) => {
        setIsBreachActive(true);
        setBreachDifficulty(difficulty);
    }} />
            {showHackGame && <HackingGame onClose={() => setShowHackGame(false)} />}
            {isBreachActive && (
                <BreachProtocol 
                    onComplete={() => setIsBreachActive(false)} 
                    onExit={() => setIsBreachActive(false)} 
                    difficulty={breachDifficulty} 
                />
            )}
            {theme === 'cyberpunk' && <CyberpunkHUD onIdleChange={setIsIdle} />}
            {isDenied && <AccessDenied onDismiss={() => setIsDenied(false)} />}



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
            </div>
        </div>
    );
};

export default Layout;
