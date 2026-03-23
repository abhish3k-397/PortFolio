import React, { createContext, useContext, useState, useEffect } from 'react';

const PerformanceContext = createContext();

export const PerformanceProvider = ({ children }) => {
    const [liteMode, setLiteMode] = useState(() => {
        const saved = localStorage.getItem('portfolio-lite-mode');
        if (saved === null) return true; // Default to the optimized SVG CSS border
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('portfolio-lite-mode', liteMode);
    }, [liteMode]);

    const toggleLiteMode = () => setLiteMode(prev => !prev);

    return (
        <PerformanceContext.Provider value={{ liteMode, toggleLiteMode }}>
            {children}
        </PerformanceContext.Provider>
    );
};

export const usePerformance = () => {
    const context = useContext(PerformanceContext);
    if (!context) {
        throw new Error('usePerformance must be used within a PerformanceProvider');
    }
    return context;
};
