import React from 'react';
import { useTheme } from '../context/ThemeContext';

const GlitchText = ({ children, text, className = "" }) => {
    const { theme } = useTheme();

    if (theme !== 'cyberpunk') {
        return <div className={className}>{children}</div>;
    }

    return (
        <div className={`relative inline-block group ${className}`}>
            {/* 
         The Glitch Container 
         We use data-text for the pseudo-elements to grab the content.
      */}
            <div
                className="glitch-wrapper relative"
                data-text={text}
            >
                {children}
            </div>

            <style>{`
        .glitch-wrapper {
          position: relative;
          display: inline-block;
        }

        /* Glitch Layers (Pseudo-elements) */
        .glitch-wrapper::before,
        .glitch-wrapper::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000; /* Match background to hide main text behind split? No, transparent */
          background: transparent; 
          opacity: 0.8;
        }

        /* Red Layer (Left) */
        .glitch-wrapper::before {
          color: #ff003c;
          z-index: -1;
          animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
          text-shadow: 2px 0 #ff003c;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }

        /* Blue/Cyan Layer (Right) */
        .glitch-wrapper::after {
          color: #00e0ff; // Cyber Blue
          z-index: -2;
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
          text-shadow: -2px 0 #00e0ff;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }

        /* Keyframes for Clip-Path Slicing */
        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
          5% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
          10% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
          15% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
          20% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
          25% { clip-path: inset(30% 0 60% 0); transform: translate(1px, -1px); }
          30% { clip-path: inset(50% 0 30% 0); transform: translate(-2px, 2px); }
          35% { clip-path: inset(10% 0 85% 0); transform: translate(2px, -1px); }
          40% { clip-path: inset(40% 0 40% 0); transform: translate(-1px, 1px); }
          45% { clip-path: inset(70% 0 20% 0); transform: translate(1px, -2px); }
          50% { clip-path: inset(20% 0 60% 0); transform: translate(-2px, 1px); }
          55% { clip-path: inset(50% 0 40% 0); transform: translate(2px, -1px); }
          60% { clip-path: inset(10% 0 80% 0); transform: translate(-1px, 2px); }
          65% { clip-path: inset(80% 0 10% 0); transform: translate(1px, -2px); }
          70% { clip-path: inset(30% 0 50% 0); transform: translate(-2px, 1px); }
          75% { clip-path: inset(60% 0 20% 0); transform: translate(2px, -1px); }
          80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 2px); }
          85% { clip-path: inset(40% 0 50% 0); transform: translate(1px, -2px); }
          90% { clip-path: inset(70% 0 10% 0); transform: translate(-2px, 1px); }
          95% { clip-path: inset(20% 0 60% 0); transform: translate(2px, -1px); }
          100% { clip-path: inset(50% 0 30% 0); transform: translate(-1px, 2px); }
        }

        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
          5% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 1px); }
          10% { clip-path: inset(30% 0 50% 0); transform: translate(2px, -2px); }
          15% { clip-path: inset(60% 0 20% 0); transform: translate(-1px, 1px); }
          20% { clip-path: inset(20% 0 70% 0); transform: translate(1px, -1px); }
          25% { clip-path: inset(50% 0 30% 0); transform: translate(-2px, 2px); }
          30% { clip-path: inset(10% 0 80% 0); transform: translate(2px, -1px); }
          35% { clip-path: inset(70% 0 10% 0); transform: translate(-1px, 1px); }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(1px, -2px); }
          45% { clip-path: inset(80% 0 15% 0); transform: translate(-2px, 1px); }
          50% { clip-path: inset(20% 0 60% 0); transform: translate(2px, -1px); }
          55% { clip-path: inset(60% 0 25% 0); transform: translate(-1px, 2px); }
          60% { clip-path: inset(10% 0 75% 0); transform: translate(1px, -2px); }
          65% { clip-path: inset(50% 0 40% 0); transform: translate(-2px, 1px); }
          70% { clip-path: inset(30% 0 55% 0); transform: translate(2px, -1px); }
          75% { clip-path: inset(70% 0 20% 0); transform: translate(-1px, 2px); }
          80% { clip-path: inset(15% 0 65% 0); transform: translate(1px, -2px); }
          85% { clip-path: inset(45% 0 35% 0); transform: translate(-2px, 1px); }
          90% { clip-path: inset(75% 0 10% 0); transform: translate(2px, -1px); }
          95% { clip-path: inset(25% 0 55% 0); transform: translate(-1px, 2px); }
          100% { clip-path: inset(55% 0 25% 0); transform: translate(1px, -2px); }
        }
      `}</style>
        </div>
    );
};

export default GlitchText;
