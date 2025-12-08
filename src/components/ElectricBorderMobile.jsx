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

            const time = (Date.now() - startTime) / 1000;
            const pulse = (Math.sin(time * 3) + 1) / 2; // 0 to 1

            ctx.clearRect(0, 0, dimensions.width, dimensions.height);

            // Draw glowing border
            ctx.beginPath();
            ctx.strokeStyle = activeColor;
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';

            // Dynamic glow
            ctx.shadowBlur = 10 + (pulse * 15); // Pulse between 10px and 25px
            ctx.shadowColor = activeColor;

            // Draw rounded rect path manually or use strokeRect (strokeRect handles corners poorly with shadow sometimes, but okay for simple)
            // Using a path for better control if needed, but rect is fine for now.
            // Note: canvas rect doesn't support border-radius directly. 
            // We'll just draw a rect. If border-radius is needed, we'd need a rounded rect function.
            // Assuming rectangular for now as most containers are.

            const padding = 2; // Prevent clipping
            ctx.strokeRect(padding, padding, dimensions.width - padding * 2, dimensions.height - padding * 2);
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
