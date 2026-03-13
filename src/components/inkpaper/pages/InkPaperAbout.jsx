import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const skills = {
    '言語 — Languages': [
        { name: 'C++ (DSA)', desc: 'Data structures & competitive programming' },
        { name: 'Python', desc: 'Scripting, automation, AI/ML' },
        { name: 'C', desc: 'Systems programming & memory management' },
        { name: 'Java (OOP)', desc: 'Object-oriented design patterns' },
        { name: 'JavaScript', desc: 'Full-stack web development' },
    ],
    '技術 — Technologies': [
        { name: 'Linux (Arch)', desc: 'System administration & kernel tuning' },
        { name: 'Node.js', desc: 'Server-side runtime & APIs' },
        { name: 'Socket Programming', desc: 'Real-time network communication' },
        { name: 'React', desc: 'Component-driven UI architecture' },
        { name: 'Tailwind', desc: 'Utility-first CSS framework' },
    ],
    '道具 — Tools': [
        { name: 'Docker', desc: 'Containerization & orchestration' },
        { name: 'Git', desc: 'Version control & collaboration' },
        { name: 'ngrok', desc: 'Secure tunneling for local servers' },
        { name: 'RESTful API', desc: 'Stateless service architecture' },
        { name: 'Postman', desc: 'API testing & documentation' },
    ],
    '能力 — Soft Skills': [
        { name: 'Problem-Solving', desc: 'Breaking down complex challenges' },
        { name: 'Team Collaboration', desc: 'Agile workflows & communication' },
        { name: 'Analytical Thinking', desc: 'Data-driven decision making' },
    ],
};

const InkPaperAbout = () => {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(el.querySelectorAll('.ink-about-reveal'),
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.2 }
            );

            gsap.fromTo(el.querySelectorAll('.inkpaper-stamp'),
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.04, delay: 0.8 }
            );
        }, el);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="inkpaper-section">

            {/* Kanji watermark */}
            <div className="inkpaper-watermark inkpaper-watermark--left">匠</div>

            {/* Decorative stroke */}
            <svg
                className="ink-stroke"
                width="500"
                height="700"
                viewBox="0 0 500 700"
                style={{ position: 'absolute', right: '-5%', top: '10%', opacity: 0.035, width: '35%', zIndex: 0 }}
            >
                <path
                    d="M50,650 C100,500 30,400 250,350 S450,300 400,150 C350,50 450,100 350,30"
                    strokeDasharray="2000"
                    strokeDashoffset="0"
                />
            </svg>

            <div className="inkpaper-section__inner">

                {/* Section Label */}
                <div className="ink-about-reveal">
                    <span className="inkpaper-jp inkpaper-jp--label" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{ width: '30px', height: '1px', background: 'var(--ink-stone-light)' }} />
                        私について — About
                    </span>
                    <h2 className="inkpaper-heading inkpaper-heading--section">
                        The Craft<span className="ink-vermillion-dot" />
                    </h2>
                </div>

                {/* About Text + Skills Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
                    <div>
                        <p className="inkpaper-body ink-about-reveal" style={{ marginBottom: '1.5rem' }}>
                            Like ink meeting paper, the best solutions emerge from the intersection of discipline and creativity.
                            I approach every challenge with precision and patience.
                        </p>
                        <p className="inkpaper-body ink-about-reveal">
                            I specialize in building high-performance web applications and securing digital assets.
                            My journey involves deep dives into system architecture, AI integration,
                            and creating immersive user experiences that leave lasting impressions.
                        </p>
                        <div className="ink-about-reveal" style={{ marginTop: '2rem' }}>
                            <div className="ink-vermillion-line" />
                            <span className="inkpaper-jp" style={{ fontSize: '0.7rem', opacity: 0.3 }}>
                                一期一会 — One opportunity, one encounter
                            </span>
                        </div>
                    </div>

                    <div>
                        {/* Categorized Skills */}
                        {Object.entries(skills).map(([category, items]) => (
                            <div key={category} className="ink-about-reveal" style={{ marginBottom: '2rem' }}>
                                <div className="inkpaper-skill-group">
                                    {category}
                                </div>
                                <div className="inkpaper-skills" style={{ marginTop: '0.75rem' }}>
                                    {items.map((skill, i) => (
                                        <span key={i} className="inkpaper-stamp">
                                            {skill.name}
                                            <span className="inkpaper-stamp__tooltip">{skill.desc}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InkPaperAbout;
