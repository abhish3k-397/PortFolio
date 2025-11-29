import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('portfolio-theme') || 'cyberpunk';
    });

    useEffect(() => {
        const root = document.documentElement;
        // Remove all theme classes
        root.classList.remove('cyberpunk', 'futuristic', 'creative');
        // Add current theme
        root.classList.add(theme);
        // Also set data-theme for attribute selectors if needed
        root.setAttribute('data-theme', theme);

        localStorage.setItem('portfolio-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
