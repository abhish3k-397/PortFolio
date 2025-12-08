import React, { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { SoundProvider } from './context/SoundContext'
import Layout from './components/Layout'
import Hero from './components/Hero'
import Bio from './components/Bio'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import StartPage from './components/StartPage'
import Loader from './components/Loader'

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
                        <Bio />
                        <About />
                        <Experience />
                        <Projects />
                        <Contact />
                    </Layout>
                )}
            </SoundProvider>
        </ThemeProvider>
    )
}

export default App
