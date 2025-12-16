import React from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="w-full px-8 py-6 flex justify-between items-center z-50 relative">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-black text-sm">
                    AK
                </div>
                <span className="font-bold text-gray-900 tracking-tight text-lg">Abhishek.</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 bg-white/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/60 shadow-sm">
                {['Home', 'Projects', 'About', 'Contact'].map((item, i) => (
                    <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className={`text-sm font-bold uppercase tracking-wider transition-colors ${i === 0 ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        {item}
                    </a>
                ))}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 bg-white/50 backdrop-blur-md rounded-lg border border-white/60 text-gray-900">
                <Menu size={24} />
            </button>

            {/* CTA Button */}
            <div className="hidden md:block">
                <button className="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20">
                    Let's Talk
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
