import React from 'react';

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
];

const SamuraiProjects = () => {
    return (
        <section className="block">
            <picture>
                <source media="(max-width: 600px)" srcSet="/samurai/img/preloader/preloader-3-600.webp" type="image/webp" />
                <source media="(max-width: 1200px)" srcSet="/samurai/img/preloader/preloader-3-1200.webp" type="image/webp" />
                <img className="block__background" alt="" src="/samurai/img/preloader/preloader-3.webp" />
            </picture>
            <div className="block__container">
                <div className="block__content">
                    <h2 className="text-3xl font-bold mb-8 text-white">PROJECTS</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-black/50 backdrop-blur-md border border-white/10 p-6 rounded-lg hover:border-white/30 transition-all cursor-pointer" onClick={() => window.open(project.url, '_blank')}>
                                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                <p className="text-sm text-gray-300 mb-4">{project.desc}</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tech.map((t, i) => (
                                        <span key={i} className="text-xs font-mono text-cyan-400 border border-cyan-400/30 px-2 py-1 rounded">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SamuraiProjects;
