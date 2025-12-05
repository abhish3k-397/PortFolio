import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSoundFX } from '../context/SoundContext';
import ElectricBorder from './ElectricBorder';

const TerminalCLI = ({ onClose, onSwitchToGui }) => {
    const { theme } = useTheme();
    const { playClick } = useSoundFX();
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { type: 'output', content: 'CYBER_TERMINAL v1.0.4 [CONNECTED]' },
        { type: 'output', content: 'Type "help" for available commands.' }
    ]);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    useEffect(() => {
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd) => {
        const trimmedCmd = cmd.trim().toLowerCase();
        const args = trimmedCmd.split(' ').slice(1);
        const command = trimmedCmd.split(' ')[0];

        let output = '';

        switch (command) {
            case 'help':
                output = `
AVAILABLE COMMANDS:
  help      - Show this help message
  gui       - Switch to Graphical User Interface
  clear     - Clear terminal output
  ls        - List sections/directories
  cd [dir]  - Navigate to a section
  whoami    - Display current user
  date      - Display system time
  exit      - Close terminal
  download  - Download Resume
  matrix    - ???
`;
                break;
            case 'download':
                if (args[0] === 'resume') {
                    const link = document.createElement('a');
                    link.href = '/resume.pdf';
                    link.download = 'Abhishek_Krishna_Resume.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    output = 'Initiating download sequence...';
                } else {
                    output = 'Usage: download resume';
                }
                break;
            case 'gui':
                onSwitchToGui();
                return;
            case 'clear':
                setHistory([]);
                return;
            case 'ls':
                output = 'SECTIONS:\n  hero\n  about\n  skills\n  projects\n  contact\n\nFILES:\n  resume.pdf\n  portfolio.config';
                break;
            case 'cd':
                const target = args[0];
                if (!target) {
                    output = 'Usage: cd [section]';
                } else if (['hero', 'about', 'skills', 'projects', 'contact'].includes(target)) {
                    const element = document.getElementById(target);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                        element.scrollIntoView({ behavior: 'smooth' });
                        output = `Navigating to /${target}...`;
                        setTimeout(() => onClose(), 800); // Small delay for effect
                    } else {
                        output = `Error: Section '${target}' not found.`;
                    }
                } else {
                    output = `Error: Directory '${target}' not found.`;
                }
                break;
            case 'whoami':
                output = 'guest@portfolio-visitor';
                break;
            case 'date':
                output = new Date().toString();
                break;
            case 'exit':
                onClose();
                return;
            case 'matrix':
                output = 'Wake up, Neo...';
                // Could trigger a visual effect here if we had one.
                break;
            case '':
                break;
            default:
                output = `Command not found: ${command}. Type "help" for list.`;
        }

        setHistory(prev => [
            ...prev,
            { type: 'command', content: `guest@portfolio:~$ ${cmd}` },
            { type: 'output', content: output }
        ]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
            playClick();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono"
            onClick={() => onClose()}
        >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-3xl h-[60vh]">
                <ElectricBorder
                    color="cyan"
                    className="w-full h-full"
                    innerClassName={`w-full h-full p-4 overflow-hidden flex flex-col ${theme === 'cyberpunk'
                        ? 'bg-black text-cyber-neon'
                        : 'bg-[#1a1b26] text-green-400'
                        }`}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2 select-none">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={onClose} />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="text-xs opacity-50">guest@portfolio:~</div>
                    </div>

                    {/* Terminal Output */}
                    <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide p-2">
                        {history.map((line, i) => (
                            <div key={i} className={`${line.type === 'command' ? 'opacity-70 mt-4' : 'whitespace-pre-wrap'}`}>
                                {line.content}
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input Line */}
                    <div className="flex items-center gap-2 p-2 border-t border-white/10 mt-2">
                        <span className="text-pink-500">➜</span>
                        <span className="text-cyan-400">~</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent outline-none border-none focus:ring-0"
                            autoFocus
                            spellCheck="false"
                            autoComplete="off"
                        />
                    </div>
                </ElectricBorder>
            </div>
        </div>
    );
};

export default TerminalCLI;
