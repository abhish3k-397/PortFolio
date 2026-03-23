import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import ElectricBorder from './ElectricBorder';
import DecryptedText from './DecryptedText';

gsap.registerPlugin(ScrollTrigger);

const Bio = () => {
    const { theme } = useTheme();
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const textRef = useRef(null);
    const parallaxRef = useRef(null);
    const bgLayerRef = useRef(null);
    const fgLayerRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(imageRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                    toggleActions: "play none none reverse",
                },
                x: -100,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });

            gsap.from(textRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                    toggleActions: "play none none reverse",
                },
                x: 100,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                delay: 0.2
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!parallaxRef.current || !bgLayerRef.current || !fgLayerRef.current) return;
        const rect = parallaxRef.current.getBoundingClientRect();
        // Normalized -1 to 1
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        // Background moves opposite to cursor (subtle)
        gsap.to(bgLayerRef.current, {
            x: -x * 15,
            y: -y * 10,
            duration: 0.6,
            ease: 'power2.out',
        });

        // Foreground moves with cursor (more dramatic)
        gsap.to(fgLayerRef.current, {
            x: x * 25,
            y: y * 15,
            duration: 0.4,
            ease: 'power2.out',
        });
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovering(true);
        if (fgLayerRef.current) {
            gsap.to(fgLayerRef.current, {
                scale: 1.08,
                duration: 0.6,
                ease: 'power2.out',
            });
        }
        if (bgLayerRef.current) {
            gsap.to(bgLayerRef.current, {
                scale: 1.15,
                duration: 0.6,
                ease: 'power2.out',
            });
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
        // Reset both layers to center
        if (bgLayerRef.current) {
            gsap.to(bgLayerRef.current, {
                x: 0, y: 0, scale: 1.05,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)',
            });
        }
        if (fgLayerRef.current) {
            gsap.to(fgLayerRef.current, {
                x: 0, y: 0, scale: 1,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)',
            });
        }
    }, []);

    const getThemeColor = () => {
        switch (theme) {
            case 'cyberpunk': return 'yellow';
            default: return 'cyan';
        }
    };

    return (
        <section id="about" ref={containerRef} className="min-h-screen py-20 px-4 flex items-center justify-center relative z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Image Section */}
                <div ref={imageRef} className="relative group">
                    <ElectricBorder
                        color={getThemeColor()}
                        className="w-full max-w-md mx-auto aspect-[3/4]"
                        innerClassName="relative w-full h-full bg-black"
                    >
                        {/* Parallax Container */}
                        <div
                            ref={parallaxRef}
                            className="relative w-full h-full overflow-hidden cursor-none"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Background Layer — event/crowd scene */}
                            <img
                                ref={bgLayerRef}
                                src="/layer2.png"
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-500 grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
                                style={{ scale: 1.05, willChange: 'transform' }}
                            />

                            {/* Foreground Layer — person cutout */}
                            <img
                                ref={fgLayerRef}
                                src="/layer1.png"
                                alt="Abhishek Krishna"
                                className="absolute bottom-0 left-0 right-0 mx-auto w-[75%] h-[85%] object-contain object-bottom transition-[filter] duration-500 grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
                                style={{ willChange: 'transform', zIndex: 1 }}
                            />

                            {/* Duotone Overlay */}
                            <div
                                className={`absolute inset-0 mix-blend-overlay opacity-60 transition-opacity duration-500 group-hover:opacity-0 ${
                                    theme === 'cyberpunk' ? 'bg-cyber-yellow' : 'bg-cyan-500'
                                }`}
                                style={{ zIndex: 2 }}
                            />

                            {/* Scanlines */}
                            <div
                                className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none"
                                style={{ zIndex: 3 }}
                            />

                            {/* Glitch Overlay (Cyberpunk only) */}
                            {theme === 'cyberpunk' && (
                                <div
                                    className="absolute inset-0 bg-cyber-red/10 mix-blend-color-dodge opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                                    style={{ zIndex: 4 }}
                                />
                            )}

                            {/* Depth shadow vignette */}
                            <div
                                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                                style={{
                                    zIndex: 5,
                                    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
                                    opacity: isHovering ? 0.8 : 0.4,
                                }}
                            />
                        </div>
                    </ElectricBorder>
                </div>

                {/* Text Section */}
                <div ref={textRef} className="space-y-8">
                    <div className="space-y-2">
                        <h3 className={`text-xl font-mono tracking-widest ${theme === 'cyberpunk' ? 'text-cyber-yellow' : 'text-cyan-400'
                            }`}>
                            &gt; SYSTEM_IDENTITY_VERIFIED
                        </h3>
                        <h2 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter ${theme === 'cyberpunk' ? 'text-white' : 'text-white'
                            }`}>
                            Abhishek <br />
                            <span className={theme === 'cyberpunk' ? 'text-cyber-red' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500'}>
                                Krishna
                            </span>
                        </h2>
                    </div>

                    <div className={`p-6 border-l-4 ${theme === 'cyberpunk' ? 'border-cyber-yellow bg-white/5' : 'border-cyan-500 bg-cyan-900/10'
                        }`}>
                        <p className="text-lg md:text-xl leading-relaxed opacity-90 font-mono">
                            <DecryptedText
                                text="I am a Full Stack Developer and Systems Engineer with a passion for building robust, scalable, and visually stunning digital experiences. My code is my craft, and I strive to create software that not only functions perfectly but also leaves a lasting impression."
                                speed={20}
                            />
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-bold opacity-50 mb-1">CURRENT_STATUS</h4>
                            <p className="text-green-400 font-mono flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                ONLINE / AVAILABLE
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold opacity-50 mb-1">LOCATION</h4>
                            <p className="font-mono">INDIA_SERVER_01</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Bio;
