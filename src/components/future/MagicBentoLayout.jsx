import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, ArrowUpRight, Code, Terminal, Cpu, Globe, Zap, Layers, Database } from 'lucide-react';

// --- MAGIC CARD COMPONENT ---
const MagicCard = ({ children, className = "", onClick }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <div
            className={`group relative border border-black/5 bg-white overflow-hidden rounded-3xl ${className}`}
            onMouseMove={handleMouseMove}
            onClick={onClick}
        >
            {/* Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                          650px circle at ${mouseX}px ${mouseY}px,
                          rgba(0,0,0,0.05),
                          transparent 80%
                        )
                      `,
                }}
            />

            {/* Content */}
            <div className="relative h-full">{children}</div>
        </div>
    );
};

const MagicBentoLayout = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#F2F2F7] text-black p-4 md:p-8 font-sans selection:bg-black selection:text-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-4 h-auto md:h-[90vh]">

                {/* 1. PROFILE CARD (Large Top-Left) */}
                <MagicCard className="md:col-span-2 md:row-span-2 p-8 flex flex-col justify-between relative group shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-8 opacity-50 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-xs font-mono text-green-600">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            AVAILABLE FOR WORK
                        </div>
                    </div>

                    <div className="space-y-4 z-10">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-black/5 group-hover:border-black/20 transition-colors">
                            <img src="/profile.jpg" alt="Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-2 text-black">Abhishek Krishna</h1>
                            <p className="text-lg text-gray-500">Full Stack Systems Engineer</p>
                        </div>
                        <p className="text-sm text-gray-600 max-w-md leading-relaxed">
                            Building robust, scalable, and visually stunning digital experiences.
                            Specialized in React, Node.js, and high-performance systems.
                        </p>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <a href="https://github.com/abhish3k-397" target="_blank" rel="noreferrer" className="p-2 bg-black/5 rounded-lg hover:bg-black hover:text-white transition-colors"><Github size={20} /></a>
                        <a href="https://www.linkedin.com/in/abhi-sh3k" target="_blank" rel="noreferrer" className="p-2 bg-black/5 rounded-lg hover:bg-black hover:text-white transition-colors"><Linkedin size={20} /></a>
                        <a href="mailto:contact@example.com" className="p-2 bg-black/5 rounded-lg hover:bg-black hover:text-white transition-colors"><Mail size={20} /></a>
                    </div>
                </MagicCard>

                {/* 2. MAP / LOCATION (Top Right) */}
                <MagicCard className="md:col-span-1 md:row-span-1 min-h-[200px] relative shadow-sm">
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/77.5946,12.9716,11,0/400x400?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGhzZCJ9')] bg-cover bg-center opacity-50 group-hover:opacity-80 transition-opacity grayscale hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={16} className="text-black" />
                            <span className="text-sm font-mono">India_Server_01</span>
                        </div>
                        <div className="text-xs text-gray-400 font-mono mt-1">{time.toLocaleTimeString()}</div>
                    </div>
                </MagicCard>

                {/* 3. LATEST PROJECT (Tall Right) */}
                <MagicCard className="md:col-span-1 md:row-span-2 bg-[#F5F5F7] p-6 flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-md transition-shadow" onClick={() => window.open('https://uno.dev.p1ng.me', '_blank')}>
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-white rounded-lg text-black shadow-sm"><Zap size={20} /></div>
                            <ArrowUpRight size={20} className="text-gray-400 group-hover:text-black transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold mb-1 text-black">FlashCards</h3>
                        <p className="text-xs text-gray-500 font-mono">Multiplayer Game</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-black w-3/4" />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                            <span>NODE.JS</span>
                            <span>WEBSOCKETS</span>
                        </div>
                    </div>
                </MagicCard>

                {/* 4. TECH STACK (Middle Strip) */}
                <MagicCard className="md:col-span-2 md:row-span-1 p-6 flex items-center overflow-hidden shadow-sm">
                    <div className="flex gap-8 animate-marquee whitespace-nowrap">
                        {[React, 'Node.js', 'TypeScript', 'Docker', 'AWS', 'GraphQL', 'Next.js', 'Tailwind', 'Python', 'Rust'].map((tech, i) => (
                            <span key={i} className="text-xl font-bold text-gray-400 hover:text-black transition-colors cursor-default">
                                {typeof tech === 'string' ? tech : <tech />}
                            </span>
                        ))}
                        {[React, 'Node.js', 'TypeScript', 'Docker', 'AWS', 'GraphQL', 'Next.js', 'Tailwind', 'Python', 'Rust'].map((tech, i) => (
                            <span key={`dup-${i}`} className="text-xl font-bold text-gray-400 hover:text-black transition-colors cursor-default">
                                {typeof tech === 'string' ? tech : <tech />}
                            </span>
                        ))}
                    </div>
                </MagicCard>

                {/* 5. STATS (Bottom Left) */}
                <MagicCard className="md:col-span-1 md:row-span-1 p-6 flex flex-col justify-center items-center text-center shadow-sm">
                    <div className="text-4xl font-black text-black mb-1">3+</div>
                    <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Years Exp</div>
                </MagicCard>

                {/* 6. SERVICES (Bottom Middle) */}
                <MagicCard className="md:col-span-2 md:row-span-1 p-6 flex justify-around items-center shadow-sm">
                    <div className="flex flex-col items-center gap-2 text-gray-400 hover:text-black transition-colors">
                        <Globe size={24} />
                        <span className="text-xs font-bold">WEB</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-gray-400 hover:text-black transition-colors">
                        <Database size={24} />
                        <span className="text-xs font-bold">BACKEND</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-gray-400 hover:text-black transition-colors">
                        <Layers size={24} />
                        <span className="text-xs font-bold">SYSTEMS</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-gray-400 hover:text-black transition-colors">
                        <Cpu size={24} />
                        <span className="text-xs font-bold">AI/ML</span>
                    </div>
                </MagicCard>

                {/* 7. CTA (Bottom Right) */}
                <MagicCard className="md:col-span-1 md:row-span-1 bg-black text-white p-6 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-gray-900 transition-colors shadow-lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                    <div className="mb-2 p-3 bg-white/10 rounded-full group-hover:scale-110 transition-transform">
                        <Mail size={24} />
                    </div>
                    <div className="font-bold">Let's Talk</div>
                </MagicCard>

            </div>
        </div>
    );
};

export default MagicBentoLayout;
