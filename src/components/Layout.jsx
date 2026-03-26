import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSoundFX } from '../context/SoundContext';
import { useAchievements } from '../context/AchievementContext';

import CustomCursor from './CustomCursor';
import MagneticButton from './MagneticButton';
import DotGrid from './DotGrid';
import BlackHoleBackground from './BlackHoleBackground';
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
    const [isRPressed, setIsRPressed] = useState(false);
    const [forceGlitch, setForceGlitch] = useState(false);

    useEffect(() => {
        const isTextFieldTarget = (target) => {
            if (!target || !(target instanceof HTMLElement)) return false;
            const tag = target.tagName;
            return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
        };

        const handleKeyDown = (e) => {
            if (isTextFieldTarget(e.target)) return;
            if (e.key === 'r' || e.key === 'R') {
                setIsRPressed(true);
            }
        };
        const handleKeyUp = (e) => {
            if (isTextFieldTarget(e.target)) return;
            if (e.key === 'r' || e.key === 'R') {
                setIsRPressed(false);
            }
        };
        const handleIframeInteractionKey = (e) => {
            if (!e.data || e.data.type !== 'webgl-interaction-key') return;
            if (typeof e.data.isPressed !== 'boolean') return;
            setIsRPressed(e.data.isPressed);
        };
        const handleBlur = () => {
            // Keep the key state during iframe focus transitions.
            // We only force-reset when the document truly loses focus.
            if (!document.hasFocus()) {
                setIsRPressed(false);
            }
        };

        const handleTouchStart = (e) => {
            if (e.touches.length >= 2) {
                setIsRPressed(prev => {
                    if (!prev) {
                        setForceGlitch(true);
                        setTimeout(() => setForceGlitch(false), 500);
                        playClick(); // mechanical feedback sound
                    }
                    return true;
                });
            }
        };

        const handleTouchEnd = (e) => {
            if (e.touches.length < 2) {
                setIsRPressed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('message', handleIframeInteractionKey);
        window.addEventListener('blur', handleBlur);
        
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('touchcancel', handleTouchEnd);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('message', handleIframeInteractionKey);
            window.removeEventListener('blur', handleBlur);

            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [playClick]);

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
            <CustomCursor isAltPressed={isRPressed} />
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
            {theme === 'cyberpunk' && <CyberpunkHUD onIdleChange={setIsIdle} forceGlitch={forceGlitch} />}
            {isDenied && <AccessDenied onDismiss={() => setIsDenied(false)} />}



            <div className={`relative z-10 transition-all duration-1000 ease-in-out pointer-events-none ${isIdle ? 'blur-[50px] opacity-50' : 'blur-0 opacity-100'}`}>
                <main className={`[&_section]:pointer-events-none ${isRPressed ? '' : '[&_section>*:not(.pointer-events-none)]:pointer-events-auto'} `}>
                    {children}
                </main>
                <div className={isRPressed ? 'pointer-events-none' : 'pointer-events-auto'}>
                    <Footer />
                </div>
            </div>

            {/* Background Effects */}
            <div className={`fixed inset-0 z-0 overflow-hidden transition-all duration-1000 ease-in-out ${isIdle ? 'blur-[50px]' : 'blur-0'}`}>
                {theme === 'cyberpunk' ? <BlackHoleBackground isInteractive={isRPressed} /> : <div className="pointer-events-none w-full h-full"><DotGrid /></div>}
            </div>
        </div>
    );
};

export default Layout;
