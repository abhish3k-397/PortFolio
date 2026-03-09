import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const InkPaperContact = () => {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(el.querySelectorAll('.ink-contact-reveal'),
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.15, delay: 0.2 }
            );

            const img = el.querySelector('.inkpaper-contact__image');
            if (img) {
                gsap.fromTo(img,
                    { opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', filter: 'grayscale(100%) sepia(20%) blur(10px)', scale: 1.05 },
                    { opacity: 0.85, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', filter: 'grayscale(100%) sepia(20%) blur(0px)', scale: 1, duration: 2, ease: 'power4.inOut', delay: 0.4 }
                );
            }
        }, el);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="inkpaper-section">

            {/* Large decorative character */}
            <div style={{
                position: 'absolute',
                right: '8%',
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: 'var(--ink-jp)',
                fontSize: 'clamp(8rem, 20vw, 18rem)',
                fontWeight: 100,
                color: 'var(--ink-charcoal)',
                opacity: 0.03,
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
                zIndex: 0,
            }}>
                絆
            </div>

            <div className="inkpaper-section__inner" style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                gap: '4rem',
                width: '100%',
                maxWidth: '70rem'
            }}>
                {/* Left Text Column */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Section Label */}
                    <div className="ink-contact-reveal">
                        <span className="inkpaper-jp inkpaper-jp--label" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <span style={{ width: '30px', height: '1px', background: 'var(--ink-stone-light)' }} />
                            連絡 — Contact
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="inkpaper-heading ink-contact-reveal" style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontWeight: 300,
                        marginBottom: '2rem',
                        maxWidth: '700px',
                        lineHeight: 1.1
                    }}>
                        Let's create
                        <br />
                        something
                        <br />
                        meaningful<span className="ink-vermillion-dot" />
                    </h2>

                    <div className="ink-contact-reveal">
                        <div className="ink-vermillion-line" />
                        <p className="inkpaper-body" style={{ marginBottom: '2.5rem', maxWidth: '500px' }}>
                            Whether it's architecting a robust system, crafting an immersive interface,
                            or securing digital infrastructure — every great project starts with a conversation.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="ink-contact-reveal" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <a href="mailto:contact@example.com" className="inkpaper-cta">
                            <span>Send Message</span>
                        </a>
                        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="inkpaper-resume-btn">
                            <span>履歴書</span> Download Resume
                        </a>
                    </div>

                    {/* Social Links */}
                    <div className="inkpaper-social ink-contact-reveal" style={{ marginTop: '3rem' }}>
                        <a href="https://github.com/abhish3k-397" target="_blank" rel="noopener noreferrer" className="inkpaper-social__link">
                            GitHub
                        </a>
                        <a href="http://www.linkedin.com/in/abhi-sh3k" target="_blank" rel="noopener noreferrer" className="inkpaper-social__link">
                            LinkedIn
                        </a>
                        <a href="#" className="inkpaper-social__link">
                            Twitter
                        </a>
                    </div>
                </div>

                {/* Right Image Column */}
                <div className="inkpaper-contact__image-wrapper" style={{
                    flex: '0 0 35%',
                    display: 'flex',
                    alignItems: 'stretch',
                    position: 'relative'
                }}>
                    <img
                        src="/profile.webp"
                        alt="Portrait"
                        className="inkpaper-contact__image"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'grayscale(100%) sepia(20%) contrast(1.2)',
                            mixBlendMode: 'multiply',
                            WebkitMaskImage: 'radial-gradient(circle, black 20%, rgba(0, 0, 0, 0.4) 60%, transparent 95%)',
                            maskImage: 'radial-gradient(circle, black 20%, rgba(0, 0, 0, 0.4) 60%, transparent 95%)',
                            opacity: 0, // Handled by GSAP
                        }}
                    />
                </div>
            </div>

            {/* Footer note */}
            <div className="ink-contact-reveal" style={{ marginTop: '5rem' }}>
                <span className="inkpaper-jp" style={{ fontSize: '0.65rem', opacity: 0.25 }}>
                    デザイン＆開発 — Abhishek Krishna M
                </span>
            </div>
        </section >
    );
};

export default InkPaperContact;
