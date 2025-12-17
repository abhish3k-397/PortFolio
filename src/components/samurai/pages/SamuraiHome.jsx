import React from 'react';

const SamuraiHome = () => {
    return (
        <>
            <section className="block">
                <picture>
                    <source media="(max-width: 600px)" srcSet="/samurai/img/preloader/preloader-1-600.webp" type="image/webp" />
                    <source media="(max-width: 1200px)" srcSet="/samurai/img/preloader/preloader-1-1200.webp" type="image/webp" />
                    <img className="block__background" alt="" src="/samurai/img/preloader/preloader-1.webp" />
                </picture>
                <div className="block__container">
                    <div className="block__content">
                        <h1 className="text-4xl md:text-6xl font-black mb-4 text-white">ABHISHEK KRISHNA</h1>
                        <p className="block__text">
                            I am a Cyber Security Specialist and Full Stack Developer.
                            Architecting robust, scalable systems and securing digital infrastructures.
                        </p>
                        <p className="block__text">
                            Based in India_Server_01.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SamuraiHome;
