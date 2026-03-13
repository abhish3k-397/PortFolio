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

            // ---- Dynamic Branches Stroke-Draw ----
            el.querySelectorAll('.sakura-branch').forEach((branch) => {
                const len = branch.getTotalLength();
                // We stored the drawing delay on the element
                const delayStr = branch.getAttribute('data-branch-delay') || '0';
                const delay = parseFloat(delayStr);

                // Animating stroke offset
                gsap.fromTo(branch,
                    { strokeDasharray: len, strokeDashoffset: len },
                    { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', delay: BRANCH_START + delay }
                );
            });

            // ---- Dynamic Blossoms Bloom ----
            // The prompt requested that branches appear BEFORE flowers!
            // Branches take ~1.5 seconds to draw.
            const BLOSSOM_DELAY_OFFSET = 1.0;

            el.querySelectorAll('.sakura-blossom').forEach((blossom) => {
                const bloomDelay = parseFloat(blossom.getAttribute('data-bloom-delay') || '0');

                // Delay them so they happen clearly after the branch has reached their coordinate
                const absoluteDelay = BRANCH_START + BLOSSOM_DELAY_OFFSET + (bloomDelay * 3.5);

                gsap.fromTo(blossom,
                    { scale: 0, opacity: 0, transformOrigin: 'center center' },
                    {
                        scale: 1,
                        opacity: parseFloat(blossom.getAttribute('opacity')) || 1,
                        duration: 0.8,
                        ease: 'back.out(2.5)',
                        delay: absoluteDelay,
                    }
                );
            });

            // ---- Falling SVG petals — appear at the very end ----
            el.querySelectorAll('.sakura-falling-petal').forEach((petal) => {
                gsap.fromTo(petal,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.8, delay: BRANCH_START + 4.0 }
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

            {/* ========== KANJI WATERMARK ========== */}
            <div className="inkpaper-watermark inkpaper-watermark--right">墨</div>

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
