import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../context/ThemeContext';

const CustomCursor = () => {
    const { theme } = useTheme();
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const trailRefs = useRef([]); // Array of refs for the trail
    const [isHovering, setIsHovering] = useState(false);
    const isHoveringRef = useRef(false); // Ref to track hover state inside event listener

    // Initialize trail refs array
    trailRefs.current = [];
    const addToTrailRefs = (el) => {
        if (el && !trailRefs.current.includes(el)) {
            trailRefs.current.push(el);
        }
    };

    // Sync ref with state
    useEffect(() => {
        isHoveringRef.current = isHovering;
    }, [isHovering]);

    // Handle hover scaling with GSAP to avoid CSS conflict
    useEffect(() => {
        if (followerRef.current && theme !== 'futuristic') {
            gsap.to(followerRef.current, {
                scale: isHovering ? 1.5 : 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }, [isHovering, theme]);

    useEffect(() => {
        // 1. Setup gsap.quickTo instances
        const cursorX = gsap.quickTo(cursorRef.current, "x", { duration: 0.1, ease: "power2.out" });
        const cursorY = gsap.quickTo(cursorRef.current, "y", { duration: 0.1, ease: "power2.out" });

        let followerX, followerY;
        if (followerRef.current) {
            followerX = gsap.quickTo(followerRef.current, "x", { duration: 0.3, ease: "power2.out" });
            followerY = gsap.quickTo(followerRef.current, "y", { duration: 0.3, ease: "power2.out" });
        }

        const trailX = [];
        const trailY = [];
        trailRefs.current.forEach((el, index) => {
            trailX.push(gsap.quickTo(el, "x", { duration: 0.15 + (index * 0.05), ease: "power2.out" }));
            trailY.push(gsap.quickTo(el, "y", { duration: 0.15 + (index * 0.05), ease: "power2.out" }));
        });

        const onMouseMove = (e) => {
            // 1. Main Cursor (Immediate)
            cursorX(e.clientX);
            cursorY(e.clientY);

            // 2. Theme Specific Behavior
            if (theme === 'futuristic') {
                // Trail Effect
                trailX.forEach(func => func(e.clientX));
                trailY.forEach(func => func(e.clientY));

                // Hide standard follower in futuristic mode
                if (followerRef.current) {
                    gsap.set(followerRef.current, { opacity: 0 });
                }

            } else {
                // Standard Follower (Cyberpunk / Creative)
                if (followerRef.current) {
                    // Use ref for current hover state to avoid re-binding listener
                    gsap.set(followerRef.current, { opacity: isHoveringRef.current ? 0.5 : 1 });

                    if (followerX && followerY) {
                        followerX(e.clientX);
                        followerY(e.clientY);
                    }
                }
            }
        };

        const onMouseEnter = () => setIsHovering(true);
        const onMouseLeave = () => setIsHovering(false);

        const clickables = document.querySelectorAll('a, button, .clickable');
        clickables.forEach((el) => {
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });

        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            clickables.forEach((el) => {
                el.removeEventListener('mouseenter', onMouseEnter);
                el.removeEventListener('mouseleave', onMouseLeave);
            });
        };
    }, [theme]); // Only re-run when theme changes (to reset refs/quickTo)

    if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        return null;
    }

    return (
        <>
            {/* Main Cursor Point */}
            <div
                ref={cursorRef}
                className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference
          ${theme === 'cyberpunk' ? 'w-2 h-2 bg-cyber-red' : ''}
          ${theme === 'futuristic' ? 'w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_cyan,0_0_30px_cyan]' : ''}
          ${theme === 'creative' ? 'w-3 h-3 bg-pink-500 rounded-full' : ''}
        `}
            />

            {/* Futuristic Trail */}
            {theme === 'futuristic' && (
                <>
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            ref={addToTrailRefs}
                            className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/40 blur-[2px]"
                            style={{
                                width: `${20 - i * 3}px`,
                                height: `${20 - i * 3}px`,
                                opacity: 0.6 - i * 0.1
                            }}
                        />
                    ))}
                </>
            )}

            {/* Standard Follower (Cyberpunk / Creative) */}
            <div
                ref={followerRef}
                className={`fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height,border-radius,background-color,opacity] duration-300
          ${theme === 'cyberpunk'
                        ? 'w-8 h-8 border border-cyber-yellow bg-transparent'
                        : ''}
          ${theme === 'creative'
                        ? 'w-12 h-12 bg-purple-500/20 rounded-full backdrop-blur-sm'
                        : ''}
          ${theme === 'futuristic' ? 'hidden' : ''} 
        `}
            />
        </>
    );
};

export default CustomCursor;
