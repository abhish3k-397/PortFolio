import React, { useRef, useEffect, useState } from 'react';

const ElectricBorderMobile = ({ children, color = '#5227FF', className, innerClassName, style }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Map named colors to hex
    const colorMap = {
        cyan: '#06b6d4',
        yellow: '#fcee0a',
        red: '#ff003c',
        purple: '#d946ef',
        white: '#ffffff'
    };
    const activeColor = colorMap[color] || color;

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || dimensions.width === 0) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let startTime = Date.now();

        const draw = () => {
            animationFrameId = requestAnimationFrame(draw);

            ctx.clearRect(0, 0, dimensions.width, dimensions.height);

            // Flicker logic: mostly bright (0.8-1.0), with occasional sharp drops (0.2-0.5)
            // Simulates a faulty neon connection
            const isGlitch = Math.random() > 0.92;
            const flicker = isGlitch ? (Math.random() * 0.5) : (0.8 + Math.random() * 0.2);

            // Draw glowing border
            ctx.beginPath();
            ctx.strokeStyle = activeColor;
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';

            // Apply flicker to glow and opacity
            ctx.shadowBlur = 10 + (flicker * 10); // Fluctuates between 10 and 20 (drops on glitch)
            ctx.shadowColor = activeColor;
            ctx.globalAlpha = flicker; // The entire line flickers opacity

            const padding = 2;
            ctx.strokeRect(padding, padding, dimensions.width - padding * 2, dimensions.height - padding * 2);

            // Reset alpha for next frame (though we clear rect anyway)
            ctx.globalAlpha = 1;
        };

        draw();

        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions, activeColor]);

    return (
        <div ref={containerRef} className={`relative ${className || ''}`} style={style}>
            <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                className="absolute inset-0 pointer-events-none z-10"
                style={{ borderRadius: style?.borderRadius }}
            />
            <div className={`relative ${innerClassName || ''}`} style={{ borderRadius: style?.borderRadius }}>
                {children}
            </div>
        </div>
    );
};

export default ElectricBorderMobile;
