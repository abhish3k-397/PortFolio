import React, { useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const DotGrid = () => {
    const canvasRef = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let dots = [];

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initDots();
        };

        const mouse = { x: undefined, y: undefined };

        const handleMouseMove = (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        };

        const handleMouseLeave = () => {
            mouse.x = undefined;
            mouse.y = undefined;
        };

        class Dot {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.baseSize = 2;
                this.size = this.baseSize;
                this.color = theme === 'cyberpunk' ? '#333' : '#ddd'; // Default color
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                // Interaction logic
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 100;

                if (distance < maxDistance) {
                    const scale = (maxDistance - distance) / maxDistance;
                    this.size = this.baseSize + scale * 3; // Grow

                    if (theme === 'cyberpunk') {
                        this.color = '#00f3ff'; // Cyber Neon
                    } else if (theme === 'futuristic') {
                        this.color = '#ffffff';
                    } else {
                        this.color = '#000000';
                    }
                } else {
                    this.size = this.baseSize;
                    this.color = theme === 'cyberpunk' ? 'rgba(50, 50, 50, 0.5)' : 'rgba(200, 200, 200, 0.3)';
                }

                this.draw();
            }
        }

        const initDots = () => {
            dots = [];
            const gap = 25;
            for (let x = 0; x < canvas.width; x += gap) {
                for (let y = 0; y < canvas.height; y += gap) {
                    dots.push(new Dot(x, y));
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dots.forEach(dot => dot.update());
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        handleResize();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
            style={{ opacity: 0.4 }}
        />
    );
};

export default DotGrid;
