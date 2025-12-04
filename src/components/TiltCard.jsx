import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';

const TiltCard = ({ children, className = "" }) => {
    const cardRef = useRef(null);
    const glareRef = useRef(null);
    const sweepRef = useRef(null);
    const [bounds, setBounds] = useState(null);

    const handleMouseEnter = (e) => {
        if (window.matchMedia("(pointer: coarse)").matches) return;

        setBounds(cardRef.current.getBoundingClientRect());
        gsap.to(cardRef.current, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
        });
        gsap.to(glareRef.current, {
            opacity: 1,
            duration: 0.3
        });

        // Light Sweep Animation
        gsap.fromTo(sweepRef.current,
            { x: '-200%', opacity: 0.5 },
            { x: '300%', opacity: 0, duration: 0.8, ease: "power1.inOut" }
        );
    };

    const handleMouseLeave = () => {
        if (window.matchMedia("(pointer: coarse)").matches) return;

        gsap.to(cardRef.current, {
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)"
        });
        gsap.to(glareRef.current, {
            opacity: 0,
            duration: 0.3
        });
    };

    const handleMouseMove = (e) => {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        if (!bounds) return;

        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(cardRef.current, {
            rotationX: rotateX,
            rotationY: rotateY,
            duration: 0.1,
            ease: "power1.out"
        });

        // Glare movement
        const glareX = (x / bounds.width) * 100;
        const glareY = (y / bounds.height) * 100;

        gsap.to(glareRef.current, {
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)`,
            duration: 0.1
        });
    };

    return (
        <div
            className="perspective-1000 w-full h-full"
            style={{ perspective: '1000px' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            <div
                ref={cardRef}
                className={`relative preserve-3d transition-shadow duration-300 ${className}`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {children}

                {/* Effects Container (Clipped) */}
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-50">
                    {/* Holographic Glare Overlay */}
                    <div
                        ref={glareRef}
                        className="absolute inset-0 opacity-0 mix-blend-overlay"
                        style={{
                            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)'
                        }}
                    />

                    {/* Light Sweep Overlay */}
                    <div
                        ref={sweepRef}
                        className="absolute top-0 bottom-0 w-1/2"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                            transform: 'skewX(-20deg) translateX(-200%)',
                            left: 0
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TiltCard;
