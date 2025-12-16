import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        // Allow creative mode if saved (persistence for the easter egg)
        // Force samurai theme for now to ensure user sees the new design
        return 'samurai';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        // Update body class for global styles if needed
        document.body.className = theme;
    }, [theme]);

    const value = {
        theme,
        setTheme,
        isCyberpunk: theme === 'cyberpunk',
        isFuturistic: theme === 'futuristic',
        isCreative: theme === 'creative',
        isSamurai: theme === 'samurai'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
