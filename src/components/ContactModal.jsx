import React, { useState } from 'react';

const ContactModal = ({ isOpen, onClose, theme = 'samurai' }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const isInk = theme === 'inkpaper';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                    setFormData({ name: '', email: '', message: '' });
                }, 3000);
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
            setErrorMessage(error.message);
        }
    };

    // Samurai Theme specific rendering
    if (!isInk) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
                <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
                    <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <h3 className="text-2xl font-light text-white mb-6 tracking-wide">Send a Message</h3>
                    {status === 'success' ? (
                        <div className="text-center py-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h4 className="text-xl text-white mb-2">Message Sent!</h4>
                            <p className="text-zinc-400">I'll get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
                                <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Your Name" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="your@email.com" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-1">Message</label>
                                <textarea id="message" name="message" required rows="4" value={formData.message} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none" placeholder="How can I help you?"></textarea>
                            </div>
                            {status === 'error' && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded">{errorMessage}</div>}
                            <button type="submit" disabled={status === 'loading'} className="w-full py-3 px-4 bg-white text-black font-bold tracking-widest hover:bg-cyan-400 transition-colors rounded disabled:opacity-50 mt-4 flex justify-center items-center">
                                {status === 'loading' ? <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : "SEND MESSAGE"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    // Ink Paper Theme specific rendering
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300" style={{ backgroundColor: 'var(--ink-wash)' }}>
            
            {/* SVG Filter for Torn Paper Edge */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }} xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                    <filter id="torn-edge" x="-5%" y="-5%" width="110%" height="110%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>

            <div className="inkpaper-torn-wrapper w-full animate-in fade-in zoom-in-95 duration-500">
                <div className="inkpaper-torn-letter">
                    <div className="inkpaper-letter-content">
                        {/* Close Button */}
                        <button 
                            onClick={onClose}
                            className="absolute top-0 right-0 transition-colors"
                            style={{ color: 'var(--ink-stone)' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--ink-vermillion)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink-stone)'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <h3 className="text-2xl font-light mb-8 tracking-wide" style={{ fontFamily: 'var(--ink-serif)', color: 'var(--ink-charcoal)' }}>
                            連絡 — Send Message
                        </h3>

                        {status === 'success' ? (
                            <div className="text-center py-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'var(--ink-wash)', color: 'var(--ink-vermillion)' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <h4 className="text-xl mb-2" style={{ fontFamily: 'var(--ink-serif)' }}>Message Sent!</h4>
                                <p style={{ color: 'var(--ink-stone)' }}>I'll get back to you soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--ink-stone-light)' }}>Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-b focus:outline-none transition-colors"
                                        style={{ 
                                            backgroundColor: 'transparent', 
                                            borderColor: 'var(--ink-cream)', 
                                            color: 'currentColor',
                                            borderTop: 'none',
                                            borderLeft: 'none',
                                            borderRight: 'none',
                                            borderRadius: 0
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--ink-vermillion)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--ink-cream)'}
                                        placeholder="Your Name"
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--ink-stone-light)' }}>Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-b focus:outline-none transition-colors"
                                        style={{ 
                                            backgroundColor: 'transparent', 
                                            borderColor: 'var(--ink-cream)', 
                                            color: 'currentColor',
                                            borderTop: 'none',
                                            borderLeft: 'none',
                                            borderRight: 'none',
                                            borderRadius: 0
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--ink-vermillion)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--ink-cream)'}
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: 'var(--ink-stone-light)' }}>Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border focus:outline-none transition-colors resize-none"
                                        style={{ 
                                            backgroundColor: 'var(--ink-wash)', 
                                            borderColor: 'transparent', 
                                            color: 'currentColor',
                                            borderRadius: '2px'
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--ink-vermillion)'; e.target.style.backgroundColor = 'transparent'; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.backgroundColor = 'var(--ink-wash)'; }}
                                        placeholder="How can I help you?"
                                    ></textarea>
                                </div>

                                {status === 'error' && (
                                    <div className="text-sm p-3 rounded" style={{ color: 'var(--ink-vermillion)', backgroundColor: 'var(--ink-wash)' }}>
                                        {errorMessage}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className={`inkpaper-minimal-btn ${status === 'loading' ? 'is-loading' : ''}`}
                                >
                                    <span className="ink-vermillion-dot" style={{ margin: '0 0.75rem 0 0', width: '5px', height: '5px' }}></span>
                                    <span>
                                        {status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
                                    </span>
                                    <span className="line"></span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
