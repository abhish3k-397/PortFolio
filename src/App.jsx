import React, { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { SoundProvider } from './context/SoundContext'
import PortfolioContent from './components/PortfolioContent'
import StartPage from './components/StartPage'
import Loader from './components/Loader'
import { AchievementProvider } from './context/AchievementContext'
import AchievementPopup from './components/AchievementPopup'

import Lenis from '@studio-freight/lenis'

function App() {
    const [hasStarted, setHasStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const lenis = new Lenis()

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
    }, [])

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
