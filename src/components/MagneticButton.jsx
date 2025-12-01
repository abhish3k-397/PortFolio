import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const MagneticButton = ({ children, className = "", onClick, strength = 0.5 }) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        const button = buttonRef.current;

        // QuickTo for smoother, more performant animation
        const xTo = gsap.quickTo(button, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(button, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const onMouseMove = (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Apply strength multiplier
            xTo(x * strength);
            yTo(y * strength);
        };

        const onMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        button.addEventListener('mousemove', onMouseMove);
        button.addEventListener('mouseleave', onMouseLeave);

        return () => {
            button.removeEventListener('mousemove', onMouseMove);
            button.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [strength]);

    return (
        <div
            ref={buttonRef}
            onClick={onClick}
            className={`relative inline-block ${className}`}
            style={{ touchAction: 'none' }} // Prevent touch scrolling issues
        >
            {children}
        </div>
    );
};

export default MagneticButton;
