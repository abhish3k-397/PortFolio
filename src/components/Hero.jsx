import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../context/ThemeContext';

const Hero = () => {
    const { theme } = useTheme();
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (theme === 'cyberpunk') {
                // Bebop Style Intro
                gsap.from(".hero-text-element", {
                    y: 100,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 1.2,
                    ease: "power4.out",
                    delay: 0.5
                });

                // Glitch effect loop
                gsap.to(".glitch-text", {
                    skewX: 20,
                    duration: 0.1,
                    repeat: -1,
                    yoyo: true,
                    repeatDelay: 3,
                    ease: "rough"
                });

            } else {
                // Standard Fade
                gsap.from(containerRef.current, { opacity: 0, duration: 1 });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [theme]);

    return (
        <section ref={containerRef} className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden p-4">

            {theme === 'cyberpunk' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
                    {/* Big Background Text */}
                    <h1 className="text-[20vw] font-black tracking-tighter text-cyber-red rotate-[-5deg] whitespace-nowrap">
                        SEE YOU SPACE COWBOY...
                    </h1>
                </div>
            )}

            <div className="z-10 text-center max-w-5xl w-full">
                <div ref={textRef} className="overflow-visible">
                    <h2 className="hero-text-element text-xl md:text-2xl mb-4 font-mono tracking-widest">
                        {theme === 'cyberpunk' ? (
                            <span className="text-cyber-yellow bg-black/50 px-2">&gt; SYSTEM.INIT(USER: ABHISHEK)</span>
                        ) : (
                            <span className="text-cyan-400">Hello, I am</span>
                        )}
                    </h2>

                    <h1 className="hero-text-element text-6xl md:text-9xl font-black mb-6 tracking-tighter leading-[0.9]">
                        ABHISHEK <br />
                        <span className={`glitch-text inline-block ${theme === 'cyberpunk' ? 'text-cyber-red drop-shadow-[4px_4px_0_rgba(255,255,255,0.2)]' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600'}`}>
                            KRISHNA
                        </span>
                    </h1>

                    <p className="hero-text-element text-lg md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed font-light">
                        Full Stack Developer • Systems Engineer • Cybersecurity Enthusiast
                    </p>

                    <div className="hero-text-element mt-12 flex justify-center gap-6">
                        <button className={`px-8 py-3 font-bold text-xl transition-all duration-300 transform hover:-translate-y-1 ${theme === 'cyberpunk'
                            ? 'bg-cyber-red text-black skew-x-[-10deg] hover:bg-white hover:shadow-[0_0_20px_#ff003c]'
                            : 'bg-cyan-500 text-black rounded-full hover:bg-cyan-400 hover:shadow-[0_0_20px_cyan]'
                            }`}>
                            VIEW WORK
                        </button>
                        <button className={`px-8 py-3 font-bold text-xl transition-all duration-300 border-2 ${theme === 'cyberpunk'
                            ? 'border-cyber-yellow text-cyber-yellow skew-x-[-10deg] hover:bg-cyber-yellow hover:text-black'
                            : 'border-white/20 text-white rounded-full hover:bg-white/10'
                            }`}>
                            CONTACT
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
