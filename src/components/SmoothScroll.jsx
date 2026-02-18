import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { useTheme } from '../context/ThemeContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SmoothScroll = () => {
    const { theme } = useTheme();
    const lenisRef = useRef(null);

    useEffect(() => {
        // Theme Isolation: Samurai theme uses discrete navigation, 
        // so we disable Lenis to avoid collisions with wheel events.
        if (theme === 'samurai') {
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
            return;
        }

        // Configuration based on theme
        const isCyber = theme === 'cyberpunk';

        const lenis = new Lenis({
            duration: isCyber ? 1.5 : 1.2, // Lightened the 'heavy' feel for Cyberpunk
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothWheel: true,
            mouseMultiplier: 1, // Normalized sensitivity
            wheelMultiplier: 1, // Normalized sensitivity
            smoothTouch: false,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        // Sync with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // Use GSAP ticker for the update loop for better performance and sync
        const updateLenis = (time) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(updateLenis);

        return () => {
            gsap.ticker.remove(updateLenis);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, [theme]); // Re-initialize when theme changes

    return null;
};

export default SmoothScroll;
