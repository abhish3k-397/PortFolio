import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../context/ThemeContext';

const CustomCursor = () => {
    const { theme } = useTheme();
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const trailRefs = useRef([]); // Array of refs for the trail
    const [isHovering, setIsHovering] = useState(false);

    // Initialize trail refs array
    trailRefs.current = [];
    const addToTrailRefs = (el) => {
        if (el && !trailRefs.current.includes(el)) {
            trailRefs.current.push(el);
        }
    };

    useEffect(() => {
        const onMouseMove = (e) => {
            // 1. Main Cursor (Immediate)
            gsap.to(cursorRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });

            // 2. Theme Specific Behavior
            if (theme === 'futuristic') {
                // Trail Effect
                trailRefs.current.forEach((el, index) => {
                    gsap.to(el, {
                        x: e.clientX,
                        y: e.clientY,
                        duration: 0.15 + (index * 0.05), // Staggered delay for "tail" effect
                        ease: 'power2.out'
                    });
                });
                // Hide standard follower in futuristic mode (we use trail instead)
                if (followerRef.current) {
                    gsap.set(followerRef.current, { opacity: 0 });
                }

            } else {
                // Standard Follower (Cyberpunk / Creative)
                if (followerRef.current) {
                    gsap.set(followerRef.current, { opacity: isHovering ? 0.5 : 1 });
                    gsap.to(followerRef.current, {
                        x: e.clientX,
                        y: e.clientY,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
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
    }, [theme, isHovering]);

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
                className={`fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300
          ${isHovering ? 'scale-150' : 'scale-100'}
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
