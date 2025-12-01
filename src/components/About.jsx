import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const skills = {
    Languages: ['C++ (DSA)', 'Python', 'C', 'Java (OOP)', 'JavaScript'],
    Technologies: ['Linux (Arch)', 'Node.js', 'Socket Programming', 'React', 'Tailwind'],
    Tools: ['Docker', 'Git', 'ngrok', 'RESTful API', 'Postman'],
    "Soft Skills": ['Problem-Solving', 'Team Collaboration', 'Analytical Thinking']
};

const About = () => {
    const { theme } = useTheme();
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".skill-category", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%", // Trigger slightly earlier
                },
                y: 50,
                // opacity: 0, // Removed to prevent disappearance bug
                stagger: 0.2,
                duration: 1,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="min-h-screen py-20 px-4 flex flex-col items-center justify-center relative z-10">
            <h2 className={`text-4xl md:text-6xl font-black mb-16 ${theme === 'cyberpunk' ? 'text-cyber-red' : 'text-white'
                }`}>
                SKILLSET_DATABASE
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
                {Object.entries(skills).map(([category, items]) => (
                    <div key={category} className={`skill-category group p-6 border transition-colors ${theme === 'cyberpunk'
                        ? 'bg-black border-white/20 hover:border-cyber-yellow'
                        : 'border-white/10 bg-white/5 backdrop-blur-lg rounded-xl hover:bg-white/10'
                        }`}>
                        <h3 className={`text-2xl font-bold mb-6 ${theme === 'cyberpunk' ? 'text-white group-hover:text-cyber-yellow' : 'text-cyan-300'
                            }`}>
                            {theme === 'cyberpunk' ? `> ${category.toUpperCase()}` : category}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {items.map((skill) => (
                                <span key={skill} className={`px-4 py-2 font-medium transition-colors cursor-default ${theme === 'cyberpunk'
                                    ? 'bg-white/5 text-gray-300 hover:text-white'
                                    : 'bg-white/10 rounded-full text-white hover:bg-white/20'
                                    }`}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default About;
