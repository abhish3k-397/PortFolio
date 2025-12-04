import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { GraduationCap, BookOpen, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const education = [
    {
        id: 1,
        type: 'college',
        date: '2021 - 2025',
        title: 'B.Tech in Computer Science',
        institution: 'University of Technology',
        desc: 'Currently pursuing Bachelor of Technology. Specializing in Full Stack Development, Artificial Intelligence, and System Architecture.',
        tags: ['DSA', 'Web Dev', 'Database']
    },
    {
        id: 2,
        type: 'school',
        date: '2019 - 2021',
        title: 'Higher Secondary (XII)',
        institution: 'City High School',
        desc: 'Completed Class XII with Science stream (PCM). Built strong foundation in Mathematics and Computer Science basics.',
        tags: ['Physics', 'Maths', 'C++']
    },
    {
        id: 3,
        type: 'school',
        date: '2018 - 2019',
        title: 'Secondary Education (X)',
        institution: 'City High School',
        desc: 'Completed Class X with distinction. Active member of the Computer Club and Science Society.',
        tags: ['Science', 'Maths', 'Logic']
    }
];

const Experience = () => {
    const { theme } = useTheme();
    const containerRef = useRef(null);
    const lineRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate the vertical line
            gsap.from(lineRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    end: "bottom 80%",
                    scrub: 1,
                    toggleActions: "play none none reverse",
                },
                height: 0,
                ease: "none"
            });

            // Animate each item
            gsap.utils.toArray('.experience-item').forEach((item, i) => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="min-h-screen py-20 px-4 flex flex-col items-center relative z-10">
            <h2 className={`text-4xl md:text-6xl font-black mb-16 tracking-tighter ${theme === 'cyberpunk' ? 'text-cyber-red' : 'text-white'
                }`}>
                ACADEMIC_LOGS
            </h2>

            <div className="relative max-w-4xl w-full">
                {/* Vertical Line */}
                <div
                    className={`absolute left-0 md:left-1/2 top-0 bottom-0 w-1 transform md:-translate-x-1/2 ${theme === 'cyberpunk' ? 'bg-white/10' : 'bg-white/10'
                        }`}
                >
                    <div
                        ref={lineRef}
                        className={`w-full h-full origin-top ${theme === 'cyberpunk' ? 'bg-cyber-yellow shadow-[0_0_15px_#f0db4f]' :
                            theme === 'futuristic' ? 'bg-cyan-400 shadow-[0_0_15px_cyan]' : 'bg-purple-500'
                            }`}
                    />
                </div>

                <div className="space-y-12 md:space-y-24">
                    {education.map((edu, index) => (
                        <div
                            key={edu.id}
                            className={`experience-item relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                }`}
                        >
                            {/* Timeline Node */}
                            <div className={`absolute left-[-5px] md:left-1/2 top-0 w-3 h-3 rounded-full transform md:-translate-x-1/2 z-20 ${theme === 'cyberpunk' ? 'bg-cyber-red' : 'bg-white'
                                }`}>
                                <div className={`absolute inset-0 rounded-full animate-ping ${theme === 'cyberpunk' ? 'bg-cyber-red' : 'bg-white'
                                    }`} />
                            </div>

                            {/* Content Card */}
                            <div className="md:w-1/2 pl-8 md:pl-0 md:px-12">
                                <div className={`p-6 border backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 ${theme === 'cyberpunk'
                                    ? 'border-white/10 bg-black/40 hover:border-cyber-yellow hover:shadow-[0_0_20px_rgba(240,219,79,0.2)]'
                                    : 'border-white/10 bg-white/5 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                                    }`}>
                                    {/* Date Badge */}
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-mono font-bold rounded-full ${theme === 'cyberpunk'
                                        ? 'bg-cyber-yellow text-black'
                                        : 'bg-cyan-500/20 text-cyan-300'
                                        }`}>
                                        <Calendar size={12} />
                                        {edu.date}
                                    </div>

                                    <h3 className={`text-2xl font-bold mb-1 ${theme === 'cyberpunk' ? 'text-white' : 'text-white'
                                        }`}>
                                        {edu.title}
                                    </h3>

                                    <div className={`flex items-center gap-2 mb-4 font-mono text-sm ${theme === 'cyberpunk' ? 'text-cyber-red' : 'text-cyan-400'
                                        }`}>
                                        {edu.type === 'college' ? <GraduationCap size={14} /> : <BookOpen size={14} />}
                                        {edu.institution}
                                    </div>

                                    <p className="opacity-70 mb-6 leading-relaxed text-sm">
                                        {edu.desc}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {edu.tags.map(t => (
                                            <span key={t} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded font-mono opacity-60">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Empty space for the other side */}
                            <div className="hidden md:block md:w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
