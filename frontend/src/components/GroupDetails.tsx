import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, Image as ImageIcon, Star, BarChart3, Users } from 'lucide-react';

interface GroupDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    conversation?: any;
}

export const GroupDetails: React.FC<GroupDetailsProps> = ({ isOpen, onClose, conversation }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'media' | 'starred' | 'stats'>('info');

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-80 glass-premium border-l border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-xl">
                    <h2 className="font-bold text-white">Channel Intelligence</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-white/70" />
                    </button>
                </div>

                {/* Tabs Navigation */}
                <div className="flex border-b border-white/5 bg-black/20">
                    {[
                        { id: 'info', icon: Users },
                        { id: 'media', icon: ImageIcon },
                        { id: 'starred', icon: Star },
                        { id: 'stats', icon: BarChart3 }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 p-4 flex justify-center transition-all relative ${activeTab === tab.id ? 'text-purple-400' : 'text-white/30 hover:text-white/60'}`}
                        >
                            <tab.icon size={20} />
                            {activeTab === tab.id && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {activeTab === 'info' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Group Identity */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg uppercase">
                                    {conversation?.title?.charAt(0) || '?'}
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{conversation?.title || 'Unknown Chat'}</h3>
                                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">Encrypted Node</p>
                                </div>
                            </div>

                            {/* Members */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Participants</h4>
                                <div className="space-y-2">
                                    {conversation?.participants?.map((p: any, i: number) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-orange-400/20 border border-white/5 flex items-center justify-center text-sm font-bold text-white">
                                                {typeof p === 'string' ? p[0] : (p.username?.[0] || 'U')}
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="text-sm font-bold text-white/80">{typeof p === 'string' ? 'User' : (p.username || 'Ghost')}</h5>
                                                <p className="text-[9px] text-emerald-400/60 uppercase font-black tracking-widest">Active Status</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <button className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all border border-red-500/10 group">
                                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                                    <span className="font-bold text-xs uppercase tracking-widest">Terminate Connection</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'media' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Shared Media</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="aspect-square bg-white/5 rounded-lg border border-white/5 flex items-center justify-center text-white/20 overflow-hidden">
                                        <ImageIcon size={20} />
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-xs text-white/20 italic pt-4">No more recent media</p>
                        </div>
                    )}

                    {activeTab === 'starred' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Starred Messages</h4>
                            <div className="text-center py-20">
                                <Star size={32} className="mx-auto mb-4 text-white/10" />
                                <p className="text-sm text-white/30">No starred messages yet</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Chat Analytics</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-2xl font-bold text-purple-400">128</p>
                                    <p className="text-[10px] text-white/40 uppercase">Messages</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-2xl font-bold text-blue-400">12</p>
                                    <p className="text-[10px] text-white/40 uppercase">Photos</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-sm font-medium text-white mb-2">Most Active Member</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-xs font-bold">A</div>
                                    <span className="text-sm text-white/70">Alice (45%)</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
