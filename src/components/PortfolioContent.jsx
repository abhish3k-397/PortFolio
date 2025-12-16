import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Layout from './Layout';
import FutureLayout from './future/FutureLayout';
import SamuraiLayout from './samurai/SamuraiLayout';

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

    // If theme is 'samurai', render the Samurai Layout
    if (theme === 'samurai') {
        return <SamuraiLayout />;
    }

    // If theme is 'futuristic', render the new Future Layout
    if (theme === 'futuristic') {
        return <FutureLayout />;
    }

    // Otherwise render the standard layout (Cyberpunk / Creative)
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
