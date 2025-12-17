import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Menu, Home, MapPin, Settings, Github, Linkedin, Mail, Twitter, Globe, Cpu, ChevronDown, Fingerprint, Scan, Sparkles, Layers, Zap, GraduationCap, BookOpen, Calendar, Terminal, Database, Code, ArrowUpRight, Music } from 'lucide-react';

// --- DATA & ASSETS ---
const projects = [
    {
        id: 1,
        title: "FlashCardsDual",
        category: "Multiplayer Game",
        url: "https://uno.dev.p1ng.me",
        img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        desc: "Browser-based multiplayer game supporting 6 concurrent players with <150ms latency using socket programming.",
        tech: ["Node.js", "WebSockets", "Docker"]
    },
    {
        id: 2,
        title: "Res-Flow",
        category: "System Tool",
        url: "https://github.com/abhish3k-397/ResFlow.git",
        img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2670&auto=format&fit=crop",
        desc: "Cross-platform resource monitoring tool tracking 15+ system processes in real-time.",
        tech: ["Python", "PyQt5", "Psutil"]
    },
    {
        id: 3,
        title: "CyberMusicAi",
        category: "AI Assistant",
        url: "https://github.com/abhish3k-397/CyberMusicAI.git",
        img: "https://images.unsplash.com/photo-1558494949-efdeb6bf80a1?q=80&w=2669&auto=format&fit=crop",
        desc: "AI-powered chatbot for music tutoring and recommendations with Spotify integration.",
        tech: ["JS", "Spotify API", "AI"]
    },
    {
        id: 4,
        title: "Portfolio",
        category: "Interactive Web",
        url: "https://github.com/abhish3k-397/PortFolio.git",
        img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
        desc: "Futuristic, cyberpunk-themed portfolio website featuring interactive animations and 3D elements.",
        tech: ["React", "GSAP", "Tailwind"]
    },
];

const education = [
    {
        id: 1,
        period: '2021 - 2025',
        role: 'B.Tech in Computer Science',
        company: 'University of Technology',
        desc: 'Specializing in Full Stack Development, Artificial Intelligence, and System Architecture.',
        type: 'college'
    },
    {
        id: 2,
        period: '2019 - 2021',
        role: 'Higher Secondary (XII)',
        company: 'City High School',
        desc: 'Science stream (PCM). Built strong foundation in Mathematics and Computer Science basics.',
        type: 'school'
    }
];

// --- COMPONENTS ---

