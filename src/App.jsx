import React from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'

function App() {
    return (
        <ThemeProvider>
            <Layout>
                <Hero />
                <About />
                <Projects />
            </Layout>
        </ThemeProvider>
    )
}

export default App
