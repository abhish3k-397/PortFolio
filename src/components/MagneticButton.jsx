import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const MagneticButton = ({ children, className = "", onClick }) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        const button = buttonRef.current;

        const onMouseMove = (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move button towards mouse
            gsap.to(button, {
                x: x * 0.3, // Magnetic strength
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        };

        const onMouseLeave = () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        };

        button.addEventListener('mousemove', onMouseMove);
        button.addEventListener('mouseleave', onMouseLeave);

        return () => {
            button.removeEventListener('mousemove', onMouseMove);
            button.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    return (
        <div
            ref={buttonRef}
            onClick={onClick}
            className={`relative inline-block ${className}`}
        >
            {children}
        </div>
    );
};

export default MagneticButton;