const ProjectCard = ({ project }) => {
    return (
        <div
            onClick={() => window.open(project.url, '_blank')}
            className="group relative h-[450px] w-[450px] overflow-hidden bg-white/40 backdrop-blur-md border border-white/60 cursor-pointer rounded-3xl shrink-0 transition-all duration-500 hover:bg-white/60 hover:border-white/80 hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
        >
            <div
                style={{
                    backgroundImage: `url(${project.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/90" />
            <div className="absolute bottom-0 left-0 w-full p-8 text-gray-900">
                <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#8B5CF6]">{project.category}</span>
                </div>
                <h3 className="text-4xl font-black leading-none mb-2 group-hover:text-[#8B5CF6] transition-colors">
                    {project.title}
                </h3>
                <p className="text-sm text-gray-600 font-medium opacity-80 group-hover:opacity-100 transition-opacity mb-4">
                    {project.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                    {project.tech && project.tech.map((t, i) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white/50 backdrop-blur-sm rounded-md border border-white/60 text-gray-700">
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- HELPER COMPONENTS ---

const SocialButton = ({ icon, label, url }) => (
    <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/60 hover:bg-white hover:border-[#8B5CF6] transition-all group"
    >
        <div className="text-gray-700 group-hover:text-[#8B5CF6] transition-colors">{icon}</div>
        <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 uppercase tracking-wider">{label}</span>
    </a>
);

const ExperienceItem = ({ role, company, period, desc }) => (
    <div className="relative pl-8 pb-8 border-l border-gray-300 last:border-0 last:pb-0">
        <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-[#8B5CF6] ring-4 ring-white" />
        <div className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest mb-1">{period}</div>
        <h4 className="text-lg font-black text-gray-900">{role}</h4>
        <div className="text-sm font-medium text-gray-500 mb-2">{company}</div>
        <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
);

const LiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <div className="font-mono text-sm font-bold text-gray-500 tracking-widest">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
    );
};

// --- GLASS BENTO LAYOUT ---

const GlassCard = ({ children, className = "", onClick }) => (
    <div
        onClick={onClick}
        className={`bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.05)] rounded-[2rem] overflow-hidden hover:shadow-[0_30px_60px_rgba(139,92,246,0.15)] hover:border-[#8B5CF6]/50 transition-all duration-500 group ${className}`}
    >
        {children}
    </div>
);

// --- NEW BENTO CARDS ---

const MusicCard = () => (
    <GlassCard className="col-span-1 row-span-1 p-6 flex flex-col justify-between bg-gradient-to-br from-green-400/20 to-emerald-500/20 border-green-400/30">
        <div className="flex justify-between items-start">
            <div className="p-2 bg-green-500 rounded-lg text-white"><Music size={16} /></div>
            <div className="flex gap-1">
                <span className="w-1 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="w-1 h-5 bg-green-500 rounded-full animate-pulse delay-75"></span>
                <span className="w-1 h-2 bg-green-500 rounded-full animate-pulse delay-150"></span>
            </div>
        </div>
        <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Listening To</div>
            <div className="font-bold text-gray-900 truncate">Lo-Fi Beats</div>

        </div>
    </GlassCard>
);

const ResumeCard = () => (
    <GlassCard className="col-span-1 row-span-1 p-6 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-white/80 transition-colors" onClick={() => window.open('/resume.pdf', '_blank')}>
        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
            <ArrowUpRight size={24} />
        </div>
        <div className="font-bold text-gray-900">Resume</div>
        <div className="text-xs text-gray-500 uppercase tracking-wider">Download PDF</div>
    </GlassCard>
);

const TechStackCard = () => (
    <GlassCard className="col-span-1 md:col-span-2 row-span-1 p-6 flex flex-col justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-white/80 z-10 pointer-events-none" />
        <div className="flex gap-8 animate-marquee whitespace-nowrap items-center">
            {[Code, Terminal, 'TypeScript', 'Docker', 'AWS', 'GraphQL', 'Next.js', 'Tailwind', 'Python', 'Rust'].map((tech, i) => (
                <span key={i} className="text-xl font-bold text-gray-400 flex items-center gap-2">
                    {typeof tech === 'string' ? tech : React.createElement(tech, { size: 24 })}
                </span>
            ))}
            {[Code, Terminal, 'TypeScript', 'Docker', 'AWS', 'GraphQL', 'Next.js', 'Tailwind', 'Python', 'Rust'].map((tech, i) => (
                <span key={`dup-${i}`} className="text-xl font-bold text-gray-400 flex items-center gap-2">
                    {typeof tech === 'string' ? tech : React.createElement(tech, { size: 24 })}
                </span>
            ))}
        </div>
    </GlassCard>
);

const GithubCard = () => (
    <GlassCard className="col-span-1 row-span-1 p-6 flex flex-col justify-between bg-gray-900 text-white border-none group cursor-pointer" onClick={() => window.open('https://github.com/abhish3k-397', '_blank')}>
        <div className="flex justify-between items-start">
            <Github size={24} />
            <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div>
            <div className="text-3xl font-black mb-1">1.2k</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Commits this year</div>
        </div>
        <div className="flex gap-1 mt-2">
            {[...Array(7)].map((_, i) => (
                <div key={i} className={`h-2 w-full rounded-sm ${[1, 3, 4, 6].includes(i) ? 'bg-green-500' : 'bg-gray-700'}`} />
            ))}
        </div>
    </GlassCard>
);

const FeaturedProjectCard = ({ project }) => (
    <GlassCard className="col-span-1 md:col-span-2 row-span-2 relative group cursor-pointer overflow-hidden" onClick={() => window.open(project.url, '_blank')}>
        <img src={project.img} alt={project.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
            <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-[#8B5CF6] rounded-full shadow-[0_0_10px_#8B5CF6]"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#8B5CF6]">Featured Project</span>
            </div>
            <h3 className="text-3xl font-black mb-2">{project.title}</h3>
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.desc}</p>
            <div className="flex flex-wrap gap-2">
                {project.tech.map((t, i) => (
                    <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-white/90">
                        {t}
                    </span>
                ))}
            </div>
        </div>
    </GlassCard>
);

import HeroBento from './HeroBento';
import Navbar from './Navbar';

// ... (existing imports)

// ... (existing helper components)

const GlassBentoLayout = () => {
    // ... (existing state)

    return (
        <div className="min-h-screen w-full bg-[#F5F5F7] text-gray-900 font-sans relative selection:bg-[#8B5CF6] selection:text-white overflow-x-hidden flex flex-col">

            {/* LIGHT AURORA BACKGROUND */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-200/60 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-200/50 rounded-full blur-[140px] animate-pulse delay-1000" />
                <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[100px] animate-pulse delay-2000" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-multiply" />
            </div>

            {/* NAVBAR */}
            <Navbar />

            {/* CONTENT GRID (Single View) */}
            <div className="relative z-10 w-full flex-1 p-4 md:p-8 md:pb-8">
                <HeroBento />
            </div>
        </div>
    );
};

// --- MAIN LAYOUT ---

const FutureLayout = () => {
    return (
        <div className="bg-[#F0F4F8]">
            {/* DESKTOP CONTENT */}
            <div className="hidden md:block">
                <GlassBentoLayout />
            </div>

            {/* MOBILE FALLBACK */}
            <div className="md:hidden">
                <MobileLayout />
            </div>
        </div>
    );
};

const MobileLayout = () => (
    <div className="min-h-screen flex flex-col relative pb-24 bg-white text-gray-900">
        {/* 1. TOP IMAGE */}
        <div className="h-[45vh] w-full relative overflow-hidden shrink-0">
            <img src="/profile.webp" alt="Profile" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-white z-10">
                <div className="font-bold tracking-widest uppercase text-sm">ABHISHEK</div>
                <Menu size={24} />
            </div>
        </div>

        {/* 2. TEXT ZONE */}
        <div className="flex-1 bg-[#F3F4F6] p-6 flex flex-col justify-center relative min-h-[400px]">
            <h1 className="text-3xl font-black leading-tight mb-4 uppercase">Cyber<br />Security<br />Specialist</h1>
            <p className="text-sm text-gray-600 max-w-xs mb-8 leading-relaxed">Securing digital infrastructures and architecting robust, scalable systems. Based in India_Server_01.</p>
            <button className="bg-[#8B5CF6] text-white px-6 py-3 rounded-full font-bold tracking-widest uppercase self-start shadow-lg flex items-center gap-2">View Work <ArrowRight size={16} /></button>
            <div className="absolute bottom-4 right-4 w-28 h-28 bg-black rounded-xl overflow-hidden shadow-xl">
                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" alt="Project" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            </div>
        </div>

        {/* 4. RED MENU BAR */}
        <div className="fixed bottom-0 left-0 w-full h-20 bg-[#F87171] text-white flex justify-around items-center z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col items-center gap-1 opacity-80"><Home size={20} /><span className="text-[10px] font-bold uppercase">Home</span></div>
            <div className="flex flex-col items-center gap-1 opacity-100"><div className="bg-white text-[#F87171] p-3 rounded-full -mt-8 shadow-lg border-4 border-[#F3F4F6]"><Menu size={24} /></div></div>
            <div className="flex flex-col items-center gap-1 opacity-80"><Settings size={20} /><span className="text-[10px] font-bold uppercase">Config</span></div>
        </div>
    </div>
);

export default FutureLayout;
