import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

const DecryptedText = ({ text, className = "", speed = 50, maxIterations = 10 }) => {
    const [displayText, setDisplayText] = useState(text);
    const [isVisible, setIsVisible] = useState(false);
    const intervalRef = useRef(null);
    const containerRef = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Run once and stop
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let iteration = isVisible ? 0 : text.length;
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplayText(prev =>
                text.split("").map((letter, index) => {
                    if (text[index] === ' ') return ' '; // Preserve spaces

                    if (isVisible) {
                        // Decrypting: Show text if index < iteration, else random
                        if (index < iteration) return text[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    } else {
                        // Encrypting: Show text if index < iteration (shrinking), else random
                        // Wait, if iteration shrinks from length to 0:
                        // If index < iteration, show text. If index >= iteration, show random.
                        // Example: length 10. iteration 9. index 0-8 text, index 9 random.
                        if (index < iteration) return text[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    }
                }).join("")
            );

            if (isVisible) {
                iteration += 1 / 3;
                if (iteration >= text.length) clearInterval(intervalRef.current);
            } else {
                iteration -= 1 / 3;
                if (iteration <= 0) clearInterval(intervalRef.current);
            }
        }, speed);

        return () => clearInterval(intervalRef.current);
    }, [isVisible, text, speed]);

    return (
        <span
            ref={containerRef}
            className={`inline-block cursor-default ${className}`}
        >
            {displayText}
        </span>
    );
};

export default DecryptedText;
