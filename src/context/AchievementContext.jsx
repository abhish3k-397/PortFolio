import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSoundFX } from './SoundContext';

const AchievementContext = createContext();

export const ACHIEVEMENTS = {
    NETRUNNER: {
        id: 'netrunner',
        title: 'NETRUNNER',
        description: 'Accessed the Terminal CLI',
        icon: 'terminal'
    },
    KONAMI: {
        id: 'konami',
        title: 'CHEAT_CODE',
        description: 'Unlocked Creative Mode via Konami Code',
        icon: 'gamepad'
    },
    RECRUITER: {
        id: 'recruiter',
        title: 'HEADHUNTER',
        description: 'Downloaded the Resume',
        icon: 'file'
    },
    AFK: {
        id: 'afk',
        title: 'SYSTEM_IDLE',
        description: 'Stayed idle for too long',
        icon: 'clock'
    },
    EXPLORER: {
        id: 'explorer',
        title: 'SOURCE_HUNTER',
        description: 'Viewed a project source code',
        icon: 'code'
    },
    THEME_SHIFTER: {
        id: 'theme_shifter',
        title: 'REALITY_WARP',
        description: 'Changed the visual theme',
        icon: 'zap'
    },
    NETRUNNER_ELITE: {
        id: 'netrunner_elite',
        title: 'ICE_BREAKER',
        description: 'Completed the Hacking Gauntlet',
        icon: 'cpu'
    }
};

export const AchievementProvider = ({ children }) => {
    const [unlocked, setUnlocked] = useState(() => {
        const saved = sessionStorage.getItem('achievements');
        return saved ? JSON.parse(saved) : [];
    });
    const [notification, setNotification] = useState(null);
    const { playClick } = useSoundFX(); // We might want a specific sound later

    useEffect(() => {
        sessionStorage.setItem('achievements', JSON.stringify(unlocked));
    }, [unlocked]);

    const unlockAchievement = (id) => {
        if (!unlocked.includes(id)) {
            setUnlocked(prev => [...prev, id]);

            // Find achievement details
            const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === id);
            if (achievement) {
                setNotification(achievement);
                playClick(); // Play sound

                // Clear notification after 5 seconds
                setTimeout(() => {
                    setNotification(null);
                }, 5000);
            }
        }
    };

    return (
        <AchievementContext.Provider value={{ unlocked, unlockAchievement, notification, ACHIEVEMENTS }}>
            {children}
        </AchievementContext.Provider>
    );
};

export const useAchievements = () => useContext(AchievementContext);
