import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { Mail, Github, Linkedin, Twitter, Send, Terminal, AlertTriangle } from 'lucide-react';
import ElectricBorder from './ElectricBorder';
import MagneticButton from './MagneticButton';
import emailjs from '@emailjs/browser';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
    const { theme } = useTheme();
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const [formState, setFormState] = useState({ user_name: '', user_email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState('IDLE'); // IDLE, SENDING, SENT, ERROR

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".contact-reveal", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
                y: 50,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('SENDING');

        emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            formRef.current,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
            .then((result) => {
                console.log(result.text);
                setIsSubmitting(false);
                setStatus('SENT');
                setFormState({ user_name: '', user_email: '', message: '' });
                setTimeout(() => setStatus('IDLE'), 5000);
            }, (error) => {
                console.log(error.text);
                setIsSubmitting(false);
                setStatus('ERROR');
                setTimeout(() => setStatus('IDLE'), 5000);
            });
    };

    const getThemeColor = () => {
        switch (theme) {
            case 'cyberpunk': return 'yellow';
            case 'futuristic': return 'cyan';
            case 'creative': return 'purple';
            default: return 'cyan';
        }
    };

    const socialLinks = [
        { icon: Github, label: "GITHUB", href: "https://github.com/abhish3k-397" },
        { icon: Linkedin, label: "LINKEDIN", href: "#" },
        { icon: Twitter, label: "TWITTER", href: "#" },
        { icon: Mail, label: "EMAIL", href: "mailto:contact@example.com" }
    ];

    return (
        <section ref={containerRef} className="min-h-screen py-20 px-4 flex items-center justify-center relative z-10">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                {/* Left Side: Info & Socials */}
                <div className="space-y-12">
                    <div className="space-y-4 contact-reveal">
                        <h2 className={`text-4xl md:text-6xl font-black ${theme === 'cyberpunk' ? 'text-cyber-red' : 'text-white'
                            }`}>
                            ESTABLISH<br />UPLINK
                        </h2>
                        <p className="text-xl opacity-70 font-mono max-w-md">
                            // Initiate encrypted transmission. <br />
                            // Available for freelance contracts and collaborative missions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 contact-reveal">
                        {socialLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group flex items-center gap-4 p-4 border transition-all duration-300 ${theme === 'cyberpunk'
                                    ? 'border-white/10 hover:border-cyber-yellow hover:bg-cyber-yellow/10'
                                    : 'border-white/10 hover:border-cyan-400 hover:bg-cyan-400/10'
                                    }`}
                            >
                                <link.icon className={`w-6 h-6 transition-colors ${theme === 'cyberpunk' ? 'group-hover:text-cyber-yellow' : 'group-hover:text-cyan-400'
                                    }`} />
                                <span className="font-mono font-bold tracking-wider">{link.label}</span>
                            </a>
                        ))}
                    </div>

                    <div className="contact-reveal p-6 border border-dashed border-white/20 rounded-lg bg-black/20 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2 text-green-400 font-mono text-sm">
                            <Terminal size={16} />
                            <span>SYSTEM_STATUS</span>
                        </div>
                        <p className="font-mono text-xs opacity-60">
                            &gt; PORT 443: OPEN<br />
                            &gt; ENCRYPTION: AES-256<br />
                            &gt; LATENCY: 12ms
                        </p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="contact-reveal h-full">
                    <ElectricBorder
                        color={getThemeColor()}
                        className="h-full"
                        innerClassName="h-full bg-black p-8 md:p-10 flex flex-col justify-center"
                    >
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-mono opacity-50 ml-1">USER_ID (NAME)</label>
                                <input
                                    type="text"
                                    name="user_name"
                                    required
                                    value={formState.user_name}
                                    onChange={e => setFormState({ ...formState, user_name: e.target.value })}
                                    className={`w-full bg-transparent border-b-2 p-3 font-mono focus:outline-none transition-colors ${theme === 'cyberpunk'
                                        ? 'border-white/20 focus:border-cyber-yellow text-cyber-yellow placeholder-white/20'
                                        : 'border-white/20 focus:border-cyan-400 text-cyan-300 placeholder-white/20'
                                        }`}
                                    placeholder="ENTER NAME..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono opacity-50 ml-1">COMM_CHANNEL (EMAIL)</label>
                                <input
                                    type="email"
                                    name="user_email"
                                    required
                                    value={formState.user_email}
                                    onChange={e => setFormState({ ...formState, user_email: e.target.value })}
                                    className={`w-full bg-transparent border-b-2 p-3 font-mono focus:outline-none transition-colors ${theme === 'cyberpunk'
                                        ? 'border-white/20 focus:border-cyber-yellow text-cyber-yellow placeholder-white/20'
                                        : 'border-white/20 focus:border-cyan-400 text-cyan-300 placeholder-white/20'
                                        }`}
                                    placeholder="ENTER EMAIL..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono opacity-50 ml-1">DATA_PACKET (MESSAGE)</label>
                                <textarea
                                    name="message"
                                    required
                                    rows={4}
                                    value={formState.message}
                                    onChange={e => setFormState({ ...formState, message: e.target.value })}
                                    className={`w-full bg-transparent border-b-2 p-3 font-mono focus:outline-none transition-colors resize-none ${theme === 'cyberpunk'
                                        ? 'border-white/20 focus:border-cyber-yellow text-cyber-yellow placeholder-white/20'
                                        : 'border-white/20 focus:border-cyan-400 text-cyan-300 placeholder-white/20'
                                        }`}
                                    placeholder="ENTER MESSAGE..."
                                />
                            </div>

                            <div className="pt-4">
                                <MagneticButton>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || status === 'SENT'}
                                        className={`w-full py-4 font-bold text-lg tracking-widest flex items-center justify-center gap-3 transition-all ${status === 'SENT'
                                            ? 'bg-green-500 text-black cursor-default'
                                            : status === 'ERROR'
                                                ? 'bg-red-500 text-white'
                                                : theme === 'cyberpunk'
                                                    ? 'bg-cyber-yellow text-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]'
                                                    : 'bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_cyan]'
                                            }`}
                                    >
                                        {status === 'SENDING' ? (
                                            <span className="animate-pulse">TRANSMITTING...</span>
                                        ) : status === 'SENT' ? (
                                            <span>TRANSMISSION COMPLETE</span>
                                        ) : status === 'ERROR' ? (
                                            <> <AlertTriangle size={20} /> TRANSMISSION FAILED</>
                                        ) : (
                                            <>SEND_TRANSMISSION <Send size={20} /></>
                                        )}
                                    </button>
                                </MagneticButton>
                            </div>
                        </form>
                    </ElectricBorder>
                </div>
            </div>
        </section>
    );
};

export default Contact;
