import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useTheme } from '../context/ThemeContext';
import { useSoundFX } from '../context/SoundContext';
import {
    Home, User, Briefcase, Mail,
    Monitor, Zap,
    Github, Linkedin, Search, Trophy
} from 'lucide-react';
import TerminalCLI from './TerminalCLI';

const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState('cli'); // 'cli' or 'gui'
    const { setTheme, theme } = useTheme();
    const { playClick, playHover } = useSoundFX();

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

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
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
            />
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-200">
                <Command
                    className={`
                        w-full rounded-xl border shadow-2xl overflow-hidden
                        ${theme === 'cyberpunk'
                            ? 'bg-black/90 border-cyber-neon shadow-[0_0_30px_rgba(0,243,255,0.2)]'
                            : 'bg-slate-900/90 border-white/10'
                        }
                    `}
                    loop
                >
                    <div className="flex items-center border-b border-white/10 px-4" cmdk-input-wrapper="">
                        <Search className={`w-5 h-5 mr-2 ${theme === 'cyberpunk' ? 'text-cyber-neon' : 'text-gray-400'}`} />
                        <Command.Input
                            placeholder="Type a command or search..."
                            className={`
                                w-full bg-transparent py-4 text-lg outline-none placeholder:text-gray-500
                                ${theme === 'cyberpunk' ? 'text-white' : 'text-white'}
                            `}
                        />
                    </div>

                    <Command.List className="max-h-[60vh] overflow-y-auto p-2 scroll-py-2">
                        <Command.Empty className="py-6 text-center text-gray-500">
                            No results found.
                        </Command.Empty>

                        <Command.Group heading="Navigation" className="text-xs font-bold text-gray-500 mb-2 px-2 mt-2">
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

                        <Command.Group heading="Theme" className="text-xs font-bold text-gray-500 mb-2 px-2 mt-4">
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
                                onSelect={() => handleThemeChange('futuristic')}
                                className={`
                                    flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-colors mb-1
                                    aria-selected:bg-white/10 aria-selected:text-white
                                    ${theme === 'cyberpunk' ? 'aria-selected:bg-cyber-neon/20 aria-selected:text-cyber-neon' : ''}
                                `}
                            >
                                <Zap size={18} />
                                <span>Futuristic Mode</span>
                            </Command.Item>

                        </Command.Group>

                        <Command.Group heading="Socials" className="text-xs font-bold text-gray-500 mb-2 px-2 mt-4">
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

                    <div className="border-t border-white/10 px-4 py-2 flex justify-between items-center text-xs text-gray-500">
                        <span>Use arrow keys to navigate</span>
                        <div className="flex gap-2">
                            <span className="bg-white/10 px-1.5 py-0.5 rounded">↵</span>
                            <span>to select</span>
                        </div>
                    </div>
                </Command>
            </div>
        </div>
    );
};

export default CommandPalette;
