import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const CodeRevealText = ({ children, code, className = "" }) => {
    const { theme } = useTheme();
    const containerRef = useRef(null);
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [patternUrl, setPatternUrl] = useState('');

    // Generate the Code Pattern Image
    useEffect(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 300;

        // Background - Transparent
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Text Style
        ctx.font = 'bold 12px monospace';
        // Use a brighter color for the code pattern to stand out against the glitch shadow
        ctx.fillStyle = theme === 'cyberpunk' ? '#ffff00' : '#00ffff';
        ctx.textBaseline = 'top';

        const text = code + " " + code + " " + code;

        for (let y = 0; y < canvas.height; y += 14) {
            ctx.fillText(text, -50 + Math.random() * 50, y);
        }

        setPatternUrl(canvas.toDataURL());
    }, [code, theme]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            setCursor({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        };

        const onMouseEnter = () => setIsHovering(true);
        const onMouseLeave = () => setIsHovering(false);

        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseenter', onMouseEnter);
        container.addEventListener('mouseleave', onMouseLeave);

        return () => {
            container.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseenter', onMouseEnter);
            container.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    // Top Layer Mask: Hides the solid text at the cursor
    const maskSize = 120;
    const topMaskStyle = isHovering ? {
        maskImage: `radial-gradient(circle ${maskSize}px at ${cursor.x}px ${cursor.y}px, transparent 0%, black 100%)`,
        WebkitMaskImage: `radial-gradient(circle ${maskSize}px at ${cursor.x}px ${cursor.y}px, transparent 0%, black 100%)`,
    } : {
        maskImage: 'none',
        WebkitMaskImage: 'none'
    };

    return (
        <div ref={containerRef} className={`relative inline-block ${className}`}>

            {/* 
          Bottom Layer: The Code Pattern Version 
          We preserve text-shadow and transforms, but override the FILL color.
      */}
            <div className="absolute inset-0 pointer-events-none select-none force-code-pattern-layer">
                {children}
            </div>

            {/* Top Layer: The Solid Version */}
            <div className="relative z-10 transition-all duration-100 ease-out" style={topMaskStyle}>
                {children}
            </div>

            <style>{`
        .force-code-pattern-layer {
            opacity: ${isHovering ? 1 : 0};
            transition: opacity 0.2s ease;
        }
        /* Target the text elements inside the bottom layer */
        .force-code-pattern-layer h1, 
        .force-code-pattern-layer span {
            color: transparent !important;
            background-image: url(${patternUrl}) !important;
            background-repeat: repeat !important;
            background-size: 300px !important;
            background-clip: text !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            
            /* IMPORTANT: We DO NOT remove text-shadow here, so the glitch glow remains! */
            /* We only override the fill color. */
        }
      `}</style>
        </div>
    );
};

export default CodeRevealText;
