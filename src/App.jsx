import React, { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { SoundProvider } from './context/SoundContext'
import PortfolioContent from './components/PortfolioContent'
import StartPage from './components/StartPage'
import Loader from './components/Loader'
import { AchievementProvider } from './context/AchievementContext'
import AchievementPopup from './components/AchievementPopup'
import SmoothScroll from './components/SmoothScroll'

function App() {
    const [hasStarted, setHasStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleStart = () => {
        setIsLoading(true);
    };

    const handleLoadingComplete = React.useCallback(() => {
        setIsLoading(false);
        setHasStarted(true);
    }, []);

    return (
        <ThemeProvider>
            <SoundProvider>
                <AchievementProvider>
                    <SmoothScroll />
                    {!hasStarted && !isLoading && (
                        <StartPage onStart={handleStart} />
                    )}

                    {/* Render PortfolioContent only after loader is complete so animations play correctly */}
                    {hasStarted && (
                        <PortfolioContent />
                    )}

                    {isLoading && (
                        <Loader onComplete={handleLoadingComplete} />
                    )}
                </AchievementProvider>
            </SoundProvider>
        </ThemeProvider>
    )
}

export default App
