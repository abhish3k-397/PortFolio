import React, { createContext, useContext, useState, useEffect } from 'react';
import useSound from 'use-sound';

// Placeholder sounds - in a real app, you'd import actual mp3 files
// For now, we'll use a simple beep if available, or just manage the state
// Since we don't have assets, I'll set up the structure.
// You would typically do: import hoverSfx from '../assets/hover.mp3';

const SoundContext = createContext({
    isMuted: false,
    toggleMute: () => { },
    playHover: () => { },
    playClick: () => { }
});

export const SoundProvider = ({ children }) => {
    const [isMuted, setIsMuted] = useState(false);

    // Mock play functions since we don't have files yet
    // In production: const [playHover] = useSound(hoverSfx, { volume: 0.5, soundEnabled: !isMuted });

    const playHover = () => {
        if (isMuted) return;
        // console.log("Play Hover SFX"); 
        // If we had an Audio object: new Audio('/hover.mp3').play();
    };

    const playClick = () => {
        if (isMuted) return;
        // console.log("Play Click SFX");
    };

    const toggleMute = () => setIsMuted(!isMuted);

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, playHover, playClick }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSoundFX = () => useContext(SoundContext);
