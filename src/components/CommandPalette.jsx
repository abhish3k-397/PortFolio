import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useTheme } from '../context/ThemeContext';
import { useSoundFX } from '../context/SoundContext';
import { useAchievements } from '../context/AchievementContext';
import {
    Home, User, Briefcase, Mail,
    Monitor, Zap, Feather,
    Github, Linkedin, Search, Trophy
} from 'lucide-react';
import TerminalCLI from './TerminalCLI';

    const CommandPalette = ({ onStartHack, onStartBreach }) => {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState('cli'); // 'cli' or 'gui'
    const { setTheme, theme } = useTheme();
    const { playClick, playHover } = useSoundFX();
    const { unlockAchievement } = useAchievements();

    // Toggle with Cmd+K
    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => {
                    if (!open) setMode('cli'); // Default to CLI when opening
                    return !open;
                });
                playClick();
            }
        };

        const handleOpenTerminal = () => {
            setOpen(true);
            setMode('cli');
            playClick();
        };

        document.addEventListener('keydown', down);
        window.addEventListener('open-terminal', handleOpenTerminal);
        return () => {
            document.removeEventListener('keydown', down);
            window.removeEventListener('open-terminal', handleOpenTerminal);
        };
    }, [playClick]);

    const scrollToSection = (id) => {
        setOpen(false);
        playClick();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        setOpen(false);
        playClick();
        unlockAchievement('theme_shifter');
    };

    const openLink = (url) => {
        window.open(url, '_blank');
        setOpen(false);
        playClick();
    };

    if (!open) return null;

    if (mode === 'cli') {
        return (
            <TerminalCLI
                onClose={() => setOpen(false)}
                onSwitchToGui={() => setMode('gui')}
                onStartHack={onStartHack}
                onStartBreach={onStartBreach}
            />
        );
    }

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${theme === 'cyberpunk' ? 'bg-black/60' : 'bg-[#2c2418]/70'} backdrop-blur-sm`}>
            <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-200">
                    <Command
                    className={`
                        w-full rounded-xl border shadow-2xl overflow-hidden
                        ${theme === 'cyberpunk'
                            ? 'bg-black/90 border-cyber-neon shadow-[0_0_30px_rgba(0,243,255,0.2)]'
                            : 'bg-[#2c2418]/95 border-[#c4956a]/40 shadow-[0_0_30px_rgba(0,0,0,0.3)]'
                        }
                    `}
                    loop
                >
                    <div className={`flex items-center border-b px-4 ${theme === 'cyberpunk' ? 'border-white/10' : 'border-[#c4956a]/20'}`} cmdk-input-wrapper="">
                        <Search className={`w-5 h-5 mr-2 ${theme === 'cyberpunk' ? 'text-cyber-neon' : 'text-[#c4956a]'}`} />
                        <Command.Input
                            placeholder="Type a command or search..."
                            className={`
                                w-full bg-transparent py-4 text-lg outline-none
                                ${theme === 'cyberpunk' ? 'text-white placeholder:text-gray-500' : 'text-[#f5f0e8] placeholder:text-[#8b6914]/50'}
                            `}
                        />
                    </div>

                    <Command.List className="max-h-[60vh] overflow-y-auto p-2 scroll-py-2">
                        <Command.Empty className={`py-6 text-center ${theme === 'cyberpunk' ? 'text-gray-500' : 'text-[#8b6914]/50'}`}>
                            No results found.
                        </Command.Empty>

                        <Command.Group heading="Navigation" className={`text-xs font-bold mb-2 px-2 mt-2 ${theme === 'cyberpunk' ? 'text-gray-500' : 'text-[#8b6914]/70'}`}>
                            <Command.Item
                                onSelect={() => scrollToSection('hero')}
                                className={`
                                    flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-colors mb-1
                                    aria-selected:bg-white/10 aria-selected:text-white
                                    ${theme === 'cyberpunk' ? 'aria-selected:bg-cyber-neon/20 aria-selected:text-cyber-neon' : ''}
                                `}
                            >
                                <Home size={18} />
                                <span>Home</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => scrollToSection('about')}
                                className={`
                                    flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-colors mb-1
                                    aria-selected:bg-white/10 aria-selected:text-white
                                    ${theme === 'cyberpunk' ? 'aria-selected:bg-cyber-neon/20 aria-selected:text-cyber-neon' : ''}
                                `}
                            >
                                <User size={18} />
                                <span>About Me</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => scrollToSection('skills')}
                                className={`
                                    flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-colors mb-1
                                    aria-selected:bg-white/10 aria-selected:text-white
                                    ${theme === 'cyberpunk' ? 'aria-selected:bg-cyber-neon/20 aria-selected:text-cyber-neon' : ''}
                                `}
                            >
                                <Zap size={18} />
                                <span>Skills</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => scrollToSection('projects')}
                                className={`
                                    flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-colors mb-1
                                    aria-selected:bg-white/10 aria-selected:text-white
                                    ${theme === 'cyberpunk' ? 'aria-selected:bg-cyber-neon/20 aria-selected:text-cyber-neon' : ''}
                                `}
                            >
                                <Briefcase size={18} />
                                <span>Projects</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => scrollToSection('achievements')}
                                className={`
                                    flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-colors mb-1
                                    aria-selected:bg-white/10 aria-selected:text-white
                                    ${theme === 'cyberpunk' ? 'aria-selected:bg-cyber-neon/20 aria-selected:text-cyber-neon' : ''}
                                `}
                            >
                                <Trophy size={18} />
                                <span>Achievements</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => scrollToSection('contact')}
                                className={`
                                    flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-colors mb-1
                                    aria-selected:bg-white/10 aria-selected:text-white
                                    ${theme === 'cyberpunk' ? 'aria-selected:bg-cyber-neon/20 aria-selected:text-cyber-neon' : ''}
                                `}
                            >
                                <Mail size={18} />
                                <span>Contact</span>
                            </Command.Item>
                        </Command.Group>

                        <Command.Group heading="Theme" className={`text-xs font-bold mb-2 px-2 mt-4 ${theme === 'cyberpunk' ? 'text-gray-500' : 'text-[#8b6914]/70'}`}>
                            <Command.Item
                                onSelect={() => handleThemeChange('cyberpunk')}
                                className={`
                                    flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-colors mb-1
                                    aria-selected:bg-white/10 aria-selected:text-white
                                    ${theme === 'cyberpunk' ? 'aria-selected:bg-cyber-neon/20 aria-selected:text-cyber-neon' : ''}
                                `}
                            >
                                <Monitor size={18} />
                                <span>Cyberpunk Mode</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => handleThemeChange('inkpaper')}
                                className={`
                                    flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-colors mb-1
                                    aria-selected:bg-white/10 aria-selected:text-white
                                    ${theme === 'cyberpunk' ? 'aria-selected:bg-cyber-neon/20 aria-selected:text-cyber-neon' : ''}
                                `}
                            >
                                <Feather size={18} />
                                <span>Ink & Paper Mode</span>
                            </Command.Item>

                        </Command.Group>

                        <Command.Group heading="Socials" className={`text-xs font-bold mb-2 px-2 mt-4 ${theme === 'cyberpunk' ? 'text-gray-500' : 'text-[#8b6914]/70'}`}>
                            <Command.Item
                                onSelect={() => openLink('https://github.com/abhish3k-397')}
                                className={`
                                    flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-colors mb-1
                                    aria-selected:bg-white/10 aria-selected:text-white
                                    ${theme === 'cyberpunk' ? 'aria-selected:bg-cyber-neon/20 aria-selected:text-cyber-neon' : ''}
                                `}
                            >
                                <Github size={18} />
                                <span>GitHub</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => openLink('https://www.linkedin.com/in/abhi-sh3k')}
                                className={`
                                    flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-colors mb-1
                                    aria-selected:bg-white/10 aria-selected:text-white
                                    ${theme === 'cyberpunk' ? 'aria-selected:bg-cyber-neon/20 aria-selected:text-cyber-neon' : ''}
                                `}
                            >
                                <Linkedin size={18} />
                                <span>LinkedIn</span>
                            </Command.Item>
                        </Command.Group>
                    </Command.List>

                    <div className={`border-t px-4 py-2 flex justify-between items-center text-xs ${theme === 'cyberpunk' ? 'border-white/10 text-gray-500' : 'border-[#c4956a]/20 text-[#8b6914]/60'}`}>
                        <span>Use arrow keys to navigate</span>
                        <div className="flex gap-2">
                            <span className={`px-1.5 py-0.5 rounded ${theme === 'cyberpunk' ? 'bg-white/10' : 'bg-[#c4956a]/15'}`}>↵</span>
                            <span>to select</span>
                        </div>
                    </div>
                </Command>
            </div>
        </div>
    );
};

export default CommandPalette;
