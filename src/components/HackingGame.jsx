import React, { useState, useEffect, useRef } from 'react';
import { X, Cpu, Lock, Unlock, Brain, Activity, AlertTriangle } from 'lucide-react';
import { useAchievements } from '../context/AchievementContext';
import { useSoundFX } from '../context/SoundContext';
import ElectricBorder from './ElectricBorder';

// --- LEVEL 1: BREACH PROTOCOL (LOGIC) ---
const BreachLevel = ({ onComplete, onFail }) => {
    const GRID_SIZE = 6;
    const SEQUENCE_LENGTH = 4;
    const HEX_CODES = ['1C', '55', 'BD', 'E9', '7A', 'FF'];
    const { playClick, playDenied } = useSoundFX();

    const [grid, setGrid] = useState([]);
    const [targetSequence, setTargetSequence] = useState([]);
    const [buffer, setBuffer] = useState([]);
    const [activeRow, setActiveRow] = useState(0);
    const [activeCol, setActiveCol] = useState(null);
    const [isRowActive, setIsRowActive] = useState(true);
    const [timeLeft, setTimeLeft] = useState(45);

    useEffect(() => {
        const newGrid = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            const row = [];
            for (let j = 0; j < GRID_SIZE; j++) {
                row.push({
                    code: HEX_CODES[Math.floor(Math.random() * HEX_CODES.length)],
                    used: false,
                    id: `${i}-${j}`
                });
            }
            newGrid.push(row);
        }
        setGrid(newGrid);

        const sequence = [];
        for (let i = 0; i < SEQUENCE_LENGTH; i++) {
            sequence.push(HEX_CODES[Math.floor(Math.random() * HEX_CODES.length)]);
        }
        setTargetSequence(sequence);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    onFail();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleCellClick = (rowIndex, colIndex, cell) => {
        if (cell.used) return;
        if (isRowActive) { if (rowIndex !== activeRow) return; }
        else { if (colIndex !== activeCol) return; }

        playClick();

        const newGrid = [...grid];
        newGrid[rowIndex][colIndex].used = true;
        setGrid(newGrid);

        const newBuffer = [...buffer, cell.code];
        setBuffer(newBuffer);

        if (checkWin(newBuffer)) {
            onComplete();
        } else if (newBuffer.length >= 8) {
            onFail();
        } else {
            if (isRowActive) { setActiveCol(colIndex); setActiveRow(null); }
            else { setActiveRow(rowIndex); setActiveCol(null); }
            setIsRowActive(!isRowActive);
        }
    };

    const checkWin = (currentBuffer) => {
        if (currentBuffer.length < targetSequence.length) return false;
        const endOfBuffer = currentBuffer.slice(-targetSequence.length);
        return endOfBuffer.every((code, i) => code === targetSequence[i]);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="flex-1">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-400">
                    <Cpu size={20} /> LEVEL 1: BREACH_PROTOCOL
                </h2>
                <div className="grid grid-cols-6 gap-2">
                    {grid.map((row, rowIndex) => (
                        row.map((cell, colIndex) => {
                            const isActive = (isRowActive && rowIndex === activeRow) || (!isRowActive && colIndex === activeCol);
                            return (
                                <div
                                    key={cell.id}
                                    onClick={() => handleCellClick(rowIndex, colIndex, cell)}
                                    className={`
                                        aspect-square flex items-center justify-center text-sm md:text-lg font-bold border transition-all duration-200
                                        ${cell.used ? 'opacity-20 border-transparent text-gray-500' : ''}
                                        ${isActive && !cell.used ? 'bg-cyan-900/30 border-cyan-500/50 text-cyan-300 cursor-pointer hover:bg-cyan-500 hover:text-black' : 'border-transparent text-gray-600'}
                                        ${!isActive && !cell.used ? 'opacity-30' : ''}
                                    `}
                                >
                                    {cell.code}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>
            <div className="w-full md:w-1/3 flex flex-col gap-6">
                <div className="bg-red-900/20 border border-red-500/30 p-4 rounded text-center">
                    <div className="text-xs text-red-400 mb-1">TIME_REMAINING</div>
                    <div className="text-3xl font-bold text-red-500">{timeLeft}s</div>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-400 mb-2">TARGET</h3>
                    <div className="flex gap-2 flex-wrap">
                        {targetSequence.map((code, i) => (
                            <div key={i} className="px-2 py-1 border border-cyan-500/50 text-cyan-400 font-bold bg-cyan-900/20">{code}</div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-400 mb-2">BUFFER</h3>
                    <div className="flex gap-1 flex-wrap min-h-[40px] p-2 border border-white/10 bg-white/5">
                        {buffer.map((code, i) => (
                            <div key={i} className="px-1 bg-white/10 text-white text-xs">{code}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- LEVEL 2: SYNAPTIC MATCH (MEMORY) ---
const MemoryLevel = ({ onComplete, onFail }) => {
    const { playClick, playDenied } = useSoundFX();
    const [sequence, setSequence] = useState([]);
    const [playerSequence, setPlayerSequence] = useState([]);
    const [isShowingSequence, setIsShowingSequence] = useState(false);
    const [round, setRound] = useState(1);
    const [activeTile, setActiveTile] = useState(null);

    const generateSequence = (length) => {
        const newSeq = [];
        for (let i = 0; i < length; i++) newSeq.push(Math.floor(Math.random() * 9));
        return newSeq;
    };

    useEffect(() => {
        startRound(1);
    }, []);

    const startRound = async (currentRound) => {
        setPlayerSequence([]);
        const newSeq = generateSequence(currentRound + 2); // Start with 3, then 4, then 5
        setSequence(newSeq);
        setIsShowingSequence(true);

        // Play Sequence
        for (let i = 0; i < newSeq.length; i++) {
            await new Promise(r => setTimeout(r, 600));
            setActiveTile(newSeq[i]);
            playClick(); // Beep
            await new Promise(r => setTimeout(r, 400));
            setActiveTile(null);
        }
        setIsShowingSequence(false);
    };

    const handleTileClick = (index) => {
        if (isShowingSequence) return;

        playClick();
        const newPlayerSeq = [...playerSequence, index];
        setPlayerSequence(newPlayerSeq);

        // Check Input
        if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
            playDenied();
            onFail();
            return;
        }

        // Round Complete
        if (newPlayerSeq.length === sequence.length) {
            if (round === 3) {
                onComplete();
            } else {
                setRound(r => r + 1);
                setTimeout(() => startRound(round + 1), 1000);
            }
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-purple-400">
                <Brain size={20} /> LEVEL 2: SYNAPTIC_MATCH (Round {round}/3)
            </h2>
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div
                        key={i}
                        onClick={() => handleTileClick(i)}
                        className={`
                            w-20 h-20 md:w-24 md:h-24 border-2 rounded-lg cursor-pointer transition-all duration-100
                            ${activeTile === i ? 'bg-purple-500 border-purple-200 shadow-[0_0_20px_#a855f7]' : 'bg-black/50 border-purple-900/50 hover:border-purple-500/50'}
                        `}
                    />
                ))}
            </div>
            <div className="mt-8 text-sm text-gray-500">
                {isShowingSequence ? "OBSERVE PATTERN..." : "REPEAT PATTERN"}
            </div>
        </div>
    );
};

// --- LEVEL 3: SIGNAL OVERRIDE (TIMING) ---
const TimingLevel = ({ onComplete, onFail }) => {
    const { playClick, playDenied } = useSoundFX();
    const [position, setPosition] = useState(0);
    const directionRef = useRef(1);
    const [targetZone, setTargetZone] = useState({ start: 40, width: 20 });
    const [locks, setLocks] = useState(0);
    const [speed, setSpeed] = useState(1.5);
    const requestRef = useRef();

    useEffect(() => {
        const animate = () => {
            setPosition(prev => {
                let currentDir = directionRef.current;
                let next = prev + (speed * currentDir);

                if (next >= 100 || next <= 0) {
                    currentDir *= -1;
                    directionRef.current = currentDir;
                    next = prev + (speed * currentDir);
                }
                return next;
            });
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [speed]);

    const handleLock = () => {
        if (position >= targetZone.start && position <= targetZone.start + targetZone.width) {
            playClick();
            if (locks + 1 >= 3) {
                onComplete();
            } else {
                setLocks(l => l + 1);
                setSpeed(s => s + 0.5); // Increase speed
                // Randomize next zone
                const newWidth = Math.max(10, targetZone.width - 2);
                const newStart = Math.random() * (90 - newWidth) + 5;
                setTargetZone({ start: newStart, width: newWidth });
            }
        } else {
            playDenied();
            onFail();
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-yellow-400">
                <Activity size={20} /> LEVEL 3: SIGNAL_OVERRIDE
            </h2>

            <div className="w-full h-12 bg-black/50 border border-yellow-900/50 rounded-full relative overflow-hidden mb-8">
                {/* Target Zone */}
                <div
                    className="absolute top-0 bottom-0 bg-yellow-500/30 border-x border-yellow-500"
                    style={{ left: `${targetZone.start}%`, width: `${targetZone.width}%` }}
                />
                {/* Cursor */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]"
                    style={{ left: `${position}%` }}
                />
            </div>

            <div className="flex gap-4 mb-8">
                {[0, 1, 2].map(i => (
                    <div key={i} className={`w-4 h-4 rounded-full ${i < locks ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]' : 'bg-gray-800'}`} />
                ))}
            </div>

            <button
                onClick={handleLock}
                className="px-8 py-4 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition-colors text-xl tracking-widest"
            >
                LOCK_SIGNAL
            </button>
        </div>
    );
};

// --- MAIN CONTAINER ---
const HackingGame = ({ onClose }) => {
    const { unlockAchievement } = useAchievements();
    const { playDenied } = useSoundFX();
    const [level, setLevel] = useState(1);
    const [gameState, setGameState] = useState('intro'); // intro, playing, transition, won, lost

    const handleLevelComplete = () => {
        if (level === 3) {
            setGameState('won');
            unlockAchievement('netrunner_elite');
            setTimeout(onClose, 4000);
        } else {
            setGameState('transition');
            setTimeout(() => {
                setLevel(l => l + 1);
                setGameState('playing');
            }, 2000);
        }
    };

    const handleFail = () => {
        setGameState('lost');
        playDenied();
    };

    const renderContent = () => {
        if (gameState === 'intro') {
            return (
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-cyan-400 mb-4">HACKING_GAUNTLET_INIT</h1>
                    <p className="text-gray-400 mb-8">3 LEVELS. NO FAILURES ALLOWED.</p>
                    <button
                        onClick={() => setGameState('playing')}
                        className="px-6 py-2 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all"
                    >
                        START_BREACH
                    </button>
                </div>
            );
        }
        if (gameState === 'transition') {
            return (
                <div className="text-center animate-pulse">
                    <h2 className="text-2xl text-green-400 font-bold mb-2">ACCESS_GRANTED</h2>
                    <p className="text-gray-500">INITIALIZING NEXT LAYER...</p>
                </div>
            );
        }
        if (gameState === 'won') {
            return (
                <div className="text-center">
                    <Unlock size={64} className="mx-auto text-green-400 mb-4" />
                    <h1 className="text-4xl font-bold text-green-400 mb-2">SYSTEM_PWNED</h1>
                    <p className="text-gray-400">ROOT ACCESS GRANTED</p>
                </div>
            );
        }
        if (gameState === 'lost') {
            return (
                <div className="text-center">
                    <AlertTriangle size={64} className="mx-auto text-red-500 mb-4" />
                    <h1 className="text-4xl font-bold text-red-500 mb-2">LOCKDOWN_INITIATED</h1>
                    <p className="text-gray-400 mb-6">INTRUSION DETECTED</p>
                    <button
                        onClick={() => { setLevel(1); setGameState('playing'); }}
                        className="px-6 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all"
                    >
                        RETRY_BREACH
                    </button>
                </div>
            );
        }

        switch (level) {
            case 1: return <BreachLevel onComplete={handleLevelComplete} onFail={handleFail} />;
            case 2: return <MemoryLevel onComplete={handleLevelComplete} onFail={handleFail} />;
            case 3: return <TimingLevel onComplete={handleLevelComplete} onFail={handleFail} />;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 font-mono">
            <div className="w-full max-w-4xl relative">
                <ElectricBorder color={gameState === 'won' ? 'green' : gameState === 'lost' ? 'red' : 'cyan'}>
                    <div className="bg-black/90 p-8 min-h-[500px] flex items-center justify-center relative">
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                            <X size={24} />
                        </button>
                        {renderContent()}
                    </div>
                </ElectricBorder>
            </div>
        </div>
    );
};

export default HackingGame;
