import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSoundFX } from '../context/SoundContext';
import { Activity, Hexagon, Zap, Cpu } from 'lucide-react';
import ElectricBorder from './ElectricBorder';
import TiltCard from './TiltCard';

const GithubActivity = () => {
    const { theme } = useTheme();
    const { playHover, playClick } = useSoundFX();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hoveredDay, setHoveredDay] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    useEffect(() => {
        fetch('https://github-contributions-api.jogruber.de/v4/abhish3k-397?y=last')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch GitHub data", err);
                setLoading(false);
            });
    }, []);

    // Cyberpunk Palette (Red/Yellow for Cyber Theme)
    const getLevelColor = (level) => {
        // Level 0: Darker, subtle grey
        if (level === 0) return theme === 'cyberpunk' ? '#18181b' : '#334155';

        if (theme === 'cyberpunk') {
            // Cyber Theme: Dark Red -> Crimson -> Neon Red -> Cyber Yellow
            const colors = ['#450a0a', '#9f1239', '#ff003c', '#fcee0a'];
            return colors[level - 1] || colors[3];
        } else {
            // Futuristic (Blue/Cyan)
            const colors = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd'];
            return colors[level - 1] || colors[3];
        }
    };

    if (loading) return (
        <div className="p-8 flex flex-col items-center justify-center gap-4 animate-pulse">
            <Hexagon size={32} className="animate-spin text-cyan-500" />
            <span className="font-mono text-xs tracking-widest">BUILDING_HIVE_STRUCTURE...</span>
        </div>
    );

    // Process last ~60 days for larger, clearer cells (less density, more visibility)
    const recentContributions = data?.contributions?.slice(-59) || [];

    return (
        <TiltCard className="h-full" maxRotation={2}>
            <ElectricBorder
                color="red"
                className="rounded-xl h-full"
                innerClassName={`relative p-8 transition-all duration-500 group h-full overflow-hidden ${theme === 'cyberpunk'
                    ? 'bg-black/95'
                    : 'bg-slate-900/95'
                    }`}
                style={{ borderRadius: '0.75rem' }}
            >
                {/* Header */}
                <div className="flex justify-between items-end mb-10 relative z-20">
                    <div className="flex items-center gap-3">
                        <Hexagon size={28} className={theme === 'cyberpunk' ? 'text-cyber-red' : 'text-blue-400'} />
                        <div>
                            <h3 className={`text-2xl font-bold tracking-widest ${theme === 'cyberpunk' ? 'text-cyber-red font-orbitron' : 'text-blue-400 font-rajdhani'}`}>
                                HIVE_MIND_LOGS
                            </h3>
                            <p className="text-sm opacity-80 font-mono text-white">NEURAL_SYNC_ACTIVE</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right font-mono text-sm">
                        <div className="opacity-60 text-white">TOTAL_CYCLES</div>
                        <div className={`text-2xl font-bold ${theme === 'cyberpunk' ? 'text-cyber-yellow' : 'text-white'}`}>
                            {data?.total?.lastYear}
                        </div>
                    </div>
                </div>

                {/* Hex Grid Container */}
                <div className="relative flex justify-center py-6 px-2">
                    <div className="flex flex-wrap justify-center gap-1 max-w-[900px]">
                        {recentContributions.map((day, i) => (
                            <div
                                key={i}
                                className="relative group/cell -ml-3 mb-[-10px] first:ml-0" // Adjusted margins for larger size
                                onMouseEnter={() => {
                                    setHoveredDay(day);
                                    playHover();
                                }}
                                onMouseLeave={() => setHoveredDay(null)}
                                onClick={() => {
                                    setSelectedDay(day);
                                    playClick();
                                }}
                            >
                                {/* The Hexagon - Larger Size */}
                                <div
                                    className={`w-10 h-11 md:w-12 md:h-14 transition-all duration-300 ${day.level > 0 ? 'scale-95 group-hover/cell:scale-110 group-hover/cell:z-10' : 'scale-90 opacity-40 hover:opacity-100'
                                        }`}
                                    style={{
                                        backgroundColor: getLevelColor(day.level),
                                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                        boxShadow: day.level > 0 ? `0 0 15px ${getLevelColor(day.level)}` : 'none',
                                    }}
                                >
                                    {/* Inner Hex for detail */}
                                    <div className="absolute inset-[3px] bg-black/40"
                                        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                                    />
                                    <div className="absolute inset-[5px]"
                                        style={{
                                            backgroundColor: getLevelColor(day.level),
                                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                            opacity: day.level > 0 ? 0.9 : 0.3
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hover/Select Info Panel */}
                <div className={`mt-10 p-4 border-t border-white/20 flex justify-between items-center font-mono text-sm transition-opacity duration-300 ${hoveredDay || selectedDay ? 'opacity-100' : 'opacity-0'
                    }`}>
                    {(hoveredDay || selectedDay) && (
                        <>
                            <div className="flex items-center gap-4">
                                <div className={`px-3 py-1 rounded font-bold ${theme === 'cyberpunk' ? 'bg-cyber-red text-black' : 'bg-blue-400 text-black'}`}>
                                    {(hoveredDay || selectedDay).count} COMMITS
                                </div>
                                <div className="opacity-90 text-white">
                                    {new Date((hoveredDay || selectedDay).date).toLocaleDateString(undefined, {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    }).toUpperCase()}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-70 text-white">
                                <Cpu size={16} />
                                <span>CELL_ID: {((hoveredDay || selectedDay).level * 1024).toString(16).toUpperCase()}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Decorative Elements (Scanline only) */}
                {theme === 'cyberpunk' && (
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,60,0.05),rgba(252,238,10,0.02),rgba(255,0,60,0.05))] z-[1] bg-[length:100%_2px,3px_100%] animate-scanline opacity-40" />
                )}
            </ElectricBorder>
        </TiltCard>
    );
};

export default GithubActivity;
