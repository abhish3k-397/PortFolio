import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Github, Linkedin, Twitter, Mail, Heart, Coffee, ArrowUp, Zap, Shield, Activity } from 'lucide-react';
import MagneticButton from './MagneticButton';

const Footer = () => {
    const { theme } = useTheme();

    const socialLinks = [
        { icon: Github, href: "https://github.com/abhish3k-397", label: "GitHub" },
        { icon: Linkedin, href: "https://www.linkedin.com/in/abhi-sh3k", label: "LinkedIn" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Mail, href: "mailto:contact@example.com", label: "Email" }
    ];

    const navLinks = [
        { label: 'HOME', id: 'hero' },
        { label: 'ABOUT', id: 'about' },
        { label: 'SKILLS', id: 'skills' },
        { label: 'WORK', id: 'projects' },
        { label: 'CONTACT', id: 'contact' },
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className={`relative z-[60] md:z-10 mt-20 border-t-2 transition-colors duration-500 overflow-hidden ${theme === 'cyberpunk'
            ? 'border-cyber-yellow/50 bg-black text-cyber-neon'
            : theme === 'futuristic'
                ? 'border-cyan-500/50 bg-slate-950 text-cyan-400'
                : 'border-white/20 bg-purple-950 text-pink-200'
            }`}>

            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[length:20px_20px]" />

            <div className="max-w-7xl mx-auto px-6 py-12 relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* Column 1: Identity & Status */}
                    <div className="space-y-6">
                        <div>
                            <h2 className={`text-3xl font-black tracking-tighter mb-2 ${theme === 'cyberpunk' ? 'text-cyber-yellow' : ''}`}>
                                ABHISHEK<br />KRISHNA
                            </h2>
                            <p className="font-mono text-sm opacity-60">
                                FULL_STACK_OPERATIVE // SYSTEMS_ENGINEER
                            </p>
                        </div>

                        <div className={`inline-flex items-center gap-3 px-4 py-2 border rounded-full ${theme === 'cyberpunk'
                            ? 'border-green-500/30 bg-green-500/10 text-green-400'
                            : 'border-white/10 bg-white/5'
                            }`}>
                            <div className="relative w-2 h-2">
                                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping" />
                                <div className="relative w-full h-full bg-green-500 rounded-full" />
                            </div>
                            <span className="text-xs font-bold tracking-widest">SYSTEMS ONLINE</span>
                        </div>
                    </div>

                    {/* Column 2: Navigation Hub */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold tracking-widest opacity-50 border-b border-white/10 pb-2">
                            NAVIGATION_HUB
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className={`text-left text-sm font-mono transition-all hover:translate-x-2 ${theme === 'cyberpunk'
                                        ? 'hover:text-cyber-yellow'
                                        : 'hover:text-white'
                                        }`}
                                >
                                    &gt; {link.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Connect & Actions */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold tracking-widest opacity-50 border-b border-white/10 pb-2">
                            ESTABLISH_CONNECTION
                        </h3>
                        <div className="flex gap-4">
                            {socialLinks.map((link, index) => (
                                <MagneticButton key={index}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-3 border rounded-lg transition-all duration-300 block ${theme === 'cyberpunk'
                                            ? 'border-cyber-yellow/30 hover:bg-cyber-yellow hover:text-black'
                                            : 'border-white/20 hover:bg-white hover:text-black'
                                            }`}
                                        aria-label={link.label}
                                    >
                                        <link.icon size={20} />
                                    </a>
                                </MagneticButton>
                            ))}
                        </div>

                        <button
                            onClick={scrollToTop}
                            className={`w-full py-4 border border-dashed font-bold tracking-widest flex items-center justify-center gap-2 transition-all group ${theme === 'cyberpunk'
                                ? 'border-cyber-red/50 hover:bg-cyber-red hover:text-black'
                                : 'border-white/20 hover:bg-white hover:text-black'
                                }`}
                        >
                            <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
                            RETURN_TO_TOP
                        </button>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono opacity-50 ${theme === 'cyberpunk' ? 'border-cyber-yellow/20' : 'border-white/10'
                    }`}>
                    <div className="flex items-center gap-4">
                        <span>© {currentYear} ABHISHEK KRISHNA</span>
                        <span className="hidden md:inline">|</span>
                        <span className="flex items-center gap-1">
                            <Shield size={10} /> SECURE_CONNECTION
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>MADE WITH</span>
                        <Heart size={10} className="animate-pulse text-red-500" />
                        <span>&</span>
                        <Coffee size={10} className="text-yellow-500" />
                        <span>IN REACT</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
