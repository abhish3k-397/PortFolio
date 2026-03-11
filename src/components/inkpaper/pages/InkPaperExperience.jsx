import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const education = [
    {
        id: 1,
        period: '2021 — 2025',
        role: 'B.Tech in Computer Science',
        company: 'University of Technology',
        desc: 'Specializing in Full Stack Development, Artificial Intelligence, and System Architecture.',
        grade: 'CGPA: 8.22',
        tags: ['DSA', 'Web Dev', 'Database']
    },
    {
        id: 2,
        period: '2019 — 2021',
        role: 'Higher Secondary (XII)',
        company: 'City High School',
        desc: 'Science stream (PCM). Built strong foundation in Mathematics and Computer Science basics.',
        grade: '94%',
        tags: ['Physics', 'Maths', 'C++']
    },
    {
        id: 3,
        period: '2018 — 2019',
        role: 'Secondary Education (X)',
        company: 'City High School',
        desc: 'Completed with distinction. Active member of Computer Club and Science Society.',
        grade: '98%',
        tags: ['Science', 'Maths', 'Logic']
    }
];

const InkPaperExperience = () => {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(el.querySelectorAll('.ink-exp-header'),
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
            );

            gsap.fromTo(el.querySelectorAll('.inkpaper-timeline__item'),
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.2, delay: 0.6 }
            );
        }, el);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="inkpaper-section">

            <div className="inkpaper-section__inner">

                {/* Section Label */}
                <div className="ink-exp-header">
                    <span className="inkpaper-jp inkpaper-jp--label" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{ width: '30px', height: '1px', background: 'var(--ink-stone-light)' }} />
                        旅路 — Journey
                    </span>
                    <h2 className="inkpaper-heading inkpaper-heading--section">
                        Experience &<br />Education<span className="ink-vermillion-dot" />
                    </h2>
                </div>

                {/* Timeline */}
                <div className="inkpaper-timeline">
                    {education.map((edu) => (
                        <div key={edu.id} className="inkpaper-timeline__item">
                            <div className="inkpaper-timeline__dot" />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div className="inkpaper-timeline__period">{edu.period}</div>
                                <span className="inkpaper-grade">{edu.grade}</span>
                            </div>
                            <div className="inkpaper-timeline__role">{edu.role}</div>
                            <div className="inkpaper-timeline__company">{edu.company}</div>
                            <p className="inkpaper-timeline__desc">{edu.desc}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                                {edu.tags.map((tag, i) => (
                                    <span key={i} className="inkpaper-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Decorative vermillion line */}
                <div style={{ marginTop: '4rem' }}>
                    <div className="ink-vermillion-line" />
                    <span className="inkpaper-jp" style={{ fontSize: '0.7rem', opacity: 0.3 }}>
                        修行の道は続く — The path of discipline continues
                    </span>
                </div>
            </div>
        </section>
    );
};

export default InkPaperExperience;
