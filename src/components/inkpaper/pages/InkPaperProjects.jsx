import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const projects = [
    {
        id: 1,
        title: "FlashCardsDual",
        category: "Multiplayer Game",
        url: "https://uno.dev.p1ng.me",
        desc: "Browser-based multiplayer game supporting 6 concurrent players with <150ms latency using socket programming.",
        tech: ["Node.js", "WebSockets", "Docker"]
    },
    {
        id: 2,
        title: "Res-Flow",
        category: "System Tool",
        url: "https://github.com/abhish3k-397/ResFlow.git",
        desc: "Cross-platform resource monitoring tool tracking 15+ system processes in real-time.",
        tech: ["Python", "PyQt5", "Psutil"]
    },
    {
        id: 3,
        title: "CyberMusicAi",
        category: "AI Assistant",
        url: "https://github.com/abhish3k-397/CyberMusicAI.git",
        desc: "AI-powered chatbot for music tutoring and recommendations with Spotify integration.",
        tech: ["JS", "Spotify API", "AI"]
    },
    {
        id: 4,
        title: "Portfolio",
        category: "Interactive Web",
        url: "https://github.com/abhish3k-397/PortFolio.git",
        desc: "Futuristic, cyberpunk-themed portfolio website featuring interactive animations and 3D elements.",
        tech: ["React", "GSAP", "Tailwind"]
    },
];

const InkPaperProjects = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(el.querySelectorAll('.ink-project-header'),
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
            );

            gsap.fromTo(el.querySelectorAll('.inkpaper-project'),
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.5 }
            );
        }, el);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="inkpaper-section" style={{ alignItems: 'flex-start' }}>

            {/* Subtle decorative element */}
            <svg
                className="ink-stroke"
                width="400"
                height="600"
                viewBox="0 0 400 600"
                style={{ position: 'absolute', left: '-8%', bottom: '0', opacity: 0.03, width: '30%', zIndex: 0 }}
            >
                <path
                    d="M350,50 C300,150 380,250 200,300 S50,350 100,500 C150,600 50,550 150,580"
                    strokeDasharray="2000"
                    strokeDashoffset="0"
                />
            </svg>

            <div className="inkpaper-section__inner" style={{ paddingTop: '8rem' }}>

                {/* Section Label */}
                <div className="ink-project-header">
                    <span className="inkpaper-jp inkpaper-jp--label" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{ width: '30px', height: '1px', background: 'var(--ink-stone-light)' }} />
                        作品 — Selected Works
                    </span>
                    <h2 className="inkpaper-heading inkpaper-heading--section">
                        Projects<span className="ink-vermillion-dot" />
                    </h2>
                </div>

                {/* Project List */}
                <div>
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className="inkpaper-project"
                            onClick={() => window.open(project.url, '_blank')}
                        >
                            <div className="inkpaper-project__number">
                                {String(index + 1).padStart(2, '0')}
                            </div>
                            <div>
                                <div className="inkpaper-project__title">{project.title}</div>
                                <div className="inkpaper-project__desc">{project.desc}</div>
                                <div className="inkpaper-project__tech">
                                    {project.tech.map((t, i) => (
                                        <span key={i} className="inkpaper-project__tag">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InkPaperProjects;
