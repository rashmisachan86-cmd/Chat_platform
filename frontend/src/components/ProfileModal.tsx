import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Zap, Sparkles, Palette, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/use-auth.js';
import type { Vibe } from '../types/theme';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const {
        gender, vibe, setGender, setVibe,
        soundsEnabled, setSoundsEnabled,
        accentColor, setAccentColor,
        chatWallpaper, setChatWallpaper
    } = useTheme();

    const { updateProfile, isLoading: isProfileLoading } = useAuth();

    if (!isOpen) return null;

    const vibes: Vibe[] = ['professional', 'coding_wizard', 'chill', 'luxury', 'minimal'];
    const accents = ['#8B5CF6', '#06B6D4', '#EC4899', '#F97316', '#22C55E'];
    const wallpapers = [
        { id: '', name: 'Clean', class: 'bg-[#13111C]' },
        { id: 'dots', name: 'Dots', class: 'wallpaper-dots' },
        { id: 'grid', name: 'Grid', class: 'wallpaper-grid' }
    ];

    const genders: any[] = [
        { id: 'boy', label: 'Boy', icon: '👦' },
        { id: 'girl', label: 'Girl', icon: '👧' }
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md glass-premium rounded-3xl overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                                <User size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Your Identity</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {/* Gender Selection */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
                                <Zap size={14} /> Avatar Archetype
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {genders.map((g) => (
                                    <button
                                        key={g.id}
                                        onClick={() => setGender(g.id)}
                                        className={`p-6 rounded-2xl flex flex-col items-center gap-3 border-2 transition-all ${gender === g.id
                                            ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/10'
                                            : 'bg-white/5 border-transparent hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-4xl">{g.icon}</span>
                                        <span className={`font-semibold ${gender === g.id ? 'text-white' : 'text-white/40'}`}>{g.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Vibe Selection */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
                                <Sparkles size={14} /> Application Vibe
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {vibes.map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setVibe(v)}
                                        className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all ${vibe === v
                                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                            : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                                            }`}
                                    >
                                        {v?.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Accent Color Selection */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
                                <Palette size={14} /> Accent Color
                            </label>
                            <div className="flex gap-4">
                                {accents.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setAccentColor(color)}
                                        className={`w-10 h-10 rounded-full border-4 transition-all ${accentColor === color ? 'border-white scale-110 shadow-lg shadow-white/20' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Wallpaper Selection */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
                                <Monitor size={14} /> Chat Wallpaper
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {wallpapers.map((wp) => (
                                    <button
                                        key={wp.id}
                                        onClick={() => setChatWallpaper(wp.id)}
                                        className={`h-16 rounded-xl border-2 transition-all flex items-center justify-center p-2 relative overflow-hidden ${chatWallpaper === wp.id ? 'border-purple-500 bg-purple-500/20' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                                    >
                                        <div className={`absolute inset-0 opacity-20 pointer-events-none ${wp.class}`} />
                                        <span className="text-xs relative z-10 text-white font-medium">{wp.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sound Toggle */}
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="space-y-1">
                                <h4 className="text-white font-medium">Haptic UI Sounds</h4>
                                <p className="text-xs text-white/40">Subtle audio feedback on actions</p>
                            </div>
                            <button
                                onClick={() => setSoundsEnabled(!soundsEnabled)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${soundsEnabled ? 'bg-purple-500' : 'bg-white/10'}`}
                            >
                                <motion.div
                                    className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md"
                                    animate={{ x: soundsEnabled ? 24 : 0 }}
                                />
                            </button>
                        </div>

                        {/* Save Button */}
                        <div className="pt-4">
                            <button
                                onClick={async () => {
                                    try {
                                        await updateProfile({
                                            gender, vibe, accentColor, chatWallpaper, soundsEnabled
                                        });
                                        onClose();
                                        // Refresh to apply theme values from user object if needed, 
                                        // although context handles it locally.
                                    } catch (err) {
                                        console.error("Profile sync failed");
                                    }
                                }}
                                disabled={isProfileLoading}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isProfileLoading ? 'Syncing...' : 'Save & Sync Identity'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
