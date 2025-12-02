import React, { useEffect, useState, useRef } from 'react';
import { ShieldAlert, Lock, Terminal, X } from 'lucide-react';

const AccessDenied = ({ onDismiss }) => {
    const [logs, setLogs] = useState([]);
    const [showTerminal, setShowTerminal] = useState(false);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState(['Welcome to CyberOS v2.0.4', 'Type "help" for available commands.']);
    const [awaitingPassword, setAwaitingPassword] = useState(false);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    // Hidden Hint
    useEffect(() => {
        console.log("%c[SECURITY LEAK] Root password hash found: 'starisarock'", "color: #ff0000; font-size: 14px; font-weight: bold;");
    }, []);

    // Auto-scroll terminal
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [output]);

    // Focus input when terminal opens
    useEffect(() => {
        if (showTerminal) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [showTerminal]);

    useEffect(() => {
        const securityLogs = [
            "DETECTING INTRUSION...",
            "IP ADDRESS TRACED: 192.168.X.X",
            "FIREWALL BREACH ATTEMPTED",
            "ENCRYPTING SENSITIVE DATA...",
            "DEPLOYING COUNTERMEASURES...",
            "LOCKING DOWN SYSTEM KERNEL...",
            "NOTIFYING ADMIN...",
            "CONNECTION TERMINATED."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < securityLogs.length) {
                setLogs(prev => [...prev, securityLogs[i]]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 150);

        return () => clearInterval(interval);
    }, []);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim();
            const newOutput = [...output];

            if (awaitingPassword) {
                newOutput.push(`[sudo] password for user: ********`);
                if (cmd === 'starisarock') {
                    newOutput.push("Access Granted. Rebooting system...");
                    setOutput(newOutput);
                    setInput('');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    newOutput.push("Sorry, try again.");
                    setAwaitingPassword(false);
                    setOutput(newOutput);
                    setInput('');
                }
                return;
            }

            newOutput.push(`user@cyber-sys:~$ ${cmd}`);

            switch (cmd.toLowerCase()) {
                case 'help':
                    newOutput.push("Available commands:");
                    newOutput.push("  sudo reboot  - Restart system kernel");
                    newOutput.push("  clear        - Clear terminal screen");
                    newOutput.push("  exit         - Close terminal");
                    break;
                case 'clear':
                    setOutput([]);
                    setInput('');
                    return;
                case 'sudo reboot':
                    newOutput.push("[sudo] password for user:");
                    setAwaitingPassword(true);
                    break;
                case 'exit':
                    setShowTerminal(false);
                    break;
                case '':
                    break;
                default:
                    newOutput.push(`Command not found: ${cmd}`);
            }

            setOutput(newOutput);
            setInput('');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden font-mono pointer-events-auto cursor-default">

            {/* Background Grid & Red Alert Glow */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,0,0,0.4)_100%)] animate-pulse" />

            {/* Caution Stripes Top/Bottom */}
            <div className="absolute top-0 left-0 w-full h-4 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ff0000_10px,#ff0000_20px)] border-b-2 border-red-500" />
            <div className="absolute bottom-0 left-0 w-full h-4 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ff0000_10px,#ff0000_20px)] border-t-2 border-red-500" />

            {/* Main Content */}
            <div className={`relative z-10 flex flex-col items-center gap-6 p-12 border-4 border-red-600 bg-black/80 backdrop-blur-sm shadow-[0_0_50px_rgba(255,0,0,0.5)] max-w-2xl w-full mx-4 transition-all duration-500 ${showTerminal ? 'scale-90 opacity-50 blur-sm' : 'scale-100 opacity-100'}`}>

                {/* Icon */}
                <div className="relative">
                    <div className="absolute inset-0 bg-red-500 blur-xl opacity-50 animate-pulse" />
                    <ShieldAlert size={80} className="text-red-500 relative z-10 animate-bounce" />
                </div>

                {/* Glitch Text */}
                <div className="text-center">
                    <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter font-geek-trend glitch-skew relative inline-block">
                        <span className="absolute top-0 left-0 -ml-1 text-red-500 opacity-70 animate-glitch-1">ACCESS DENIED</span>
                        <span className="absolute top-0 left-0 ml-1 text-cyan-500 opacity-70 animate-glitch-2">ACCESS DENIED</span>
                        ACCESS DENIED
                    </h1>
                    <p className="text-red-400 tracking-[0.5em] font-bold mt-2 animate-pulse">
                        SECURITY PROTOCOL VIOLATION
                    </p>
                </div>

                {/* Terminal Logs */}
                <div className="w-full bg-black/50 border border-red-900/50 p-4 h-32 overflow-hidden font-mono text-xs md:text-sm text-red-500/80 text-left relative">
                    <div className="absolute top-0 right-0 p-1 text-[10px] text-red-500 border border-red-500/30">SYS.LOG</div>
                    {logs.map((log, index) => (
                        <div key={index} className="mb-1">
                            <span className="text-red-700 mr-2">{`> `}</span>
                            {log}
                        </div>
                    ))}
                    <div className="animate-pulse">_</div>
                </div>

                {/* Open Terminal Button */}
                <button
                    onClick={() => setShowTerminal(true)}
                    className="mt-4 px-8 py-3 bg-black hover:bg-red-900/20 text-red-500 font-bold tracking-widest border-2 border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,0,0,0.6)] transition-all duration-300 uppercase font-orbitron flex items-center gap-2 group"
                >
                    <Terminal size={18} className="group-hover:animate-pulse" />
                    Open Terminal
                </button>
            </div>

            {/* Terminal Overlay */}
            {showTerminal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="w-[95%] md:w-full md:max-w-3xl bg-black border-2 border-green-500/50 rounded-lg shadow-[0_0_50px_rgba(0,255,0,0.2)] overflow-hidden flex flex-col h-[50vh] md:h-[60vh]">
                        {/* Terminal Header */}
                        <div className="bg-green-900/20 border-b border-green-500/30 p-2 flex justify-between items-center">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="text-green-500/80 text-xs tracking-widest font-orbitron">ROOT ACCESS TERMINAL</div>
                            <button onClick={() => setShowTerminal(false)} className="text-green-500 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Terminal Body */}
                        <div
                            className="flex-1 p-4 font-mono text-green-500 overflow-y-auto scrollbar-hide text-sm md:text-base"
                            onClick={() => inputRef.current?.focus()}
                        >
                            {output.map((line, i) => (
                                <div key={i} className="mb-1 whitespace-pre-wrap">{line}</div>
                            ))}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-green-400">
                                    {awaitingPassword ? '[sudo] password:' : 'user@cyber-sys:~$'}
                                </span>
                                <input
                                    ref={inputRef}
                                    type={awaitingPassword ? "password" : "text"}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleCommand}
                                    className="bg-transparent border-none outline-none flex-1 text-green-400 focus:ring-0"
                                    autoFocus
                                    autoComplete="off"
                                />
                            </div>
                            <div ref={bottomRef} />
                        </div>
                    </div>
                </div>
            )}

            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[20] bg-[length:100%_2px,3px_100%] pointer-events-none" />
        </div>
    );
};

export default AccessDenied;
