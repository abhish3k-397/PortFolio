import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { useAchievements, ACHIEVEMENTS } from '../context/AchievementContext';
import { Trophy, Lock, Terminal, Gamepad, FileText, Clock, Code, Zap } from 'lucide-react';
import ElectricBorder from './ElectricBorder';
import TiltCard from './TiltCard';

const Achievements = () => {
    const { theme } = useTheme();
    const { unlocked } = useAchievements();
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".achievement-card", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
                y: 50,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'terminal': return Terminal;
            case 'gamepad': return Gamepad;
            case 'file': return FileText;
            case 'clock': return Clock;
            case 'code': return Code;
            case 'zap': return Zap;
            default: return Trophy;
        }
    };

    const achievementList = Object.values(ACHIEVEMENTS);
    // Ensure we only count unlocked achievements that still exist in our definition
    const validUnlockedCount = unlocked.filter(id => achievementList.find(a => a.id === id)).length;
    const totalCount = achievementList.length;

    return (
        <section id="achievements" ref={containerRef} className="min-h-screen py-20 px-4 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className={`text-4xl md:text-6xl font-black mb-4 ${theme === 'cyberpunk' ? 'text-cyber-red' : 'text-white'}`}>
                        SYSTEM_ACHIEVEMENTS
                    </h2>
                    <div className="inline-block px-4 py-2 border border-white/20 rounded bg-black/40 backdrop-blur-md">
                        <span className="font-mono text-xl tracking-widest">
                            PROGRESS: <span className={theme === 'cyberpunk' ? 'text-cyber-yellow' : 'text-cyan-400'}>{validUnlockedCount}</span> / {totalCount}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievementList.map((ach) => {
                        const isUnlocked = unlocked.includes(ach.id);
                        const Icon = getIcon(ach.icon);

                        return (
                            <div key={ach.id} className="achievement-card h-48">
                                <TiltCard className="h-full" maxRotation={5}>
                                    <ElectricBorder
                                        color={isUnlocked ? (theme === 'cyberpunk' ? 'yellow' : 'cyan') : 'gray'}
                                        className="h-full"
                                        innerClassName={`h-full p-6 flex flex-col items-center justify-center text-center transition-all duration-500 relative overflow-hidden ${isUnlocked
                                            ? (theme === 'cyberpunk' ? 'bg-black' : 'bg-slate-900/90')
                                            : 'bg-black/80'
                                            }`}
                                    >
                                        {/* Locked Overlay (Mist) */}
                                        {!isUnlocked && (
                                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                                                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                                                <Lock className="w-12 h-12 text-white/20 mb-2" />
                                                <div className="absolute bottom-4 text-xs font-mono text-white/30 tracking-widest">
                                                    LOCKED_DATA
                                                </div>
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className={`relative z-10 ${!isUnlocked ? 'blur-sm opacity-50 grayscale' : ''}`}>
                                            <div className={`p-4 rounded-full mb-4 inline-flex items-center justify-center ${isUnlocked
                                                ? (theme === 'cyberpunk' ? 'bg-cyber-yellow/10 text-cyber-yellow' : 'bg-cyan-400/10 text-cyan-400')
                                                : 'bg-white/5 text-white/20'
                                                }`}>
                                                <Icon size={32} />
                                            </div>
                                            <h3 className={`text-xl font-bold mb-2 font-orbitron ${isUnlocked ? 'text-white' : 'text-white/40'
                                                }`}>
                                                {ach.title}
                                            </h3>
                                            <p className="text-sm font-mono opacity-70">
                                                {ach.description}
                                            </p>
                                        </div>

                                        {/* Glitch Effect for Locked Cards */}
                                        {!isUnlocked && theme === 'cyberpunk' && (
                                            <div className="absolute inset-0 z-30 pointer-events-none opacity-10 animate-pulse bg-red-500/10 mix-blend-overlay" />
                                        )}
                                    </ElectricBorder>
                                </TiltCard>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Achievements;
