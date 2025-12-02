import React from 'react';
import backgroundVideo from '../assets/background.mp4';
import MagneticButton from './MagneticButton';
import { useSoundFX } from '../context/SoundContext';

const StartPage = ({ onStart }) => {
    const { playClick, playHover } = useSoundFX();

    const handleStart = () => {
        playClick();
        onStart();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute w-full h-full object-cover opacity-50"
            >
                <source src={backgroundVideo} type="video/mp4" />
            </video>

            <div className="absolute bottom-24 z-10">
                <MagneticButton strength={0.5}>
                    <button
                        onClick={handleStart}
                        onMouseEnter={playHover}
                        className="px-8 py-3 text-lg md:px-12 md:py-4 md:text-2xl font-bold tracking-[0.2em] text-white border border-white/30 bg-black/30 backdrop-blur-md hover:bg-white hover:text-black transition-all duration-500 rounded-sm"
                    >
                        ENTER SYSTEM
                    </button>
                </MagneticButton>
            </div>
        </div>
    );
};

export default StartPage;
