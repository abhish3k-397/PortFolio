import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const InkPaperContact = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(el.querySelectorAll('.ink-contact-reveal'),
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.15, delay: 0.2 }
            );
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

            <div className="inkpaper-section__inner">

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
                    <p className="inkpaper-body" style={{ marginBottom: '2.5rem' }}>
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
                <div className="inkpaper-social ink-contact-reveal">
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

                {/* Footer note */}
                <div className="ink-contact-reveal" style={{ marginTop: '5rem' }}>
                    <span className="inkpaper-jp" style={{ fontSize: '0.65rem', opacity: 0.25 }}>
                        デザイン＆開発 — Abhishek Krishna M
                    </span>
                </div>
            </div>
        </section>
    );
};

export default InkPaperContact;
