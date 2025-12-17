import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { useTheme } from '../context/ThemeContext';

const SmoothScroll = () => {
    const { theme } = useTheme();
    const lenisRef = useRef(null);

    useEffect(() => {
        // Configuration based on theme
        // User requested slow scroll for 'cyberpunk' theme
        const isCyber = theme === 'cyberpunk';

        const lenis = new Lenis({
            duration: isCyber ? 4.5 : 1.2, // Maximum heaviness
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothWheel: true,
            mouseMultiplier: isCyber ? 0.15 : 1, // Extremely low sensitivity
            wheelMultiplier: isCyber ? 0.15 : 1, // Extremely low sensitivity
            smoothTouch: false,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        let rafId;
        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, [theme]); // Re-initialize when theme changes

    return null;
};

export default SmoothScroll;
