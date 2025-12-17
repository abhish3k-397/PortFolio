import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './Samurai.css';

gsap.registerPlugin(ScrollTrigger);

const SamuraiLayout = () => {
    const overlayRef = useRef(null);
    const loaderRef = useRef(null);
    const containerRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const isNavigating = useRef(false);
    const [direction, setDirection] = useState(0);
    const [isEntered, setIsEntered] = useState(false);

    const routes = ['/samurai', '/samurai/projects', '/samurai/experience', '/samurai/about', '/samurai/contact'];

    useEffect(() => {
        const handleWheel = (e) => {
            if (isNavigating.current) return;

            const currentPath = location.pathname;
            const currentIndex = routes.indexOf(currentPath);

            if (currentIndex === -1) return;

            if (e.deltaY > 0) {
                // Scroll Down -> Next Route
                if (currentIndex < routes.length - 1) {
                    isNavigating.current = true;
                    setDirection(1);
                    navigate(routes[currentIndex + 1]);
                    setTimeout(() => isNavigating.current = false, 1500); // Increased debounce for animation
                }
            } else if (e.deltaY < 0) {
                // Scroll Up -> Previous Route
                if (currentIndex > 0) {
                    isNavigating.current = true;
                    setDirection(-1);
                    navigate(routes[currentIndex - 1]);
                    setTimeout(() => isNavigating.current = false, 1500);
                }
            }
        };

        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [location.pathname, navigate]);

    useLayoutEffect(() => {
        let timer;

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
                    delay: 2,
                    onStart: () => setIsEntered(true) // Show Navbar when animation starts
                });
            };

            if (overlayRef.current) {
                overlayRef.current.addEventListener('click', handleOverlayClick);
            }

            // Scroll Animations for Sections (Re-run on route change)
            // We need a slight delay to allow the new page content to render
            timer = setTimeout(() => {
                ctx.add(() => {
                    const sections = document.querySelectorAll(".block");
                    sections.forEach((section) => {
                        ScrollTrigger.create({
                            trigger: section,
                            start: "top top",
                            end: "bottom top",
                            scrub: true,
                            snap: {
                                snapTo: 1,
                                duration: 0.5,
                                delay: 0.1,
                                ease: "power1.inOut"
                            }
                        });
                    });
                    ScrollTrigger.refresh();
                });
            }, 500);

            return () => {
                overlayRef.current?.removeEventListener('click', handleOverlayClick);
            };
        }, containerRef);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach(t => t.kill());
            ctx.revert();
        };
    }, [location.pathname]); // Re-run animations when route changes

    const cubeVariants = {
        initial: (direction) => ({
            rotateX: direction > 0 ? -90 : 90,
            opacity: 0,
            y: direction > 0 ? '100%' : '-100%',
            scale: 0.8
        }),
        animate: {
            rotateX: 0,
            opacity: 1,
            y: '0%',
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] // Custom cubic bezier for smooth feel
            }
        },
        exit: (direction) => ({
            rotateX: direction > 0 ? 90 : -90,
            opacity: 0,
            y: direction > 0 ? '-100%' : '100%',
            scale: 0.8,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    };

    return (
        <div className="wrapper samurai-theme" ref={containerRef}>
            {/* HEADER */}
            <header className="header" style={{ opacity: isEntered ? 1 : 0, pointerEvents: isEntered ? 'all' : 'none' }}>
                <div className="header__container">
                    <Link to="/samurai" className="header__logo">
                        <img src="/samurai/img/logo.svg" alt="logo" />
                    </Link>
                    <div className="header__menu menu">
                        <nav className="menu__body">
                            <ul className="menu__list">
                                <li className="menu__item"><Link to="/samurai" className="menu__link">ホームページ (Home)</Link></li>
                                <li className="menu__item"><Link to="/samurai/projects" className="menu__link">プロジェクト (Projects)</Link></li>
                                <li className="menu__item"><Link to="/samurai/experience" className="menu__link">経験 (Experience)</Link></li>
                                <li className="menu__item"><Link to="/samurai/about" className="menu__link">私について (About)</Link></li>
                                <li className="menu__item"><Link to="/samurai/contact" className="menu__link">連絡先 (Contact)</Link></li>
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

            {/* LOADER */}
            <div className="loader" ref={loaderRef} style={{ zIndex: 1001 }}>
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
                    <img src="/samurai/img/preloader/preloader-6.webp" alt="" />
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

            <main className="page" style={{ perspective: '1500px', overflow: 'hidden', position: 'relative', height: '100vh', width: '100vw' }}>

                {/* DYNAMIC CONTENT WITH 3D TRANSITION */}
                <AnimatePresence mode="popLayout" custom={direction}>
                    <motion.div
                        key={location.pathname}
                        custom={direction}
                        variants={cubeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{
                            width: '100%',
                            height: '100%',
                            transformStyle: 'preserve-3d',
                            position: 'absolute', // Essential for overlap if using popLayout, but good for stability here
                            top: 0,
                            left: 0
                        }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>

            </main>
        </div>
    );
};

export default SamuraiLayout;
