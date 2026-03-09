import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SakuraBranch from '../SakuraBranch';

const BRANCH_DURATION = 3;
const BRANCH_START = 0.3;

const InkPaperHome = () => {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {

            // ---- Text reveals ----
            gsap.fromTo(el.querySelectorAll('.ink-home-reveal'),
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.15, delay: 0.1 }
            );

            // ---- SVG container entrance ----
            gsap.fromTo(el.querySelector('.sakura-svg'),
                { opacity: 0, x: 60 },
                { opacity: 1, x: 0, duration: 1.5, ease: 'power3.out', delay: BRANCH_START - 0.2 }
            );

            // ---- Main branch stroke-draw ----
            const mainPath = el.querySelector('.sakura-branch-main');
            if (mainPath) {
                const len = mainPath.getTotalLength();
                gsap.fromTo(mainPath,
                    { strokeDasharray: len, strokeDashoffset: len },
                    { strokeDashoffset: 0, duration: BRANCH_DURATION, ease: 'power2.inOut', delay: BRANCH_START }
                );
            }

            // ---- Sub-branch A (forks at ~22%) ----
            const sub1 = el.querySelector('.sakura-branch-sub1');
            if (sub1) {
                const len = sub1.getTotalLength();
                gsap.fromTo(sub1,
                    { strokeDasharray: len, strokeDashoffset: len },
                    { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', delay: BRANCH_START + 0.22 * BRANCH_DURATION }
                );
            }

            // ---- Sub-branch B (forks at ~40%) ----
            const sub2 = el.querySelector('.sakura-branch-sub2');
            if (sub2) {
                const len = sub2.getTotalLength();
                gsap.fromTo(sub2,
                    { strokeDasharray: len, strokeDashoffset: len },
                    { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', delay: BRANCH_START + 0.40 * BRANCH_DURATION }
                );
            }

            // ---- Sub-branch C (forks at ~58%) ----
            const sub3 = el.querySelector('.sakura-branch-sub3');
            if (sub3) {
                const len = sub3.getTotalLength();
                gsap.fromTo(sub3,
                    { strokeDasharray: len, strokeDashoffset: len },
                    { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', delay: BRANCH_START + 0.58 * BRANCH_DURATION }
                );
            }

            // ---- Sub-branch D (forks at ~72%) ----
            const sub4 = el.querySelector('.sakura-branch-sub4');
            if (sub4) {
                const len = sub4.getTotalLength();
                gsap.fromTo(sub4,
                    { strokeDasharray: len, strokeDashoffset: len },
                    { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', delay: BRANCH_START + 0.72 * BRANCH_DURATION }
                );
            }

            // ---- Sub-branch E (short spur from sub-A) ----
            const sub5 = el.querySelector('.sakura-branch-sub5');
            if (sub5) {
                const len = sub5.getTotalLength();
                gsap.fromTo(sub5,
                    { strokeDasharray: len, strokeDashoffset: len },
                    { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', delay: BRANCH_START + 0.35 * BRANCH_DURATION }
                );
            }

            // ---- Twigs ----
            el.querySelectorAll('.sakura-twig').forEach((twig, i) => {
                const len = twig.getTotalLength();
                gsap.fromTo(twig,
                    { strokeDasharray: len, strokeDashoffset: len },
                    { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out', delay: BRANCH_START + 0.15 * BRANCH_DURATION + i * 0.1 }
                );
            });

            // ---- Bark texture ----
            el.querySelectorAll('.sakura-bark').forEach((bark) => {
                gsap.fromTo(bark,
                    { opacity: 0 },
                    { opacity: 1, duration: 1.2, ease: 'power2.out', delay: BRANCH_START + 0.15 }
                );
            });

            // ---- Blossoms bloom as branch reaches them ----
            el.querySelectorAll('.sakura-blossom').forEach((blossom) => {
                const bloomDelay = parseFloat(blossom.getAttribute('data-bloom-delay') || 0);
                const absoluteDelay = BRANCH_START + bloomDelay * BRANCH_DURATION;

                gsap.fromTo(blossom,
                    { scale: 0, opacity: 0, transformOrigin: 'center center' },
                    {
                        scale: 1,
                        opacity: parseFloat(blossom.getAttribute('opacity')) || 1,
                        duration: 0.5,
                        ease: 'back.out(2.5)',
                        delay: absoluteDelay,
                    }
                );
            });

            // ---- Falling SVG petals — appear after branch finishes ----
            el.querySelectorAll('.sakura-falling-petal').forEach((petal) => {
                gsap.fromTo(petal,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.5, delay: BRANCH_START + BRANCH_DURATION + 0.5 }
                );
            });

            // ---- Pink moon ----
            gsap.fromTo(el.querySelector('.sakura-moon'),
                { opacity: 0, scale: 0.5 },
                { opacity: 1, scale: 1, duration: 2.5, ease: 'power3.out', delay: 0.5 }
            );

            // ---- Original ink stroke ----
            const strokePath = el.querySelector('.ink-home-stroke path');
            if (strokePath) {
                gsap.fromTo(strokePath,
                    { strokeDashoffset: 2000 },
                    { strokeDashoffset: 0, duration: 3, ease: 'power2.out', delay: 0.5 }
                );
            }
        }, el);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="inkpaper-section" style={{ overflow: 'hidden' }}>

            {/* ========== SVG SAKURA BRANCH ========== */}
            <SakuraBranch />

            {/* ========== PINK MOON CIRCLE ========== */}
            <div className="sakura-moon" />

            {/* ========== ORIGINAL INK BRUSH STROKE ========== */}
            <svg
                className="ink-stroke ink-home-stroke"
                width="600" height="800" viewBox="0 0 600 800"
                style={{ position: 'absolute', right: '-5%', top: '5%', opacity: 0.04, width: '45%', zIndex: 0 }}
            >
                <path
                    d="M100,50 C150,100 80,200 200,250 S350,200 300,350 C250,500 400,450 350,600 S200,700 300,750"
                    strokeDasharray="2000" strokeDashoffset="0"
                />
            </svg>

            {/* ========== TEXT CONTENT ========== */}
            <div className="inkpaper-section__inner" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', position: 'relative', zIndex: 3 }}>

                <div className="ink-home-reveal" style={{ marginBottom: '2rem' }}>
                    <div className="inkpaper-availability">
                        <span className="inkpaper-availability__dot" />
                        募集中 — Available for Work
                    </div>
                </div>

                <div className="ink-home-reveal" style={{ marginBottom: '1.5rem' }}>
                    <span className="inkpaper-jp inkpaper-jp--label" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ width: '30px', height: '1px', background: 'var(--ink-stone-light)' }} />
                        ポートフォリオ — Portfolio
                    </span>
                </div>

                <h1 className="inkpaper-heading inkpaper-heading--hero ink-home-reveal">
                    Abhishek
                </h1>
                <h1 className="inkpaper-heading inkpaper-heading--hero ink-home-reveal" style={{ marginTop: '-0.2em' }}>
                    Krishna<span className="ink-vermillion-dot" />
                </h1>

                <div className="ink-home-reveal" style={{ marginTop: '2rem', maxWidth: '550px' }}>
                    <div className="ink-vermillion-line" />
                    <p className="inkpaper-body">
                        Cyber Security Specialist & Full Stack Developer.
                        Architecting robust, scalable systems and securing digital infrastructures.
                    </p>
                </div>

                <div className="ink-home-reveal" style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="inkpaper-jp" style={{ fontSize: '0.75rem', opacity: 0.35 }}>
                        インド
                    </span>
                    <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--ink-stone-light)', textTransform: 'uppercase', fontWeight: 500 }}>
                        Based in India
                    </span>
                </div>
            </div>
        </section>
    );
};

export default InkPaperHome;
