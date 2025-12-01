import React, { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { SoundProvider } from './context/SoundContext'
import Layout from './components/Layout'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import StartPage from './components/StartPage'
import Loader from './components/Loader'

function App() {
    const [hasStarted, setHasStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleStart = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setHasStarted(true);
        }, 3000);
    };

    return (
        <ThemeProvider>
            <SoundProvider>
                {!hasStarted && !isLoading && (
                    <StartPage onStart={handleStart} />
                )}

                {isLoading && (
                    <Loader />
                )}

                {hasStarted && (
                    <Layout>
                        <Hero />
                        <About />
                        <Projects />
                    </Layout>
                )}
            </SoundProvider>
        </ThemeProvider>
    )
}

export default App
