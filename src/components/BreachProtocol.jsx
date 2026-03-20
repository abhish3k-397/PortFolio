import React, { useState, useEffect, useRef } from 'react';
import { useAchievements } from '../context/AchievementContext';
import { useSoundFX } from '../context/SoundContext';

const BreachProtocol = ({ onComplete, onExit, difficulty = 'medium' }) => {
  const { unlockAchievement } = useAchievements();
  const { playClick, playError, playSuccess } = useSoundFX();
  
  // Game configuration based on difficulty
  const config = {
    easy: { sequenceLength: 4, lives: 5, timePerStep: 1500 },
    medium: { sequenceLength: 5, lives: 3, timePerStep: 1200 },
    hard: { sequenceLength: 6, lives: 3, timePerStep: 1000 }
  }[difficulty];
  
  const [sequence, setSequence] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [lives, setLives] = useState(config.lives);
  const [level, setLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
  const [inputBuffer, setInputBuffer] = useState('');
  const [showColorBlind, setShowColorBlind] = useState(false);
  
  // Symbols for colorblind mode
  const symbols = {
    ArrowUp: '▲',
    ArrowDown: '▼',
    ArrowLeft: '◄',
    ArrowRight: '►'
  };
  
  // Generate a random direction
  const generateStep = () => {
    const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    return directions[Math.floor(Math.random() * directions.length)];
  };
  
  // Initialize or reset the game
  useEffect(() => {
    resetGame();
  }, [difficulty]);
  
  const resetGame = () => {
    const newSequence = Array(config.sequenceLength).fill(null).map(generateStep);
    setSequence(newSequence);
    setCurrentStep(0);
    setLives(config.lives);
    setLevel(1);
    setGameStatus('playing');
    setInputBuffer('');
  };
  
  // Handle key presses
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatus !== 'playing') return;
      
      // Only accept arrow keys
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        return;
      }
      
      e.preventDefault();
      
      // Add to input buffer
      setInputBuffer(prev => prev + e.key);
      
      // Check if the input matches the expected step
      const expectedStep = sequence[currentStep];
      if (e.key === expectedStep) {
        // Correct input
        playClick();
        
        // Move to next step
        if (currentStep + 1 >= sequence.length) {
          // Completed the sequence for this level
          setLevel(prev => prev + 1);
          setCurrentStep(0);
          
          // Generate new sequence for next level (longer sequence)
          if (level >= 5) {
            // Win condition: completed 5 levels
            setGameStatus('won');
            // Unlock achievement for hard difficulty
            if (difficulty === 'hard') {
              unlockAchievement('ghost_in_the_shell');
            }
          } else {
            // Extend sequence by one for next level
            const newSequence = [...sequence, generateStep()];
            setSequence(newSequence);
          }
          
          // Reset input buffer after short delay
          setTimeout(() => setInputBuffer(''), 300);
        } else {
          // Move to next step in current sequence
          setCurrentStep(prev => prev + 1);
          setInputBuffer('');
        }
      } else {
        // Incorrect input
        playError();
        setLives(prev => prev - 1);
        setInputBuffer('');
        
        if (lives <= 1) {
          setGameStatus('lost');
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, currentStep, lives, level, sequence.length, difficulty, playClick, playError, unlockAchievement]);
  
  // Auto-exit after game ends
  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      const timer = setTimeout(() => {
        onExit();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameStatus, onExit]);
  
  // Get display symbol for current expected step
  const getDisplaySymbol = (step) => {
    if (showColorBlind) {
      return symbols[step];
    }
    return step;
  };
  
  // Render the game
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[200] bg-black/80 backdrop-blur-sm">
      <div className="relative w-[90vw] max-w-[400px] h-[80vh] max-h-[600px] bg-black/70 border-2 border-cyan-400/50 rounded-lg overflow-hidden">
        {/* Game Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-cyan-400/20">
          <div className="flex items-center gap-2 text-xs text-cyan-400">
            <span className="w-2 h-2 bg-cyber-red rounded-full animate-pulse" />
            BREACH PROTOCOL
          </div>
          <div className="flex items-center gap-2 text-xs text-cyan-400">
            <span>LEVEL: {level}</span>
            <span className="mx-1">|</span>
            <span>LIVES: 
              {[...Array(lives)].map((_, i) => (
                <span key={i} className="w-1 h-1 bg-cyber-red rounded-full inline-block mr-0.5"></span>
              ))}
            </span>
          </div>
        </div>
        
        {/* Game Status Messages */}
        {gameStatus !== 'playing' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
            <div className="text-center text-cyan-400">
              {gameStatus === 'won' ? (
                <>
                  <h2 className="text-xl font-bold mb-2">BREACH SUCCESSFUL</h2>
                  <p className="mb-4">You have infiltrated the system.</p>
                  {difficulty === 'hard' && (
                    <p className="text-sm italic">Achievement Unlocked: Ghost in the Shell</p>
                  )}
                  <p className="text-xs mt-4">Returning to terminal...</p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-2">BREACH FAILED</h2>
                  <p className="mb-4">Intrusion detected. System securing.</p>
                  <p className="text-xs">Returning to terminal...</p>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Game Board */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Sequence Display */}
          <div className="mb-6 min-h-[80px] flex items-center justify-center w-full">
              {sequence.map((step, index) => (
                <div key={index} className={`flex items-center gap-2 ${index === currentStep ? 'animate-pulse' : ''}`}>
                   <div className={`w-6 h-6 flex items-center justify-center text-lg font-orbitron ${index < currentStep ? 'text-cyber-yellow' : index === currentStep ? 'text-cyan-400' : 'text-cyan-400/50'}`}>
                     {getDisplaySymbol(step)}
                   </div>
                  {index < sequence.length - 1 && (
                    <div className="w-1 h-1 bg-cyan-400/20 rounded-full" />
                  )}
                </div>
              ))}
          </div>
          
          {/* Input Display */}
          <div className="mb-4 text-cyan-400/50 font-mono text-sm">
            INPUT: {inputBuffer.split('').map(key => getDisplaySymbol(key)).join(' ')} 
            {inputBuffer.length < sequence.length && '_'.repeat(sequence.length - inputBuffer.length)}
          </div>
          
          {/* Instructions */}
          <div className="text-center text-xs text-cyan-400/60 mb-6">
            Use arrow keys to repeat the sequence
            {showColorBlind && ' (Colorblind Mode: ▲▼◄►)'}
          </div>
          
          {/* Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center px-4">
            <button 
              onClick={() => setShowColorBlind(!showColorBlind)}
              className="text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors"
            >
              {showColorBlind ? 'Normal Colors' : 'Colorblind Mode'}
            </button>
            <button 
              onClick={onExit}
              className="text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors"
            >
              Abort Mission
            </button>
          </div>
        </div>
        
        {/* Glitch Effect Overlay */}
        {gameStatus === 'lost' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-cyber-red/20 animate-glitch-1" aria-hidden="true" />
            <div className="absolute inset-0 bg-cyan-400/20 animate-glitch-2" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BreachProtocol;