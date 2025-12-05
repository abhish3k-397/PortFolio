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
        let lastDraw = 0;
        const fps = 15; // Limit FPS for mobile performance
        const interval = 1000 / fps;

        const drawLightningLine = (x1, y1, x2, y2, displacement) => {
            if (displacement < 2) {
                ctx.lineTo(x2, y2);
                return;
            }
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const normalX = -(y2 - y1);
            const normalY = x2 - x1;
            const len = Math.sqrt(normalX * normalX + normalY * normalY);

            // Add random jitter
            const jitter = (Math.random() - 0.5) * displacement;
            const dX = (normalX / len) * jitter;
            const dY = (normalY / len) * jitter;

            drawLightningLine(x1, y1, midX + dX, midY + dY, displacement / 2);
            drawLightningLine(midX + dX, midY + dY, x2, y2, displacement / 2);
        };

        const draw = (timestamp) => {
            animationFrameId = requestAnimationFrame(draw);

            if (timestamp - lastDraw < interval) return;
            lastDraw = timestamp;

            ctx.clearRect(0, 0, dimensions.width, dimensions.height);
            ctx.beginPath();
            ctx.strokeStyle = activeColor;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = activeColor;

            // Top
            ctx.moveTo(0, 0);
            drawLightningLine(0, 0, dimensions.width, 0, 20);

            // Right
            drawLightningLine(dimensions.width, 0, dimensions.width, dimensions.height, 20);

            // Bottom
            drawLightningLine(dimensions.width, dimensions.height, 0, dimensions.height, 20);

            // Left
            drawLightningLine(0, dimensions.height, 0, 0, 20);

            ctx.stroke();
        };

        draw(0);

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
