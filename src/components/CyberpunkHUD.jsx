import React, { useState, useEffect, useRef } from 'react';
import { Battery, BatteryCharging, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements } from '../context/AchievementContext';

const useTime = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return { time, setTime };
};

const CyberpunkHUD = ({ onIdleChange }) => {
    const { time } = useTime();
    const { unlockAchievement } = useAchievements();
    const [battery, setBattery] = useState({ level: 100, charging: false });
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isIdle, setIsIdle] = useState(false);
    const [isGlitching, setIsGlitching] = useState(false);
    const idleTimerRef = useRef(null);

    // Idle Detection Logic
    useEffect(() => {
        const resetIdleTimer = () => {
            setIsIdle(false);
            setIsGlitching(false);
            if (onIdleChange) onIdleChange(false);

            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            idleTimerRef.current = setTimeout(() => {
                setIsIdle(true);
                if (onIdleChange) onIdleChange(true);
                unlockAchievement('afk');
            }, 15000); // 15 seconds
        };

        // Initial timer
        resetIdleTimer();

        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, resetIdleTimer));

        return () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            events.forEach(event => window.removeEventListener(event, resetIdleTimer));
        };
    }, [onIdleChange]);

    // Trigger Glitch after animation
    useEffect(() => {
        let timeout;
        if (isIdle) {
            timeout = setTimeout(() => setIsGlitching(true), 800);
        } else {
            setIsGlitching(false);
        }
        return () => clearTimeout(timeout);
    }, [isIdle]);

    // Battery Logic
    useEffect(() => {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(bat => {
                const updateBattery = () => {
                    setBattery({
                        level: bat.level * 100,
                        charging: bat.charging
                    });
                };
                updateBattery();
                bat.addEventListener('levelchange', updateBattery);
                bat.addEventListener('chargingchange', updateBattery);

                return () => {
                    bat.removeEventListener('levelchange', updateBattery);
                    bat.removeEventListener('chargingchange', updateBattery);
                };
            });
        }
    }, []);

    // Scroll Logic
    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;
            setScrollProgress(Number(scroll));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-50 font-rajdhani text-cyber-yellow select-none">

            {/* Idle Overlay (Dark Tint + Noise) */}
            <AnimatePresence>
                {isIdle && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="absolute inset-0 bg-black/60 z-40"
                    >
                        {/* Noise Texture for Acrylic Feel */}
                        <div
                            className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HUD Content Wrapper (Mix Blend Screen) */}
            <div className="absolute inset-0 p-4 md:p-8 mix-blend-screen z-50">

                {/* Animated Clock Container */}
                <motion.div
                    initial={false}
                    animate={{
                        top: isIdle ? "50%" : "2rem",
                        left: isIdle ? "50%" : "2rem",
                        x: isIdle ? "-50%" : "0%",
                        y: isIdle ? "-50%" : "0%",
                        scale: isIdle ? 5 : 1,
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute flex flex-col gap-1 origin-center z-50"
                >
                    <motion.div
                        animate={{ opacity: isIdle ? 0 : 0.8 }}
                        className="flex items-center gap-2 text-xs md:text-sm tracking-[0.2em]"
                    >
                        <div className="w-2 h-2 bg-cyber-red rounded-full animate-pulse" />
                        SYSTEM ONLINE
                    </motion.div>

                    {/* Glitch Clock Structure */}
                    <div className="relative">
                        {/* Red Ghost Layer */}
                        <div className={`absolute inset-0 text-cyber-red opacity-70 select-none pointer-events-none z-[-1] ${isGlitching ? 'animate-glitch-1 block' : 'hidden'}`} aria-hidden="true">
                            <div className="text-2xl md:text-4xl font-bold tracking-widest font-orbitron whitespace-nowrap glitch-skew origin-center">
                                {formatTime(time)}
                            </div>
                        </div>

                        {/* Cyan Ghost Layer */}
                        <div className={`absolute inset-0 text-cyan-400 opacity-70 select-none pointer-events-none z-[-2] ${isGlitching ? 'animate-glitch-2 block' : 'hidden'}`} aria-hidden="true">
                            <div className="text-2xl md:text-4xl font-bold tracking-widest font-orbitron whitespace-nowrap glitch-skew origin-center">
                                {formatTime(time)}
                            </div>
                        </div>

                        {/* Main Visible Text */}
                        <div className={`text-2xl md:text-4xl font-bold tracking-widest font-orbitron whitespace-nowrap relative z-10 ${isGlitching ? 'glitch-skew origin-center' : ''}`}>
                            {formatTime(time)}
                        </div>
                    </div>

                    <motion.div
                        animate={{ opacity: isIdle ? 0 : 1 }}
                        className="h-[1px] w-32 bg-gradient-to-r from-cyber-yellow to-transparent"
                    />
                    <motion.div
                        animate={{ opacity: isIdle ? 0 : 1 }}
                        className="text-[10px] text-cyan-400 tracking-widest mt-1"
                    >
                        LOC: 127.0.0.1
                    </motion.div>
                </motion.div>

                {/* Other HUD Elements (Fade out when idle) */}
                <motion.div animate={{ opacity: isIdle ? 0 : 1 }} transition={{ duration: 0.5 }}>

                    {/* Top Right: Battery & Network */}
                    <div className="absolute top-8 right-8 hidden md:flex flex-col items-end gap-2">
                        <div className="flex items-center gap-4 text-cyan-400">
                            <div className="flex items-center gap-2">
                                <span className="text-xs tracking-widest">NET</span>
                                <Wifi size={18} />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs tracking-widest">{Math.round(battery.level)}%</span>
                                {battery.charging ? <BatteryCharging size={18} /> : <Battery size={18} />}
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-8 h-1 bg-cyber-red opacity-60" />
                            <div className="w-2 h-1 bg-cyber-red opacity-40" />
                            <div className="w-1 h-1 bg-cyber-red opacity-20" />
                        </div>
                    </div>

                    {/* Bottom Right: Scroll Progress */}
                    <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-end gap-2">
                        <div className="text-xs tracking-[0.3em] text-cyan-400 mb-1">
                            INTEGRITY
                        </div>
                        <div className="flex items-end gap-2 h-32">
                            <div className="w-1 h-full bg-white/10 relative">
                                <div
                                    className="absolute bottom-0 left-0 w-full bg-cyber-yellow transition-all duration-100 ease-out shadow-[0_0_10px_#fcee0a]"
                                    style={{ height: `${scrollProgress * 100}%` }}
                                />
                            </div>
                            <div className="flex flex-col justify-between h-full py-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-2 h-[1px] bg-cyan-400/50" />
                                ))}
                            </div>
                        </div>
                        <div className="text-xl font-bold font-orbitron text-cyber-yellow">
                            {Math.round(scrollProgress * 100)}%
                        </div>
                    </div>

                    {/* Bottom Left: Decorative */}
                    <div className="absolute bottom-8 left-8 hidden md:block">
                        <div className="border-l-2 border-b-2 border-cyan-400/50 w-16 h-16 rounded-bl-lg" />
                        <div className="text-[10px] tracking-widest text-cyan-400/60 mt-2 ml-2">
                            VER 2.0.4
                        </div>
                    </div>

                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-16 h-16 md:w-32 md:h-32 border-l-2 border-t-2 border-white/10 rounded-tl-3xl pointer-events-none" />
                    <div className="absolute top-0 right-0 w-16 h-16 md:w-32 md:h-32 border-r-2 border-t-2 border-white/10 rounded-tr-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 md:w-32 md:h-32 border-l-2 border-b-2 border-white/10 rounded-bl-3xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 md:w-32 md:h-32 border-r-2 border-b-2 border-white/10 rounded-br-3xl pointer-events-none" />
                </motion.div>
            </div>
        </div>
    );
};

export default CyberpunkHUD;
