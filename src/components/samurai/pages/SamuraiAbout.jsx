import React from 'react';

const SamuraiAbout = () => {
    return (
        <section className="block">
            <picture>
                <source media="(max-width: 600px)" srcSet="/samurai/img/preloader/preloader-4-600.webp" type="image/webp" />
                <source media="(max-width: 1200px)" srcSet="/samurai/img/preloader/preloader-4-1200.webp" type="image/webp" />
                <img className="block__background" alt="" src="/samurai/img/preloader/preloader-4.webp" />
            </picture>
            <div className="block__container">
                <div className="block__content">
                    <h2 className="text-3xl font-bold mb-8 text-white">ABOUT ME</h2>
                    <div className="bg-black/50 backdrop-blur-md border border-white/10 p-8 rounded-lg">
                        <p className="text-lg text-gray-200 leading-relaxed mb-6">
                            Like a modern Samurai, I serve the code. Discipline, precision, and continuous improvement are my way of the warrior.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            I specialize in building high-performance web applications and securing digital assets. My journey involves deep dives into system architecture, AI integration, and creating immersive user experiences.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SamuraiAbout;
