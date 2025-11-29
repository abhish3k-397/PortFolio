import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { Github } from 'lucide-react';

const projects = [
    {
        title: "FlashCardsDual",
        subtitle: "Online Multiplayer Game",
        tech: ["Node.js", "WebSockets", "Docker", "HTML/CSS"],
        desc: "Browser-based multiplayer game supporting 6 concurrent players with <150ms latency using socket programming.",
        link: "https://github.com/abhish3k-397"
    },
    {
        title: "Res-Flow",
        subtitle: "Python Task Manager",
        tech: ["PyQt5", "Psutil", "Flask"],
        desc: "Cross-platform resource monitoring tool tracking 15+ system processes in real-time.",
        link: "https://github.com/abhish3k-397"
    },
    {
        title: "CyberMusicAi",
        subtitle: "AI Music Assistant",
        tech: ["HTML", "CSS", "JavaScript", "Spotify API"],
        desc: "AI-powered chatbot for music tutoring and recommendations with Spotify integration.",
        link: "https://github.com/abhish3k-397"
    }
];

const Projects = () => {
    const { theme } = useTheme();
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".project-card", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                },
                y: 100,
                opacity: 0,
                stagger: 0.2,
                duration: 0.8
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="min-h-screen py-20 px-4 relative z-10">
            <h2 className={`text-4xl md:text-6xl font-black mb-16 text-center ${theme === 'cyberpunk' ? 'text-cyber-red' : 'text-white'
                }`}>
                PROJECT_LOGS
            </h2>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <div key={index} className={`project-card group relative p-6 h-full flex flex-col ${theme === 'cyberpunk'
                            ? 'bg-black border border-white/20 hover:border-cyber-yellow transition-colors'
                            : 'bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all'
                        }`}>
                        {theme === 'cyberpunk' && (
                            <div className="absolute top-0 right-0 p-2 text-xs font-mono text-white/30">
                                0{index + 1}
                            </div>
                        )}

                        <h3 className={`text-2xl font-bold mb-2 ${theme === 'cyberpunk' ? 'text-white group-hover:text-cyber-yellow' : 'text-cyan-300'
                            }`}>
                            {project.title}
                        </h3>
                        <p className="text-sm opacity-60 mb-4 font-mono">{project.subtitle}</p>

                        <p className="mb-6 opacity-80 flex-grow">
                            {project.desc}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.tech.map(t => (
                                <span key={t} className="text-xs px-2 py-1 bg-white/5 rounded">
                                    {t}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-4 mt-auto">
                            <a href={project.link} className={`flex items-center gap-2 text-sm font-bold ${theme === 'cyberpunk' ? 'text-cyber-neon hover:text-white' : 'text-white hover:text-cyan-300'
                                }`}>
                                <Github size={16} /> CODE
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projects;
