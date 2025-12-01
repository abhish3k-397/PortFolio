import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../context/ThemeContext';
import InteractiveBlob from './InteractiveBlob';
import MagneticButton from './MagneticButton';
import CodeRevealText from './CodeRevealText';
import GlitchText from './GlitchText';

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

            } else if (theme === 'futuristic') {
                // Futuristic Fade In
                gsap.from(".hero-text-element", {
                    y: 50,
                    opacity: 0,
                    stagger: 0.2,
                    duration: 1.5,
                    ease: "power2.out"
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

            {theme === 'futuristic' && (
                <InteractiveBlob />
            )}

            <div className="z-10 text-center max-w-5xl w-full pointer-events-none">
                <div ref={textRef} className="overflow-visible pointer-events-auto">
                    <h2 className="hero-text-element text-xl md:text-2xl mb-4 font-mono tracking-widest">
                        {theme === 'cyberpunk' ? (
                            <span className="text-cyber-yellow bg-black/50 px-2">&gt; SYSTEM.INIT(USER: ABHISHEK)</span>
                        ) : theme === 'futuristic' ? (
                            <span className="text-cyan-400 tracking-[0.5em] uppercase text-sm">Interactive Experience</span>
                        ) : (
                            <span className="text-cyan-400">Hello, I am</span>
                        )}
                    </h2>

                    {theme === 'futuristic' ? (
                        <>
                            <h1 className="hero-text-element text-5xl md:text-8xl font-bold mb-6 tracking-tight leading-tight text-white mix-blend-overlay">
                                Crafting experiences <br /> through code.
                            </h1>
                            <p className="hero-text-element text-lg md:text-xl opacity-90 max-w-2xl mx-auto font-light text-cyan-100">
                                Building intuitive, fast, and meaningful software.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="mb-6 relative inline-block">
                                <CodeRevealText
                                    code={`<h1 className="hero-title">ABHISHEK KRISHNA</h1> <span className="glitch">DEV</span>`}
                                    className="cursor-crosshair"
                                >
                                    {/* Main Text Container */}
                                    <div className="relative">
                                        {/* 
                                            Glitch Stack:
                                            1. Main Text (Visible)
                                            2. Red Ghost (Behind, Glitching)
                                            3. Cyan Ghost (Behind, Glitching)
                                        */}

                                        {/* Red Ghost Layer */}
                                        {theme === 'cyberpunk' && (
                                            <div className="absolute inset-0 text-cyber-red opacity-70 animate-glitch-1 select-none pointer-events-none z-[-1]" aria-hidden="true">
                                                <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] font-geek-trend">
                                                    ABHISHEK <br />
                                                    <span className="inline-block glitch-skew">
                                                        KRISHNA
                                                    </span>
                                                </h1>
                                            </div>
                                        )}

                                        {/* Cyan Ghost Layer */}
                                        {theme === 'cyberpunk' && (
                                            <div className="absolute inset-0 text-cyan-400 opacity-70 animate-glitch-2 select-none pointer-events-none z-[-2]" aria-hidden="true">
                                                <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] font-geek-trend">
                                                    ABHISHEK <br />
                                                    <span className="inline-block glitch-skew">
                                                        KRISHNA
                                                    </span>
                                                </h1>
                                            </div>
                                        )}

                                        {/* Main Visible Text */}
                                        <h1 className="hero-text-element text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] cursor-default relative z-10 font-geek-trend">
                                            ABHISHEK <br />
                                            <span className={`inline-block glitch-skew ${theme === 'cyberpunk' ? 'text-cyber-yellow drop-shadow-[4px_4px_0_rgba(255,0,0,0.5)]' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600'}`}>
                                                KRISHNA
                                            </span>
                                        </h1>
                                    </div>
                                </CodeRevealText>
                            </div>

                            <p className="hero-text-element text-lg md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed font-light">
                                Full Stack Developer • Systems Engineer • Cybersecurity Enthusiast
                            </p>
                        </>
                    )}

                    <div className="hero-text-element mt-12 flex justify-center gap-6">
                        <MagneticButton strength={0.5}>
                            <button className={`px-8 py-3 font-bold text-xl transition-all duration-300 transform hover:-translate-y-1 ${theme === 'cyberpunk'
                                ? 'bg-cyber-red text-black skew-x-[-10deg] hover:bg-white hover:shadow-[0_0_20px_#ff003c]'
                                : theme === 'futuristic'
                                    ? 'bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 border border-white/20'
                                    : 'bg-cyan-500 text-black rounded-full hover:bg-cyan-400 hover:shadow-[0_0_20px_cyan]'
                                }`}>
                                VIEW WORK
                            </button>
                        </MagneticButton>

                        <MagneticButton strength={0.5}>
                            <button className={`px-8 py-3 font-bold text-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${theme === 'cyberpunk'
                                ? 'border-cyber-yellow text-cyber-yellow skew-x-[-10deg] hover:bg-cyber-yellow hover:text-black'
                                : theme === 'futuristic'
                                    ? 'border-white/10 text-white rounded-full hover:bg-white/5'
                                    : 'border-white/20 text-white rounded-full hover:bg-white/10'
                                }`}>
                                CONTACT
                            </button>
                        </MagneticButton>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
