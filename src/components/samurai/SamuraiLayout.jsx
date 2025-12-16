import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Samurai.css';

// Import assets (assuming they are in src/assets/samurai)
// Note: In a real scenario, we might want to move these to public for easier referencing if there are many.
// For now, I'll use relative paths assuming Vite handles them or I'll use a placeholder if imports fail.
// A better approach for this "drop-in" might be to move assets to public/samurai.
// Let's assume I'll move them to public in the next step for easier pathing, 
// so I will use /samurai/img/... paths.

gsap.registerPlugin(ScrollTrigger);

const SamuraiLayout = () => {
    const overlayRef = useRef(null);
    const loaderRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial Animation
            gsap.from("h2 div", {
                yPercent: 100,
                duration: 1.5,
                ease: "power4.inOut",
                stagger: {
                    amount: 0.5
                }
            });

            gsap.to("h2", {
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                duration: 1.5,
                ease: "power4.inOut",
                stagger: {
                    amount: 0.5
                }
            });

            // Overlay Click Interaction
            const handleOverlayClick = () => {
                gsap.to("h2 div", {
                    yPercent: -100,
                    duration: 1.5,
                    ease: "power4.inOut",
                    stagger: {
                        amount: 0.5
                    }
                });
                gsap.to("h2", {
                    clipPath: "polygon(0 85%, 100% 85%, 100% 100%, 0% 100%)",
                    duration: 1.5,
                    ease: "power4.inOut",
                    stagger: {
                        amount: 0.5
                    }
                });
                gsap.to(overlayRef.current, {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                    duration: 2,
                    ease: "power4.inOut"
                });
                gsap.to(".loader__img", {
                    clipPath: "polygon(0 100%, 100% 100%, 100% 0%, 0 0%)",
                    duration: 2,
                    ease: "power4.inOut",
                    stagger: {
                        amount: 1.5
                    }
                });
                gsap.to(loaderRef.current, {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                    duration: 2,
                    ease: "power4.inOut",
                    delay: 2
                });
            };

            overlayRef.current.addEventListener('click', handleOverlayClick);

            // Scroll Animations for Sections
            const sections = document.querySelectorAll(".block");
            sections.forEach((section) => {
                ScrollTrigger.create({
                    trigger: section,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                    pin: true,
                    pinSpacing: false,
                    snap: {
                        snapTo: 1,
                        duration: 0.5,
                        delay: 0.1,
                        ease: "power1.inOut"
                    }
                });
            });

            // Refresh ScrollTrigger to ensure positions are correct after render
            ScrollTrigger.refresh();

            return () => {
                overlayRef.current?.removeEventListener('click', handleOverlayClick);
            };
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="wrapper samurai-theme" ref={containerRef}>
            {/* HEADER */}
            <header className="header">
                <div className="header__container">
                    <a href="#" className="header__logo">
                        <img src="/samurai/img/logo.svg" alt="logo" />
                    </a>
                    <div className="header__menu menu">
                        <nav className="menu__body">
                            <ul className="menu__list">
                                <li className="menu__item"><a href="#" className="menu__link">ホームページ (Home)</a></li>
                                <li className="menu__item"><a href="#" className="menu__link">侍の歴史 (History)</a></li>
                                <li className="menu__item"><a href="#" className="menu__link">有名な侍 (Famous)</a></li>
                                <li className="menu__item"><a href="#" className="menu__link">侍の文化 (Culture)</a></li>
                                <li className="menu__item"><a href="#" className="menu__link">ギャラリー (Gallery)</a></li>
                            </ul>
                        </nav>
                        <div className="header__actions action-header">
                            <a href="#" className="action-header__notification">
                                <img src="/samurai/img/notification.svg" alt="notification button" />
                            </a>
                            <button type="button" className="action-header__icon icon-menu">
                                <span></span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="page">
                {/* LOADER */}
                <div className="loader" ref={loaderRef}>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                        <div key={num} className="loader__img">
                            <picture>
                                <source media="(max-width: 600px)" srcSet={`/samurai/img/preloader/preloader-${num}-600.webp`} type="image/webp" />
                                <source media="(max-width: 1200px)" srcSet={`/samurai/img/preloader/preloader-${num}-1200.webp`} type="image/webp" />
                                <img alt="" src={`/samurai/img/preloader/preloader-${num}.webp`} />
                            </picture>
                        </div>
                    ))}
                    <div className="loader__img reveal">
                        <img src="/samurai/img/preloader/preloader-7.png" alt="" />
                    </div>
                </div>

                {/* OVERLAY */}
                <div className="overlay" ref={overlayRef}>
                    <div className="overlay__column">
                        <h2 className="overlay__text"><div>ABHISHEK</div></h2>
                        <h2 className="overlay__text"><div>CYBER SECURITY</div></h2>
                        <h2 className="overlay__text"><div>SPECIALIST</div></h2>
                    </div>
                    <div className="overlay__column overlay__column--cta">
                        <h2 className="overlay__text">
                            <div><span>click</span> anywhere to enter</div>
                        </h2>
                    </div>
                </div>

                {/* SECTION 1 */}
                <section className="block">
                    <picture>
                        <source media="(max-width: 600px)" srcSet="/samurai/img/preloader/preloader-1-600.webp" type="image/webp" />
                        <source media="(max-width: 1200px)" srcSet="/samurai/img/preloader/preloader-1-1200.webp" type="image/webp" />
                        <img className="block__background" alt="" src="/samurai/img/preloader/preloader-1.webp" />
                    </picture>
                    <div className="block__container">
                        <div className="block__content">
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

                {/* SECTION 2 */}
                <section className="block">
                    <picture>
                        <source media="(max-width: 600px)" srcSet="/samurai/img/preloader/preloader-2-600.webp" type="image/webp" />
                        <source media="(max-width: 1200px)" srcSet="/samurai/img/preloader/preloader-2-1200.webp" type="image/webp" />
                        <img className="block__background" alt="" src="/samurai/img/preloader/preloader-2.webp" />
                    </picture>
                    <div className="block__container">
                        <div className="block__content block__content--center">
                            <p className="block__text">
                                Like a modern Samurai, I serve the code.
                                Discipline, precision, and continuous improvement are my way of the warrior.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION 3 */}
                <section className="block">
                    <picture>
                        <source media="(max-width: 600px)" srcSet="/samurai/img/preloader/preloader-3-600.webp" type="image/webp" />
                        <source media="(max-width: 1200px)" srcSet="/samurai/img/preloader/preloader-3-1200.webp" type="image/webp" />
                        <img className="block__background" alt="" src="/samurai/img/preloader/preloader-3.webp" />
                    </picture>
                    <div className="block__container">
                        <div className="block__content">
                            <p className="block__text">
                                <strong>FlashCardsDual:</strong> Multiplayer gaming with &lt; 150ms latency.
                                <br /><br />
                                <strong>Res-Flow:</strong> Real-time system resource monitoring.
                            </p>
                            <p className="block__text">
                                <strong>CyberMusicAi:</strong> AI-powered music tutoring.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION 4 */}
                <section className="block">
                    <picture>
                        <source media="(max-width: 600px)" srcSet="/samurai/img/preloader/preloader-4-600.webp" type="image/webp" />
                        <source media="(max-width: 1200px)" srcSet="/samurai/img/preloader/preloader-4-1200.webp" type="image/webp" />
                        <img className="block__background" alt="" src="/samurai/img/preloader/preloader-4.webp" />
                    </picture>
                    <div className="block__container">
                        <div className="block__content">
                            <p className="block__text">
                                Ready to forge something legendary?
                                <br />
                                Let's connect.
                            </p>
                            <p className="block__text">
                                contact@example.com
                            </p>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default SamuraiLayout;
