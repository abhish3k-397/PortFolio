import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { SoundProvider } from './context/SoundContext'
import PortfolioContent from './components/PortfolioContent'
import StartPage from './components/StartPage'
import Loader from './components/Loader'
import { AchievementProvider } from './context/AchievementContext'
import AchievementPopup from './components/AchievementPopup'
import SmoothScroll from './components/SmoothScroll'

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
    const { theme } = useTheme();

    const handleStart = () => {
        setIsLoading(true);
    };

    const handleLoadingComplete = React.useCallback(() => {
        setIsLoading(false);
        setHasStarted(true);
    }, []);

    // If theme is Ink & Paper, we use the Router structure
    if (theme === 'inkpaper') {
        return (
            <>
                {/* Ink & Paper owns its own Lenis instance (avoid double Lenis loops). */}
                {/* Render Ink & Paper Layout immediately so it's visible under the transparent loader */}
                {(hasStarted || isLoading) && (
                    <Routes>
                        <Route path="/inkpaper" element={<InkPaperLayout />}>
                            <Route index element={<InkPaperHome />} />
                            <Route path="projects" element={<InkPaperProjects />} />
                            <Route path="experience" element={<InkPaperExperience />} />
                            <Route path="about" element={<InkPaperAbout />} />
                            <Route path="contact" element={<InkPaperContact />} />
                        </Route>
                        {/* Redirect root to inkpaper home if in inkpaper theme */}
                        <Route path="*" element={<Navigate to="/inkpaper" replace />} />
                    </Routes>
                )}

                {/* Start Page for Ink & Paper Theme */}
                {!hasStarted && !isLoading && (
                    <StartPage onStart={handleStart} />
                )}

                {/* Loader Overlay */}
                {isLoading && (
                    <Loader onComplete={handleLoadingComplete} />
                )}
            </>
        );
    }

    return (
        <>
            <SmoothScroll />
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
        </>
    );
};

function App() {
    return (
        <Router>
            <ThemeProvider>
                <SoundProvider>
                    <AppContent />
                </SoundProvider>
            </ThemeProvider>
        </Router>
    )
}

export default App
