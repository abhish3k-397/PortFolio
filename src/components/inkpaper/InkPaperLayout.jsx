import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './InkPaper.css';

gsap.registerPlugin(ScrollTrigger);

const InkPaperLayout = () => {
    const containerRef = useRef(null);
    const overlayRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const isNavigating = useRef(false);
    const [direction, setDirection] = useState(0);
    const [isEntered, setIsEntered] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('inkpaper-dark');
        return saved === 'true';
    });

    // Persist dark mode preference
    useEffect(() => {
        localStorage.setItem('inkpaper-dark', isDark);
    }, [isDark]);

    const routes = ['/inkpaper', '/inkpaper/projects', '/inkpaper/experience', '/inkpaper/about', '/inkpaper/contact'];

    const navItems = [
        { path: '/inkpaper', label: 'Home', jp: 'ホーム' },
        { path: '/inkpaper/projects', label: 'Works', jp: '作品' },
        { path: '/inkpaper/experience', label: 'Journey', jp: '旅路' },
        { path: '/inkpaper/about', label: 'About', jp: '私について' },
        { path: '/inkpaper/contact', label: 'Contact', jp: '連絡' },
    ];

    // Scroll-based route navigation
    useEffect(() => {
        const handleWheel = (e) => {
            if (isNavigating.current) return;

            const currentPath = location.pathname;
            const currentIndex = routes.indexOf(currentPath);
            if (currentIndex === -1) return;

            if (e.deltaY > 0 && currentIndex < routes.length - 1) {
                isNavigating.current = true;
                setDirection(1);
                navigate(routes[currentIndex + 1]);
                setTimeout(() => isNavigating.current = false, 1800);
            } else if (e.deltaY < 0 && currentIndex > 0) {
                isNavigating.current = true;
                setDirection(-1);
                navigate(routes[currentIndex - 1]);
                setTimeout(() => isNavigating.current = false, 1800);
            }
        };

        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [location.pathname, navigate]);

    // Overlay entrance animation (text reveal) on mount
    useLayoutEffect(() => {
        if (isEntered) return; // Already entered, skip

        const overlay = overlayRef.current;
        if (!overlay) return;

        const ctx = gsap.context(() => {
            // Reveal each text line from below
            gsap.from(overlay.querySelectorAll('.inkpaper-overlay__text div'), {
                yPercent: 100,
                duration: 1.5,
                ease: 'power4.inOut',
                stagger: 0.15,
            });

            gsap.to(overlay.querySelectorAll('.inkpaper-overlay__text'), {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                duration: 1.5,
                ease: 'power4.inOut',
                stagger: 0.15,
            });

            // Pulse effect on CTA
            gsap.fromTo(overlay.querySelector('.inkpaper-overlay__cta'),
                { opacity: 0 },
                { opacity: 1, duration: 1.5, delay: 1.2, ease: 'power2.out' }
            );

            // Image reveal
            const img = overlay.querySelector('.inkpaper-overlay__image');
            if (img) {
                gsap.fromTo(img,
                    { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', scale: 1.1 },
                    { clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)', scale: 1, duration: 2, ease: 'power4.out', delay: 0.3 }
                );
            }
        }, overlay);

        // Click handler
        const handleClick = () => {
            const ctx2 = gsap.context(() => {
                // Slide text out
                gsap.to(overlay.querySelectorAll('.inkpaper-overlay__text div'), {
                    yPercent: -120,
                    duration: 1.2,
                    ease: 'power4.inOut',
                    stagger: 0.1,
                });

                gsap.to(overlay.querySelectorAll('.inkpaper-overlay__text'), {
                    clipPath: 'polygon(0 0%, 100% 0%, 100% 0%, 0 0%)',
                    duration: 1.2,
                    ease: 'power4.inOut',
                    stagger: 0.1,
                });

                // Fade CTA
                gsap.to(overlay.querySelector('.inkpaper-overlay__cta'), {
                    opacity: 0,
                    duration: 0.5,
                });

                // Hide image
                const img = overlay.querySelector('.inkpaper-overlay__image');
                if (img) {
                    gsap.to(img, {
                        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
                        y: -50,
                        duration: 1.2,
                        ease: 'power4.inOut'
                    });
                }

                // Wipe overlay away from bottom to top
                gsap.to(overlay, {
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
                    duration: 1.5,
                    ease: 'power4.inOut',
                    delay: 0.5,
                    onComplete: () => {
                        setIsEntered(true);
                    },
                });
            }, overlay);
        };

        overlay.addEventListener('click', handleClick);

        return () => {
            overlay.removeEventListener('click', handleClick);
            ctx.revert();
        };
    }, [isEntered]);

    // Ink-bleed page transition variants
    const pageVariants = {
        initial: (dir) => ({
            opacity: 0,
            y: dir > 0 ? '8%' : '-8%',
            scale: 0.98,
            filter: 'blur(4px)'
        }),
        animate: {
            opacity: 1,
            y: '0%',
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                duration: 1,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        exit: (dir) => ({
            opacity: 0,
            y: dir > 0 ? '-8%' : '8%',
            scale: 0.98,
            filter: 'blur(4px)',
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    };

    // Current route index for the scroll indicator
    const currentIndex = routes.indexOf(location.pathname);

    return (
        <div className={`inkpaper-wrapper ${isDark ? 'inkpaper-dark' : ''}`} ref={containerRef}>

            {/* ===== CLICK-TO-ENTER OVERLAY ===== */}
            {!isEntered && (
                <div className="inkpaper-overlay" ref={overlayRef}>
                    <div className="inkpaper-overlay__content">
                        <div className="inkpaper-overlay__left">
                            <h2 className="inkpaper-overlay__text"><div>Abhishek</div></h2>
                            <h2 className="inkpaper-overlay__text"><div>Krishna</div></h2>
                            <div className="inkpaper-overlay__line" />
                            <h2 className="inkpaper-overlay__text inkpaper-overlay__text--sub">
                                <div>ポートフォリオ</div>
                            </h2>
                        </div>
                        <div className="inkpaper-overlay__image-wrapper">
                            <img src="/profile.webp" alt="Abhishek Krishna" className="inkpaper-overlay__image" />
                        </div>
                        <div className="inkpaper-overlay__right">
                            <p className="inkpaper-overlay__cta">
                                <span className="inkpaper-overlay__cta-jp">入る</span>
                                <span className="inkpaper-overlay__cta-en">click anywhere to enter</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER / NAV */}
            <header className="inkpaper-header" style={{ opacity: isEntered ? 1 : 0, pointerEvents: isEntered ? 'all' : 'none', transition: 'opacity 0.8s ease' }}>

                <Link to="/inkpaper" className="inkpaper-header__logo">
                    Abhishek Krishna
                </Link>
                <nav className="inkpaper-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`inkpaper-nav__link ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => {
                                const idx = routes.indexOf(item.path);
                                setDirection(idx > currentIndex ? 1 : -1);
                            }}
                        >
                            {item.label}
                            <span className="inkpaper-nav__jp">{item.jp}</span>
                        </Link>
                    ))}

                    {/* DARK MODE TOGGLE */}
                    <button
                        className="inkpaper-mode-toggle"
                        onClick={() => setIsDark(!isDark)}
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        title={isDark ? '光 Light' : '闇 Dark'}
                    >
                        <div className="inkpaper-mode-toggle__knob" />
                    </button>
                </nav>
            </header>

            {/* MAIN CONTENT WITH TRANSITIONS */}
            <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'visible' }}>
                <AnimatePresence mode="popLayout" custom={direction}>
                    <motion.div
                        key={location.pathname}
                        custom={direction}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            overflow: 'visible',
                        }}
                    >
                        {isEntered && <Outlet context={{ isEntered }} />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* SCROLL INDICATOR */}
            <div className="inkpaper-scroll-hint">
                <span className="inkpaper-scroll-hint__text">
                    Scroll
                </span>
                <div className="inkpaper-scroll-hint__line" />
            </div>

            {/* PAGE COUNTER */}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                left: '3rem',
                zIndex: 50,
                mixBlendMode: 'difference',
                color: 'white',
                fontFamily: 'var(--ink-serif)',
                fontSize: '0.85rem',
                fontWeight: 300,
                letterSpacing: '0.1em'
            }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 500 }}>
                    {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <span style={{ margin: '0 0.5rem', opacity: 0.3 }}>/</span>
                <span style={{ opacity: 0.4 }}>
                    {String(routes.length).padStart(2, '0')}
                </span>
            </div>
        </div>
    );
};

export default InkPaperLayout;
