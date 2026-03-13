import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const projects = [
    {
        id: 1,
        title: "FlashCardsDual",
        category: "Multiplayer Game",
        url: "https://uno.dev.p1ng.me",
        img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        desc: "Browser-based multiplayer game supporting 6 concurrent players with <150ms latency using socket programming.",
        tech: ["Node.js", "WebSockets", "Docker"]
    },
    {
        id: 2,
        title: "Res-Flow",
        category: "System Tool",
        url: "https://github.com/abhish3k-397/ResFlow.git",
        img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2670&auto=format&fit=crop",
        desc: "Cross-platform resource monitoring tool tracking 15+ system processes in real-time.",
        tech: ["Python", "PyQt5", "Psutil"]
    },
    {
        id: 3,
        title: "CyberMusicAi",
        category: "AI Assistant",
        url: "https://github.com/abhish3k-397/CyberMusicAI.git",
        img: "https://images.unsplash.com/photo-1558494949-efdeb6bf80a1?q=80&w=2669&auto=format&fit=crop",
        desc: "AI-powered chatbot for music tutoring and recommendations with Spotify integration.",
        tech: ["JS", "Spotify API", "AI"]
    },
    {
        id: 4,
        title: "Portfolio",
        category: "Interactive Web",
        url: "https://github.com/abhish3k-397/PortFolio.git",
        img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
        desc: "Futuristic, cyberpunk-themed portfolio website featuring interactive animations and 3D elements.",
        tech: ["React", "GSAP", "Tailwind"]
    },
    {
        id: 5,
        title: "Ascii_ART-GEN",
        category: "Generative Tool",
        url: "https://github.com/abhish3k-397/Ascii_ART-GEN.git",
        img: "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=2670&auto=format&fit=crop",
        desc: "Pure Python BMP-to-ASCII converter built from scratch. Translates raw image bytes into dynamic terminal art without external libraries.",
        tech: ["Python", "Algorithms", "CLI"]
    },
];

const InkPaperProjects = () => {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
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

            {/* Kanji watermark */}
            <div className="inkpaper-watermark inkpaper-watermark--right">作</div>

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

            <div className="inkpaper-section__inner inkpaper-projects-inner">

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
                            {/* Ink-bleed image reveal */}
                            <div className="inkpaper-project__image-wrap">
                                <img
                                    src={project.img}
                                    alt=""
                                    className="inkpaper-project__image"
                                    loading="lazy"
                                />
                            </div>

                            <div className="inkpaper-project__number">
                                {String(index + 1).padStart(2, '0')}
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                    <div className="inkpaper-project__title">{project.title}</div>
                                    <span className="inkpaper-tag">{project.category}</span>
                                </div>
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
