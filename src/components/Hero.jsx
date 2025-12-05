import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../context/ThemeContext';
import InteractiveBlob from './InteractiveBlob';
import MagneticButton from './MagneticButton';
import CodeRevealText from './CodeRevealText';

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
        <section id="hero" ref={containerRef} className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden p-4">

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

            <div className="z-10 text-center w-full pointer-events-none">
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
                        <div className="relative z-10 text-center px-4">
                            <div
                                className="mb-8 relative inline-block group"
                                onMouseEnter={() => {
                                    gsap.fromTo(".hero-ripple",
                                        { x: '-200%', opacity: 0.5 },
                                        { x: '300%', opacity: 0, duration: 1, ease: "power1.inOut" }
                                    );
                                }}
                            >
                                <CodeRevealText
                                    code={`<h1 className="hero-title">ABHISHEK KRISHNA</h1> <span className="glitch">DEV</span>`}
                                    className="cursor-crosshair"
                                >
                                    {/* Main Text Container */}
                                    <div className="relative overflow-hidden">
                                        {/* Red Ghost Layer (Now Cyan for Abhishek) */}
                                        {theme === 'cyberpunk' && (
                                            <div className="absolute inset-0 text-cyan-400 opacity-70 animate-glitch-1 select-none pointer-events-none z-[-1]" aria-hidden="true">
                                                <h1 className="text-[clamp(2rem,6vw,9rem)] font-black tracking-tighter leading-[0.9] font-geek-trend glitch-skew origin-center">
                                                    ABHISHEK <br />
                                                    <span className="text-cyber-yellow">KRISHNA</span>
                                                </h1>
                                            </div>
                                        )}

                                        {/* Cyan Ghost Layer (Now Yellow for Krishna) */}
                                        {theme === 'cyberpunk' && (
                                            <div className="absolute inset-0 text-cyber-yellow opacity-70 animate-glitch-2 select-none pointer-events-none z-[-2]" aria-hidden="true">
                                                <h1 className="text-[clamp(2rem,6vw,9rem)] font-black tracking-tighter leading-[0.9] font-geek-trend glitch-skew origin-center">
                                                    <span className="text-cyan-400">ABHISHEK</span> <br />
                                                    KRISHNA
                                                </h1>
                                            </div>
                                        )}

                                        {/* Main Visible Text */}
                                        <h1 className="hero-text-element text-[clamp(2rem,6vw,9rem)] font-black tracking-tighter leading-[0.9] cursor-default relative z-10 font-geek-trend glitch-skew origin-center text-cyan-400">
                                            ABHISHEK <br />
                                            <span className={theme === 'cyberpunk' ? 'text-cyber-yellow drop-shadow-[4px_4px_0_rgba(255,0,0,0.5)]' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600'}>
                                                KRISHNA
                                            </span>
                                        </h1>

                                        {/* Light Sweep Overlay */}
                                        <div
                                            className="hero-ripple absolute top-0 bottom-0 w-1/2 pointer-events-none z-30"
                                            style={{
                                                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                                                transform: 'skewX(-20deg) translateX(-200%)',
                                                left: 0,
                                                mixBlendMode: 'overlay'
                                            }}
                                        />
                                    </div>
                                </CodeRevealText>
                            </div>

                            <p className="hero-text-element text-sm md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed font-light mb-6 md:mb-12">
                                Full Stack Developer • Systems Engineer • Cybersecurity Enthusiast
                            </p>

                            <div className="hero-text-element flex flex-row flex-wrap justify-center gap-2 md:gap-6 items-center">
                                <MagneticButton strength={0.5}>
                                    <button className={`w-auto px-4 py-2 text-sm md:px-8 md:py-4 md:font-bold md:text-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${theme === 'cyberpunk'
                                        ? 'border-cyber-yellow text-cyber-yellow skew-x-[-10deg] hover:bg-cyber-yellow hover:text-black'
                                        : theme === 'futuristic'
                                            ? 'border-white/10 text-white rounded-full hover:bg-white/5'
                                            : 'border-white/20 text-white rounded-full hover:bg-white/10'
                                        }`}>
                                        ABOUT ME
                                    </button>
                                </MagneticButton>

                                <MagneticButton strength={0.5}>
                                    <button className={`w-auto px-4 py-2 text-sm md:px-8 md:py-4 md:font-bold md:text-xl transition-all duration-300 transform hover:-translate-y-1 ${theme === 'cyberpunk'
                                        ? 'bg-cyber-red text-black skew-x-[-10deg] hover:bg-white hover:shadow-[0_0_20px_#ff003c]'
                                        : theme === 'futuristic'
                                            ? 'bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 border border-white/20'
                                            : 'bg-cyan-500 text-black rounded-full hover:bg-cyan-400 hover:shadow-[0_0_20px_cyan]'
                                        }`}>
                                        VIEW WORK
                                    </button>
                                </MagneticButton>

                                <MagneticButton strength={0.5}>
                                    <button className={`w-auto px-4 py-2 text-sm md:px-8 md:py-4 md:font-bold md:text-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${theme === 'cyberpunk'
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
                    )}
                </div>
            </div >
        </section >
    );
};

export default Hero;
