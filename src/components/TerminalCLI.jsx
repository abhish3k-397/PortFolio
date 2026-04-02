import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSoundFX } from '../context/SoundContext';
import { useAchievements } from '../context/AchievementContext';
import {
    Activity,
    Terminal,
    Cpu,
    Database,
    Globe,
    Zap,
    ShieldCheck,
    Wifi,
    X,
    Maximize2,
    Settings,
    HardDrive,
    Info,
    AlertCircle,
    ChevronRight,
    Search,
    Download,
    Upload,
    Clock,
    Lock,
    Unlock,
    Hash,
    Command,
    Square
} from 'lucide-react';
import { getCompletions, resolvePath } from '../utils/virtualFS';
import { executeCommandLine, getCommandNames } from '../utils/terminalCommands';

// ─── Helpers ──────────────────────────────────────────────
const HOME = '/home/guest';

function formatPath(cwd) {
    if (cwd === HOME) return '~';
    if (cwd.startsWith(HOME + '/')) return '~' + cwd.slice(HOME.length);
    return cwd;
}

function getPrompt(cwd, theme) {
    const short = formatPath(cwd);
    if (theme === 'inkpaper') return `guest ${short} ▸`;
    return `guest@portfolio:${short}$`;
}

// Strip ANSI-like escape codes for display width calc
function stripAnsi(str) {
    return str.replace(/\x1b\[[0-9;]*m/g, '');
}

// ─── Typing Queue Item ────────────────────────────────────
// { text: string, onComplete?: () => void }

const TerminalCLI = ({ onClose, onSwitchToGui, onStartHack, onStartBreach }) => {
    const { theme, setTheme } = useTheme();
    const { playClick } = useSoundFX();
    const { unlockAchievement, unlocked } = useAchievements();

    const isCyber = theme === 'cyberpunk';

    // ── State ──────────────────────────────────────────────
    const [input, setInput] = useState('');
    const [cwd, setCwd] = useState(HOME);
    const [history, setHistory] = useState([]);
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [savedInput, setSavedInput] = useState('');
    const [env, setEnv] = useState({
        USER: 'guest',
        HOME,
        SHELL: '/bin/netrunner',
        TERM: 'xterm-256color',
        PORTFOLIO_THEME: theme,
        EDITOR: 'vim',
        BROWSER: 'firefox',
    });
    const [aliases, setAliases] = useState({});
    const [commandCount, setCommandCount] = useState(0);
    const [typingQueue, setTypingQueue] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [displayedOutput, setDisplayedOutput] = useState('');
    const [clock, setClock] = useState('');
    const [readFiles, setReadFiles] = useState(new Set());
    const [tabPresses, setTabPresses] = useState(0);
    const [lastTabPrefix, setLastTabPrefix] = useState('');
    const [showBooting, setShowBooting] = useState(true);
    const [bootLines, setBootLines] = useState([]);

    // ── Metrics State (Cyber Theme Only) ───────────────────
    const [metrics, setMetrics] = useState({
        cpu: 12,
        mem: 45,
        net: 2,
        temp: 34
    });

    useEffect(() => {
        if (!isCyber) return;
        const interval = setInterval(() => {
            setMetrics({
                cpu: Math.floor(Math.random() * 40) + 10,
                mem: Math.floor(Math.random() * 20) + 40,
                net: Math.floor(Math.random() * 5),
                temp: Math.floor(Math.random() * 10) + 30
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [isCyber]);

    // ── Refs ───────────────────────────────────────────────
    const inputRef = useRef(null);
    const bottomRef = useRef(null);
    const historyContainerRef = useRef(null);
    const typingTimerRef = useRef(null);
    const bootTimerRef = useRef(null);

    // ── Boot Sequence ──────────────────────────────────────
    useEffect(() => {
        const bootSequence = isCyber ? [
            { text: '[BIOS] POST check passed', delay: 60 },
            { text: '[BIOS] Memory test: 8192 MiB OK', delay: 80 },
            { text: '[BOOT] Loading NetRunnerOS kernel 2.0.0...', delay: 100 },
            { text: '[INIT] Mounting virtual filesystem...', delay: 70 },
            { text: '[INIT] Starting /bin/netrunner shell...', delay: 90 },
            { text: '[NET ] Establishing secure connection...', delay: 80 },
            { text: '[NET ] Connection established: ENCRYPTED', delay: 60 },
            { text: '[SYS ] Terminal subsystem ready', delay: 50 },
            { text: '', delay: 30 },
            { text: '╔══════════════════════════════════════════════════════╗', delay: 25 },
            { text: '║     ███╗   ██╗███████╗████████╗██████╗ ██╗   ██╗     ║', delay: 25 },
            { text: '║     ████╗  ██║██╔════╝╚══██╔══╝██╔══██╗╚██╗ ██╔╝     ║', delay: 25 },
            { text: '║     ██╔██╗ ██║█████╗     ██║   ██████╔╝ ╚████╔╝      ║', delay: 25 },
            { text: '║     ██║╚██╗██║██╔══╝     ██║   ██╔══██╗  ╚██╔╝       ║', delay: 25 },
            { text: '║     ██║ ╚████║███████╗   ██║   ██║  ██║   ██║        ║', delay: 25 },
            { text: '║     ╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝        ║', delay: 25 },
            { text: '║            RUNNER TERMINAL v2.0                      ║', delay: 25 },
            { text: '╚══════════════════════════════════════════════════════╝', delay: 25 },
            { text: '', delay: 20 },
            { text: 'Type "help" for available commands. Tab to autocomplete.', delay: 40 },
            { text: '', delay: 10 },
        ] : [
            { text: 'Initializing sumi (墨) terminal...', delay: 80 },
            { text: 'Loading virtual filesystem...', delay: 70 },
            { text: '', delay: 30 },
            { text: '    ╱▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔╲', delay: 25 },
            { text: '   │    墨  TERMINAL  筆    │', delay: 25 },
            { text: '   │   ─────────────────    │', delay: 25 },
            { text: '   │   Abhishek Krishna     │', delay: 25 },
            { text: '   │   ポートフォリオ端末     │', delay: 25 },
            { text: '    ╲________________________╱', delay: 25 },
            { text: '', delay: 20 },
            { text: 'Type "help" for available commands.', delay: 40 },
            { text: '', delay: 10 },
        ];

        let i = 0;
        const lines = [];

        function nextLine() {
            if (i >= bootSequence.length) {
                setShowBooting(false);
                setHistory(lines.map(text => ({ type: 'system', content: text })));
                setTimeout(() => inputRef.current?.focus(), 50);
                return;
            }
            const item = bootSequence[i];
            lines.push(item.text);
            setBootLines([...lines]);
            i++;
            bootTimerRef.current = setTimeout(nextLine, item.delay);
        }

        nextLine();

        return () => clearTimeout(bootTimerRef.current);
    }, [isCyber]);

    // ── Focus management & Scroll Lock ─────────────────────
    useEffect(() => {
        if (!showBooting) {
            inputRef.current?.focus();
        }
        unlockAchievement('netrunner');
    }, [showBooting]);

    // ── Global key listener & Focus ───────────────────────
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (e.metaKey || e.ctrlKey) return;

            if (showBooting) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    setShowBooting(false);
                    setTimeout(() => inputRef.current?.focus(), 10);
                }
                return;
            }

            const selection = window.getSelection();
            if (selection && selection.toString().length > 0) return;

            if (document.activeElement !== inputRef.current) {
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showBooting]);

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    // ── Auto-scroll ────────────────────────────────────────
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history, displayedOutput, bootLines]);

    // ── Clock ──────────────────────────────────────────────
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setClock(now.toLocaleTimeString('en-US', { hour12: false }));
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    // ── Typing animation ───────────────────────────────────
    useEffect(() => {
        if (typingQueue.length === 0 || isTyping) return;

        setIsTyping(true);
        const item = typingQueue[0];
        let charIndex = 0;
        const text = item.text;
        setDisplayedOutput('');

        const speed = isCyber ? 8 : 12;

        typingTimerRef.current = setInterval(() => {
            if (charIndex < text.length) {
                const chunk = text.slice(charIndex, charIndex + 3);
                charIndex += 3;
                setDisplayedOutput(prev => prev + chunk);
            } else {
                clearInterval(typingTimerRef.current);
                setHistory(prev => [...prev, { type: item.type || 'output', content: text }]);
                setDisplayedOutput('');
                setTypingQueue(prev => prev.slice(1));
                setIsTyping(false);
                if (item.onComplete) item.onComplete();
            }
        }, speed);

        return () => clearInterval(typingTimerRef.current);
    }, [typingQueue, isCyber]);

    // ── Skip typing on Enter ───────────────────────────────
    const skipTyping = useCallback(() => {
        if (!isTyping) return;
        clearInterval(typingTimerRef.current);

        const allItems = typingQueue.map(item => ({ type: item.type || 'output', content: item.text }));
        setHistory(prev => [...prev, ...allItems]);

        typingQueue.forEach(item => { if (item.onComplete) item.onComplete(); });

        setDisplayedOutput('');
        setTypingQueue([]);
        setIsTyping(false);
    }, [isTyping, typingQueue]);


    // ── Command execution ──────────────────────────────────
    const handleCommand = useCallback((rawInput) => {
        const trimmed = rawInput.trim();

        setCommandHistory(prev => [...prev, trimmed]);
        setHistoryIndex(-1);
        setCommandCount(prev => prev + 1);

        setHistory(prev => [...prev, { type: 'command', cwd: cwd, content: trimmed }]);

        const context = { cwd, env, aliases, commandHistory, commandCount, theme };
        const { results, finalCwd, lastResult } = executeCommandLine(trimmed, context);

        if (finalCwd !== cwd) setCwd(finalCwd);

        const outputItems = [];
        for (const result of results) {
            if (result.sideEffect) {
                switch (result.sideEffect.type) {
                    case 'clear':
                        setHistory([]);
                        break;
                    case 'exit':
                        setTimeout(() => onClose(), 200);
                        return;
                    case 'switchToGui':
                        setTimeout(() => onSwitchToGui(), 200);
                        return;
                    case 'download': {
                        const link = document.createElement('a');
                        link.href = '/resume.pdf';
                        link.download = 'Abhishek_Krishna_Resume.pdf';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        unlockAchievement('recruiter');
                        break;
                    }
                    case 'startHack':
                        setTimeout(() => onStartHack(), 200);
                        return;
                    case 'startBreach':
                        setTimeout(() => onStartBreach(), 200);
                        return;
                    case 'setEnv':
                        setEnv(prev => ({ ...prev, [result.sideEffect.key]: result.sideEffect.value }));
                        break;
                    case 'alias':
                        setAliases(prev => ({ ...prev, [result.sideEffect.key]: result.sideEffect.value }));
                        break;
                    case 'setTheme':
                        setTheme(result.sideEffect.theme);
                        unlockAchievement('theme_shifter');
                        break;
                }
            }

            if (result.matrixEffect) {
                unlockAchievement('matrix_viewer');
            }

            if (trimmed.startsWith('cat ') || trimmed.startsWith('head ') || trimmed.startsWith('tail ') || trimmed.startsWith('grep ')) {
                setReadFiles(prev => {
                    const next = new Set(prev);
                    const args = trimmed.split(' ').slice(1);
                    args.forEach(a => {
                        if (!a.startsWith('-')) {
                            const resolved = resolvePath(finalCwd, a);
                            next.add(resolved);
                        }
                    });
                    return next;
                });
            }

            if (trimmed === 'fortune') {
                unlockAchievement('fortune_finder');
            }

            if (result.output && result.output.trim()) {
                outputItems.push({
                    text: result.output,
                    type: result.type || 'output',
                    colored: result.colored,
                });
            }
        }

        if (readFiles.size >= 10) {
            unlockAchievement('file_explorer');
        }

        if (commandCount + 1 >= 50) {
            unlockAchievement('shell_expert');
        }

        if (outputItems.length > 0) {
            setTypingQueue(prev => [...prev, ...outputItems]);
        }
    }, [cwd, env, aliases, commandHistory, commandCount, theme, onClose, onSwitchToGui, setTheme, unlockAchievement, readFiles]);

    // ── Tab completion ─────────────────────────────────────
    const handleTab = useCallback(() => {
        if (!input) return;

        const parts = input.split(' ');
        const isFirstWord = parts.length <= 1;
        const partial = parts[parts.length - 1];

        let completions;
        if (isFirstWord) {
            const cmdNames = getCommandNames();
            completions = cmdNames.filter(c => c.startsWith(partial));
        } else {
            completions = getCompletions(cwd, partial);
        }

        if (completions.length === 0) return;

        if (completions.length === 1) {
            const completion = completions[0];
            if (isFirstWord) {
                setInput(completion + ' ');
            } else {
                parts[parts.length - 1] = completion;
                setInput(parts.join(' ') + (completion.endsWith('/') ? '' : ' '));
            }
            setTabPresses(0);
            return;
        }

        let common = completions[0];
        for (const c of completions) {
            while (!c.startsWith(common)) {
                common = common.slice(0, -1);
            }
        }

        if (common.length > partial.length) {
            if (isFirstWord) {
                setInput(common);
            } else {
                parts[parts.length - 1] = common;
                setInput(parts.join(' '));
            }
            setTabPresses(0);
        } else {
            if (tabPresses === 0 || lastTabPrefix !== input) {
                setTabPresses(1);
                setLastTabPrefix(input);
            } else {
                setHistory(prev => [
                    ...prev,
                    { type: 'command', cwd: cwd, content: input },
                    { type: 'output', content: completions.join('  ') },
                ]);
                setTabPresses(0);
            }
        }
    }, [input, cwd, tabPresses, lastTabPrefix]);

    const handleKeyDown = useCallback((e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'c':
                    e.preventDefault();
                    setHistory(prev => [...prev,
                        { type: 'command', cwd: cwd, content: `${input}^C` },
                    ]);
                    setInput('');
                    return;
                case 'l':
                    e.preventDefault();
                    setHistory([]);
                    return;
                case 'a':
                    e.preventDefault();
                    inputRef.current?.setSelectionRange(0, 0);
                    return;
                case 'e':
                    e.preventDefault();
                    inputRef.current?.setSelectionRange(input.length, input.length);
                    return;
                case 'u':
                    e.preventDefault();
                    setInput('');
                    return;
                case 'k':
                    return;
            }
        }

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (commandHistory.length === 0) return;
                setHistoryIndex(prev => {
                    const newIndex = prev === -1 ? commandHistory.length - 1 : Math.max(0, prev - 1);
                    if (prev === -1) setSavedInput(input);
                    const cmd = commandHistory[newIndex];
                    setInput(cmd);
                    return newIndex;
                });
                break;

            case 'ArrowDown':
                e.preventDefault();
                if (historyIndex === -1) return;
                setHistoryIndex(prev => {
                    if (prev === -1) return -1;
                    const newIndex = prev + 1;
                    if (newIndex >= commandHistory.length) {
                        setInput(savedInput);
                        return -1;
                    }
                    const cmd = commandHistory[newIndex];
                    setInput(cmd);
                    return newIndex;
                });
                break;

            case 'Tab':
                e.preventDefault();
                handleTab();
                break;
        }
    }, [handleTab, commandHistory, historyIndex, savedInput, input, cwd]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isTyping) {
            skipTyping();
        } else {
            handleCommand(input);
            setInput('');
        }
    };

    // ── Render colored output ──────────────────────────────
    const renderOutput = useCallback((text, colored) => {
        if (!colored || !text.includes('\x1b')) {
            return text;
        }

        const parts = [];
        const regex = /\x1b\[([0-9;]*)m/g;
        let lastIndex = 0;
        let currentStyles = {};
        let key = 0;

        let match;
        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                const content = text.slice(lastIndex, match.index);
                parts.push(
                    <span key={key++} style={{ ...currentStyles }}>
                        {content}
                    </span>
                );
            }

            const codes = match[1].split(';').map(Number);
            const newStyles = { ...currentStyles };

            for (const code of codes) {
                switch (code) {
                    case 0:
                        Object.keys(newStyles).forEach(k => delete newStyles[k]);
                        break;
                    case 1:
                        newStyles.fontWeight = 'bold';
                        break;
                    case 31:
                        newStyles.color = isCyber ? '#ff003c' : '#c62828';
                        break;
                    case 32:
                        newStyles.color = isCyber ? '#00ff88' : '#2e7d32';
                        break;
                    case 33:
                        newStyles.color = isCyber ? '#fcee0a' : '#f9a825';
                        break;
                    case 34:
                        newStyles.color = isCyber ? '#00f3ff' : '#1565c0';
                        break;
                    case 36:
                        newStyles.color = isCyber ? '#00f3ff' : '#00838f';
                        break;
                    case 40:
                        newStyles.backgroundColor = '#000';
                        break;
                    case 41:
                        newStyles.backgroundColor = '#ff003c';
                        break;
                    case 42:
                        newStyles.backgroundColor = '#00ff88';
                        break;
                    case 43:
                        newStyles.backgroundColor = '#fcee0a';
                        break;
                    case 44:
                        newStyles.backgroundColor = '#00f3ff';
                        break;
                    case 45:
                        newStyles.backgroundColor = '#d946ef';
                        break;
                    case 46:
                        newStyles.backgroundColor = '#00f3ff';
                        break;
                    case 47:
                        newStyles.backgroundColor = '#fff';
                        break;
                }
            }

            currentStyles = newStyles;
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
            parts.push(
                <span key={key++} style={{ ...currentStyles }}>
                    {text.slice(lastIndex)}
                </span>
            );
        }

        return parts;
    }, [isCyber]);

    // ── Focus trap ─────────────────────────────────────────
    const focusInput = useCallback(() => {
        if (!showBooting && !isTyping) {
            inputRef.current?.focus();
        }
    }, [showBooting, isTyping]);

    // ── Theme-specific styles ──────────────────────────────
    const containerClass = useMemo(() => {
        if (isCyber) {
            return 'text-[#c5c8c6]';
        }
        return 'text-[#2c2418]';
    }, [isCyber]);

    const fontFamily = isCyber
        ? "'Fira Code', 'JetBrains Mono', 'Roboto Mono', 'Courier New', monospace"
        : "'Shippori Mincho', 'Cormorant Garamond', serif";

    const headerFont = isCyber
        ? "'Orbitron', 'Roboto Mono', monospace"
        : "'Cormorant Garamond', 'Noto Serif JP', 'Shippori Mincho', serif";

    const fontStyle = { fontFamily };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
            onClick={focusInput}
            style={{ fontFamily }}
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 backdrop-blur-sm ${isCyber ? 'bg-black/75' : 'bg-[#2c2418]/50'}`}
                onClick={() => onClose()}
            />

            {/* Terminal Window */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full max-w-[1100px] h-[88vh] sm:h-[82vh] flex flex-col overflow-hidden terminal-enter ${isCyber ? 'rounded-none' : 'rounded-lg'}`}
                style={{
                    boxShadow: isCyber
                        ? '0 0 120px rgba(0,243,255,0.08), 0 0 40px rgba(0,243,255,0.1)'
                        : '0 20px 80px rgba(44,36,24,0.3)',
                    animation: isCyber ? 'terminal-ambient-flicker 8s ease-in-out infinite' : 'none',
                    border: isCyber ? '1px solid rgba(0,243,255,0.2)' : 'none'
                }}
            >
                {isCyber ? (
                    <div className="w-full h-full flex-1 flex flex-col bg-[#020204] relative">
                        {/* Deep Grid Background */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{
                                backgroundImage: `linear-gradient(rgba(0,243,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.2) 1px, transparent 1px)`,
                                backgroundSize: '40px 40px',
                                maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
                            }}
                        />
                        {/* Digital Noise */}
                        <div className="absolute inset-0 opacity-[0.015] pointer-events-none terminal-ink-paper-texture" />

                        {/* Structural HUD Elements */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00f3ff]/40" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00f3ff]/40" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00f3ff]/40" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00f3ff]/40" />

                        {renderTerminalContent()}
                    </div>
                ) : (
                    <div className={`w-full h-full flex-1 flex flex-col bg-[#faf6ef]/95 backdrop-blur-md ${containerClass} rounded-lg`} style={{ border: '1px solid rgba(196,149,106,0.35)' }}>
                        {renderTerminalContent()}
                    </div>
                )}
            </div>
        </div>
    );

    // ── Terminal content (rendered inside both themes) ─────
    function renderTerminalContent() {
        return (
            <>
                {/* Scanline overlay for Cyber */}
                {isCyber && (
                    <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.07] overflow-hidden">
                        <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
                        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#00f3ff]/20 to-transparent animate-scanline-sweep" />
                    </div>
                )}

                {/* ─── Header ─────────────────────────────────── */}
                {isCyber ? (
                    /* ══ ADVANCED CYBER HUD HEADER ══ */
                    <div className="shrink-0 select-none relative z-20 border-b border-[#00f3ff]/30 bg-black/40 backdrop-blur-xl">
                        {/* Scanning Glow Line */}
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#00f3ff] shadow-[0_0_15px_#00f3ff] animate-pulse" />

                        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between px-6 py-4 gap-4">
                            {/* Left: Branding & Connection Status */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#ff003c]/10 border border-[#ff003c]/30">
                                        <Terminal size={20} className="text-[#ff003c]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-white tracking-[0.3em] uppercase leading-none">
                                            NETRUN_OS<span className="text-[#ff003c]">.SYS</span>
                                        </span>
                                        <span className="text-[9px] font-mono text-[#00f3ff]/50 mt-1 uppercase tracking-widest">
                                            Established_Link // {clock}
                                        </span>
                                    </div>
                                </div>

                                <div className="hidden lg:flex items-center gap-4 border-l border-white/10 pl-6">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between text-[8px] text-white/40 uppercase font-mono">
                                            <span>CPU_LOAD</span>
                                            <span>{metrics.cpu}%</span>
                                        </div>
                                        <div className="w-24 h-1 bg-white/5 overflow-hidden">
                                            <div className="h-full bg-[#00f3ff] transition-all duration-1000" style={{ width: `${metrics.cpu}%` }} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between text-[8px] text-white/40 uppercase font-mono">
                                            <span>MEM_USE</span>
                                            <span>{metrics.mem}%</span>
                                        </div>
                                        <div className="w-24 h-1 bg-white/5 overflow-hidden">
                                            <div className="h-full bg-[#fcee0a] transition-all duration-1000" style={{ width: `${metrics.mem}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Controls & Network */}
                            <div className="flex items-center justify-between md:justify-end gap-8">
                                <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-[0.2em]">
                                    <div className="flex items-center gap-2 text-green-400">
                                        <ShieldCheck size={12} />
                                        <span className="hidden sm:inline">Encrypted</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#00f3ff]">
                                        <Wifi size={12} className="animate-pulse" />
                                        <span className="hidden sm:inline">Node: {metrics.net}ms</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button className="p-2 hover:bg-white/5 text-white/40 hover:text-[#00f3ff] transition-all border border-transparent hover:border-white/10">
                                        <Maximize2 size={16} />
                                    </button>
                                    <button
                                        className="p-2 bg-[#ff003c]/20 hover:bg-[#ff003c] text-[#ff003c] hover:text-white transition-all border border-[#ff003c]/40"
                                        onClick={() => onClose()}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ══ INKPAPER HEADER ══ */
                    <div
                        className="shrink-0 select-none relative z-20 border-b border-[#c4956a]/40 bg-[#faf6ef]/90 backdrop-blur-md"
                        style={{ fontFamily: headerFont }}
                    >
                        <div className="flex items-center justify-between px-6 py-3">
                            <div className="flex items-center gap-3">
                                <span className="text-lg text-[#8b2323] whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                                    御
                                </span>
                                <span className="text-sm font-medium text-[#2c2418] tracking-[0.15em] border-l border-[#c4956a]/30 pl-3">
                                    MANUSCRIPT.COM <span className="text-[#c4956a]/60 text-xs ml-2 font-serif">第七巻</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-[#c4956a] font-serif tracking-widest hidden sm:inline-block">筆記用具</span>
                                <button className="text-[#8b2323]/70 hover:text-[#8b2323] transition-colors font-serif text-lg leading-none" onClick={() => onClose()}>
                                    閉
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Output Area ─────────────────────────────── */}
                <div
                    ref={historyContainerRef}
                    className="flex-1 overflow-y-auto overscroll-contain px-6 py-4 relative z-10 scrollbar-hide"
                    data-lenis-prevent
                    style={{
                        ...fontStyle,
                        textShadow: isCyber ? '0 0 4px rgba(0,243,255,0.3)' : 'none',
                    }}
                >
                    <div className="flex flex-col min-h-full pb-8">
                        {/* Boot Sequence */}
                        {showBooting && (
                            <div className={`whitespace-pre border-l-2 pl-4 py-2 mt-4 space-y-1 ${isCyber ? 'border-[#00f3ff]/40 text-[#00f3ff]' : 'border-[#c4956a] text-[#4a3f35]'}`}>
                                {bootLines.map((line, i) => (
                                    <div key={'boot-' + i} className="opacity-90 leading-relaxed text-sm">{line}</div>
                                ))}
                                <div className={`animate-pulse mt-1 ${isCyber ? 'text-[#ff003c]' : 'text-[#8b2323]'}`}>_</div>
                            </div>
                        )}

                        {/* History */}
                        {!showBooting && history.map((item, i) => (
                            <div key={i} className={`whitespace-pre leading-relaxed ${item.type === 'error' ? 'text-[#ff003c] font-bold' : item.colored ? 'text-[#00f3ff]' : isCyber ? 'text-[#00f3ff]' : ''}`}>
                                {item.type === 'command' ? (
                                    <div className="flex items-start break-all opacity-100 mb-1 mt-6 relative">
                                        {isCyber && <div className="absolute -left-6 top-0 bottom-0 w-[1px] bg-[#ff003c]/30" />}
                                        <div className="mr-3 shrink-0 flex items-center gap-2">
                                            {isCyber ? (
                                                <div className="flex items-center bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm">
                                                    <span className="text-[10px] text-[#00f3ff]/40 font-mono mr-2">EXE</span>
                                                    <span className="text-[#00f3ff] font-bold"> guest_session</span>
                                                    <ChevronRight size={10} className="text-[#ff003c] ml-1" />
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-[#8b2323] font-bold">◆</span>
                                                    <span className="text-[#2c2418] font-bold border-b border-[#2c2418]/20 leading-none">客</span>
                                                    <span className="text-[#c4956a] mx-1">/</span>
                                                    <span className="text-[#4a3f35] italic font-serif">{formatPath(item.cwd || '~')}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className={`mt-[4px] ${isCyber ? 'text-[#00f3ff] font-medium pl-2 shadow-[0_0_8px_#00f3ff/30]' : 'text-[#1a150f]'}`}>{item.content}</div>
                                    </div>
                                ) : (
                                    <div className={`pl-4 relative my-0 overflow-hidden ${isCyber
                                        ? (item.type === 'error' ? 'border-l-2 border-[#ff003c] text-[#ff003c]' : 'text-[#00f3ff]/80')
                                        : (item.type === 'error' ? 'border-l-2 border-[#8b2323] text-[#8b2323]' : 'border-l-2 border-[#c4956a]/30 text-[#4a3f35]')
                                        }`}>
                                        <div className="py-0 break-words font-mono text-sm leading-relaxed">{renderOutput(item.content, item.colored)}</div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Currently typing output */}
                        {isTyping && displayedOutput && (
                            <div className="whitespace-pre text-sm leading-relaxed opacity-80 pl-4 py-1">
                                {displayedOutput}
                            </div>
                        )}

                        {/* Input Row */}
                        {!showBooting && (
                            <div className="flex flex-col mt-8 group/input relative">
                                {isCyber && (
                                    <div className="flex items-center gap-3 mb-2 opacity-50 group-focus-within/input:opacity-100 transition-opacity">
                                        <div className="w-2 h-2 bg-[#00f3ff]" />
                                        <span className="text-[10px] font-mono text-[#00f3ff] tracking-widest">AWAIT_INPUT://_</span>
                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-[#00f3ff]/20 to-transparent" />
                                    </div>
                                )}

                                <div className="flex items-center">
                                    <div className="mr-3 shrink-0 flex items-center gap-2">
                                        {isCyber ? (
                                            <div className="flex items-center text-[#00f3ff] font-bold">
                                                <div className="flex items-center bg-[#00f3ff]/10 border border-[#00f3ff]/30 px-2 py-0.5 rounded-sm">
                                                    <Command size={12} className="mr-2" />
                                                    <span className="text-[#fcee0a]">sys</span>
                                                    <span className="mx-1 opacity-30">❯</span>
                                                    <span className="text-[#00f3ff] font-mono tracking-tight">{formatPath(cwd)}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-[#8b2323] font-bold">◆</span>
                                                <span className="text-[#2c2418] font-bold border-b border-[#2c2418]/20 leading-none">客</span>
                                                <span className="text-[#c4956a] mx-1">/</span>
                                                <span className="text-[#4a3f35] italic font-serif pr-1">{formatPath(cwd)}</span>
                                            </>
                                        )}
                                    </div>
                                    <form onSubmit={handleSubmit} className="flex-1 relative flex items-center overflow-hidden">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className={`w-full bg-transparent outline-none border-none tracking-wide text-lg ${isCyber ? 'text-[#00f3ff]' : 'text-[#1a150f]'}`}
                                            autoFocus
                                            autoComplete="off"
                                            spellCheck="false"
                                            style={{ ...fontStyle, caretColor: 'transparent' }}
                                        />

                                        {/* Custom Cursor for Cyber */}
                                        {isCyber && (
                                            <div
                                                className="absolute pointer-events-none w-[10px] h-[22px] bg-[#00f3ff] animate-terminal-cyber-cursor"
                                                style={{
                                                    left: `${(input.length + 0.5) * 10}px`,
                                                    boxShadow: '0 0 10px #00f3ff'
                                                }}
                                            />
                                        )}

                                        {isCyber && <div className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-[#00f3ff]/40 to-transparent" />}
                                    </form>
                                </div>

                                {isCyber && (
                                    <div className="absolute -bottom-4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff003c]/20 to-transparent animate-scanline-sweep opacity-0 group-focus-within/input:opacity-100" />
                                )}
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                </div>

                {/* ─── Status Bar ───────────────────────────────── */}
                {!showBooting && (
                    <div
                        className={`shrink-0 flex items-center justify-between px-6 py-2 select-none z-20 ${isCyber
                            ? 'bg-black/80 border-t border-[#00f3ff]/20 text-[10px] text-[#00f3ff]/70 font-mono tracking-widest uppercase'
                            : 'bg-[#faf6ef] border-t border-[#c4956a]/30 text-xs text-[#c4956a] font-serif tracking-[0.2em]'
                            }`}
                        style={{ fontFamily: isCyber ? fontStyle.fontFamily : headerFont }}
                    >
                        {isCyber ? (
                            <>
                                <div className="items-center gap-6 hidden sm:flex">
                                    <div className="flex items-center gap-2">
                                        <Hash size={12} className="text-[#fcee0a]" />
                                        <span>PID: 8872</span>
                                    </div>
                                    <span className="opacity-30">|</span>
                                    <div className="flex items-center gap-2">
                                        <Lock size={12} className="text-green-500" />
                                        <span>SESSION: ACTIVE</span>
                                    </div>
                                    <span className="opacity-30">|</span>
                                    <div className="flex items-center gap-2">
                                        <Command size={12} className="text-[#ff003c]" />
                                        <span>CMDS: {commandCount}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 justify-between w-full sm:w-auto">
                                    <div className="flex items-center gap-2 text-[#00f3ff]">
                                        <div className="w-1.5 h-1.5 bg-[#00f3ff] animate-pulse" />
                                        <span>SYS_OK</span>
                                    </div>
                                    <span className="opacity-30 hidden sm:inline">|</span>
                                    <span className="text-[#00f3ff] font-black min-w-[60px] text-right">{clock}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-4">
                                    <span>頁 {formatPath(cwd)}</span>
                                    <span className="opacity-50 hidden sm:inline">•</span>
                                    <span className="hidden sm:inline">筆録 {commandCount}</span>
                                </div>
                                <div>
                                    <span>{clock}</span>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </>
        );
    }
};

export default TerminalCLI;
