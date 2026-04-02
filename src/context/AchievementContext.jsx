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
        title: 'CONGRATULATIONS!',
        description: 'You\'ve discovered the secret path to Project K.',
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
    },
    GHOST_IN_THE_SHELL: {
      id: 'ghost_in_the_shell',
      title: 'GHOST_IN_THE_SHELL',
      description: 'Completed Breach Protocol on hard difficulty',
      icon: 'cpu',
      secret: true
    },
    SHELL_EXPERT: {
      id: 'shell_expert',
      title: 'SHELL_EXPERT',
      description: 'Executed 50+ commands in a single session',
      icon: 'terminal',
      secret: true
    },
    FILE_EXPLORER: {
      id: 'file_explorer',
      title: 'FILE_EXPLORER',
      description: 'Read every file in the virtual filesystem',
      icon: 'folder',
      secret: true
    },
    FORTUNE_FINDER: {
      id: 'fortune_finder',
      title: 'FORTUNE_FINDER',
      description: 'Discovered the fortune command',
      icon: 'sparkles'
    },
    MATRIX_VIEWER: {
      id: 'matrix_viewer',
      title: 'WAKE_UP_NEO',
      description: 'Executed the matrix command',
      icon: 'monitor',
      secret: true
    }
};

export const AchievementProvider = ({ children }) => {
    const [unlocked, setUnlocked] = useState(() => {
        const saved = sessionStorage.getItem('achievements');
        if (!saved) return [];
        try {
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? [...new Set(parsed)] : [];
        } catch (e) {
            return [];
        }
    });
    const [notification, setNotification] = useState(null);
    const { playClick } = useSoundFX(); // We might want a specific sound later

    useEffect(() => {
        sessionStorage.setItem('achievements', JSON.stringify(unlocked));
    }, [unlocked]);

    const unlockAchievement = (id, forceNotification = false) => {
        if (!unlocked.includes(id) || forceNotification) {
            if (!unlocked.includes(id)) {
                setUnlocked(prev => {
                    if (prev.includes(id)) return prev;
                    return [...prev, id];
                });
            }

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
