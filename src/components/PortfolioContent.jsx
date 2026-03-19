import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Layout from './Layout';
import InkPaperLayout from './inkpaper/InkPaperLayout';

// Import all standard components
import Hero from './Hero';
import Bio from './Bio';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';
import Achievements from './Achievements';
import Contact from './Contact';
import AchievementPopup from './AchievementPopup';

const PortfolioContent = () => {
    const { theme } = useTheme();

    // If theme is 'inkpaper', render the Ink & Paper Layout
    if (theme === 'inkpaper') {
        return <InkPaperLayout />;
    }

    // Otherwise render the standard layout (Cyberpunk)
    return (
        <Layout>
            <AchievementPopup />
            <Hero />
            <Bio />
            <About />
            <Experience />
            <Projects />
            <Achievements />
            <Contact />
        </Layout>
    );
};

export default PortfolioContent;
