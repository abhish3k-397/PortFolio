import React from 'react';

const SamuraiContact = () => {
    return (
        <section className="block">
            <picture>
                <source media="(max-width: 600px)" srcSet="/samurai/img/preloader/preloader-1-600.webp" type="image/webp" />
                <source media="(max-width: 1200px)" srcSet="/samurai/img/preloader/preloader-1-1200.webp" type="image/webp" />
                <img className="block__background" alt="" src="/samurai/img/preloader/preloader-1.webp" />
            </picture>
            <div className="block__container">
                <div className="block__content">
                    <h2 className="text-3xl font-bold mb-8 text-white">CONTACT</h2>
                    <div className="text-center">
                        <p className="text-2xl font-light text-white mb-8">
                            Ready to forge something legendary?
                        </p>
                        <a href="mailto:contact@example.com" className="inline-block px-8 py-4 bg-white text-black font-bold tracking-widest hover:bg-cyan-400 transition-colors">
                            SEND MESSAGE
                        </a>
                        <div className="mt-12 flex justify-center gap-8">
                            <a href="https://github.com/abhish3k-397" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">GITHUB</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">LINKEDIN</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">TWITTER</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SamuraiContact;
