import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const InkPaperHome = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            // Stagger reveal for text elements
            gsap.fromTo(el.querySelectorAll('.ink-home-reveal'),
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power3.out',
                    stagger: 0.15,
                    delay: 0.3
                }
            );

            // Ink brush stroke draw animation
            const strokePath = el.querySelector('.ink-home-stroke path');
            if (strokePath) {
                gsap.fromTo(strokePath,
                    { strokeDashoffset: 2000 },
                    { strokeDashoffset: 0, duration: 3, ease: 'power2.out', delay: 0.8 }
                );
            }

            // Vermillion circle scale-in
            const circle = el.querySelector('.ink-home-circle');
            if (circle) {
                gsap.fromTo(circle,
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 0.08, duration: 1.5, ease: 'power3.out', delay: 1.2 }
                );
            }
        }, el);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="inkpaper-section">

            {/* Decorative ink brush stroke */}
            <svg
                className="ink-stroke ink-home-stroke"
                width="600"
                height="800"
                viewBox="0 0 600 800"
                style={{ position: 'absolute', right: '-5%', top: '5%', opacity: 0.04, width: '45%', zIndex: 0 }}
            >
                <path
                    d="M100,50 C150,100 80,200 200,250 S350,200 300,350 C250,500 400,450 350,600 S200,700 300,750"
                    strokeDasharray="2000"
                    strokeDashoffset="0"
                />
            </svg>

            {/* Vermillion accent circle */}
            <div
                className="ink-home-circle"
                style={{
                    position: 'absolute',
                    top: '12%',
                    right: '15%',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--ink-vermillion)',
                    opacity: 0,
                    zIndex: 0,
                }}
            />

            <div className="inkpaper-section__inner" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>

                {/* Japanese label */}
                <div className="ink-home-reveal" style={{ marginBottom: '2rem' }}>
                    <span className="inkpaper-jp inkpaper-jp--label" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ width: '30px', height: '1px', background: 'var(--ink-stone-light)' }} />
                        ポートフォリオ — Portfolio
                    </span>
                </div>

                {/* Hero Name */}
                <h1 className="inkpaper-heading inkpaper-heading--hero ink-home-reveal">
                    Abhishek
                </h1>
                <h1 className="inkpaper-heading inkpaper-heading--hero ink-home-reveal" style={{ marginTop: '-0.2em' }}>
                    Krishna<span className="ink-vermillion-dot" />
                </h1>

                {/* Subtitle */}
                <div className="ink-home-reveal" style={{ marginTop: '2rem', maxWidth: '500px' }}>
                    <div className="ink-vermillion-line" />
                    <p className="inkpaper-body">
                        Cyber Security Specialist & Full Stack Developer.
                        Architecting robust, scalable systems and securing digital infrastructures.
                    </p>
                </div>

                {/* Location */}
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
