import React from 'react';

const education = [
    {
        id: 1,
        period: '2021 - 2025',
        role: 'B.Tech in Computer Science',
        company: 'University of Technology',
        desc: 'Specializing in Full Stack Development, Artificial Intelligence, and System Architecture.',
        type: 'college'
    },
    {
        id: 2,
        period: '2019 - 2021',
        role: 'Higher Secondary (XII)',
        company: 'City High School',
        desc: 'Science stream (PCM). Built strong foundation in Mathematics and Computer Science basics.',
        type: 'school'
    }
];

const SamuraiExperience = () => {
    return (
        <section className="block">
            <picture>
                <source media="(max-width: 600px)" srcSet="/samurai/img/preloader/preloader-2-600.webp" type="image/webp" />
                <source media="(max-width: 1200px)" srcSet="/samurai/img/preloader/preloader-2-1200.webp" type="image/webp" />
                <img className="block__background" alt="" src="/samurai/img/preloader/preloader-2.webp" />
            </picture>
            <div className="block__container">
                <div className="block__content">
                    <h2 className="text-3xl font-bold mb-8 text-white">EXPERIENCE & EDUCATION</h2>
                    <div className="space-y-8">
                        {education.map((edu) => (
                            <div key={edu.id} className="relative pl-8 border-l border-white/20">
                                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-cyan-500" />
                                <div className="text-sm font-mono text-cyan-400 mb-1">{edu.period}</div>
                                <h3 className="text-xl font-bold text-white">{edu.role}</h3>
                                <div className="text-sm text-gray-400 mb-2">{edu.company}</div>
                                <p className="text-gray-300">{edu.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SamuraiExperience;
