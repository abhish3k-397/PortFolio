import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, Outlet, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import './InkPaper.css';

gsap.registerPlugin(ScrollTrigger);

/* ===== 8B — HANKO SEAL COMPONENT ===== */
const HankoSeal = ({ className = '' }) => (
    <div className={`inkpaper-hanko ${className}`}>
        <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            {/* Outer circle — slightly irregular for organic feel */}
            <circle cx="30" cy="30" r="27" fill="none" stroke="#C62828" strokeWidth="2.5"
                strokeDasharray="2 0.5" opacity="0.85" />
            {/* Inner border ring */}
            <circle cx="30" cy="30" r="22" fill="none" stroke="#C62828" strokeWidth="0.8"
                opacity="0.4" />
            {/* Initials — AK */}
            <text x="30" y="34" textAnchor="middle" fontFamily="'Cormorant Garamond', serif"
                fontSize="16" fontWeight="600" fill="#C62828" letterSpacing="1">
                AK
            </text>
        </svg>
    </div>
);

const InkPaperLayout = () => {
    const containerRef = useRef(null);
    const overlayRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const outlet = useOutlet();
    const isNavigating = useRef(false);
    const lenisRef = useRef(null);
    const [direction, setDirection] = useState(0);
    const [isEntered, setIsEntered] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('inkpaper-dark');
        return saved === 'true';
    });
    const locationRef = useRef(location.pathname);

    // Persist dark mode and handle route jump
    useEffect(() => {
        localStorage.setItem('inkpaper-dark', isDark);
    }, [isDark]);

    useLayoutEffect(() => {
        locationRef.current = location.pathname;
        // Close mobile menu on navigation
        setMobileMenuOpen(false);
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0); // Always snap back to top on exact route change
        }
    }, [location.pathname]);

    const routes = ['/inkpaper', '/inkpaper/projects', '/inkpaper/experience', '/inkpaper/about', '/inkpaper/contact'];

    const navItems = [
        { path: '/inkpaper', label: 'Home', jp: 'ホーム' },
        { path: '/inkpaper/projects', label: 'Works', jp: '作品' },
        { path: '/inkpaper/experience', label: 'Journey', jp: '旅路' },
        { path: '/inkpaper/about', label: 'About', jp: '私について' },
        { path: '/inkpaper/contact', label: 'Contact', jp: '連絡' },
    ];

    // Central Scroll and Lenis Integrator
    useEffect(() => {
        // Initialize Lenis and drive it via GSAP ticker (single RAF loop)
        const lenis = new Lenis({ autoRaf: false, smoothWheel: true });
        lenisRef.current = lenis;
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        let accumulatedDelta = 0;
        let lastTouchY = 0;
        let wheelTimeout;

        // Force Lenis to recalculate limits when React DOM changes height
        const resizeObserver = new ResizeObserver(() => {
            if (lenisRef.current) {
                lenisRef.current.resize();
            }
        });
        
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        const checkNavigation = () => {
            if (Math.abs(accumulatedDelta) > 120) {
                const currentPath = locationRef.current;
                const currentIndex = routes.indexOf(currentPath);
                if (currentIndex === -1) return;

                if (accumulatedDelta > 0 && currentIndex < routes.length - 1) {
                    isNavigating.current = true;
                    setDirection(1);
                    navigate(routes[currentIndex + 1]);
                    setTimeout(() => isNavigating.current = false, 1500);
                } else if (accumulatedDelta < 0 && currentIndex > 0) {
                    isNavigating.current = true;
                    setDirection(-1);
                    navigate(routes[currentIndex - 1]);
                    setTimeout(() => isNavigating.current = false, 1500);
                }
                accumulatedDelta = 0;
            }
        };

        const handleWheel = (e) => {
            if (isNavigating.current) return;

            // Query Lenis directly for perfect bounds regardless of React DOM resizing during transition states
            const lenis = lenisRef.current;
            const limit = lenis ? lenis.limit : (document.documentElement.scrollHeight - window.innerHeight);
            const scroll = lenis ? lenis.scroll : window.scrollY;

            const isAtBottom = scroll >= limit - 40;
            const isAtTop = scroll <= 40;

            if (e.deltaY > 0 && isAtBottom) {
                accumulatedDelta += e.deltaY;
            } else if (e.deltaY < 0 && isAtTop) {
                accumulatedDelta += e.deltaY;
            }

            checkNavigation();

            // Clear delta after 400ms of no scrolling to prevent stale accumulations across sessions
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                accumulatedDelta = 0;
            }, 400);
        };

        let touchStartY = 0;

        const handleTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
            accumulatedDelta = 0; // Reset on new swipe
        };

        const handleTouchMove = (e) => {
            if (isNavigating.current) return;
            const currentY = e.touches[0].clientY;

            // Calculate total swipe distance from the start
            const deltaY = touchStartY - currentY;

            // Query Lenis for bounds
            const lenis = lenisRef.current;
            const limit = lenis ? lenis.limit : (document.documentElement.scrollHeight - window.innerHeight);
            const scroll = lenis ? lenis.scroll : window.scrollY;

            const isAtBottom = scroll >= limit - 40;
            const isAtTop = scroll <= 40;

            // Notice deltaY is positive when swiping UP (scrolling down the page)
            if (deltaY > 0 && isAtBottom) {
                accumulatedDelta = deltaY;
            } else if (deltaY < 0 && isAtTop) {
                accumulatedDelta = deltaY;
            } else {
                accumulatedDelta = 0;
            }

            checkNavigation();
        };

        const handleKeyDown = (e) => {
            if (isNavigating.current) return;
            if (e.altKey || e.ctrlKey || e.metaKey) return;
            const target = e.target;
            if (target instanceof HTMLElement) {
                const tag = target.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) return;
            }

            const isDown = e.key === 'ArrowDown' || e.key === 'PageDown';
            const isUp = e.key === 'ArrowUp' || e.key === 'PageUp';
            if (!isDown && !isUp) return;

            const lenis = lenisRef.current;
            const limit = lenis ? lenis.limit : (document.documentElement.scrollHeight - window.innerHeight);
            const scroll = lenis ? lenis.scroll : window.scrollY;
            const isAtBottom = scroll >= limit - 40;
            const isAtTop = scroll <= 40;

            // Only use keys for route navigation when you're at bounds, otherwise let them scroll normally.
            if ((isDown && isAtBottom) || (isUp && isAtTop)) {
                accumulatedDelta = isDown ? 999 : -999; // exceed threshold to trigger navigation
                checkNavigation();
                // prevent native "bump" scroll at the bounds
                e.preventDefault();
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('keydown', handleKeyDown, { passive: false });

        return () => {
            resizeObserver.disconnect();
            lenis.destroy();
            gsap.ticker.remove(tick);
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [navigate]);

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
            y: dir > 0 ? '100vh' : '-100vh',
            filter: 'brightness(1)'
        }),
        animate: {
            opacity: 1,
            y: '0vh',
            filter: 'brightness(1)',
            transition: {
                duration: 1.0,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        exit: (dir) => ({
            opacity: 0,
            y: dir > 0 ? '-20vh' : '20vh',
            filter: 'brightness(0.5)',
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

                    {/* 8B — Hanko seal on overlay */}
                    <HankoSeal className="inkpaper-hanko--overlay" />
                </div>
            )}

            {/* HEADER / NAV */}
            <header className="inkpaper-header" style={{ opacity: isEntered ? 1 : 0, pointerEvents: isEntered ? 'all' : 'none', transition: 'opacity 0.8s ease' }}>

                <Link to="/inkpaper" className="inkpaper-header__logo">
                    Abhishek Krishna
                </Link>

                {/* Desktop nav */}
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

                {/* 8E — Mobile hamburger button */}
                <button
                    className={`inkpaper-hamburger ${mobileMenuOpen ? 'is-open' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                    <span className="inkpaper-hamburger__line" />
                    <span className="inkpaper-hamburger__line" />
                    <span className="inkpaper-hamburger__line" />
                </button>
            </header>

            {/* 8E — Full-screen mobile nav overlay */}
            <div className={`inkpaper-mobile-nav ${mobileMenuOpen ? 'is-open' : ''}`}>
                <div className="inkpaper-mobile-nav__kanji">和</div>
                <div className="inkpaper-mobile-nav__links">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`inkpaper-mobile-nav__link ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => {
                                const idx = routes.indexOf(item.path);
                                setDirection(idx > currentIndex ? 1 : -1);
                                setMobileMenuOpen(false);
                            }}
                        >
                            {item.label}
                            <span className="inkpaper-mobile-nav__link-jp">{item.jp}</span>
                        </Link>
                    ))}
                </div>
                <div className="inkpaper-mobile-nav__footer">
                    <span className="inkpaper-mobile-nav__footer-label">
                        {isDark ? '光 Light' : '闇 Dark'}
                    </span>
                    <button
                        className="inkpaper-mode-toggle"
                        onClick={() => setIsDark(!isDark)}
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        <div className="inkpaper-mode-toggle__knob" />
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT WITH TRANSITIONS */}
            <main style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={location.pathname}
                        custom={direction}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{
                            width: '100%',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            transformOrigin: 'top center',
                        }}
                    >
                        {isEntered && outlet && React.cloneElement(outlet, { key: location.pathname })}
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
