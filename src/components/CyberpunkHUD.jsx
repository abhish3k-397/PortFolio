import React, { useState, useEffect } from 'react';
import { Battery, BatteryCharging, Wifi } from 'lucide-react';

const CyberpunkHUD = () => {
    const [time, setTime] = useState(new Date());
    const [battery, setBattery] = useState({ level: 100, charging: false });
    const [scrollProgress, setScrollProgress] = useState(0);

    // Clock Logic
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

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
        <div className="fixed inset-0 pointer-events-none z-50 p-4 md:p-8 font-rajdhani text-cyber-yellow select-none mix-blend-screen">
            {/* Top Left: System Status */}
            <div className="absolute top-8 left-8 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs md:text-sm tracking-[0.2em] opacity-80">
                    <div className="w-2 h-2 bg-cyber-red rounded-full animate-pulse" />
                    SYSTEM ONLINE
                </div>
                <div className="text-2xl md:text-4xl font-bold tracking-widest font-orbitron">
                    {formatTime(time)}
                </div>
                <div className="h-[1px] w-32 bg-gradient-to-r from-cyber-yellow to-transparent" />
                <div className="text-[10px] text-cyan-400 tracking-widest mt-1">
                    LOC: 127.0.0.1
                </div>
            </div>

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
                {/* Decorative lines */}
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
                    {/* Progress Bar */}
                    <div className="w-1 h-full bg-white/10 relative">
                        <div
                            className="absolute bottom-0 left-0 w-full bg-cyber-yellow transition-all duration-100 ease-out shadow-[0_0_10px_#fcee0a]"
                            style={{ height: `${scrollProgress * 100}%` }}
                        />
                    </div>
                    {/* Scale markers */}
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
        </div>
    );
};

export default CyberpunkHUD;
