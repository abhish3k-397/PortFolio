import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { SoundProvider } from './context/SoundContext'
import PortfolioContent from './components/PortfolioContent'
import StartPage from './components/StartPage'
import Loader from './components/Loader'
import { AchievementProvider } from './context/AchievementContext'
import { PerformanceProvider } from './context/PerformanceContext'
import AchievementPopup from './components/AchievementPopup'
import SmoothScroll from './components/SmoothScroll'
import BreachProtocol from './components/BreachProtocol'

// Ink & Paper Pages
import InkPaperLayout from './components/inkpaper/InkPaperLayout'
import InkPaperHome from './components/inkpaper/pages/InkPaperHome'
import InkPaperProjects from './components/inkpaper/pages/InkPaperProjects'
import InkPaperExperience from './components/inkpaper/pages/InkPaperExperience'
import InkPaperAbout from './components/inkpaper/pages/InkPaperAbout'
import InkPaperContact from './components/inkpaper/pages/InkPaperContact'

const AppContent = () => {
    const [hasStarted, setHasStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isBreachActive, setIsBreachActive] = useState(false);
    const [breachDifficulty, setBreachDifficulty] = useState('medium');
    const { theme } = useTheme();

    const handleStart = () => {
        setIsLoading(true);
    };

    const handleLoadingComplete = React.useCallback(() => {
        setIsLoading(false);
        setHasStarted(true);
    }, []);

    const handleStartBreach = (difficulty) => {
        setBreachDifficulty(difficulty);
        setIsBreachActive(true);
    };

    const handleEndBreach = () => {
        setIsBreachActive(false);
    };

    return (
        <>
            {/* Always render StartPage in the same stable position before loading */}
            {!hasStarted && !isLoading && (
                <StartPage onStart={handleStart} />
            )}

            {(hasStarted || isLoading) && theme === 'inkpaper' ? (
                <>
                    <Routes>
                        <Route path="/inkpaper" element={<InkPaperLayout />}>
                            <Route index element={<InkPaperHome />} />
                            <Route path="projects" element={<InkPaperProjects />} />
                            <Route path="experience" element={<InkPaperExperience />} />
                            <Route path="about" element={<InkPaperAbout />} />
                            <Route path="contact" element={<InkPaperContact />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/inkpaper" replace />} />
                    </Routes>
                    {isLoading && <Loader onComplete={handleLoadingComplete} />}
                </>
            ) : (hasStarted || isLoading) && theme !== 'inkpaper' ? (
                <>
                    <SmoothScroll />
                    {hasStarted && !isBreachActive && (
                        <PortfolioContent />
                    )}

                    {isBreachActive && (
                        <BreachProtocol 
                            onComplete={handleEndBreach} 
                            onExit={handleEndBreach} 
                            difficulty={breachDifficulty} 
                        />
                    )}

                    {isLoading && <Loader onComplete={handleLoadingComplete} />}
                </>
            ) : null}
        </>
    );
};

function App() {
    return (
        <Router>
            <PerformanceProvider>
                <ThemeProvider>
                    <SoundProvider>
                        <AchievementProvider>
                            <AppContent />
                        </AchievementProvider>
                    </SoundProvider>
                </ThemeProvider>
            </PerformanceProvider>
        </Router>
    )
}

export default App
