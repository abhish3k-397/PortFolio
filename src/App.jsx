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

// Samurai Pages
import SamuraiLayout from './components/samurai/SamuraiLayout'
import SamuraiHome from './components/samurai/pages/SamuraiHome'
import SamuraiProjects from './components/samurai/pages/SamuraiProjects'
import SamuraiExperience from './components/samurai/pages/SamuraiExperience'
import SamuraiAbout from './components/samurai/pages/SamuraiAbout'
import SamuraiContact from './components/samurai/pages/SamuraiContact'

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

    // If theme is Samurai, we use the Router structure
    if (theme === 'samurai') {
        return (
            <>
                <SmoothScroll />
                {/* Render Samurai Layout immediately so it's visible under the transparent loader */}
                {(hasStarted || isLoading) && (
                    <Routes>
                        <Route path="/samurai" element={<SamuraiLayout />}>
                            <Route index element={<SamuraiHome />} />
                            <Route path="projects" element={<SamuraiProjects />} />
                            <Route path="experience" element={<SamuraiExperience />} />
                            <Route path="about" element={<SamuraiAbout />} />
                            <Route path="contact" element={<SamuraiContact />} />
                        </Route>
                        {/* Redirect root to samurai home if in samurai theme */}
                        <Route path="*" element={<Navigate to="/samurai" replace />} />
                    </Routes>
                )}

                {/* Start Page for Samurai Theme */}
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
