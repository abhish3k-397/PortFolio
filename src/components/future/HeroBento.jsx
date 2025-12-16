import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Code, Cpu, Globe, Layers, Sparkles, Terminal, Zap, Command, ArrowRight, Fingerprint, Activity, GraduationCap } from 'lucide-react';

// --- PREMIUM CARD COMPONENT ---
const HeroCard = ({ children, className = "", onClick, delay = 0, dark = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }} // Cubic bezier for premium feel
        whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.3 } }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`relative rounded-[2rem] overflow-hidden group cursor-pointer transition-all duration-500 ${dark
            ? 'bg-[#FAF9F6] border border-white/60 shadow-xl shadow-gray-200/50 text-gray-900'
            : 'bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-white/80 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]'
            } ${className}`}
    >
        {/* Inner Glow */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${dark ? 'bg-gradient-to-tr from-white/80 to-transparent' : 'bg-gradient-to-tr from-white/40 to-transparent'
            }`} />

        {children}
    </motion.div>
);

const HeroBento = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 gap-4 md:gap-6 h-full w-full">

            {/* 1. PRIMARY IDENTITY TILE (Large 2x2) */}
            <HeroCard className="md:col-span-2 md:row-span-2 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden" delay={0.1}>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity scale-150 origin-top-right">
                    <Fingerprint size={200} strokeWidth={0.5} />
                </div>

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/5 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-gray-500 mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
                        </span>
                        System Online
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.85] mb-4 mix-blend-darken">
                        ABHISHEK<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500">KRISHNA</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 font-medium max-w-md leading-relaxed">
                        Architecting <span className="text-gray-900 font-bold underline decoration-2 decoration-gray-300 underline-offset-4">digital reality</span> with precision engineering and elite design.
                    </p>
                </div>

                <div className="flex items-center gap-4 mt-6">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">v2.5.0 // 2025</span>
                </div>
            </HeroCard>

            {/* 2. LIVE STATUS TILE (1x1) */}
            <HeroCard className="col-span-1 row-span-1 p-6 flex flex-col justify-between bg-[#F0FDF4] border-emerald-100" delay={0.2}>
                <div className="flex justify-between items-start">
                    <Activity size={24} className="text-emerald-500" />
                    <div className="relative">
                        <span className="absolute -inset-1 rounded-full bg-emerald-400/30 animate-ping" />
                        <span className="relative block w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                    </div>
                </div>
                <div>
                    <div className="text-3xl font-black text-gray-900">100%</div>
                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">Capacity Available</div>
                </div>
            </HeroCard>

            {/* 3. FEATURED PROJECT TILE (1x2 - Vertical) */}
            <HeroCard className="col-span-1 row-span-2 p-0 relative group" delay={0.3} onClick={() => window.open('https://uno.dev.p1ng.me', '_blank')} dark={true}>
                <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                    alt="Featured"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-6 right-6 bg-white/30 backdrop-blur-md border border-white/40 p-2 rounded-full text-white group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUpRight size={20} />
                </div>

                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full shadow-[0_0_8px_#8B5CF6]"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5CF6]">Featured Project</span>
                    </div>
                    <h3 className="text-3xl font-black leading-none mb-2">FlashCards<br />Dual</h3>
                    <p className="text-xs text-gray-100 line-clamp-2 leading-relaxed border-l-2 border-white/40 pl-3">
                        High-performance multiplayer gaming engine with &lt;150ms latency.
                    </p>
                </div>
            </HeroCard>

            {/* 4. SKILLS / TECH TILE (1x1) */}
            <HeroCard className="col-span-1 row-span-1 p-6 flex flex-col justify-center relative overflow-hidden group bg-[#FAF9F6]" delay={0.4} dark={true}>
                <div className="absolute -right-6 -top-6 text-gray-200 group-hover:text-gray-300 transition-colors rotate-12">
                    <Command size={120} strokeWidth={1} />
                </div>
                <div className="relative z-10">
                    <div className="flex gap-3 mb-4 text-gray-400">
                        <Terminal size={20} className="text-blue-500" />
                        <Cpu size={20} className="text-purple-500" />
                        <Zap size={20} className="text-yellow-500" />
                    </div>
                    <div className="font-bold text-xl leading-tight text-gray-900">
                        Full Stack<br />
                        <span className="text-gray-500 group-hover:text-gray-700 transition-colors">& AI Architecture</span>
                    </div>
                </div>
            </HeroCard>

            {/* 5. EXPERIMENTAL / AMBIENT TILE (1x1) */}
            <HeroCard className="col-span-1 md:col-span-2 row-span-1 relative overflow-hidden bg-[#FAF9F6]" delay={0.5} dark={true}>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 opacity-80" />

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border border-gray-300 rounded-full animate-[spin_8s_linear_infinite]" />
                        <div className="absolute inset-2 border border-gray-400 rounded-full animate-[spin_4s_linear_infinite_reverse]" />
                        <div className="absolute inset-8 bg-white rounded-full animate-pulse shadow-[0_0_20px_rgba(0,0,0,0.05)]" />
                    </div>
                </div>
                <div className="absolute bottom-4 left-4 text-gray-400 text-[10px] font-mono uppercase tracking-widest">
                    Exp_01
                </div>
            </HeroCard>

            {/* 6. EDUCATION TILE (2x1) */}
            <HeroCard className="col-span-1 md:col-span-2 row-span-1 p-6 flex flex-col bg-[#FAF9F6] text-gray-900 border-none group overflow-y-auto custom-scrollbar" delay={0.6}>
                <div className="flex items-center gap-3 mb-4 sticky top-0 bg-[#FAF9F6] z-10 pb-2 border-b border-gray-100">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <GraduationCap size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Academic Log</span>
                </div>

                <div className="space-y-4">
                    {[
                        {
                            id: 1,
                            date: '2021 - 2025',
                            title: 'B.Tech in Computer Science',
                            institution: 'University of Technology',
                            grade: 'CGPA: 9.2'
                        },
                        {
                            id: 2,
                            date: '2019 - 2021',
                            title: 'Higher Secondary (XII)',
                            institution: 'City High School',
                            grade: '94%'
                        },
                        {
                            id: 3,
                            date: '2018 - 2019',
                            title: 'Secondary Education (X)',
                            institution: 'City High School',
                            grade: '98%'
                        }
                    ].map((edu) => (
                        <div key={edu.id} className="flex justify-between items-start group/item hover:bg-white p-2 rounded-lg transition-colors">
                            <div>
                                <div className="font-bold text-sm text-gray-900 leading-tight">{edu.title}</div>
                                <div className="text-xs text-gray-500 font-medium">{edu.institution}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-1">{edu.date}</div>
                                <div className="text-[10px] text-gray-400 font-medium">{edu.grade}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </HeroCard>

        </div>
    );
};

// Helper for visual flair
const FingerprintPattern = () => (
    <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90C72.0914 90 90 72.0914 90 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 20C33.4315 20 20 33.4315 20 50C20 66.5685 33.4315 80 50 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 30C38.9543 30 30 38.9543 30 50C30 61.0457 38.9543 70 50 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 40C44.4772 40 40 44.4772 40 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export default HeroBento;
