import React from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { SoundProvider } from './context/SoundContext'
import Layout from './components/Layout'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'

function App() {
    return (
        <ThemeProvider>
            <SoundProvider>
                <Layout>
                    <Hero />
                    <About />
                    <Projects />
                </Layout>
            </SoundProvider>
        </ThemeProvider>
    )
}

export default App
