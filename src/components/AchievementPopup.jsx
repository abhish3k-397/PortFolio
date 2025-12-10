import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Terminal, Gamepad, FileText, Clock, Code, Zap } from 'lucide-react';
import { useAchievements } from '../context/AchievementContext';
import { useTheme } from '../context/ThemeContext';
import ElectricBorder from './ElectricBorder';

const AchievementPopup = () => {
    const { notification } = useAchievements();
    const { theme } = useTheme();

    if (!notification) return null;

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'terminal': return Terminal;
            case 'gamepad': return Gamepad;
            case 'file': return FileText;
            case 'clock': return Clock;
            case 'code': return Code;
            case 'zap': return Zap;
            default: return Trophy;
        }
    };

    const Icon = getIcon(notification.icon);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                className="fixed top-24 right-6 z-[100] w-80 pointer-events-none"
            >
                <ElectricBorder
                    color={theme === 'cyberpunk' ? 'yellow' : 'cyan'}
                    className="w-full"
                    innerClassName={`p-4 flex items-center gap-4 ${theme === 'cyberpunk'
                            ? 'bg-black/90 text-cyber-yellow'
                            : 'bg-slate-900/90 text-cyan-400'
                        }`}
                >
                    <div className={`p-3 rounded-full border ${theme === 'cyberpunk'
                            ? 'border-cyber-yellow bg-cyber-yellow/10'
                            : 'border-cyan-400 bg-cyan-400/10'
                        }`}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <div className="text-xs font-bold tracking-widest opacity-70 mb-1">ACHIEVEMENT UNLOCKED</div>
                        <h3 className="font-bold font-orbitron">{notification.title}</h3>
                        <p className="text-xs font-mono opacity-80">{notification.description}</p>
                    </div>
                </ElectricBorder>
            </motion.div>
        </AnimatePresence>
    );
};

export default AchievementPopup;
