import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../context/ThemeContext';

const CustomCursor = () => {
    const { theme } = useTheme();
    const cursorRef = useRef(null);
    const outerRef = useRef(null);
    const hoverTarget = useRef(null);
    const [isHovering, setIsHovering] = useState(false);


    useEffect(() => {
        // Hide native cursor globally
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                cursor: none !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);


    useEffect(() => {
        // Mouse movement logic
        const moveCursor = (e) => {
            // Always move the small dot
            gsap.to(cursorRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });

            if (hoverTarget.current) {
                // If hovering a target, snap to its center and adapt shape
                const rect = hoverTarget.current.getBoundingClientRect();
                const style = window.getComputedStyle(hoverTarget.current);
                const borderRadius = style.borderRadius;

                gsap.to(outerRef.current, {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    width: rect.width + 20,
                    height: rect.height + 20,
                    borderRadius: borderRadius,
                    rotation: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                // If not hovering, follow mouse with default shape
                gsap.to(outerRef.current, {
                    x: e.clientX,
                    y: e.clientY,
                    width: 40,
                    height: 40,
                    borderRadius: '0px', // Square by default for target look
                    rotation: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        };

        // Hover states
        const handleMouseEnter = (e) => {
            setIsHovering(true);
            hoverTarget.current = e.currentTarget;
        };

        const handleMouseLeave = () => {
            setIsHovering(false);
            hoverTarget.current = null;
        };

        window.addEventListener('mousemove', moveCursor);

        // Re-bind listeners periodically or use a mutation observer if needed, 
        // but for now standard selection is fine.
        // We'll select broadly to catch most interactive elements.
        const clickables = document.querySelectorAll('a, button, .clickable, input, textarea, [role="button"]');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            clickables.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);



    if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        return null;
    }

    const getColor = () => {
        switch (theme) {
            case 'cyberpunk': return '#fcee0a'; // Cyber Yellow
            case 'futuristic': return '#06b6d4'; // Cyan
            case 'creative': return '#d946ef'; // Fuchsia
            default: return '#06b6d4';
        }
    };

    const color = getColor();

    return (
        <>
            {/* Center Dot */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
                style={{ backgroundColor: color }}
            />

            {/* Outer Target Brackets */}
            <div
                ref={outerRef}
                className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
                style={{ width: '40px', height: '40px' }}
            >
                {/* Top Left */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: color }} />
                {/* Top Right */}
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: color }} />
                {/* Bottom Left */}
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: color }} />
                {/* Bottom Right */}
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: color }} />
            </div>
        </>
    );
};

export default CustomCursor;
