import React, { useEffect, useState, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSoundFX } from '../context/SoundContext';
import { Activity, Zap, Quote, Trophy, Flame, Calendar, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ElectricBorder from './ElectricBorder';
import TiltCard from './TiltCard';

// 1. GitHub Stats Card (Total, Current Streak, Longest Streak)
const StatsCard = ({ stats, total, theme }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/5 rounded-xl overflow-hidden bg-white/5 backdrop-blur-md">
            {/* Total Contributions */}
            <div className="p-8 flex flex-col items-center justify-center border-r border-white/5 group/stat">
                <span className={`text-4xl font-black mb-2 ${theme === 'cyberpunk' ? 'text-white' : 'text-slate-200'}`}>
                    {total}
                </span>
                <span className="text-[10px] font-mono tracking-[0.2em] opacity-40 uppercase">Total_Contributions</span>
                <span className="text-[9px] font-mono opacity-20 mt-2 italic">Dec 3, 2023 - Present</span>
            </div>

            {/* Current Streak (Circular Focus) */}
            <div className="p-8 flex flex-col items-center justify-center border-r border-white/5 bg-white/[0.02] relative overflow-hidden">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                        <motion.circle 
                            cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                            strokeDasharray="251.2"
                            initial={{ strokeDashoffset: 251.2 }}
                            animate={{ strokeDashoffset: 251.2 - (Math.min(stats.streak, 30) / 30) * 251.2 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={theme === 'cyberpunk' ? 'text-cyber-yellow' : 'text-cyan-400'}
                        />
                    </svg>
                    <div className="flex flex-col items-center">
                        <Flame size={16} className={theme === 'cyberpunk' ? 'text-cyber-yellow mb-1' : 'text-cyan-400 mb-1'} />
                        <span className="text-3xl font-black leading-none">{stats.streak}</span>
                    </div>
                </div>
                <span className={`text-[11px] font-bold mt-4 uppercase tracking-widest ${theme === 'cyberpunk' ? 'text-cyber-yellow' : 'text-cyan-400'}`}>
                    Current_Streak
                </span>
                <span className="text-[9px] font-mono opacity-20 mt-1 uppercase">Today</span>
            </div>

            {/* Longest Streak */}
            <div className="p-8 flex flex-col items-center justify-center group/stat">
                <div className="flex items-center gap-3 mb-2">
                    <Trophy size={20} className="opacity-20" />
                    <span className={`text-4xl font-black ${theme === 'cyberpunk' ? 'text-white' : 'text-slate-200'}`}>
                        {stats.longest || 6}
                    </span>
                </div>
                <span className="text-[10px] font-mono tracking-[0.2em] opacity-40 uppercase">Longest_Streak</span>
                <span className="text-[9px] font-mono opacity-20 mt-2 italic">Peak Performance Phase</span>
            </div>
        </div>
    );
};

// 2. Activity Graph (Refining the Pulse chart into a fuller README-style graph)
const ActivityGraph = ({ contributions, theme }) => {
    const dataPoints = contributions.slice(-50);
    const maxCount = Math.max(...dataPoints.map(d => d.count), 1);
    
    // Scale points to Fit Container (800x150)
    const points = dataPoints.map((d, i) => ({
        x: (i / (dataPoints.length - 1)) * 800,
        y: 150 - (d.count / maxCount) * 120
    }));

    // Generate Smooth Bezier Path
    const getSmoothPath = (pts) => {
        if (pts.length < 2) return "";
        let d = `M ${pts[0].x},${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const cp1x = p1.x + (p2.x - p1.x) / 2;
            const cp2x = p1.x + (p2.x - p1.x) / 2;
            d += ` C ${cp1x},${p1.y} ${cp2x},${p2.y} ${p2.x},${p2.y}`;
        }
        return d;
    };

    const smoothPath = getSmoothPath(points);

    return (
        <div className="w-full mt-12">
            <div className="flex items-center gap-3 mb-6">
                <Activity size={18} className={theme === 'cyberpunk' ? 'text-cyber-red' : 'text-cyan-400'} />
                <h4 className="text-sm font-bold tracking-[0.2em] uppercase opacity-60">Activity_Graph</h4>
                <div className="h-[1px] flex-1 bg-white/10 ml-4" />
            </div>
            
            <div className="relative w-full h-48 bg-black/40 rounded-xl border border-white/5 p-6 backdrop-blur-sm overflow-hidden group/graph">
                <svg viewBox="0 0 800 150" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={theme === 'cyberpunk' ? '#ff003c' : '#22d3ee'} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={theme === 'cyberpunk' ? '#ff003c' : '#22d3ee'} stopOpacity="0" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    
                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(v => (
                        <line key={v} x1="0" y1={150 - v * 120} x2="800" y2={150 - v * 120} stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
                    ))}
                    {Array.from({ length: 10 }).map((_, i) => (
                        <line key={i} x1={(i / 9) * 800} y1="0" x2={(i / 9) * 800} y2="150" stroke="white" strokeOpacity="0.03" strokeWidth="0.5" />
                    ))}

                    {/* Area */}
                    <motion.path
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                        d={`${smoothPath} L 800,150 L 0,150 Z`}
                        fill="url(#graphGradient)"
                    />
                    
                    {/* Main Line with Glow */}
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d={smoothPath}
                        fill="none"
                        stroke={theme === 'cyberpunk' ? '#ff003c' : '#22d3ee'}
                        strokeWidth="3"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        className="opacity-80"
                    />
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d={smoothPath}
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1"
                        className="opacity-20"
                    />

                    {/* Interaction Nodes */}
                    {points.filter((_, i) => i % 2 === 0).map((p, i) => (
                        <motion.circle 
                            key={i} cx={p.x} cy={p.y} r="3" 
                            fill={theme === 'cyberpunk' ? '#ff003c' : '#22d3ee'}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.5 + i * 0.02 }}
                            whileHover={{ r: 6, fill: '#fff' }}
                            className="transition-all duration-300 cursor-crosshair shadow-xl"
                        />
                    ))}
                </svg>
                
                {/* Axes Metadata */}
                <div className="absolute bottom-2 left-6 right-6 flex justify-between font-mono text-[8px] opacity-30 uppercase tracking-[0.2em]">
                    <span>Analysis_Time_T-50d</span>
                    <span className="animate-pulse">Live_Sync_Active</span>
                    <span>Point_T-0</span>
                </div>
            </div>
        </div>
    );
};

// 3. Random Dev Quote Component
const DevQuote = ({ theme }) => {
    const quotes = [
        { text: "There are few sources of energy so powerful as a procrastinating grad student.", author: "Paul Graham" },
        { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
        { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
        { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
        { text: "Knowledge is power.", author: "Francis Bacon" }
    ];

    const [quoteIdx, setQuoteIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIdx(prev => (prev + 1) % quotes.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const quote = quotes[quoteIdx];

    return (
        <div className="w-full mt-12 border-t border-white/5 pt-10">
            <div className="flex items-center gap-3 mb-6">
                <Quote size={18} className={theme === 'cyberpunk' ? 'text-cyber-yellow' : 'text-slate-400'} />
                <h4 className="text-sm font-bold tracking-[0.2em] uppercase opacity-60">Random_Dev_Quote</h4>
            </div>
            
            <div className="bg-white/[0.03] p-8 rounded-xl border-l-4 border-white/10 relative overflow-hidden group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={quoteIdx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="relative z-10"
                    >
                        <p className={`text-lg md:text-xl font-medium leading-relaxed italic ${
                            theme === 'cyberpunk' ? 'text-white/80' : 'text-slate-300'
                        }`}>
                            "<span className={theme === 'cyberpunk' ? 'text-cyber-yellow' : 'text-cyan-400'}>{quote.text.split('.')[0]}</span>.
                            {quote.text.split('.')[1]}"
                        </p>
                        <div className="mt-4 flex items-center gap-2 font-mono text-xs opacity-50 uppercase tracking-widest">
                            <div className="w-4 h-[1px] bg-white" />
                            <span>{quote.author} (Programmer)</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
                
                {/* Animated Decor */}
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Quote size={80} />
                </div>
            </div>
        </div>
    );
};

const GithubActivity = () => {
    const { theme } = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ streak: 0, max: 0, longest: 6 });

    useEffect(() => {
        fetch('https://github-contributions-api.jogruber.de/v4/abhish3k-397?y=last')
            .then(res => res.json())
            .then(json => {
                setData(json);
                const contribs = json.contributions || [];
                let currentStreak = 0;
                let maxStreak = 0;
                let tempStreak = 0;

                for (let i = 0; i < contribs.length; i++) {
                    if (contribs[i].count > 0) tempStreak++;
                    else {
                        if (tempStreak > maxStreak) maxStreak = tempStreak;
                        tempStreak = 0;
                    }
                }
                
                // Real-time current streak (counting back from today)
                for (let i = contribs.length - 1; i >= 0; i--) {
                    if (contribs[i].count > 0) currentStreak++;
                    else if (i < contribs.length - 1) break;
                }

                setStats({ streak: currentStreak, max: Math.max(...contribs.map(d => d.count), 0), longest: Math.max(maxStreak, currentStreak) });
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch GitHub data", err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="p-12 flex flex-col items-center justify-center gap-6">
            <div className={`w-12 h-12 border-2 border-dashed rounded-full animate-spin ${theme === 'cyberpunk' ? 'border-cyber-red' : 'border-cyan-400'}`} />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase opacity-50">Syncing_GitHub_Pulse...</span>
        </div>
    );

    return (
        <TiltCard className="h-full" maxRotation={1}>
            <ElectricBorder
                color={theme === 'cyberpunk' ? "red" : "cyan"}
                className="rounded-xl h-full"
                innerClassName={`relative p-8 md:p-14 transition-all duration-500 overflow-hidden h-full ${
                    theme === 'cyberpunk' ? 'bg-black/95' : 'bg-slate-900/40 backdrop-blur-2xl'
                }`}
                style={{ borderRadius: '0.75rem' }}
            >
                {/* Header Metadate */}
                <div className="flex items-center gap-4 mb-14">
                    <div className={theme === 'cyberpunk' ? 'text-cyber-red' : 'text-cyan-400'}>
                         <Trophy size={28} />
                    </div>
                    <h3 className={`text-4xl font-black tracking-tight uppercase ${theme === 'cyberpunk' ? 'text-white' : 'text-slate-100'}`}>
                        GitHub_Stats
                    </h3>
                </div>

                {/* The Three Sections */}
                <StatsCard stats={stats} total={data?.total?.lastYear || 0} theme={theme} />
                <ActivityGraph contributions={data?.contributions || []} theme={theme} />
                <DevQuote theme={theme} />

                {/* Subtle Background Elements */}
                {theme === 'cyberpunk' && (
                    <div className="absolute inset-0 pointer-events-none">
                         <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-red/5 blur-[120px]" />
                         <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyber-yellow/5 blur-[120px]" />
                    </div>
                )}
            </ElectricBorder>
        </TiltCard>
    );
};

export default GithubActivity;
